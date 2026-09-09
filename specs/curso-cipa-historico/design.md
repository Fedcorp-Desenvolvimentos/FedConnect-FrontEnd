# Design — Histórico, consulta e detalhe da turma (fases A–D)

> **Rastreabilidade** — RF: RF-HIS-001..006 · INV: — · ADR: ADR-0009 · Questões: PA-026, PA-028, PA-030, PA-031
> **Status:** aprovado · **Dono:** Ingrid Aylana · **Atualizado:** 2026-09-09
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
| `src/services/cursoCipaService.js` | `obterTurma`, `listarHistorico`, `listarParticipantes`, `baixarListaPresenca` (blob + nome do `Content-Disposition`) |
| `useTurmaDetalhe`, `TurmaDetalhe.jsx` (fase B) | `baixarListaPresenca`/`baixandoLista`; botão "Lista de presença (PDF)" nas ações do cabeçalho |
| `AppRouter.jsx`, `Breadcrumb.jsx`, `CondomedHome.jsx`, `CondomedHomeHelp.jsx` | rotas sob a guarda `admin/condomed`, rótulo, card e ajuda |
| `src/pages/Condomed/Turmas/PresencaConteudo.jsx` (novo, fase C) | aba Presença: três estados por inscrito editados em memória, "Marcar todos presentes" (só quem está sem registro), Desfazer, Salvar em um único `POST presenca/`; bloqueada em turma cancelada ou antes da data, com o motivo; mostra quem registrou e quando; avisa pendências (`beforeunload` e `onPendencias` para o pai) |
| `TurmaDetalhe.jsx` (fase C) | abas Inscritos/Presença (`TurmasStyles.Abas`); troca de aba com marcações pendentes pede confirmação; contagens vêm da turma |
| `useTurmaDetalhe.js`, `cursoCipaService.js` (fase C) | `registrarPresenca(presencas)` → substitui a turma pela resposta (já Realizada, com `presentes`/`ausentes`/`sem_registro`) |
| `TurmaModal.jsx` (fase C) | "Realizada" deixa de ser opção: aparece travada quando já é o estado |
| `TurmasStyles.js` (fase C) | `SeloContagem`, `Segmentado`, `OpcaoSegmento` |
| `src/pages/Condomed/Turmas/CertificadosConteudo.jsx` (novo, fase D) | aba Certificados: presentes com estado emitido (número, quando, por quem) / apto / impedido (sem CNPJ); bloqueio antecipado com o motivo (cancelada, sem presença, sem instrutor, instrutor sem assinatura) e atalho "Editar turma"; "Emitir certificados (N)" com confirmação e resultado do lote (emitidos, já existentes, impedidos por nome); "Baixar todos (N)" e "Baixar" por linha; "Informar CNPJ" leva ao inscrito na aba Inscritos |
| `TurmaDetalhe.jsx` (fase D) | terceira aba; aviso "turma com certificados: não pode ser excluída nem cancelada"; Excluir turma desabilitado com certificado; `editarInicial` para o atalho de CNPJ |
| `useTurmaDetalhe.js`, `cursoCipaService.js` (fase D) | `emitirCertificados` (substitui a turma pela do lote), `baixarCertificados` (turma) e `baixarCertificado` (número), com `baixandoCertificado` = "todos" \| número \| null; `baixarPdf()` comum |
| `InscritosConteudo.jsx` (fase D) | prop `editarInicial`: outra aba pode abrir um inscrito em edição |
| `TurmaModal.jsx` (fase D) | "Cancelada" sai das opções quando há certificado (PA-031); botão Excluir só quando permitido |
| `HistoricoTurmas.jsx` (fase D) | selo "N sem certificado" ao lado da situação em turma realizada com presentes aptos sem certificado (contagem do backend) |

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
| CT-HIS-005 | RF-HIS-004 | No detalhe, o botão baixa `lista-presenca-cipa-<data>-<local>.pdf`; durante a geração mostra "Gerando..."; funciona em turma futura e vazia; erro do backend vira snackbar |
| CT-HIS-006 | RF-HIS-005 | Aba Presença lista na ordem da lista impressa; marcar e salvar envia um lote e a situação vira Realizada sem clique extra; "Marcar todos presentes" não altera ausentes; sair da aba com marcações pendentes pede confirmação; turma cancelada e turma futura mostram a aba bloqueada com o motivo; "Realizada" não aparece mais como opção no formulário — capturas com API simulada em 2026-09-08 |
| CT-HIS-007 | RF-HIS-006 | Aba Certificados lista presentes com estado emitido/apto/impedido e as contagens do backend; "Emitir" pede confirmação, faz uma chamada, recarrega e mostra emitidos e impedidos por nome; sem instrutor/assinatura o botão fica desabilitado com o aviso e "Editar turma"; "Baixar todos" e "Baixar" usam o nome do servidor; aba bloqueada em turma cancelada ou sem presença; com certificado, Excluir some e "Cancelada" sai do formulário; histórico marca "N sem certificado" — capturas com API simulada em 2026-09-09 |

## Impacto e Riscos

Refatoração do `useCursoCipa` e do `InscritosPanel` atinge a agenda que já está na branch: o risco é regressão no painel de inscritos. Mitigação: o conteúdo foi movido sem alteração de lógica, e o build passa. Sem runner de testes, CT-HIS-004 é a verificação manual dessa regressão.
