# Design — Tela de agendamento de cursos CIPA (Condomed)

> **Rastreabilidade** — RF: RF-CIP-001..003 · INV: INV-CIP-001 · ADR: ADR-0002 · Questões: PA-001..003
> **Status:** aprovado · **Dono:** Ingrid Aylana · **Atualizado:** 2026-08-31
> **Baseado em:** `requirements.md` (aprovado)

## Visão Geral da Solução

Página nova `src/pages/Condomed/CursoCipa/` com `PageLayout` (ação "Nova turma" no cabeçalho): faixa de quatro medidas, barra de filtros, calendário mensal próprio (dias, não slots — `agendaSlots.js` não se aplica e fica intocado) onde cada turma é uma etiqueta dentro do dia, e painel lateral com hoje, próximas turmas, alertas e ocupação por local. Service `cursoCipaService.js` sobre `api.js`. Modal de turma com administradora em select digitável (`input` + `datalist` sobre `/vistorias/administradoras/`) e condomínio digitado; painel de inscritos no padrão `PessoaFormFields`. Guarda de rota por nível adicionada ao `PrivateRouter` (prop `allowed`), fechando o gap para esta rota sem alterar as demais.

## Arquitetura de Componentes

| Arquivo | Mudança |
|---|---|
| `src/services/cursoCipaService.js` (novo) | `listarLocais`, `listarTurmas({mes, ano, local})`, `criarTurma`, `atualizarTurma`, `excluirTurma`, `listarInscritos`, `criarInscrito`, `atualizarInscrito`, `excluirInscrito`, `verificarCpf` |
| `src/pages/Condomed/CursoCipa/CursoCipa.jsx` (novo) | container: resumo, calendário, trilho, modais |
| `src/pages/Condomed/CursoCipa/hooks/useCursoCipa.js` (novo) | estado, chamadas, tratamento 409/400 (fonte única das regras de tela) |
| `src/pages/Condomed/CursoCipa/components/` (novo) | `FaixaMedidas`, `BarraFiltros`, `CalendarioMensal`, `PainelLateral`, `TurmaModal`, `InscritosPanel`, `ConfirmarModal`; `CursoCipaHelp` e `CursoCipaStyles` na raiz da página |
| `src/utils/formatters.js` | `formatCPF`, `validarCPF` (novos) |
| `src/utils/accessLevels.js`, `src/components/Sidebar/Sidebar.jsx` | nível `condomed`; item "Cursos CIPA" `allowed: ['admin','condomed']` |
| `src/routes/PrivateRouter.jsx`, `src/routes/AppRouter.jsx` | prop `allowed` (redireciona se nível não permitido); rota `/condomed/cursos-cipa` |

## Contratos de API e Estado

Endpoints e campos definidos em `FedConnect-Back-End/specs/curso-cipa/design.md` ("Modelo de Dados e Contratos"). A listagem do mês é pedida **sem** o filtro `local`, para trazer os dois de uma vez. Estado: `mes`/`ano`, `filtros` (local, situação, busca), `turmas[]` (mês inteiro), `turmasPorDia[data][]`, `turmaSelecionada`, `inscritos[]`. Os filtros agem sobre o mês já carregado, sem nova requisição; `resumo`, `turmasDeHoje`, `proximasTurmas` e `alertas` derivam das turmas visíveis, e capacidade e contagem continuam vindo do backend (RNF-CIP-002). Capacidade e contagem vêm de `turma.capacidade` e `turma.total_inscritos` do backend (RNF-CIP-002).

## Invariantes

| ID | Invariante | Garantido em |
|---|---|---|
| INV-CIP-001 | A interface nunca envia inscrição quando `total_inscritos >= capacidade` retornados pelo backend | aplicação (botão desabilitado + checagem no hook) + backend (400) |

## Fluxo Principal

1. Operador abre "Cursos CIPA" → medidas do mês, calendário com os dois locais e trilho de próximas turmas/alertas (RF-CIP-001).
2. Clica no dia (ou em "Nova turma") → `TurmaModal` com a data; escolhe local, administradora e condomínio → salva; 409 vira mensagem (RF-CIP-001).
3. Salvar a turma nova encadeia direto no `InscritosPanel`, com foco no campo Nome; abrir uma turma existente no calendário chega ao mesmo painel. Adiciona funcionários (CPF com máscara/validação); contador `n/capacidade` (RF-CIP-002). Editar a turma a partir do painel volta para ele ao salvar.

## Tratamento de Erros e Casos de Borda

| Falha | Comportamento na tela | Requisito |
|---|---|---|
| 409 do backend | snackbar com a mensagem de conflito recebida | RF-CIP-001 |
| API indisponível | snackbar de erro; calendário mantém último estado | RF-CIP-001 |
| Capacidade atingida | botão "Adicionar inscrito" desabilitado com tooltip | RF-CIP-002 |
| Nível sem acesso digita a URL | redireciona para `/` | RF-CIP-003 |

## Decisões

- ADR-0002: painel único dos dois locais no lugar das abas por local.
- Guarda de rota via prop `allowed` no `PrivateRouter` (aditiva; rotas atuais sem a prop mantêm comportamento). Decisão local, sem ADR — vira ADR se for generalizada às outras rotas.

## Divergência vs. produção

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

## Impacto e Riscos

Depende do deploy do backend (rotas e nível). `PrivateRouter` ganha prop opcional — sem efeito nas rotas existentes. Sem runner de testes: verificação manual por CT.
