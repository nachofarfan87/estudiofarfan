// src/lib/schema.ts
import { absoluteUrl, publicUrl } from '../config/site';
import { estudio, abogado, zonasSchema } from '../data/estudio';

// Identificadores estables del grafo. Todas las páginas referencian estos
// mismos @id en vez de redeclarar la entidad: así el estudio es UNA entidad
// para Google y no una por página.
export const ID = {
  sitio: publicUrl('/#website'),
  estudio: publicUrl('/#estudio'),
  abogado: publicUrl('/#juan'),
} as const;

// Cuando la ficha de Google Business esté verificada, cargar acá su URL y la
// de las redes. Es el campo que le dice a Google que el sitio y la ficha del
// mapa son la misma entidad; sin él las dos identidades no suman autoridad.
const sameAs: string[] = [];

// Idem: latitud y longitud reales de Carrizo 672 y el enlace corto de la
// ficha. Se completan el mismo día que se verifica el perfil.
const geo: { latitude: number; longitude: number } | null = null;
const hasMap: string | null = null;

export const nodoSitio = () => ({
  '@type': 'WebSite',
  '@id': ID.sitio,
  ...(absoluteUrl('/') ? { url: absoluteUrl('/') } : {}),
  name: estudio.nombre,
  inLanguage: 'es-AR',
  publisher: { '@id': ID.estudio },
});

export const nodoEstudio = () => ({
  '@type': ['LegalService', 'Attorney'],
  '@id': ID.estudio,
  name: estudio.nombre,
  alternateName: estudio.alternativo,
  description:
    'Estudio jurídico integral en Jujuy desde 1953. Tres generaciones de abogados en los siete fueros de la provincia, bajo un mismo criterio: leer cada caso completo.',
  slogan: estudio.lema,
  ...(absoluteUrl('/') ? { url: absoluteUrl('/') } : {}),
  ...(absoluteUrl('/og-farfan.jpg') ? { image: absoluteUrl('/og-farfan.jpg') } : {}),
  // Sin `logo` a propósito: og-farfan.jpg es una tarjeta 1200×630 y Google
  // espera una marca de proporción cercana al cuadrado. Se agrega cuando
  // exista el archivo de logo real.
  foundingDate: estudio.fundado,
  currenciesAccepted: 'ARS',
  founder: { '@type': 'Person', name: 'Ciro Alberto Farfán' },
  address: {
    '@type': 'PostalAddress',
    streetAddress: estudio.domicilio.calle,
    addressLocality: estudio.domicilio.localidad,
    addressRegion: estudio.domicilio.provincia,
    postalCode: estudio.domicilio.codigoPostal,
    addressCountry: estudio.domicilio.pais,
  },
  areaServed: [
    { '@type': 'AdministrativeArea', name: 'Provincia de Jujuy, Argentina' },
    ...zonasSchema.map((name) => ({ '@type': 'City', name })),
  ],
  telephone: estudio.telefono,
  email: estudio.email,
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: estudio.telefono,
    contactType: 'customer service',
    areaServed: 'AR',
    availableLanguage: ['Spanish'],
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [...estudio.horario.dias],
      opens: estudio.horario.abre,
      closes: estudio.horario.cierra,
    },
  ],
  employee: { '@id': ID.abogado },
  knowsLanguage: 'es-AR',
  ...(sameAs.length ? { sameAs } : {}),
  ...(geo ? { geo: { '@type': 'GeoCoordinates', ...geo } } : {}),
  ...(hasMap ? { hasMap } : {}),
});

export const nodoAbogado = () => ({
  '@type': ['Person', 'Attorney'],
  '@id': ID.abogado,
  name: abogado.nombre,
  jobTitle: abogado.cargo,
  identifier: abogado.matricula,
  worksFor: { '@id': ID.estudio },
  knowsLanguage: 'es-AR',
  areaServed: {
    '@type': 'AdministrativeArea',
    name: 'Provincia de Jujuy, Argentina',
  },
});

export const nodoMigas = (
  url: string,
  tramos: { nombre: string; url?: string }[],
) => ({
  '@type': 'BreadcrumbList',
  '@id': `${url}#crumbs`,
  itemListElement: tramos.map((t, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: t.nombre,
    ...(t.url ? { item: t.url } : {}),
  })),
});

export const nodoPreguntas = (
  url: string,
  faq: { q: string; a: string[] }[],
) => ({
  '@type': 'FAQPage',
  '@id': `${url}#faq`,
  mainEntity: faq.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a.join(' ') },
  })),
});
