# Tarefas — Histórico, consulta e detalhe da turma (fases A–D)

> **Rastreabilidade** — RF: RF-HIS-001..006 · CT: CT-HIS-001..007 · Questões: PA-026, PA-028, PA-030, PA-031
> **Status:** aprovado · **Dono:** Ingrid Aylana · **Atualizado:** 2026-09-09
> **Baseado em:** `design.md` (aprovado)

## Fase 1 (fase A do mapeamento) — Histórico, consulta e detalhe

- [x] T-HIS-1.1 `useInscritos` como fonte única das operações de inscrito; `useCursoCipa` delega; `extrairMensagemApi` muda de dono sem quebrar quem importa _(RNF-HIS-001 · CT-HIS-004)_
- [x] T-HIS-1.2 Dividir `InscritosPanel` em `InscritosConteudo` + moldura; extrair `ExcluirTurmaModal` _(RNF-HIS-001, RF-HIS-003 · CT-HIS-003, CT-HIS-004)_
- [x] T-HIS-1.3 Service: `obterTurma`, `listarHistorico`, `listarParticipantes` _(RF-HIS-001, RF-HIS-002)_
- [x] T-HIS-1.4 `HistoricoTurmas` + `useHistoricoTurmas`: abas, filtros aplicados ao confirmar, paginação, linhas clicáveis _(RF-HIS-001, RF-HIS-002 · CT-HIS-001, CT-HIS-002)_
- [x] T-HIS-1.5 `TurmaDetalhe` + `useTurmaDetalhe`: medidas, inscritos editáveis, editar/excluir turma, 404 _(RF-HIS-003 · CT-HIS-003)_
- [x] T-HIS-1.6 Rotas sob a guarda, breadcrumb, card e ajuda da home, "Ver detalhe" na agenda _(RF-HIS-003 · CT-HIS-004)_

## Fase 2 (fase B do mapeamento) — Lista de presença

- [x] T-HIS-2.1 `baixarListaPresenca` no service (blob + nome do header) e no `useTurmaDetalhe`; botão no cabeçalho do detalhe _(RF-HIS-004 · CT-HIS-005)_

## Fase 3 (fase C do mapeamento) — Presença

- [x] T-HIS-3.1 `registrarPresenca` no service e no `useTurmaDetalhe` _(RF-HIS-005 · CT-HIS-006)_
- [x] T-HIS-3.2 `PresencaConteudo` (estados, marcar todos, desfazer, salvar, bloqueios, auditoria, pendências) e estilos _(RF-HIS-005 · CT-HIS-006)_
- [x] T-HIS-3.3 Abas em `TurmaDetalhe` com confirmação ao sair com pendências; "Realizada" travada no `TurmaModal` _(RF-HIS-005 · CT-HIS-006)_

## Fase 4 (fase D do mapeamento) — Certificados

- [x] T-HIS-4.1 Service: `emitirCertificados`, `baixarCertificadosTurma`, `baixarCertificado`, `baixarPdf` comum; hook com `emitindo`/`baixandoCertificado` _(RF-HIS-006 · CT-HIS-007)_
- [x] T-HIS-4.2 `CertificadosConteudo` (estados, bloqueios, emissão com confirmação e resultado, downloads, atalho de CNPJ) _(RF-HIS-006 · CT-HIS-007)_
- [x] T-HIS-4.3 Terceira aba e aviso em `TurmaDetalhe`; `editarInicial` no `InscritosConteudo`; "Cancelada"/Excluir bloqueados com certificado; selo "sem certificado" no histórico _(RF-HIS-006 · CT-HIS-007)_

## Verificação Final

- [x] Build passa (`npm run build`) em 2026-09-09
- [ ] Roteiro dos CT executado — CT-HIS-001..005 dependem de ambiente rodando contra o backend com `historico/` e `participantes/`
- [x] `bash specs/verificar.sh` sem violações; STATUS.md atualizado
