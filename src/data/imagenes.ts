// src/data/imagenes.ts
// Las fotos del estudio, en un solo lugar. Las usa la home para mostrarlas y
// `lib/schema.ts` para declararlas en el JSON-LD: así la entidad que ve Google
// apunta exactamente a los mismos archivos que ve el visitante, que es lo que
// hace que una foto sume y no sólo pese.
import { abogado, estudio } from './estudio';

import fachadaSrc from '../images/estudio-juridico-farfan-jujuy-fachada.jpg';

// El retrato del titular se resuelve por glob y no por import directo a
// propósito: mientras el archivo no esté en `src/images/`, la ficha del
// abogado cae en el monograma de siempre en vez de romper el build.
const retratos = import.meta.glob<ImageMetadata>(
  '../images/juan-ignacio-farfan-abogado-jujuy.{jpg,jpeg,png,webp}',
  { eager: true, import: 'default' },
);

export const fachada = fachadaSrc;
export const retrato: ImageMetadata | undefined = Object.values(retratos)[0];

// El alt describe lo que se ve y nombra el lugar, que es lo que Google Imágenes
// necesita para asociar la foto al estudio. No es un renglón de palabras clave.
export const alt = {
  fachada: `Frente del ${estudio.nombre} en ${estudio.domicilio.calle}, ${estudio.domicilio.localidad}`,
  retrato: `${abogado.nombre}, abogado en ${estudio.domicilio.localidad} — ${abogado.matricula}`,
} as const;
