import assert from 'node:assert/strict';
import { test } from 'node:test';
import { calcularDuracao, formatarDuracao } from '../js/duracao.js';

for (const [horario, texto] of [
  ['14', '16 horas'],
  ['14h', '16 horas'],
  ['14:30', '15 horas e 30 minutos'],
  ['1430', '15 horas e 30 minutos'],
  ['23:59', '6 horas e 1 minuto'],
  ['00:00', '30 horas'],
  ['6', '24 horas'],
  ['05:30', '24 horas e 30 minutos'],
]) {
  test(`De ${horario} até as 06h do dia seguinte são ${texto}`, () => {
    assert.equal(formatarDuracao(calcularDuracao(horario)), texto);
  });
}

test('Rejeita horário vazio, incompleto ou inválido', () => {
  for (const horario of ['', '14:', '14:3', '24', '24:00', '1460', '-1', '14h30']) {
    assert.equal(calcularDuracao(horario), null);
  }
});
