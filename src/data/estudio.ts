// src/data/estudio.ts
// Fuente única de los datos del estudio. Todo lo que aparece en el JSON-LD,
// en el pie, en la ficha de Google y en los directorios sale de acá: el NAP
// tiene que ser idéntico byte por byte en todos lados, y la única forma de
// garantizarlo es no escribirlo dos veces.

// PENDIENTE ANTES DE PUBLICAR: confirmar con el titular cada dato personal,
// profesional y operativo de este archivo. Se preservan los valores migrados;
// no constituyen una verificación independiente.

export const estudio = {
  nombre: 'Estudio Jurídico Farfán',
  alternativo: 'Farfán Abogados',
  lema: 'Tres generaciones. Un mismo criterio.',
  fundado: '1953',
  telefono: '+543885800175',
  telefonoVisible: '+54 388 580-0175',
  email: 'juanignaciofarfan@gmail.com',
  whatsapp:
    'https://wa.me/5493885800175?text=Hola.%20Quisiera%20hacer%20una%20consulta%20con%20el%20estudio.',
  domicilio: {
    calle: 'Carrizo N° 672',
    localidad: 'San Salvador de Jujuy',
    provincia: 'Jujuy',
    codigoPostal: '4600',
    pais: 'AR',
  },
  horario: { dias: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], abre: '09:00', cierra: '18:00' },
} as const;

export const abogado = {
  nombre: 'Juan Ignacio Farfán',
  matricula: 'M.P. 4692',
  cargo: 'Abogado',
} as const;

// Las doce localidades donde el estudio atiende causas. Alimentan el
// `areaServed` del JSON-LD y la sección "Dónde atendemos" de cada materia.
export const zonas = [
  'San Salvador de Jujuy',
  'Palpalá',
  'Perico',
  'El Carmen',
  'Monterrico',
  'San Pedro de Jujuy',
  'Libertador Gral. San Martín',
  'Fraile Pintado',
  'Humahuaca',
  'Tilcara',
  'La Quiaca',
  'Abra Pampa',
] as const;

// El nombre completo de las localidades para schema.org, donde conviene el
// topónimo sin abreviar.
export const zonasSchema = zonas.map((z) =>
  z === 'Libertador Gral. San Martín' ? 'Libertador General San Martín' : z,
);
