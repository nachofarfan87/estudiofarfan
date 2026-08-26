// src/scripts/plausible.js
// Utilidades mínimas y compartidas para los eventos de Plausible.
//
// Los eventos nunca incluyen nombres, correos, mensajes ni la materia elegida:
// en un sitio jurídico esos datos pueden ser personales o sensibles. Sólo se
// informa el contexto necesario para tomar decisiones de producto.

export function nombreDePagina(ruta) {
  if (ruta === '/') return 'home';
  if (ruta === '/articulos/') return 'articulos';
  if (ruta.indexOf('/articulos/') === 0) return 'articulo';
  if (ruta.indexOf('/materias/') === 0) return 'materia';
  return ruta;
}

export function trackPlausible(nombre, propiedades) {
  if (typeof window.plausible !== 'function') return;

  try {
    window.plausible(nombre, { props: propiedades });
  } catch (err) {
    // La analítica nunca debe interferir con el contacto ni con la navegación.
  }
}
