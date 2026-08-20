# Tarefas — Seletor "Empresa pagadora (Recebemos de)"

> **Status:** Em andamento (código concluído; verificação manual pendente)
> **Baseado em:** `design.md` (aprovado em 2026-08-18)

## Fase 1: Fundação

- [x] 1.1 `constants/empresasPagadoras.js` com as 3 empresas + helpers _(RF-1)_

## Fase 2: Hook

- [x] 2.1 Estado `empresaPagadoraTipo` + derivados `empresaInferida`/`tiposMistos`/`empresaPagadora` _(RF-1)_
- [x] 2.2 Validação bloqueante em `emitirDocumento` (voucher + sem empresa) _(RF-2)_
- [x] 2.3 `empresa_pagadora_*` no payload de emissão; `empresaPagadora` no payload do preview _(RF-2, RF-3)_

## Fase 3: Interface

- [x] 3.1 Dropdown no `EmissaoPanel` (só voucher; "Automático — <empresa>"; aviso quando misto) _(RF-1, RF-2)_
- [x] 3.2 Props conectadas em `Comissoes.jsx` _(RF-1)_
- [x] 3.3 Empresa pagadora nos metadados do `PreviewModalDetails` _(RF-3)_

## Verificação Final (manual)

- [ ] Build passa (`npm run build`)
- [ ] Seleção só BENEFICIO → seletor mostra "Automático — Fedcorp Adm. de Benefícios"; PDF confere
- [ ] Seleção só CONDOCORP/PEAGA → empresa correspondente no seletor, preview e PDF
- [ ] Seleção mista → aviso vermelho + emissão bloqueada até escolher; após escolher, PDF sai com a escolhida
- [ ] Trocar manualmente com TIPO único → escolha prevalece
- [ ] Critérios EARS do requirements.md conferidos um a um
