import assert from 'node:assert/strict';
import { test } from 'node:test';
import { calcularInternacao, lerData } from '../js/calculadora.js';
import { classificar, faixas, formatarPercentual } from '../js/regras.js';

for (const [dias, esperado] of [
  [0, 0], [1, 0], [14, 0], [15, 2.5], [27, 2.5], [41, 2.5], [42, 2.5],
  [43, 3], [58, 3], [59, 3], [60, 3.5], [61, 3.5], [100, 3.5], [365, 3.5],
]) {
  test(`Classifica ${dias} DIH em ${esperado}%`, () => {
    assert.equal(classificar(dias).percentual, esperado);
  });
}

test('As faixas cobrem todos os totais sem sobreposição', () => {
  let minimo = 0;
  for (const faixa of faixas) {
    assert.equal(faixa.minimo, minimo);
    assert.ok(faixa.maximo >= minimo);
    minimo = faixa.maximo + 1;
  }
  assert.equal(faixas.at(-1).maximo, Infinity);
});

test('Formata todos os percentuais no padrão brasileiro', () => {
  assert.deepEqual(faixas.map(({ percentual }) => formatarPercentual(percentual)), ['0%', '2,5%', '3%', '3,5%']);
});

for (const [inicio, fim, inclusiva, dias, percentual] of [
  ['26/09/2026', '23/10/2026', false, 27, 2.5],
  ['26/09/2026', '23/10/2026', true, 28, 2.5],
  ['01/10/2026', '15/10/2026', false, 14, 0],
  ['01/10/2026', '15/10/2026', true, 15, 2.5],
  ['01/09/2026', '13/10/2026', false, 42, 2.5],
  ['01/09/2026', '13/10/2026', true, 43, 3],
  ['01/09/2026', '30/10/2026', false, 59, 3],
  ['01/09/2026', '30/10/2026', true, 60, 3.5],
  ['10/10/2026', '10/10/2026', false, 0, 0],
  ['10/10/2026', '10/10/2026', true, 1, 0],
  ['31/12/2026', '01/01/2027', false, 1, 0],
  ['28/02/2028', '01/03/2028', false, 2, 0],
]) {
  test(`${inicio} a ${fim}, com contagem ${inclusiva ? 'inclusiva' : 'padrão'}`, () => {
    const resultado = calcularInternacao(inicio, fim, inclusiva);
    assert.equal(resultado.dias, dias);
    assert.equal(resultado.faixa.percentual, percentual);
  });
}

for (const [inicio, fim] of [
  ['', '01/01/2026'], ['01/01/2026', ''], ['', ''],
  ['02/01/2026', '01/01/2026'], ['01/01/2026', '31/02/2026'],
  ['1/01/2026', '02/01/2026'], ['01/01/2026', '02/01/'],
]) {
  test(`Rejeita o período "${inicio}" a "${fim}" nos dois modos`, () => {
    assert.equal(calcularInternacao(inicio, fim), null);
    assert.equal(calcularInternacao(inicio, fim, true), null);
  });
}

test('Valida o calendário gregoriano e interpreta anos com zeros à esquerda', () => {
  assert.equal(lerData('29/02/1900'), null);
  assert.equal(lerData('29/02/2000').toISOString(), '2000-02-29T00:00:00.000Z');
  assert.equal(lerData('01/01/0099').toISOString(), '0099-01-01T00:00:00.000Z');
  assert.equal(lerData('01/01/0000'), null);
});

test('Calcula com datas digitadas sem barras ou em formatos mistos', () => {
  for (const alta of ['23102026', '23/10/2026']) {
    const resultado = calcularInternacao('26092026', alta);
    assert.equal(resultado.dias, 27);
    assert.equal(resultado.faixa.percentual, 2.5);
  }
});

test('Rejeita datas compactas inválidas e com quantidade incorreta de dígitos', () => {
  for (const valor of ['31022026', '2609202', '260920266', '26/092026']) {
    assert.equal(lerData(valor), null);
  }
});
