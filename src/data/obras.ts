// src/data/obras.ts
// Los libros publicados por el titular. Alimentan § II de la home, la página
// de cada obra en /obras/<slug>/ y el JSON-LD (`Book`).
//
// Pendiente: ISBN y año de edición. Mientras el campo esté vacío no se muestra
// en la ficha ni se declara en el schema; cuando llegue, se carga acá y listo.
import { whatsappUrl } from './estudio';

import tapaDerecho from '../images/obras/el-tiempo-util-del-derecho-juan-ignacio-farfan.jpg';
import tapaProceso from '../images/obras/el-tiempo-util-del-proceso-juan-ignacio-farfan.jpg';

export interface Obra {
  slug: string;
  /** Orden de la serie: el anteproyecto primero, los fundamentos después. */
  orden: number;
  titulo: string;
  subtitulo: string;
  /** Qué es la obra, en dos o tres palabras. Va en el rótulo de la tarjeta. */
  genero: string;
  tapa: ImageMetadata;
  tapaAlt: string;
  /** Bajada corta: tarjeta de la home y meta description. */
  copete: string;
  /** Texto de la contratapa, párrafo por párrafo, tal como está impreso. */
  contratapa: string[];
  editorial: string;
  paginas?: number;
  isbn?: string;
  anio?: string;
}

export const editorial = 'Editorial Cuadernos del Duende';

export const obras: Obra[] = [
  {
    slug: 'el-tiempo-util-del-derecho',
    orden: 1,
    titulo: 'El tiempo útil del Derecho',
    subtitulo: 'Anteproyecto de Ley de Gestión Temporal del Proceso Judicial',
    genero: 'Anteproyecto de ley',
    tapa: tapaDerecho,
    tapaAlt:
      'Tapa del libro «El tiempo útil del Derecho. Ley de Gestión Temporal del Proceso Judicial», de Juan Ignacio Farfán, Editorial Cuadernos del Duende',
    copete:
      'Su primera obra publicada nace de una pregunta: ¿de qué sirve una sentencia justa si llega cuando ya nada de lo que motivó el reclamo sigue igual? En ella convierte esa pregunta en un proyecto de ley concreto.',
    contratapa: [
      'Juan Ignacio Farfán, abogado graduado en la Universidad Blas Pascal, es tercera generación de una familia con cimientos en el Derecho. Su Abuelo fundó el estudio en 1953 y fue pionero de proyectos de ley como el Código Contencioso Administrativo y el Código de Minería de la provincia. Su Padre, presidente del Colegio de Abogados, continuó ejerciendo la profesión y le enseñó buena parte de lo que hoy sabe, guiándolo todavía día a día.',
      'Hoy él continúa ese legado con “El tiempo útil del Derecho”, su primera obra publicada, que nace de una pregunta que lo acompaña desde siempre: ¿de qué sirve una sentencia justa si llega cuando ya nada de lo que motivó el reclamo sigue igual? En ella convierte esa pregunta en un proyecto de ley concreto.',
    ],
    editorial,
  },
  {
    slug: 'el-tiempo-util-del-proceso',
    orden: 2,
    titulo: 'El tiempo útil del proceso',
    subtitulo: 'Fundamentos para un proceso judicial más dinámico en la Provincia de Jujuy',
    genero: 'Fundamentos doctrinarios',
    tapa: tapaProceso,
    tapaAlt:
      'Tapa del libro «El tiempo útil del proceso. Fundamentos para un proceso judicial más dinámico en la Provincia de Jujuy», de Juan Ignacio Farfán, Editorial Cuadernos del Duende',
    copete:
      'El diagnóstico y los fundamentos doctrinarios de la reforma, desde una convicción: el tiempo de las personas dentro de un proceso judicial es una dimensión sustancial de la tutela judicial efectiva.',
    contratapa: [
      'Juan Ignacio Farfán, autor del anteproyecto de ley «El tiempo útil del Derecho», presenta su nueva obra: “El tiempo útil del proceso - Fundamentos para un proceso judicial más dinámico en la Provincia de Jujuy” (440 páginas).',
      'En sus páginas expone el diagnóstico y los fundamentos doctrinarios de la reforma que impulsa, desde una convicción: el tiempo de las personas dentro de un proceso judicial es una dimensión sustancial de la tutela judicial efectiva.',
    ],
    editorial,
    paginas: 440,
  },
];

export const obrasEnOrden = () => [...obras].sort((a, b) => a.orden - b.orden);

/** El pedido de un ejemplar va por el WhatsApp del estudio, con el título ya escrito. */
export const pedidoUrl = (o: Obra) =>
  whatsappUrl(`Hola. Quisiera solicitar un ejemplar del libro «${o.titulo}».`);
