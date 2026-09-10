# Tarefas — Relatório de faturas pendentes (tela do Financeiro)

> **Rastreabilidade** — RF: RF-FIN-001..002 · CT: CT-FIN-001..002
> **Status:** aprovado · **Dono:** Ingrid Aylana · **Atualizado:** 2026-09-09
> **Baseado em:** `design.md` (aprovado em 2026-09-09)

## Fase 1 — Tela, rota e cards

- [x] T-FIN-1.1 `faturasPendentesService.js`: buscar e baixar planilha/PDF com o nome do `Content-Disposition` _(RF-FIN-002, RNF-FIN-001 · CT-FIN-002)_
- [x] T-FIN-1.2 `useFaturasPendentes.js`: padrões do legado, filtros digitados × aplicados, agrupamento por administradora _(RF-FIN-001, RF-FIN-002 · CT-FIN-001)_
- [x] T-FIN-1.3 `FaturasPendentes.jsx` + estilos: filtros, tabela, totais, avisos, exportações _(RF-FIN-001, RF-FIN-002 · CT-FIN-001, CT-FIN-002)_
- [x] T-FIN-1.4 Guarda `faturasPendentes` em `routeAccess.js`, rota, breadcrumb e cards nas homes do Financeiro e do Faturamento _(RF-FIN-002 · CT-FIN-002)_

## Fase 2 — Verificação manual

- [ ] T-FIN-2.1 Roteiro CT-FIN-001/002 contra o Django com o FedHub pelo túnel; comparar planilha e PDF com o relatório do legado _(CT-FIN-001, CT-FIN-002)_

## Verificação Final

- [x] Build passa (`npm run build`) em 2026-09-09
- [ ] Roteiro dos CT executado (depende do FedHub real)
- [x] `bash specs/verificar.sh` sem violações; STATUS.md atualizado
