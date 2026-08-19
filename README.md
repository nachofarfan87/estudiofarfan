<!-- README.md -->

# Estudio Jurídico Farfán

Sitio estático construido con Astro para la presencia institucional, el SEO local en
Jujuy, las páginas de materias, el contenido doctrinario y la consulta de honorarios.

## Requisitos

- Node.js 22.12 o superior.
- npm 11 o compatible con el lockfile incluido.

## Desarrollo

```sh
npm install
npx astro dev --background
```

El servidor en segundo plano se administra con:

```sh
npx astro dev status
npx astro dev logs
npx astro dev stop
```

## Validación y build

```sh
npm run build
npm run preview
```

La salida de producción se genera en `dist/`. La etapa `postbuild` prerenderiza en
Honorarios el catálogo de `servicios.json` con el UMA vigente y completa sus metadatos
públicos sólo cuando existe `PUBLIC_SITE_URL`.

## Dominio público

El dominio no está escrito en el código. Debe configurarse únicamente cuando esté
confirmado:

```sh
PUBLIC_SITE_URL=https://dominio-confirmado.com.ar
```

Puede copiarse `.env.example` a `.env` para desarrollo local. Cuando la variable no
existe, el proyecto compila sin publicar una canonical, un sitemap o URLs sociales
ficticias. Al definirla, Astro alinea canonical, Open Graph, JSON-LD, robots y sitemap.

## Estructura principal

```text
src/
├── components/       Cabecera y pie reutilizables
├── config/           Configuración pública del sitio
├── content/materias/ Contenido jurídico por materia
├── data/             Datos del estudio y artículos
├── layouts/          Documento HTML base y layout de lectura
├── lib/              Generadores de datos estructurados
├── pages/            Home, materias, artículos y robots
├── scripts/          Interacciones progresivas de la home
└── styles/           Sistema global y estilos por tipo de página
```

La aplicación de honorarios permanece en `public/honorarios/`, junto con sus datos,
manifiesto y service worker. En desarrollo, Astro mapea `/honorarios/` a su documento
estático; en producción la estructura de directorios ya publica esa URL de forma
nativa. Su catálogo también queda disponible sin JavaScript gracias a la etapa
`postbuild`.

## Datos que deben confirmarse antes de publicar

Los valores migrados en `src/data/estudio.ts` y `public/honorarios/index.html` deben
validarse con el titular del estudio:

- nombre comercial y profesionales actuales;
- matrículas;
- domicilio, teléfono, WhatsApp y correo;
- horarios y tiempos de respuesta;
- áreas efectivamente ejercidas y alcance territorial;
- historia institucional y fecha de fundación;
- modalidad y costo de la primera consulta;
- dominio, redes, logo, fotografías y textos legales.

No debe publicarse el sitio hasta completar esta revisión de datos.

## Integraciones actuales

- El formulario de la home usa Netlify Forms.
- `@astrojs/sitemap` se activa cuando existe `PUBLIC_SITE_URL`.
- `.github/workflows/update-uma.yml` prepara la actualización periódica del UMA; para
  operar necesita un repositorio remoto y GitHub Actions habilitado.
