# Design — Seletor "Empresa pagadora (Recebemos de)"

> **Status:** Aprovado
> **Baseado em:** `requirements.md` (aprovado em 2026-08-18) + `FedHub-Backend/specs/voucher-recebemos-de-empresa/design.md`

## Visão Geral da Solução

Constante única com as 3 empresas + helpers de inferência; estado `empresaPagadoraTipo` no hook (`null` = automático); derivados `empresaInferida`/`tiposMistos`/`empresaPagadora` (efetiva); seletor no `EmissaoPanel` visível quando documento = voucher; validação bloqueante em `emitirDocumento`; campos no payload; empresa nos metadados do preview.

## Arquitetura de Componentes

| Arquivo | Mudança |
|---|---|
| `constants/empresasPagadoras.js` (novo) | `EMPRESAS_PAGADORAS`, `getEmpresaPorTipo`, `inferirEmpresaPorTipos` |
| `hooks/useComissoes.js` | Estado + derivados + validação + `empresa_pagadora_*` no payload de emissão + `empresaPagadora` no payload do preview |
| `components/EmissaoPanel.jsx` | Dropdown (opção "Automático — <empresa>" + 3 empresas com CNPJ); aviso vermelho quando misto sem escolha |
| `Comissoes.jsx` | Passa as novas props do hook ao painel |
| `components/PreviewModalDetails.jsx` | Linha "Empresa pagadora (Recebemos de)" nos metadados (só voucher) |

## Contratos de API e Estado

Payload de emissão ganha `empresa_pagadora_nome` (str) e `empresa_pagadora_cnpj` (str) — repassados pelo Django ao FedHub. Backend rejeita misto sem os campos com HTTP 400 (defesa em profundidade; a tela bloqueia antes).

## Tratamento de Erros e Casos de Borda

| Caso | Comportamento na tela | Requisito |
|---|---|---|
| Misto sem escolha | Seletor com borda vermelha + card de aviso + snackbar ao tentar emitir | RF-2 |
| Sem seleção de comissões | Seletor mostra "Automático (pelo tipo da comissão)" | RF-1 |
| Documento = Recibo | Seletor oculto | Escopo |

## Estratégia de Verificação

Roteiro manual em tasks.md (sem runner de testes no projeto).

## Impacto e Riscos

Requer backend (Django + FedHub) deployado junto — Django antigo descartaria os campos (emissão de TIPO único ainda sai certa via inferência do FedHub; mista falharia com 400, que é o comportamento seguro).
