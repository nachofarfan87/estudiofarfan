// Metadatos de los artículos. Alimentan § II de la home, el índice
// /articulos/ y el JSON-LD de cada pieza.
//
// El cuerpo de cada artículo vive en su propia página bajo src/pages/articulos/
// y no en una colección de contenido: la prosa doctrinaria usa encabezados
// numerados y epígrafes que Markdown no expresa sin perder el formato. Cuando
// entren las guías divulgativas —que sí son Markdown corriente— conviene
// sumar una colección aparte para ésas.

export interface Articulo {
  slug: string;
  titulo: string;
  subtitulo: string;
  seccion: string;
  /** ISO, para schema.org y para ordenar. */
  fecha: string;
  /** Cómo se muestra la fecha en la página. */
  fechaTexto: string;
  /** Bajada del índice y de § II en la home. */
  copete: string;
  destacado?: boolean;
}

export const articulos: Articulo[] = [
  {
    slug: 'la-legitimacion-que-el-banco-reconocio',
    titulo: 'La legitimación que el banco ya había reconocido',
    subtitulo:
      'Por qué un banco que reconoció la cuenta, la operación y ocho meses de reclamos no puede negar, recién ante el juez, que quien reclama tenga derecho a hacerlo.',
    seccion: 'Derecho del Consumidor',
    fecha: '2026-08-31',
    fechaTexto: '31 de agosto de 2026',
    copete:
      'Un banco reconoció durante ocho meses que la clienta era la titular de la cuenta y la interlocutora de sus reclamos; recién ante el juez sostuvo que no tenía legitimación para demandar. Qué es la legitimación, por qué esa contradicción tiene nombre en el Código Civil y Comercial, y qué sanciones prevé la ley procesal de Jujuy para la defensa que sólo busca ganar tiempo.',
  },
  {
    slug: 'el-derecho-a-arrepentirse',
    titulo: 'El derecho a arrepentirse que la letra chica no puede borrar',
    subtitulo:
      'Qué puede hacer un consumidor cuando una compra ya aceptada deja de convencerlo, por qué ese derecho no depende de lo que diga el contrato que firmó, y cómo se ejerce en la práctica.',
    seccion: 'Derecho del Consumidor',
    fecha: '2026-08-25',
    fechaTexto: '25 de agosto de 2026',
    copete:
      'El artículo 34 de la Ley de Defensa del Consumidor le da a quien compró a distancia o fuera de un local diez días corridos para revocar la aceptación, sin explicar por qué y sin costo alguno. Qué comprende ese derecho, qué queda afuera, y qué hacer cuando el botón de arrepentimiento no funciona o el proveedor dice que no corresponde.',
  },
  {
    slug: 'el-tiempo-que-la-ley-no-manda-perder',
    titulo: 'El tiempo que la ley no manda perder',
    subtitulo:
      'La carga ilegítima de las diligencias sobre los letrados en el fuero civil y comercial de Jujuy.',
    seccion: 'Derecho Procesal',
    fecha: '2026-08-05',
    fechaTexto: '5 de agosto de 2026',
    copete:
      'Una práctica extendida en los juzgados civiles y comerciales de Jujuy obliga a los abogados a confeccionar las cédulas y oficios del propio juzgado, invocando un “deber de colaboración” que la ley no impone. Por qué esa carga es ilegítima —y a quién le corresponde realmente esa tarea.',
    destacado: true,
  },
];

export const articulosPorFecha = () =>
  [...articulos].sort((a, b) => b.fecha.localeCompare(a.fecha));
