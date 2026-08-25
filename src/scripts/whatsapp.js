// src/scripts/whatsapp.js
// Medición de los clics a WhatsApp, para todo el sitio.
//
// Vive acá y lo importa Base.astro porque el botón flotante está en el layout:
// cada página que use el layout queda medida sola. Antes cada página traía su
// propia copia del listener y las siete de materias se habían quedado sin
// ninguna, así que esos clics no se contaban.
//
// `/honorarios/` no pasa por el layout —es HTML suelto en public/— y conserva
// su copia inline. Es la única.
//
// Si Plausible no está disponible, no hace nada.

// El nombre de la página, con los mismos valores que ya venía reportando cada
// una, para no cortar la serie histórica de Plausible.
function nombreDePagina(ruta) {
  if (ruta === '/') return 'home';
  if (ruta === '/articulos/') return 'articulos';
  if (ruta.indexOf('/articulos/') === 0) return 'articulo';
  if (ruta.indexOf('/materias/') === 0) return 'materia';
  return ruta;
}

// Dónde estaba el enlace. El flotante y el pie se reconocen solos; el resto lo
// declara la marcación con data-wa-origen, que es lo que distingue el enlace
// de la ficha de contacto del que cierra un artículo.
function origenDelEnlace(a) {
  if (a.classList.contains('wa-float')) return 'flotante';
  if (a.closest('footer')) return 'pie';
  return a.dataset.waOrigen || 'cuerpo';
}

document.addEventListener('click', function (e) {
  var a = e.target.closest && e.target.closest('a[href*="wa.me"]');
  if (!a || typeof window.plausible !== 'function') return;
  try {
    window.plausible('WhatsApp', {
      props: {
        origen: origenDelEnlace(a),
        pagina: nombreDePagina(location.pathname),
      },
    });
  } catch (err) {}
});
