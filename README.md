# Sistema Orquestrador de Micro-Fazendas Verticais (Fase 6)

Versão da Fase 6, construída com React e Vite a partir do projeto da Fase 5.

## Como executar

Requisito: Node.js instalado.

```
npm install
npm run dev
```

Abra o endereço mostrado no terminal (por padrão http://localhost:5173).

## Funcionalidades da Fase 7

### Cadastro de culturas

O catálogo deixou de ser fixo no código. Na página Guia de culturas existe o
botão Cadastrar cultura, que abre um formulário com nome, ícone, ciclo em dias,
necessidade de sol e de água, dificuldade e dica de cultivo.

A cultura cadastrada entra no catálogo, pode ser usada em um plantio na mesma
hora e nasce com a rotina básica de manejo, calculada a partir do ciclo
informado. Com isso o sistema fecha as seis funcionalidades previstas no escopo
original do projeto.

O formulário usa o React Hook Form, com validação de campo obrigatório, tamanho
mínimo e máximo, faixa de dias válida e verificação de nome repetido no catálogo.

### Faixa agrometeorológica

O topo da página Painel traz as condições do tempo da região do usuário, sem
pedir nada a ele. A localização é obtida em três camadas: primeiro o navegador,
depois a localização aproximada pela conexão, caso a permissão seja negada, e por
último a busca manual por cidade, no link Ver outra cidade.

A apresentação é compacta. A linha de cima mostra a cidade, a temperatura e a
condição atual. Abaixo, uma faixa deslizante exibe os indicadores no formato
usado por painéis de cotação: umidade do ar, vento com direção, pressão, chuva do
dia, chance de chuva, índice ultravioleta, evapotranspiração, temperatura e
umidade do solo e os horários do sol. A faixa para quando o ponteiro passa sobre
ela e fica estática para quem configurou menos movimento no sistema.

A previsão dos próximos sete dias fica recolhida e aparece ao clicar. As
informações são apresentadas sem recomendação de manejo.

Os dados vêm das APIs públicas do Open-Meteo, consumidas com fetch. A API é
gratuita, não exige chave e permite chamadas direto do navegador. O serviço fica
em `src/servicos/clima.js`, separado da tela.

## Conceitos de React aplicados

- **Componentes**: cada parte da interface é um componente em `src/components`,
  com a primeira letra maiúscula. `Cabecalho` e `Rodape` são reutilizados em toda
  a aplicação, e `Vertical.jsx` reúne as peças visuais das páginas.
- **JSX**: `className` no lugar de `class` e variáveis inseridas com chaves.
- **Props**: `App` passa dados e funções para as páginas, incluindo o catálogo de
  culturas e a micro-fazenda.
- **useState**: o estado principal fica em `App`, e cada formulário guarda os
  seus próprios campos.
- **useEffect**: em `Avisos.jsx` agenda o fechamento do aviso quando o componente
  é montado e cancela no desmonte. Em `Contato.jsx` roda apenas quando o campo
  mensagem muda.
- **React Router DOM**: rotas de verdade, com `NavLink` marcando a página atual.
- **React Hook Form**: cuida do estado e das validações do cadastro de culturas.
- **styled-components**: usado no componente `PainelClima`, onde o estilo fica
  junto do componente.
- **fetch**: consumo da API de previsão do tempo em `src/servicos/clima.js`.

## Estrutura

- `index.html` - arquivo base do Vite, com a `<div id="root">`.
- `src/main.jsx` - renderiza o componente `App` dentro da `div root`.
- `src/App.jsx` - componente principal, com o estado e as rotas.
- `src/components/` - componentes da aplicação.
- `src/models/` - as classes do diagrama UML: `Cultura`, `RotinaCultura`, `Plantio`,
  `Tarefa` (com `Rega`, `Adubacao`, `Inspecao` e `Personalizada`), `Colheita` e
  `MicroFazenda`.
- `src/dados/culturas.js` - catálogo de culturas.
- `src/dados/rotinas.js` - receitas de manejo de alface, rúcula e cenoura.
- `src/css/estilo.css` — estilos de base do projeto.
- `src/css/vertical.css` — tema visual das páginas, aplicado sobre o Bootstrap.
- `public/_redirects` - faz o servidor de hospedagem entregar as rotas do React Router.

## Páginas

- **Home** - apresentação e link do pitch vídeo.
- **O Sistema** - funcionalidades e público.
- **Guia de Culturas** - catálogo com busca e detalhes (funcionalidade da Fase 5).
- **Painel** - registro de plantios, simulação de dias, colheita e histórico.
- **Manejo** - rotinas de manejo por plantio (funcionalidade da Fase 6).
- **Fale Conosco** - formulário com validações.
