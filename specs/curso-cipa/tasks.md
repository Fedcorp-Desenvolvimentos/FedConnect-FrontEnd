# Tarefas — Tela de agendamento de cursos CIPA (Condomed)

> **Rastreabilidade** — RF: RF-CIP-001..005 · CT: CT-CIP-001..018 · Questões: PA-003
> **Status:** em revisão · **Dono:** Ingrid Aylana · **Atualizado:** 2026-09-04
> **Baseado em:** `design.md` (aprovado)

## Fase 1 — Fundação

- [x] T-CIP-1.1 `cursoCipaService.js` sobre `api.js` _(RF-CIP-001, RF-CIP-002 · CT-CIP-001)_
- [x] T-CIP-1.2 `formatCPF`/`validarCPF` em `utils/formatters.js` _(RF-CIP-002 · CT-CIP-003)_
- [x] T-CIP-1.3 Nível `condomed` em `accessLevels.js`; prop `allowed` no `PrivateRouter` _(RF-CIP-003 · CT-CIP-005)_

## Fase 2 — Tela

- [x] T-CIP-2.1 `useCursoCipa` (estado, chamadas, 409/400) _(RF-CIP-001 · CT-CIP-002)_
- [x] T-CIP-2.2 `FaixaMedidas` + `BarraFiltros` + `CalendarioMensal` + `PainelLateral` _(RF-CIP-001 · CT-CIP-001)_
- [x] T-CIP-2.3 `TurmaModal` com local, data, administradora em select digitável e condomínio digitado _(RF-CIP-001, RF-CIP-002 · CT-CIP-003)_
- [x] T-CIP-2.4 `InscritosPanel` com capacidade, edição de inscrito, `ConfirmarModal` na exclusão e aviso de CPF em outra turma _(RF-CIP-002 · CT-CIP-004)_

## Fase 3 — Integração

- [x] T-CIP-3.1 Rota `/condomed/cursos-cipa`, item de menu, `CursoCipaHelp` _(RF-CIP-003 · CT-CIP-005)_
- [x] T-CIP-3.3 `CondomedHome` + `CondomedHomeHelp`, rota `/condomed`, item de menu do setor, breadcrumb e destaque nas rotas filhas _(RF-CIP-004 · CT-CIP-007)_
- [x] T-CIP-3.4 `accessLevels.js` como fonte única (`ACCESS_LEVEL_OPTIONS`) e os seletores de Cadastro e Gerenciar Usuários passando a consumi-la _(RF-CIP-004 · CT-CIP-008)_
- [ ] T-CIP-3.2 Verificação do espelho na `/agenda` _(RF-CIP-001 · CT-CIP-006)_ — pendente: exige app rodando contra o backend com a migração aplicada

## Fase 4 — Vínculo no inscrito (ADR-0005)

- [x] T-CIP-4.1 `TurmaModal` sem administradora e condomínio (fica local, data, situação, observação) _(RF-CIP-001 · CT-CIP-011)_
- [x] T-CIP-4.2 `InscritosPanel`: administradora (select digitável) e condomínio por inscrito, obrigatórios, com as duas colunas na tabela _(RF-CIP-002 · CT-CIP-009)_
- [x] T-CIP-4.3 Repetição do vínculo do inscrito anterior na mesma sessão _(RF-CIP-002 · CT-CIP-010)_
- [x] T-CIP-4.4 Identificação por local + ocupação em `CalendarioMensal`, `PainelLateral` e no título do `InscritosPanel` _(RF-CIP-001 · CT-CIP-011)_
- [x] T-CIP-4.5 Busca da `BarraFiltros` sobre `turma.administradoras`/`turma.condominios`; `useCursoCipa` sem o vínculo no payload da turma _(RF-CIP-001 · CT-CIP-012)_
- [x] T-CIP-4.6 Aviso de CPF em outra turma exibindo administradora e condomínio da inscrição encontrada _(RF-CIP-002 · CT-CIP-009)_
- [x] T-CIP-4.7 Reescrever `CursoCipaHelp` nas partes de agendamento e inscritos _(RF-CIP-001, RF-CIP-002)_

## Fase 5 — Excluir a turma inteira (ADR-0006)

- [x] T-CIP-5.2 Exclusão da turma pelo `ConfirmarModal`, nomeando local, dia, total de inscritos e a perda por condomínio; fim do `window.confirm` _(RF-CIP-002 · CT-CIP-013)_
- [x] T-CIP-5.4 "Excluir turma" na barra do `InscritosPanel` _(RF-CIP-002 · CT-CIP-013)_

## Fase 6 — Criar turma por planilha (ADR-0007)

- [x] T-CIP-6.1 `lerPlanilhaInscritos`: cabeçalhos com apelidos, número da linha, obrigatórios, CPF, duplicidade e administradora contra a base _(RF-CIP-005 · CT-CIP-016, CT-CIP-017)_
- [x] T-CIP-6.2 `ImportarPlanilhaModal` com local, data, download do modelo, anexo e pré-visualização _(RF-CIP-005 · CT-CIP-015)_
- [x] T-CIP-6.3 Bloqueio por capacidade e aviso de linhas fora _(RF-CIP-005 · CT-CIP-018)_
- [x] T-CIP-6.4 `importarTurma` no hook e no service; ação "Turma por planilha" no cabeçalho; abre a lista da turma criada _(RF-CIP-005 · CT-CIP-015)_
- [x] T-CIP-6.5 Ajuda da tela com a seção de planilha _(RF-CIP-005)_

## Verificação Final

- [x] Build passa (`npm run build`) em 2026-09-04, incluindo a Fase 4; detector de design sem achados em `src/pages/Condomed/CursoCipa`
- [ ] Roteiro dos CT executado — CT-CIP-001..018 dependem de ambiente rodando
- [x] `bash specs/verificar.sh` sem violações no `curso-cipa` (R6 falha por PA-023 de `envio-porto`, cross-repo, pré-existente); STATUS.md atualizado
