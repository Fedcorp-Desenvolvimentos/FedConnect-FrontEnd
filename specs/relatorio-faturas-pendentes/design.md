# Design — Relatório de faturas pendentes (tela do Financeiro)

> **Rastreabilidade** — RF: RF-FIN-001..002 · RNF: RNF-FIN-001 · INV: — · Questões: PA-032, PA-033
> **Status:** aprovado · **Dono:** Ingrid Aylana · **Atualizado:** 2026-09-09
> **Baseado em:** `requirements.md` (aprovado em 2026-09-09) · implementado no mesmo dia por instrução do dono ("segue")

## Visão Geral da Solução

Página `/financeiro/faturas-pendentes` montada com os estilos do Financeiro (`ComissoesStyles`): um card de filtros com os campos e padrões do legado (RF-FIN-001) e um card de resultado com a tabela, um documento por linha, totais do backend e os botões Gerar planilha e Gerar PDF (RF-FIN-002). O hook `useFaturasPendentes` separa filtros digitados de aplicados: só Buscar consulta, e as exportações saem com os aplicados. Nomes de filtros e colunas são os do FedHub, sem tradução (RNF-FIN-001). A rota tem guarda própria para `admin`, `financeiro` e `faturamento`, e o card aparece nas homes do Financeiro e do Faturamento, porque o nível `faturamento` não vê o menu Financeiro.

## Arquitetura de Componentes

| Arquivo | Mudança |
|---|---|
| `src/services/faturasPendentesService.js` (novo) | `buscar`, `baixarPlanilha`, `baixarPdf` (blob + nome do `Content-Disposition`); remove filtros vazios |
| `src/pages/Financeiro/FaturasPendentes/hooks/useFaturasPendentes.js` (novo) | `FILTROS_PADRAO`, vocabulários `SITUACOES`/`CLASSIFICACOES`/`ORDENACOES`; filtros digitados × aplicados; `buscar`, `baixar(tipo)`, `grupos` (agrupamento por administradora com subtotal do backend), `filtrosMudaram` |
| `src/pages/Financeiro/FaturasPendentes/FaturasPendentes.jsx` (novo) | cabeçalho, card de filtros, card de resultado (tabela, avisos, totais), estados vazio/sem consulta |
| `src/pages/Financeiro/FaturasPendentes/FaturasPendentesStyles.js` (novo) | tabela, linha de grupo, subtotal, selos, aviso |
| `src/utils/routeAccess.js` | `faturasPendentes: ["admin", "financeiro", "faturamento"]` |
| `src/routes/AppRouter.jsx` | rota sob `PrivateRouter allowed={ROUTE_ACCESS.faturasPendentes}` |
| `src/components/Breadcrumb/Breadcrumb.jsx` | rótulo "Faturas pendentes" |
| `src/pages/Financeiro/Home/FinanceiroHome.jsx`, `src/pages/Faturamento/FaturamentoHome.jsx` | card "Faturas pendentes" |

## Contratos de API e Estado

Backend em `FedConnect-Back-End/specs/relatorio-faturas-pendentes/design.md`: `GET faturas/pendentes/` devolve `{sucesso, filtros, referencia, totais, data}`; as exportações devolvem arquivo com `Content-Disposition`.

Estado: `filtros` (digitados), `aplicados` (o que gerou o `resultado`), `resultado` (corpo do backend), `gerando` (`""`/`"xlsx"`/`"pdf"`). `grupos` deriva de `resultado` e `aplicados.ordenar_por`: com `administradora`, uma seção por administradora com o subtotal de `totais.por_administradora`; senão, um grupo único. `filtrosMudaram` liga o aviso "os filtros mudaram depois da busca".

## Fluxo Principal

1. Home do Financeiro (ou do Faturamento) → card → `/financeiro/faturas-pendentes`.
2. Filtros já vêm com os padrões do legado; Buscar consulta uma vez e guarda os aplicados.
3. Tabela com um documento por linha; ordenação por administradora agrupa com subtotal.
4. Gerar planilha / Gerar PDF baixam com os filtros aplicados e o nome do servidor; o botão mostra "Gerando..." até terminar.

## Tratamento de Erros e Casos de Borda

| Falha | Comportamento | Requisito |
|---|---|---|
| Backend 502/504/400 | snackbar com a mensagem; a lista mantém o último resultado | RF-FIN-001 |
| Nenhum documento | estado vazio explicando que o relatório vazio existe; botões continuam habilitados | RF-FIN-001 |
| Filtros alterados após a busca | aviso; exportações seguem usando os aplicados | RF-FIN-002 |
| Resultado no teto do FedHub (5.000) | aviso para refinar os filtros | RF-FIN-001 |
| Antes da primeira busca | estado "nenhuma consulta ainda"; exportações desabilitadas | RF-FIN-002 |

## Decisões

- Estilos do Financeiro (`ComissoesStyles`) e não os da Condomed: a página é do Financeiro e deve parecer com Comissões.
- Filtros de seguradora, cedente e administradora por **código** na primeira versão (PA-032): a busca por nome depende de serviços de lookup que só existem para administradora e cedente; entra como melhoria quando a operação pedir.
- Card também na home do Faturamento: o nível `faturamento` não tem o item Financeiro no menu; sem o card ele só chegaria pela URL.

## Divergência vs. produção

Nenhuma — página, rota e cards novos.

## Estratégia de Verificação

| CT | Requisito | Caso |
|---|---|---|
| CT-FIN-001 | RF-FIN-001, RNF-FIN-001 | Abrir a página mostra os padrões do legado; Buscar consulta uma vez; tabela e totais vêm do backend; ordenação por administradora agrupa com subtotal; vazio mantém os botões; erro vira snackbar; aviso de filtros alterados |
| CT-FIN-002 | RF-FIN-002 | Gerar planilha/PDF baixam com o nome do servidor e os filtros aplicados; card visível para admin/financeiro/faturamento e oculto para os demais; rota redireciona quem não tem nível |

Sem runner de testes no frontend: verificação manual contra o Django com o FedHub pelo túnel. Build (`npm run build`) passou em 2026-09-09.

## Impacto e Riscos

Nada existente muda. Risco baixo: a tabela com 5.000 linhas é pesada de renderizar; o teto e o filtro padrão `vencidas` limitam, e a rolagem horizontal cobre telas menores.
