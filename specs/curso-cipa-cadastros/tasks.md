# Tarefas — Cadastros da Condomed (palestrantes e locais)

> **Rastreabilidade** — RF: RF-CIP-006..007 · CT: CT-CIP-020..021
> **Status:** aprovado · **Dono:** Ingrid Aylana · **Atualizado:** 2026-09-09
> **Baseado em:** `design.md` (aprovado)

## Fase 1 — Agenda sem código fixo de local

- [x] T-CAD-1.1 Service: `listarLocais({todos})`, `listarInstrutores({todos})` e CRUD dos dois cadastros (multipart para assinatura) _(RNF-CIP-003 · CT-CIP-020, CT-CIP-021)_
- [x] T-CAD-1.2 `registrarCoresLocais` em `CursoCipaStyles`; `useCursoCipa` sem `ORDEM_LOCAIS`; `BarraFiltros`, `PainelLateral`, `TurmaModal`, `ImportarPlanilhaModal`, `HistoricoTurmas` (via `useLocaisCipa`), `ExcluirTurmaModal` iterando a lista _(RF-CIP-007 · CT-CIP-021)_

## Fase 2 — Página de cadastros

- [x] T-CAD-2.1 `useCadastrosCipa` (listas, gravações, erros por campo) _(RF-CIP-006, RF-CIP-007 · CT-CIP-020, CT-CIP-021)_
- [x] T-CAD-2.2 `CadastrosCondomed` com abas, tabelas, desativar/reativar, excluir com confirmação _(RF-CIP-006, RF-CIP-007 · CT-CIP-020, CT-CIP-021)_
- [x] T-CAD-2.3 `PalestranteModal` (assinatura com prévia e limites) e `LocalModal` (unidade, sala da Agenda) _(RF-CIP-006, RF-CIP-007 · CT-CIP-020, CT-CIP-021)_
- [x] T-CAD-2.4 Rota, breadcrumb, card e ajuda da home; `CadastrosHelp` _(RF-CIP-006, RF-CIP-007)_

## Verificação Final

- [x] Build passa (`npm run build`) em 2026-09-09
- [x] Capturas com API simulada (home, lista de palestrantes, novo palestrante, locais com inativo, novo local)
- [ ] Roteiro dos CT executado contra o backend com as migrações 0005/0006 (ambiente)
- [x] `bash specs/verificar.sh` sem violações; STATUS.md atualizado
