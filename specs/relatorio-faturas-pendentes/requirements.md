# Requisitos — Relatório de faturas pendentes (tela do Financeiro)

> **Rastreabilidade** — RF: RF-FIN-001..002 · RNF: RNF-FIN-001 · Questões: PA-032, PA-033
> **Status:** aprovado · **Dono:** Ingrid Aylana · **Atualizado:** 2026-09-09
> **Aprovado pelo dono em 2026-09-09** (respostas às questões + confirmação da situação A vencer / Vencidas / Todas). **PA-032 fechada em 2026-09-09 com as respostas do dono.**

## Contexto e Problema

`[E]` O Financeiro tem uma home em cards (`src/pages/Financeiro/Home/FinanceiroHome.jsx`) com emissão e consulta de comissões, e as consultas de faturas já baixam Excel e PDF pelo `Content-Disposition` do backend (`src/services/consultaFatura.js`). `[D]` PA-033: o dono pediu em 2026-09-09 o relatório de faturas pendentes do legado dentro do FedConnect, para financeiro, faturamento e admin. Lados backend em `FedConnect-Back-End/specs/relatorio-faturas-pendentes/` e `FedHub-Backend/specs/relatorio-faturas-pendentes/`.

## Escopo

**Dentro do escopo:**
- Card "Faturas pendentes" na home do Financeiro e página `/financeiro/faturas-pendentes` com filtros, tabela com totais e os botões Gerar planilha e Gerar PDF.

**Fora do escopo:**
- Ações sobre a fatura a partir do relatório (baixa, reemissão, cancelamento).
- Salvar filtros favoritos ou agendar envio.

## User Stories e Critérios de Aceitação

### RF-FIN-001: Filtrar e ver as faturas pendentes

**Como** analista do financeiro, **quero** filtrar as faturas vencidas e sem baixa como no legado, **para** conferir a lista antes de gerar o relatório.

- **QUANDO** abro `/financeiro/faturas-pendentes`, **ENTÃO** a interface **DEVE** mostrar os filtros (fatura, seguradora, cedente, administradora, apólice, vencimento de/até, início de vigência, classificação, situação e ordenação), com a classificação em "OBS não preenchida e sem depósito em C/C", a situação em "Vencidas" e a ordenação em "Vencimento" por padrão. `[D]` PA-032
- **QUANDO** clico em Buscar, **ENTÃO** a interface **DEVE** consultar o backend uma vez com os filtros aplicados e mostrar a tabela com **uma linha por documento**: fatura, documento, sacado, produto/OBS, vigência, vencimento, dias em atraso, valor, periodicidade e parcela, administradora, mais os totais vindos do backend (documentos, faturas, valor). `[E]` regra do `CLAUDE.md`: contagens e somas vêm do backend
- **QUANDO** a ordenação é administradora, **ENTÃO** a tabela **DEVE** agrupar visualmente por administradora com o subtotal do grupo (o PDF do legado não agrupa; na tela ajuda a cobrar por cliente). `[E]` decisão local de tela
- **SE** não há resultado, **ENTÃO** a interface **DEVE** dizer "Nenhuma fatura pendente para estes filtros" e manter os botões de exportação habilitados (o relatório vazio existe). `[E]` decisão do backend (RF-FAT-002 de lá)
- **SE** o backend responder erro ou demorar, **ENTÃO** a interface **DEVE** mostrar snackbar e manter o último resultado. `[E]` padrão das telas do Financeiro

### RF-FIN-002: Gerar planilha e PDF

**Como** analista, **quero** os botões Gerar planilha e Gerar PDF com os mesmos filtros da tela, **para** substituir os dois botões do legado.

- **QUANDO** clico em Gerar planilha ou Gerar PDF, **ENTÃO** a interface **DEVE** baixar o arquivo do backend com o nome que ele indicar no `Content-Disposition`, mostrando "Gerando..." no botão até terminar. `[E]` `consultaFatura.js` `exportarFaturasParaExcel`/`exportarFaturasParaPDF`
- **QUANDO** os filtros mudam depois da busca, **ENTÃO** os botões **DEVEM** exportar o que está na tela (filtros aplicados), não o que está digitado — igual à busca. `[E]` padrão do histórico do CIPA (filtros digitados × aplicados)
- **QUANDO** olho o card na home do Financeiro, **ENTÃO** ele **DEVE** aparecer para `admin`, `financeiro` e `faturamento`, e a rota **DEVE** ficar sob a guarda desses níveis. `[D]` PA-033; `[E]` `src/utils/routeAccess.js`

## Requisitos Não Funcionais

### RNF-FIN-001: Contrato

Os nomes dos filtros e das colunas são os do FedHub, repassados pelo Django sem tradução; a tela não renomeia nem recalcula. `[E]` `FedConnect-Back-End/specs/relatorio-faturas-pendentes/` RNF-FAT-002

**Verificação prevista (detalhada no design, após aprovação):** CT-FIN-001 — filtros com padrão do legado, busca só ao confirmar, tabela com totais do backend, agrupamento por administradora, vazio com botões habilitados, erro vira snackbar; CT-FIN-002 — planilha e PDF baixam com o nome do servidor e os filtros aplicados; card e rota respeitam os níveis.

## Questões em Aberto

- Nenhuma. PA-032 fechada em 2026-09-09. A situação "a vencer" depende da questão aberta no registro do FedHub.
