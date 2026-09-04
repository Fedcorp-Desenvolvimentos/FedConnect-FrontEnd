# Design — Tela de agendamento de cursos CIPA (Condomed)

> **Rastreabilidade** — RF: RF-CIP-001..004 · INV: INV-CIP-001 · ADR: ADR-0002, ADR-0004..0006 · Questões: PA-001..003
> **Status:** em revisão · **Dono:** Ingrid Aylana · **Atualizado:** 2026-09-04
> **Baseado em:** `requirements.md` (aprovado)

## Visão Geral da Solução

Home da área em `src/pages/Condomed/Home/` reusando o `CardGridLayout` das outras áreas (um cartão por ferramenta, filtrado pelo nível) — o menu passa a apontar para o setor, não para uma tela dele. Página nova `src/pages/Condomed/CursoCipa/` com `PageLayout` (ação "Nova turma" no cabeçalho): faixa de quatro medidas, barra de filtros, calendário mensal próprio (dias, não slots — `agendaSlots.js` não se aplica e fica intocado) onde cada turma é uma etiqueta dentro do dia, e painel lateral com hoje, próximas turmas, alertas e ocupação por local. Service `cursoCipaService.js` sobre `api.js`. Modal de turma **só com local, data, situação e observação** (ADR-0005). O select digitável de administradora (`input` + `datalist` sobre `/vistorias/administradoras/`) e o condomínio digitado migram para o formulário de inscrito, dentro do painel de inscritos, que segue o padrão `PessoaFormFields`. Guarda de rota por nível adicionada ao `PrivateRouter` (prop `allowed`), fechando o gap para esta rota sem alterar as demais.

## Arquitetura de Componentes

| Arquivo | Mudança |
|---|---|
| `src/services/cursoCipaService.js` (novo) | `listarLocais`, `listarTurmas({mes, ano, local})`, `criarTurma`, `atualizarTurma`, `excluirTurma`, `listarInscritos`, `criarInscrito`, `atualizarInscrito`, `excluirInscrito`, `verificarCpf` |
| `src/pages/Condomed/CursoCipa/CursoCipa.jsx` (novo) | container: resumo, calendário, trilho, modais |
| `src/pages/Condomed/CursoCipa/hooks/useCursoCipa.js` (novo) | estado, chamadas, tratamento 409/400 (fonte única das regras de tela) |
| `src/pages/Condomed/CursoCipa/components/` (novo) | `FaixaMedidas`, `BarraFiltros`, `CalendarioMensal`, `PainelLateral`, `TurmaModal`, `InscritosPanel`, `ConfirmarModal`; `CursoCipaHelp` e `CursoCipaStyles` na raiz da página |
| `TurmaModal` (ADR-0005) | perde administradora e condomínio; fica local, data, situação e observação |
| `InscritosPanel` (ADR-0005) | ganha administradora (select digitável) e condomínio (digitado) por inscrito, obrigatórios, com repetição do vínculo do inscrito anterior; a tabela ganha as duas colunas; o título passa a local + ocupação |
| `CalendarioMensal`, `PainelLateral` (ADR-0005) | etiqueta e linha passam a local + ocupação; o `title` da etiqueta lista as administradoras presentes |
| `BarraFiltros` (ADR-0005) | a busca casa contra `turma.administradoras` e `turma.condominios` (derivados) |
| `useCursoCipa` (ADR-0005) | remove o vínculo do payload da turma; guarda o último vínculo usado na sessão; busca sobre as listas derivadas |
| `CursoCipa.jsx`, `ConfirmarModal` (ADR-0006) | exclusão da turma pelo `ConfirmarModal` (não mais `window.confirm`), com a perda agrupada por condomínio e a prop `acaoAlternativa`; `InscritosPanel` ganha "Excluir turma" |
| `src/utils/formatters.js` | `formatCPF`, `validarCPF` (novos) |
| `src/pages/Condomed/Home/CondomedHome.jsx` (novo) | home da área sobre `CardGridLayout`; cartões declarados em `opcoesCondomed` com `niveis`, hoje só Cursos CIPA |
| `src/pages/Condomed/Home/CondomedHomeHelp.jsx` (novo) | ajuda da área (o que é a Condomed, o que é cada cartão, quem tem acesso) |
| `src/utils/accessLevels.js` | **fonte única** dos níveis: `ACCESS_LEVELS` (com `condomed` e `financeiro`, que faltava), `ACCESS_LEVEL_ORDER` na ordem dos choices do backend e `ACCESS_LEVEL_OPTIONS` para os selects |
| `src/pages/Cadastro/constants/cadastroConstants.js`, `src/pages/GerenciarUsuarios/constants/userConstants.js` | passam a reexportar `ACCESS_LEVEL_OPTIONS` em vez de manter listas fixas próprias |
| `src/components/Sidebar/Sidebar.jsx` | item "Condomed" → `/condomed`, `allowed: ['admin','condomed']`, ativo também nas rotas filhas |
| `src/components/Breadcrumb/Breadcrumb.jsx` | rótulos de `/condomed` e `/condomed/cursos-cipa` |
| `src/routes/PrivateRouter.jsx`, `src/routes/AppRouter.jsx` | prop `allowed` (redireciona se nível não permitido); rotas `/condomed` e `/condomed/cursos-cipa` sob a mesma guarda |

## Contratos de API e Estado

Endpoints e campos definidos em `FedConnect-Back-End/specs/curso-cipa/design.md` ("Modelo de Dados e Contratos"). A listagem do mês é pedida **sem** o filtro `local`, para trazer os dois de uma vez. Estado: `mes`/`ano`, `filtros` (local, situação, busca), `turmas[]` (mês inteiro), `turmasPorDia[data][]`, `turmaSelecionada`, `inscritos[]`. Os filtros agem sobre o mês já carregado, sem nova requisição; `resumo`, `turmasDeHoje`, `proximasTurmas` e `alertas` derivam das turmas visíveis, e capacidade e contagem continuam vindo do backend (RNF-CIP-002). Capacidade e contagem vêm de `turma.capacidade` e `turma.total_inscritos` do backend (RNF-CIP-002).

## Invariantes

| ID | Invariante | Garantido em |
|---|---|---|
| INV-CIP-001 | A interface nunca envia inscrição quando `total_inscritos >= capacidade` retornados pelo backend | aplicação (botão desabilitado + checagem no hook) + backend (400) |

## Fluxo Principal

1. Operador abre "Condomed" no menu → home da área → cartão "Cursos CIPA" → medidas do mês, calendário com os dois locais e trilho de próximas turmas/alertas (RF-CIP-001).
2. Clica no dia (ou em "Nova turma") → `TurmaModal` com a data; escolhe local, administradora e condomínio → salva; 409 vira mensagem (RF-CIP-001).
3. Salvar a turma nova encadeia direto no `InscritosPanel`, com foco no campo Nome; abrir uma turma existente no calendário chega ao mesmo painel. Adiciona funcionários (CPF com máscara/validação); contador `n/capacidade` (RF-CIP-002). Editar a turma a partir do painel volta para ele ao salvar.

## Tratamento de Erros e Casos de Borda

| Falha | Comportamento na tela | Requisito |
|---|---|---|
| 409 do backend | snackbar com a mensagem de conflito recebida | RF-CIP-001 |
| API indisponível | snackbar de erro; calendário mantém último estado | RF-CIP-001 |
| Capacidade atingida | botão "Adicionar inscrito" desabilitado com tooltip | RF-CIP-002 |
| Nível sem acesso digita a URL | redireciona para `/` | RF-CIP-003 |
| Nível sem nenhuma ferramenta permitida | home mostra a mensagem de área vazia | RF-CIP-004 |

## Decisões

- ADR-0002: painel único dos dois locais no lugar das abas por local.
- ADR-0005: vínculo (administradora + condomínio) no formulário do inscrito; turma identificada por local + ocupação; busca sobre as listas derivadas.
- ADR-0006: exclusão da turma com confirmação que nomeia a perda, alcançável da lista de inscritos, e com cancelar como saída não destrutiva.
- ADR-0004: home da área no menu (padrão `CardGridLayout` de Financeiro e Faturamento) em vez de a rota abrir direto a tela do CIPA; e `accessLevels.js` como fonte única dos níveis, espelhando os choices do backend.
- Guarda de rota via prop `allowed` no `PrivateRouter` (aditiva; rotas atuais sem a prop mantêm comportamento). Decisão local, sem ADR — vira ADR se for generalizada às outras rotas.

## Divergência vs. produção

- A tela em produção (branch `feat/curso-cipa`) ainda cadastra administradora e condomínio na turma: a Fase 4 desta spec é o que a alinha ao ADR-0005. O deploy do frontend e do backend é o mesmo evento — a migração `0002` do backend remove os campos do contrato da turma.

- O seletor em cascata administradora → condomínio não foi possível: não existe endpoint de condomínios por administradora. A administradora é um select digitável sobre `/vistorias/administradoras/` e o condomínio é só o nome digitado — o código do condomínio e o técnico instrutor foram retirados do escopo pelo dono em 2026-08-31. `[P]` PA-003

- `src/pages/RH/RH.jsx` testa `nivel_acesso === "rh"`, nível inexistente, e navega para rotas que não existem — mock fora do escopo (PA-002).
- A Reserva espelho criada pelo backend tem `duracao=510`; `agendaSlots.js` só prevê 60–240 na UI, mas `intervaloBloqueado`/`mapaDeOcupacao` aceitam qualquer duração — renderização a confirmar (PA-001).

## Estratégia de Verificação

| CT | Requisito | Caso |
|---|---|---|
| CT-CIP-001 | RF-CIP-001 | Medidas do mês conferem; calendário mostra as turmas dos dois locais; clique no dia abre o formulário com a data; filtros recortam calendário, painel e medidas juntos |
| CT-CIP-002 | RF-CIP-001 | Turma em dia ocupado → snackbar com a mensagem 409 do backend |
| CT-CIP-003 | RF-CIP-002 | Campo de administradora filtra ao digitar e recusa valor fora da lista; inscrito com CPF inválido bloqueado no formulário |
| CT-CIP-004 | RF-CIP-002 | Ao atingir a capacidade, botão desabilita e contador mostra `n/capacidade` |
| CT-CIP-005 | RF-CIP-003 | Nível `usuario`: sem item no menu e URL redireciona; `condomed`/`admin`: acesso normal |
| CT-CIP-006 | RF-CIP-001 | Turma na sala aparece como "Reservado" 09:00–17:30 na tela `/agenda` (verifica PA-001) |
| CT-CIP-007 | RF-CIP-004 | `/condomed` lista o cartão de Cursos CIPA para `condomed`/`admin` e a mensagem de área vazia para outro nível; menu marca "Condomed" também dentro da tela do CIPA |
| CT-CIP-008 | RF-CIP-004 | Cadastro e edição de usuário oferecem `Condomed` no seletor de nível, e o usuário salvo com esse nível entra em `/condomed` |
| CT-CIP-009 | RF-CIP-002 | Inscrito sem administradora ou sem condomínio: envio bloqueado apontando o campo; com os dois, salva e a tabela mostra as colunas |
| CT-CIP-010 | RF-CIP-002 | Segundo inscrito na mesma sessão já vem com administradora e condomínio do anterior, e o campo aceita troca |
| CT-CIP-011 | RF-CIP-001 | Etiqueta do calendário, painel lateral e título da lista mostram local + ocupação; turma vazia mostra `0/capacidade` |
| CT-CIP-012 | RF-CIP-001 | Busca por nome de administradora traz as turmas que têm inscritos dela; busca por condomínio idem |
| CT-CIP-013 | RF-CIP-002 | Excluir turma pela lista de inscritos e pelo formulário: a confirmação nomeia local, dia, total de inscritos e condomínios; confirmar apaga e fecha os painéis |
| CT-CIP-014 | RF-CIP-002 | Turma com inscritos: a confirmação oferece "Só cancelar a turma", que marca `cancelada` e mantém a lista; turma vazia não oferece a alternativa |

## Impacto e Riscos

Depende do deploy do backend (rotas e nível). `PrivateRouter` ganha prop opcional — sem efeito nas rotas existentes. Sem runner de testes: verificação manual por CT.
