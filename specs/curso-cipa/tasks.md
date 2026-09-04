# Tarefas — Tela de agendamento de cursos CIPA (Condomed)

> **Rastreabilidade** — RF: RF-CIP-001..004 · CT: CT-CIP-001..008 · Questões: PA-003
> **Status:** aprovado · **Dono:** Ingrid Aylana · **Atualizado:** 2026-09-04
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

## Verificação Final

- [x] Build passa (`npm run build`) em 2026-09-04; detector de design sem achados em `src/pages/Condomed/CursoCipa`
- [ ] Roteiro dos CT executado — CT-CIP-001..008 dependem de ambiente rodando
- [x] `bash specs/verificar.sh` sem violações no `curso-cipa` (R6 falha por PA-023 de `envio-porto`, cross-repo, pré-existente); STATUS.md atualizado
