# Design — Cadastros da Condomed (palestrantes e locais)

> **Rastreabilidade** — RF: RF-CIP-006..007 · RNF: RNF-CIP-003 · INV: — · ADR: ADR-0009 · Questões: PA-029
> **Status:** aprovado · **Dono:** Ingrid Aylana · **Atualizado:** 2026-09-09
> **Baseado em:** `requirements.md` (aprovado em 2026-09-08 — resposta do dono a PA-029 e instrução "segue o que dá pra fazer")

## Visão Geral da Solução

Uma página nova, `/condomed/cadastros`, com duas abas (Palestrantes, Locais) sobre o `PageLayout` e os estilos do CIPA, e a agenda deixando de conhecer locais por código fixo: abas do calendário, legenda, painel de ocupação, selects de turma/importação e filtro do histórico passam a iterar a lista que vem de `cursos-cipa/locais/`. As cores por local são atribuídas quando a lista chega. O contrato da API não mudou (`local`/`instrutor` continuam códigos), então os payloads da turma são os mesmos.

## Arquitetura de Componentes

| Arquivo | Mudança |
|---|---|
| `src/pages/Condomed/Cadastros/CadastrosCondomed.jsx` (novo) | abas, tabelas com "mostrar inativos", Novo/Editar (modais), Desativar/Reativar, Excluir com confirmação (desabilitado quando há turma) |
| `src/pages/Condomed/Cadastros/hooks/useCadastrosCipa.js` (novo) | listas com inativos, `salvar*`/`alternarAtivo*`/`excluir*`, erros por campo vindos do backend (`errosCampos`) |
| `src/pages/Condomed/Cadastros/PalestranteModal.jsx` (novo) | nome, título (pré-preenchido), MTE, UF, assinatura (PNG/JPEG ≤ 500 KB) com prévia local |
| `src/pages/Condomed/Cadastros/LocalModal.jsx` (novo) | nome, prédio, capacidade, unidade emissora, marca "sala de reunião da Agenda" com explicação |
| `src/pages/Condomed/Cadastros/CadastrosHelp.jsx` (novo) | guia rápido da tela |
| `src/pages/Condomed/CursoCipa/hooks/useLocaisCipa.js` (novo) | lista de locais (com `todos`) e registro das cores; usado pelo histórico |
| `src/services/cursoCipaService.js` | `listarLocais({todos})`, `criar/atualizar/excluirLocal`, `listarInstrutores({todos})`, `criar/atualizar/excluirInstrutor` (multipart quando há arquivo) |
| `src/pages/Condomed/CursoCipa/CursoCipaStyles.js` | `registrarCoresLocais(locais)`: paleta por ordem, sala da agenda em verde-azulado; os dois códigos originais mantêm a cor |
| `useCursoCipa.js`, `BarraFiltros.jsx`, `PainelLateral.jsx`, `TurmaModal.jsx`, `ImportarPlanilhaModal.jsx`, `HistoricoTurmas.jsx`, `ExcluirTurmaModal.jsx` | saem `ORDEM_LOCAIS`/`NOME_LOCAL`/`"SALA_REUNIAO"`; tudo itera `locais`; sala da agenda reconhecida por `tem_espelho != null` |
| `AppRouter.jsx`, `Breadcrumb.jsx`, `CondomedHome.jsx`, `CondomedHomeHelp.jsx` | rota sob a guarda `admin/condomed`, rótulo, card "Cadastros" e ajuda |

## Contratos de API e Estado

Backend em `FedConnect-Back-End/specs/curso-cipa-cadastros/design.md`. As listas de cadastro são pequenas e sem paginação; a tela pede `?todos=1` e filtra inativos localmente. Erros do backend chegam por campo e vão para o campo do formulário; `detail` vira snackbar. O `ativo` de um palestrante nunca é enviado junto com a assinatura em multipart sem intenção: o backend mantém o default.

Estado da agenda: `locais` já era carregado uma vez em `useCursoCipa`; agora ele também define a ordem das abas e as cores. `TurmaModal` mostra "(desativado)" para o local de uma turma antiga que saiu da lista, sem permitir escolhê-lo em turma nova.

## Fluxo Principal

1. Home da Condomed → card "Cadastros" → `/condomed/cadastros`.
2. Novo palestrante → modal → `POST instrutores/` (multipart se houver assinatura) → lista recarrega; o select da turma passa a oferecê-lo.
3. Desativar → `PATCH {ativo:false}` → sai das opções; com "mostrar inativos" continua visível e pode ser reativado.
4. Excluir só habilitado sem turma vinculada; com turma o botão explica que é para desativar.
5. Locais: idem; a marca de sala da Agenda só cabe em um — o backend recusa o segundo e a mensagem aparece no formulário.

## Tratamento de Erros e Casos de Borda

| Falha | Comportamento | Requisito |
|---|---|---|
| Arquivo não PNG/JPEG ou > 500 KB | recusado antes de enviar, mensagem no campo | RF-CIP-006 |
| Backend recusa (MTE repetido, nome repetido, segunda sala) | mensagem no campo correspondente | RF-CIP-006, RF-CIP-007 |
| Excluir com turma | botão desabilitado com motivo; se ainda assim o backend recusar, snackbar | RF-CIP-006, RF-CIP-007 |
| Local desativado em turma antiga | aparece como "(desativado)" no formulário; não é opção para turma nova | RF-CIP-007 |
| Lista de locais vazia | calendário sem abas; formulário sem opção — o backend sempre tem ao menos os dois semeados | RF-CIP-007 |

## Decisões

- Códigos continuam sendo a chave no frontend (espelha a decisão do backend em RNF-CIP-004 de lá): zero migração de payload, e as cores dos dois locais originais não mudam.
- Cores atribuídas em tempo de carga (`registrarCoresLocais`), não por código fixo: um local novo ganha cor da paleta na ordem em que chega; a sala da agenda é sempre verde-azulada para o operador reconhecer o bloqueio na Agenda.
- Sem verificação de assinatura de volta (o backend não expõe o arquivo): a prévia é só do arquivo recém-escolhido; a lista mostra "cadastrada"/"sem assinatura".

## Divergência vs. produção

Nenhuma — a tela é nova; a agenda continua com o mesmo comportamento para os dois locais que existem.

## Estratégia de Verificação

| CT | Requisito | Caso |
|---|---|---|
| CT-CIP-020 | RF-CIP-006, RNF-CIP-003 | listar palestrantes com selo de assinatura; criar com assinatura (prévia) e sem; MTE repetido mostra erro no campo; desativar some do select da turma e volta com "mostrar inativos"; excluir desabilitado com turma |
| CT-CIP-021 | RF-CIP-007, RNF-CIP-003 | criar local aparece nas abas do calendário e no select da turma na próxima carga; capacidade alterada reflete no `x/y`; segunda sala da agenda mostra erro no campo; desativado sai das abas e continua no filtro do histórico |

Build `npm run build` OK em 2026-09-09; capturas das telas com API simulada em 2026-09-09. Verificação manual contra o backend pendente (ambiente).

## Impacto e Riscos

Refatoração dos componentes da agenda (abas, legenda, painel, modais) para lista dinâmica: risco de regressão visual se a lista chegar vazia ou fora de ordem. Mitigação: build e capturas com os dois locais semeados mais um inativo; ordem é a do backend (`id`).
