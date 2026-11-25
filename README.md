# Calculadora de DIH

Aplicação web em português brasileiro para calcular a diferença entre as datas de internação e alta e indicar o percentual aplicável. A opção **Incluir dia da alta** soma um dia antes de classificar o total. As datas são interpretadas como datas civis em UTC.

Para preencher o DIH pelo teclado, digite oito números por data, como `26092026`. O resultado aparece assim que as duas datas são válidas. Ao sair do campo, a data é exibida com barras. Também é possível digitar com barras ou usar o calendário.

A seção **Tempo de permanência em horas** recebe somente o horário da internação. Digite, por exemplo, `14`, `14h`, `14:30` ou `1430`. Até as 06h, o corte é às 06h da mesma manhã. Após as 06h, o corte é na manhã seguinte. Uma internação às 03h42 resulta em 2 horas e 18 minutos, e às 14h resulta em 16 horas. Cada formulário tem seu próprio botão de limpeza.

## Executar localmente

Na raiz do projeto, inicie um servidor estático com Python 3 e abra [a calculadora local](http://localhost:8000/).

```sh
python -m http.server 8000 --bind localhost
```

Use HTTP em localhost durante o desenvolvimento e HTTPS em produção. Isso permite carregar os módulos JavaScript e dá acesso à área de transferência quando o navegador autoriza. O servidor local apenas entrega os arquivos estáticos.

## Testes

Com Node.js 22 ou superior, execute `npm test` (ou `node --test`). A suíte nativa valida os limites percentuais, a formatação, a contagem inclusiva, as datas inválidas, as mudanças de mês e ano e os anos bissextos. O projeto dispensa instalação de dependências.

Para validar a interface no navegador, preencha 26/09/2026 e 23/10/2026. A aplicação deve exibir 27 dias, 2,5% e o indicador **Aplicada** na faixa correspondente. Marque a opção inclusiva e confirme 28 dias. Copie o resultado, confira a confirmação e cole o texto em um editor. Ao limpar, confira os campos vazios, a opção desmarcada e a remoção do resultado e do destaque. Teste o calendário com Tab e Enter e use Escape para fechá-lo. Informe uma alta anterior à internação e confirme que o resultado some e a mensagem aparece. Reduza a janela até a largura de um celular e confira a disposição dos campos.

## Publicar no GitHub Pages

1. Envie os arquivos da raiz para a branch `main` de um repositório público no GitHub. Inclua o arquivo `.nojekyll`.
2. Abra **Settings → Pages** no repositório. Em **Build and deployment**, selecione **Deploy from a branch**.
3. Selecione `main` e `/(root)` e clique em **Save**.
4. Quando a publicação terminar, confirme **Enforce HTTPS** e copie o endereço apresentado na tela de Pages. O endereço padrão de um projeto segue o formato `https://USUARIO.github.io/REPOSITORIO/`.

[Documentação do GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

## Organização e manutenção

| Arquivo | Responsabilidade |
| --- | --- |
| `index.html` | Estrutura semântica e controles |
| `css/style.css` | Estilo, foco visível e responsividade |
| `js/regras.js` | Faixas, percentual e formatação |
| `js/calculadora.js` | Validação e cálculo de datas civis em UTC |
| `js/duracao.js` | Cálculo e formatação da duração em horas e minutos |
| `js/app.js` | Eventos, calendário, resultados e cópia |
| `assets/favicon.svg` | Ícone de calculadora |
| `tests/calculadora.test.js` | Testes com o módulo nativo do Node.js |
| `tests/duracao.test.js` | Testes da duração e dos horários inválidos |
| `package.json` | Configuração de módulos e comando de testes |
| `.gitignore` e `.nojekyll` | Exclusões do Git e publicação estática |

Altere as faixas em `js/regras.js` e atualize os casos esperados nos testes quando a regra de negócio mudar. A tabela e a classificação leem a mesma configuração.

## Privacidade

Os cálculos acontecem no navegador. A página dispensa autenticação e usa somente arquivos locais do próprio site. As datas e os resultados ficam em memória durante o uso, sem cookies, armazenamento web, rastreamento ou transmissão. O botão de cópia envia apenas o total e o percentual à área de transferência quando acionado.
