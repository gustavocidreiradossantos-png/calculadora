export const faixas = [
  { minimo: 0, maximo: 14, percentual: 0 },
  { minimo: 15, maximo: 42, percentual: 2.5 },
  { minimo: 43, maximo: 59, percentual: 3 },
  { minimo: 60, maximo: Infinity, percentual: 3.5 },
];

export function classificar(dias) {
  return faixas.find(({ minimo, maximo }) => dias >= minimo && dias <= maximo);
}

const formatador = new Intl.NumberFormat('pt-BR', { style: 'percent', maximumFractionDigits: 2 });

export function formatarPercentual(percentual) {
  return formatador.format(percentual / 100);
}

export function rotuloFaixa({ minimo, maximo }) {
  return Number.isFinite(maximo) ? `${minimo} a ${maximo} dias` : `${minimo} dias ou mais`;
}
