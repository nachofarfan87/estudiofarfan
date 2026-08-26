// src/scripts/contact-events.js
// Medición de los contactos iniciados por WhatsApp y correo en todo el sitio.
//
// Vive junto al layout Base para cubrir home, materias y artículos sin repetir
// listeners. `/honorarios/` es HTML estático y conserva su listener inline.

import { nombreDePagina, trackPlausible } from './plausible.js';

function origenDelEnlace(a) {
  if (a.classList.contains('wa-float')) return 'flotante';
  if (a.closest('footer')) return 'pie';
  if (a.closest('.form-error')) return 'error_formulario';
  if (a.closest('.contact-list')) return 'contacto';
  return a.dataset.waOrigen || a.dataset.emailOrigen || 'cuerpo';
}

document.addEventListener('click', function (e) {
  var a = e.target.closest && e.target.closest('a[href*="wa.me"], a[href^="mailto:"]');
  if (!a) return;

  var esWhatsapp = a.href.indexOf('wa.me') !== -1;
  trackPlausible(esWhatsapp ? 'WhatsApp' : 'Correo', {
    origen: origenDelEnlace(a),
    pagina: nombreDePagina(location.pathname),
  });
});
