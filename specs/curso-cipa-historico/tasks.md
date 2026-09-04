# Tarefas — Histórico, consulta e detalhe da turma (fase A)

> **Rastreabilidade** — RF: RF-HIS-001..003 · CT: CT-HIS-001..004 · Questões: PA-026
> **Status:** aprovado · **Dono:** Ingrid Aylana · **Atualizado:** 2026-09-04
> **Baseado em:** `design.md` (aprovado)

## Fase 1 (fase A do mapeamento) — Histórico, consulta e detalhe

- [x] T-HIS-1.1 `useInscritos` como fonte única das operações de inscrito; `useCursoCipa` delega; `extrairMensagemApi` muda de dono sem quebrar quem importa _(RNF-HIS-001 · CT-HIS-004)_
- [x] T-HIS-1.2 Dividir `InscritosPanel` em `InscritosConteudo` + moldura; extrair `ExcluirTurmaModal` _(RNF-HIS-001, RF-HIS-003 · CT-HIS-003, CT-HIS-004)_
- [x] T-HIS-1.3 Service: `obterTurma`, `listarHistorico`, `listarParticipantes` _(RF-HIS-001, RF-HIS-002)_
- [x] T-HIS-1.4 `HistoricoTurmas` + `useHistoricoTurmas`: abas, filtros aplicados ao confirmar, paginação, linhas clicáveis _(RF-HIS-001, RF-HIS-002 · CT-HIS-001, CT-HIS-002)_
- [x] T-HIS-1.5 `TurmaDetalhe` + `useTurmaDetalhe`: medidas, inscritos editáveis, editar/excluir turma, 404 _(RF-HIS-003 · CT-HIS-003)_
- [x] T-HIS-1.6 Rotas sob a guarda, breadcrumb, card e ajuda da home, "Ver detalhe" na agenda _(RF-HIS-003 · CT-HIS-004)_

## Fases B–D (rascunho, travadas em PA-026)

- [ ] Aba Documentos com lista de presença · aba Presença · certificados — ver `../../MAPEAMENTO_CIPA_FASE2.md`

## Verificação Final

- [x] Build passa (`npm run build`) em 2026-09-04
- [ ] Roteiro dos CT executado — CT-HIS-001..004 dependem de ambiente rodando contra o backend com `historico/` e `participantes/`
- [x] `bash specs/verificar.sh` sem violações; STATUS.md atualizado
