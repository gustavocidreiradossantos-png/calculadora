const MINUTOS_ATE_CORTE = (24 + 6) * 60;

export function calcularDuracao(horario) {
  const partes = /^(\d{1,2})(?:h|:(\d{2}))?$/i.exec(horario)
    ?? /^(\d{2})(\d{2})$/.exec(horario);
  if (!partes) return null;

  const horas = Number(partes[1]);
  const minutos = Number(partes[2] ?? 0);
  if (horas > 23 || minutos > 59) return null;

  const total = MINUTOS_ATE_CORTE - (horas * 60 + minutos);
  return { horas: Math.floor(total / 60), minutos: total % 60 };
}

export function formatarDuracao({ horas, minutos }) {
  const textoHoras = `${horas} ${horas === 1 ? 'hora' : 'horas'}`;
  const textoMinutos = `${minutos} ${minutos === 1 ? 'minuto' : 'minutos'}`;
  if (!horas && minutos) return textoMinutos;
  return minutos ? `${textoHoras} e ${textoMinutos}` : textoHoras;
}
