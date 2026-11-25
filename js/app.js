import { calcularInternacao, dataUTC, lerData } from './calculadora.js';
import { calcularDuracao, formatarDuracao } from './duracao.js';
import { faixas, formatarPercentual, rotuloFaixa } from './regras.js';

const porId = (id) => document.getElementById(id);
const formulario = porId('formulario');
const internacao = porId('internacao');
const alta = porId('alta');
const inclusiva = porId('inclusiva');
const copiar = porId('copiar');
const mensagemCopia = porId('copia');
const linhas = faixas.map((faixa) => {
  const linha = porId('faixas').insertRow();
  linha.insertCell().textContent = rotuloFaixa(faixa);
  const marcador = document.createElement('span');
  marcador.className = 'aplicada';
  marcador.textContent = 'Aplicada';
  marcador.hidden = true;
  linha.cells[0].append(marcador);
  linha.insertCell().textContent = formatarPercentual(faixa.percentual);
  return { faixa, linha, marcador };
});

let resultado;
let revisao = 0;

function mostrarErro(campo, mensagem) {
  const aviso = porId(`erro-${campo.id}`);
  if (aviso.textContent !== mensagem) aviso.textContent = mensagem;
  campo.setAttribute('aria-invalid', String(Boolean(mensagem)));
}

function erroData(valor, data, mostrarIncompletas) {
  const completo = /^\d{8,}$/.test(valor) || valor.length >= 10;
  return valor && !data && (mostrarIncompletas || completo)
    ? 'Informe uma data válida, como 26092026 ou 26/09/2026.' : '';
}

function atualizar(mostrarIncompletas = false) {
  const inicio = internacao.value.trim();
  const fim = alta.value.trim();
  const dataInicio = lerData(inicio);
  const dataFim = lerData(fim);
  mostrarErro(internacao, erroData(inicio, dataInicio, mostrarIncompletas));
  mostrarErro(alta, dataInicio && dataFim && dataFim < dataInicio
    ? 'A alta deve ser na mesma data da internação ou depois.'
    : erroData(fim, dataFim, mostrarIncompletas));

  resultado = calcularInternacao(inicio, fim, inclusiva.checked);
  revisao += 1;
  const dias = resultado ? `${resultado.dias} ${resultado.dias === 1 ? 'dia' : 'dias'}` : '—';
  const percentual = resultado ? formatarPercentual(resultado.faixa.percentual) : '—';
  porId('dias').textContent = dias;
  porId('percentual').textContent = percentual;
  const anuncio = resultado ? `Total de internação: ${dias}. Percentual aplicável: ${percentual}.` : 'Sem resultado.';
  if (porId('anuncio').textContent !== anuncio) porId('anuncio').textContent = anuncio;
  copiar.disabled = !resultado;
  mensagemCopia.textContent = '';

  for (const { faixa, linha, marcador } of linhas) {
    const ativa = faixa === resultado?.faixa;
    linha.classList.toggle('ativa', ativa);
    marcador.hidden = !ativa;
  }
}

formulario.addEventListener('submit', (evento) => evento.preventDefault());
formulario.addEventListener('input', () => atualizar());
for (const campo of [internacao, alta]) {
  campo.addEventListener('blur', () => {
    const valor = campo.value.trim();
    if (/^\d{8}$/.test(valor) && lerData(valor)) {
      campo.value = valor.replace(/^(\d{2})(\d{2})(\d{4})$/, '$1/$2/$3');
    }
    atualizar(true);
  });
}

porId('limpar').addEventListener('click', () => {
  formulario.reset();
  atualizar();
  internacao.focus();
});

copiar.addEventListener('click', async () => {
  if (!resultado) return;
  const versao = revisao;
  const texto = `${resultado.dias} dias - ${formatarPercentual(resultado.faixa.percentual)}`;
  try {
    await navigator.clipboard.writeText(texto);
    if (versao === revisao) mensagemCopia.textContent = 'Resultado copiado.';
  } catch {
    if (versao === revisao) mensagemCopia.textContent = 'Não foi possível copiar. Selecione o resultado e copie manualmente.';
  }
});

const formularioHoras = porId('formulario-horas');
const horaInicio = porId('hora-inicio');

function atualizarHoras(validar = false) {
  const horario = horaInicio.value.trim();
  const duracao = calcularDuracao(horario);
  const erro = validar && horario && !duracao ? 'Informe um horário válido, como 14 ou 14:30.' : '';
  mostrarErro(horaInicio, erro);
  const texto = duracao ? formatarDuracao(duracao) : '—';
  if (porId('duracao').textContent !== texto) porId('duracao').textContent = texto;
}

formularioHoras.addEventListener('submit', (evento) => {
  evento.preventDefault();
  atualizarHoras(true);
});
formularioHoras.addEventListener('input', () => atualizarHoras());
horaInicio.addEventListener('blur', () => atualizarHoras(true));
porId('limpar-horas').addEventListener('click', () => {
  formularioHoras.reset();
  atualizarHoras();
  horaInicio.focus();
});

const seletor = porId('seletor');
const campoMes = porId('mes');
const campoAno = porId('ano');
const grade = porId('dias-calendario');
const anterior = porId('anterior');
const proximo = porId('proximo');
const nomeMes = new Intl.DateTimeFormat('pt-BR', { month: 'long', timeZone: 'UTC' });
const nomeDia = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'full', timeZone: 'UTC' });
let campoAtivo;
let dataSelecionada;
let mesVisivel;

for (let mes = 1; mes <= 12; mes += 1) {
  campoMes.add(new Option(nomeMes.format(dataUTC(2000, mes, 1)), mes));
}

function exibirMes(ano, mes) {
  mesVisivel = dataUTC(ano, mes, 1);
  ano = mesVisivel.getUTCFullYear();
  mes = mesVisivel.getUTCMonth() + 1;
  campoMes.value = mes;
  campoAno.value = ano;
  anterior.disabled = ano === 1 && mes === 1;
  proximo.disabled = ano === 9999 && mes === 12;
  grade.replaceChildren();

  for (let coluna = 0; coluna < mesVisivel.getUTCDay(); coluna += 1) {
    const vazio = document.createElement('span');
    vazio.setAttribute('aria-hidden', 'true');
    grade.append(vazio);
  }
  const ultimoDia = dataUTC(ano, mes + 1, 0).getUTCDate();
  for (let dia = 1; dia <= ultimoDia; dia += 1) {
    const data = dataUTC(ano, mes, dia);
    const botao = document.createElement('button');
    botao.type = 'button';
    botao.textContent = dia;
    botao.setAttribute('aria-label', nomeDia.format(data));
    botao.setAttribute('aria-pressed', String(data.getTime() === dataSelecionada?.getTime()));
    botao.addEventListener('click', () => {
      campoAtivo.value = [dia, mes, ano].map((parte, i) => String(parte).padStart(i === 2 ? 4 : 2, '0')).join('/');
      atualizar(true);
      seletor.close();
    });
    grade.append(botao);
  }
}

for (const botao of document.querySelectorAll('[data-campo]')) {
  botao.addEventListener('click', () => {
    campoAtivo = porId(botao.dataset.campo);
    dataSelecionada = lerData(campoAtivo.value.trim());
    const hoje = new Date();
    const referencia = dataSelecionada ?? lerData(internacao.value.trim())
      ?? dataUTC(hoje.getFullYear(), hoje.getMonth() + 1, hoje.getDate());
    porId('seletor-titulo').textContent = campoAtivo.labels[0].textContent;
    exibirMes(referencia.getUTCFullYear(), referencia.getUTCMonth() + 1);
    seletor.showModal();
    campoMes.focus();
  });
}

campoMes.addEventListener('change', () => exibirMes(mesVisivel.getUTCFullYear(), Number(campoMes.value)));
campoAno.addEventListener('change', () => {
  const ano = campoAno.valueAsNumber;
  exibirMes(campoAno.validity.valid && Number.isInteger(ano) ? ano : mesVisivel.getUTCFullYear(), Number(campoMes.value));
});
for (const [botao, ajuste] of [[anterior, -1], [proximo, 1]]) {
  botao.addEventListener('click', () => {
    exibirMes(mesVisivel.getUTCFullYear(), mesVisivel.getUTCMonth() + 1 + ajuste);
    if (botao.disabled) campoMes.focus();
  });
}
porId('fechar').addEventListener('click', () => seletor.close());
