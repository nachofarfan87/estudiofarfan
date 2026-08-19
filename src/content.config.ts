import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Las siete materias. El esquema es estricto a propósito: si mañana se agrega
// un fuero y falta el id del arancel, el build falla en vez de publicar una
// página con un enlace roto a /honorarios/.
const materias = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/materias' }),
  schema: z.object({
    orden: z.number().int().min(1).max(7),
    romano: z.enum(['I', 'II', 'III', 'IV', 'V', 'VI', 'VII']),
    fuero: z.string(),
    // Identificadores de servicios.json, los que usan /honorarios/#area-<id>
    areaId: z.enum([
      'familia',
      'civil',
      'laboral',
      'penal',
      'contencioso',
      'genero',
      'contratos',
    ]),
    h1: z.string(),
    deck: z.string(),
    resumen: z.string(),
    seo: z.object({
      title: z.string(),
      description: z.string(),
      ogTitle: z.string(),
      ogDescription: z.string(),
    }),
    // Lo que la materia aporta a la home: su fila del índice § III y su
    // etiqueta en el <select> del formulario de contacto. Vive acá para que
    // agregar un fuero sea tocar un solo archivo, no tres listas sueltas.
    home: z.object({
      desc: z.string(),
      arts: z.string(),
      ver: z.string(),
      select: z.string(),
      /** Etiqueta corta del pie de página, más breve que la del formulario. */
      pie: z.string(),
    }),
    tramites: z.array(z.object({ t: z.string(), d: z.string() })).min(1),
    pasos: z.array(z.object({ t: z.string(), d: z.string() })).min(1),
    faq: z.array(z.object({ q: z.string(), a: z.array(z.string()).min(1) })).min(1),
  }),
});

export const collections = { materias };
