// src/lib/inicio.ts
// Costos fijos de inicio de un juicio sin monto, para la banda de la home.
// Sale de los mismos datos que la calculadora (/inicio-de-juicio/), así que
// cuando cambia un valor en src/data/aportes.json o el UMA, cambian los dos.
import aportes from '../data/aportes.json';
import uma from '../../public/honorarios/uma.json';

const tj = aportes.tasa_justicia;
const cp = aportes.capsap;
const est = aportes.estampilla_colabo;

/** La estampilla del Colegio: lo que cobra hoy, o ½ UMA redondeado si no está cargado. */
export const estampillaColabo =
  typeof est.vigente === 'number'
    ? est.vigente
    : Math.round((est.umas * uma.valor) / est.redondeo) * est.redondeo;

export const sinMonto = {
  tasa: tj.sin_monto_unidades * tj.valor_unidad,
  capsap: cp.sin_monto + cp.estampilla_previsional,
  estampilla: estampillaColabo,
};

export const totalSinMonto = sinMonto.tasa + sinMonto.capsap + sinMonto.estampilla;

/** Porcentajes de los juicios con monto, para el texto. */
export const porcentajes = { tasa: tj.porcentaje, capsap: cp.porcentaje };
