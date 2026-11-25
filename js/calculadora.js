import { classificar } from './regras.js';

const MILISSEGUNDOS_POR_DIA = 86_400_000;

export function dataUTC(ano, mes, dia) {
  const data = new Date(0);
  data.setUTCFullYear(ano, mes - 1, dia);
  return data;
}

export function lerData(valor) {
  const partes = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(valor)
    ?? /^(\d{2})(\d{2})(\d{4})$/.exec(valor);
  if (!partes) return null;

  const [, dia, mes, ano] = partes.map(Number);
  const data = dataUTC(ano, mes, dia);
  if (ano < 1 || data.getUTCFullYear() !== ano ||
      data.getUTCMonth() + 1 !== mes || data.getUTCDate() !== dia) {
    return null;
  }
  return data;
}

export function calcularInternacao(internacao, alta, inclusiva = false) {
  const inicio = lerData(internacao);
  const fim = lerData(alta);
  if (!inicio || !fim || fim < inicio) return null;

  const dias = (fim - inicio) / MILISSEGUNDOS_POR_DIA + Number(inclusiva);
  return { dias, faixa: classificar(dias) };
}
