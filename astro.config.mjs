// astro.config.mjs
// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { loadEnv } from 'vite';

// El dominio se configura en el entorno de publicación. Si todavía no está
// confirmado, el build funciona sin inventar canonical ni sitemap.
//
// OJO: `defineConfig` de Astro recibe un OBJETO, no una función. La forma
// `defineConfig(({ mode }) => ({...}))` es de Vite: Astro no la invoca nunca y
// el archivo entero queda ignorado en silencio —sin site, sin trailingSlash y
// sin sitemap—. Por eso la resolución del entorno va acá arriba, al importar.
const env = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), '');

// Se leen las dos fuentes: `loadEnv` cubre los archivos .env locales y
// `process.env` cubre las variables que Netlify inyecta en el build.
const rawSite = (env.PUBLIC_SITE_URL ?? process.env.PUBLIC_SITE_URL)?.trim();
const site = rawSite ? new URL(rawSite).origin : undefined;

/**
 * Vite sirve literalmente los archivos de `public/`, pero no resuelve un
 * `index.html` dentro de sus subdirectorios. Este alias existe sólo durante
 * desarrollo; la salida estática de producción ya publica la URL esperada.
 *
 * @returns {import('vite').Plugin}
 */
const honorariosDirectoryIndex = () => ({
  name: 'honorarios-directory-index',
  enforce: 'pre',
  apply: 'serve',
  configureServer(server) {
    server.middlewares.use((request, _response, next) => {
      if (!request.url) return next();

      const queryIndex = request.url.indexOf('?');
      const pathname =
        queryIndex === -1 ? request.url : request.url.slice(0, queryIndex);
      const query = queryIndex === -1 ? '' : request.url.slice(queryIndex);

      if (pathname === '/honorarios/') {
        request.url = `/honorarios/index.html${query}`;
      }

      return next();
    });
  },
});

export default defineConfig({
  site,

  // `directory` mantiene URLs legibles y coherentes con trailingSlash, y son
  // exactamente las que el sitio ya tiene publicadas.
  build: { format: 'directory' },
  trailingSlash: 'always',

  vite: {
    plugins: [honorariosDirectoryIndex()],
  },

  integrations: site
    ? [
        sitemap({
          customPages: [new URL('/honorarios/', site).href],
          serialize(item) {
            // Sin priority ni changefreq: Google los ignora desde hace años.
            delete item.priority;
            delete item.changefreq;
            return item;
          },
        }),
      ]
    : [],
});
