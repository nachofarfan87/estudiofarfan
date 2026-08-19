// src/config/site.ts

/**
 * Dominio público confirmado del sitio.
 *
 * Debe definirse como PUBLIC_SITE_URL en el entorno de build, por ejemplo:
 * https://dominio-confirmado.com.ar
 *
 * Mientras no exista un dominio confirmado, las URLs internas siguen siendo
 * relativas y no se publica una canonical ficticia.
 */
const rawSiteUrl = import.meta.env.PUBLIC_SITE_URL?.trim();

function normalizeOrigin(value: string | undefined): string | undefined {
  if (!value) return undefined;

  const url = new URL(value);
  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error('PUBLIC_SITE_URL debe usar http:// o https://');
  }

  return url.origin;
}

export const SITE_ORIGIN = normalizeOrigin(rawSiteUrl);

export function absoluteUrl(pathname: string): string | undefined {
  if (!SITE_ORIGIN) return undefined;
  return new URL(pathname, `${SITE_ORIGIN}/`).href;
}

export function publicUrl(pathname: string): string {
  return absoluteUrl(pathname) ?? pathname;
}

