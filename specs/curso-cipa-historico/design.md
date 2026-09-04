# Design — Histórico, consulta e detalhe da turma (fase A)

> **Rastreabilidade** — RF: RF-HIS-001..003 · INV: — · ADR: ADR-0009 · Questões: PA-026
> **Status:** aprovado · **Dono:** Ingrid Aylana · **Atualizado:** 2026-09-04
> **Baseado em:** `requirements.md` (aprovado)

## Visão Geral da Solução

Uma segunda página da área (`/condomed/turmas`) e um detalhe por turma (`/condomed/turmas/:id`), ambos sobre o `PageLayout` e reaproveitando os estilos do CIPA. Para o detalhe mostrar a lista de inscritos **sem duplicar código**, o `InscritosPanel` da agenda foi dividido em `InscritosConteudo` (conteúdo) + `InscritosPanel` (moldura de modal), e as operações de inscrito saíram do `useCursoCipa` para um hook próprio, `useInscritos`, que os dois lugares usam. A confirmação de exclusão da turma virou componente (`ExcluirTurmaModal`) pelo mesmo motivo.

## Arquitetura de Componentes

| Arquivo | Mudança |
|---|---|
| `src/pages/Condomed/Turmas/HistoricoTurmas.jsx` (novo) | abas Turmas/Participantes, filtros aplicados ao confirmar, tabelas clicáveis, paginação |
| `src/pages/Condomed/Turmas/hooks/useHistoricoTurmas.js` (novo) | estado das abas, filtros digitados × aplicados, páginas, chamadas a `historico/` e `participantes/` |
| `src/pages/Condomed/Turmas/TurmaDetalhe.jsx` (novo) | medidas da turma, `InscritosConteudo`, `TurmaModal`, `ExcluirTurmaModal`; 404 tratado |
| `src/pages/Condomed/Turmas/hooks/useTurmaDetalhe.js` (novo) | carregar, atualizar e excluir uma turma pelo id |
| `src/pages/Condomed/Turmas/TurmasStyles.js` (novo) | abas, superfície, filtros, linha clicável, paginação, medidas |
| `src/pages/Condomed/CursoCipa/hooks/useInscritos.js` (novo) | fonte única de carregar/adicionar/editar/remover/verificarCpf; passa a ser dono de `extrairMensagemApi` (o `useCursoCipa` re-exporta) |
| `src/pages/Condomed/CursoCipa/components/InscritosConteudo.jsx` (novo) | o corpo do antigo `InscritosPanel`, sem moldura |
| `src/pages/Condomed/CursoCipa/components/InscritosPanel.jsx` | vira moldura: overlay, cabeçalho e "Ver detalhe"; renderiza `InscritosConteudo` |
| `src/pages/Condomed/CursoCipa/components/ExcluirTurmaModal.jsx` (novo) | confirmação de exclusão extraída de `CursoCipa.jsx`, com a perda por condomínio |
| `src/pages/Condomed/CursoCipa/hooks/useCursoCipa.js` | delega inscritos ao `useInscritos`; mantém a API que a agenda consome |
| `src/services/cursoCipaService.js` | `obterTurma`, `listarHistorico`, `listarParticipantes` |
| `AppRouter.jsx`, `Breadcrumb.jsx`, `CondomedHome.jsx`, `CondomedHomeHelp.jsx` | rotas sob a guarda `admin/condomed`, rótulo, card e ajuda |

## Contratos de API e Estado

Backend em `FedConnect-Back-End/specs/curso-cipa-historico/design.md`. `historico/` e `participantes/` devolvem `{count, next, previous, results}`; a tela pagina por `page`/`page_size=25` e calcula o total de páginas a partir de `count`.

Estado do histórico: por aba, **filtros digitados** e **filtros aplicados** — só os aplicados disparam requisição, ao confirmar. Uma aba consulta por vez; a outra guarda o último resultado. Filtro padrão de Turmas: `data_inicio` = hoje − 6 meses, `data_fim` vazio (as futuras aparecem no topo).

Estado do detalhe: `useTurmaDetalhe(id)` guarda a turma; `useInscritos({ turma, aoMudar: recarregar })` guarda os inscritos e recarrega a turma a cada gravação, para contagens e listas derivadas acompanharem.

## Fluxo Principal

1. Home da Condomed → card "Turmas e participantes" → `/condomed/turmas`.
2. Aba Turmas com os últimos seis meses; filtros; Buscar; clique na linha → detalhe.
3. Aba Participantes: busca por nome/CPF/condomínio/administradora; clique → detalhe da turma da inscrição.
4. No detalhe: mesma lista de inscritos da agenda; "Editar turma" abre o `TurmaModal`; "Excluir turma" abre o `ExcluirTurmaModal` e volta ao histórico ao confirmar.
5. Da agenda, o painel de inscritos leva ao detalhe por "Ver detalhe".

## Tratamento de Erros e Casos de Borda

| Falha | Comportamento | Requisito |
|---|---|---|
| Turma inexistente no detalhe | página de "não encontrada" com volta ao histórico | RF-HIS-003 |
| API indisponível | snackbar; a lista mantém o último resultado | RF-HIS-001 |
| Nenhum resultado | mensagem de vazio distinta de "carregando" | RF-HIS-001, RF-HIS-002 |
| Busca com dígitos e máscara | vai ao backend só com os dígitos | RF-HIS-002 |

## Decisões

- ADR-0009: página própria para histórico e detalhe, com `InscritosConteudo` e `useInscritos` como fonte única entre agenda e detalhe.
- Filtros aplicados ao confirmar, não por tecla: lista paginada no servidor; uma requisição por caractere seria carga sem ganho.

## Divergência vs. produção

Nenhuma — páginas e rotas novas; a agenda mantém o comportamento (o modal continua o mesmo, mais um botão).

## Estratégia de Verificação

| CT | Requisito | Caso |
|---|---|---|
| CT-HIS-001 | RF-HIS-001 | Abrir a página lista os últimos seis meses paginados; filtros só consultam ao confirmar; linha abre o detalhe; `+N` aparece em turma acima da capacidade |
| CT-HIS-002 | RF-HIS-002 | Buscar "Maria" e um CPF com máscara devolve uma linha por inscrição; clique abre a turma certa |
| CT-HIS-003 | RF-HIS-003 | No detalhe, adicionar/editar/remover inscrito e editar/excluir a turma funcionam como na agenda; id inexistente mostra a página de não encontrada |
| CT-HIS-004 | RNF-HIS-001, RF-HIS-003 | Na agenda, o painel continua funcionando igual e ganha "Ver detalhe" que abre a página certa |

## Impacto e Riscos

Refatoração do `useCursoCipa` e do `InscritosPanel` atinge a agenda que já está na branch: o risco é regressão no painel de inscritos. Mitigação: o conteúdo foi movido sem alteração de lógica, e o build passa. Sem runner de testes, CT-HIS-004 é a verificação manual dessa regressão.
