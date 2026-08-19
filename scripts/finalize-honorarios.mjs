// scripts/finalize-honorarios.mjs
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { loadEnv } from 'vite';

const projectRoot = process.cwd();
const outputFile = path.join(projectRoot, 'dist', 'honorarios', 'index.html');
const servicesFile = path.join(projectRoot, 'public', 'honorarios', 'servicios.json');
const umaFile = path.join(projectRoot, 'public', 'honorarios', 'uma.json');

const env = loadEnv(process.env.NODE_ENV ?? 'production', projectRoot, '');
const rawSiteUrl = (env.PUBLIC_SITE_URL ?? process.env.PUBLIC_SITE_URL)?.trim();

function resolveSiteOrigin(value) {
  if (!value) return null;

  const parsed = new URL(value);
  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new Error('PUBLIC_SITE_URL debe usar http o https.');
  }

  return parsed.origin;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

const currency = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
});

function replaceRegion(html, name, content) {
  const start = `<!-- ${name}_START -->`;
  const end = `<!-- ${name}_END -->`;
  const startIndex = html.indexOf(start);
  const endIndex = html.indexOf(end);

  if (startIndex < 0 || endIndex < startIndex) {
    throw new Error(`No se encontró la región ${name} en Honorarios.`);
  }

  const before = html.slice(0, startIndex);
  const after = html.slice(endIndex + end.length);
  const body = content.trim();

  return `${before}${start}\n${body ? `${body}\n` : ''}${end}${after}`;
}

function renderCatalog(areas, umaValue) {
  return areas
    .map((area) => {
      const services = area.servicios
        .map((service) => {
          const note = service.nota
            ? `<div class="servicio-nota">${escapeHtml(service.nota)}</div>`
            : '';
          const price =
            service.umas == null ? '' : currency.format(Number(service.umas) * umaValue);

          return `        <div class="servicio-item">
          <div>
            <div class="servicio-nombre">${escapeHtml(service.nombre)}</div>
            ${note}
          </div>
          <div class="servicio-precio">${escapeHtml(price)}</div>
        </div>`;
        })
        .join('\n');

      return `      <details class="area-panel" id="area-${escapeHtml(area.id)}" data-area="${escapeHtml(area.id)}">
        <summary class="area-header">
          <span class="area-name">${escapeHtml(area.nombre)}</span>
          <span class="area-meta">
            <span class="area-count">${area.servicios.length}</span>
            <span class="area-chev" aria-hidden="true">›</span>
          </span>
        </summary>
        <div class="area-body">
${services}
        </div>
      </details>`;
    })
    .join('\n');
}

function renderStaticUmaValues(html, umaData) {
  const value = Number(umaData.valor);
  const [year = '', month = '', day = ''] = String(umaData.actualizado ?? '').split('-');
  const updated = [day, month, year].filter(Boolean).join('/');
  const replacements = new Map([
    [
      '<div class="uma-value" id="umaValor">—</div>',
      `<div class="uma-value" id="umaValor">${escapeHtml(currency.format(value))}</div>`,
    ],
    [
      '<p class="uma-month" id="umaMes"></p>',
      `<p class="uma-month" id="umaMes">UMA de <strong>${escapeHtml(umaData.mes)}</strong></p>`,
    ],
    [
      '<span class="updated" id="umaUpdated"></span>',
      `<span class="updated" id="umaUpdated">${updated ? `Actualizado el ${escapeHtml(updated)}` : ''}</span>`,
    ],
    [
      '<div class="monto" id="monto-virtual">—</div>',
      `<div class="monto" id="monto-virtual">${escapeHtml(currency.format(value * 4))}</div>`,
    ],
    [
      '<div class="monto" id="monto-oral">—</div>',
      `<div class="monto" id="monto-oral">${escapeHtml(currency.format(value * 5))}</div>`,
    ],
    [
      '<div class="monto" id="monto-escrita">—</div>',
      `<div class="monto" id="monto-escrita">${escapeHtml(currency.format(value * 8))}</div>`,
    ],
  ]);

  for (const [placeholder, rendered] of replacements) {
    if (!html.includes(placeholder)) {
      throw new Error(`No se encontró el placeholder esperado: ${placeholder}`);
    }
    html = html.replace(placeholder, rendered);
  }

  return html;
}

function renderPublicMetadata(siteOrigin) {
  if (!siteOrigin) return '';

  const pageUrl = new URL('/honorarios/', siteOrigin).href;
  const imageUrl = new URL('/og-farfan.jpg', siteOrigin).href;

  return `<link rel="canonical" href="${pageUrl}">
<meta property="og:url" content="${pageUrl}">
<meta property="og:image" content="${imageUrl}">
<meta property="og:image:alt" content="Identidad visual del Estudio Jurídico Farfán">
<meta name="twitter:image" content="${imageUrl}">
<meta name="twitter:image:alt" content="Identidad visual del Estudio Jurídico Farfán">`;
}

function absolutizeStructuredData(html, siteOrigin) {
  if (!siteOrigin) return html;

  const replacements = new Map([
    ['"@id": "/#estudio"', `"@id": "${new URL('/#estudio', siteOrigin).href}"`],
    ['"@id": "/#website"', `"@id": "${new URL('/#website', siteOrigin).href}"`],
    [
      '"@id": "/honorarios/#page"',
      `"@id": "${new URL('/honorarios/#page', siteOrigin).href}"`,
    ],
    ['"url": "/"', `"url": "${new URL('/', siteOrigin).href}"`],
    [
      '"url": "/honorarios/"',
      `"url": "${new URL('/honorarios/', siteOrigin).href}"`,
    ],
  ]);

  for (const [relative, absolute] of replacements) {
    html = html.replaceAll(relative, absolute);
  }

  return html;
}

const [sourceHtml, servicesData, umaData] = await Promise.all([
  readFile(outputFile, 'utf8'),
  readFile(servicesFile, 'utf8').then(JSON.parse),
  readFile(umaFile, 'utf8').then(JSON.parse),
]);

if (!Array.isArray(servicesData.areas) || !Number.isFinite(Number(umaData.valor))) {
  throw new Error('Los datos de Honorarios no tienen el formato esperado.');
}

const siteOrigin = resolveSiteOrigin(rawSiteUrl);
const catalog = renderCatalog(servicesData.areas, Number(umaData.valor));

let outputHtml = replaceRegion(sourceHtml, 'HONORARIOS_STATIC_CATALOG', catalog);
outputHtml = replaceRegion(outputHtml, 'PUBLIC_URL_META', renderPublicMetadata(siteOrigin));
outputHtml = renderStaticUmaValues(outputHtml, umaData);
outputHtml = absolutizeStructuredData(outputHtml, siteOrigin);

await writeFile(outputFile, outputHtml, 'utf8');

const serviceCount = servicesData.areas.reduce(
  (total, area) => total + area.servicios.length,
  0,
);
console.log(
  `[honorarios] Catálogo prerenderizado: ${serviceCount} trámites; URLs públicas: ${siteOrigin ? 'configuradas' : 'omitidas'}.`,
);
