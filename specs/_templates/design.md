# Design — [Nome da Feature]

> **Status:** Rascunho | Em revisão | Aprovado
> **Baseado em:** `requirements.md` (aprovado em [data])

## Visão Geral da Solução

<!-- 1 parágrafo: a abordagem escolhida, em prosa. -->

## Arquitetura de Componentes

<!-- Páginas, componentes, hooks e serviços tocados e como se conectam. -->
<!-- ATENÇÃO: funções compartilhadas (ex.: getComissaoKey) têm FONTE ÚNICA exportada do hook — nunca criar cópia local em componente. -->

| Arquivo | Mudança |
|---|---|
| `src/pages/...` | |
| `src/services/...` | |

## Contratos de API e Estado

<!-- Endpoints consumidos (rota, payload enviado, campos usados da resposta — com o case exato). Estado local vs global, chaves de seleção/cache. Se nada muda no contrato, dizer explicitamente. -->

## Fluxo Principal

<!-- Passo a passo do caminho feliz, do clique ao resultado na tela. -->

## Tratamento de Erros e Casos de Borda

| Falha | Comportamento na tela | Requisito |
|---|---|---|
| API indisponível / timeout | | RF-n |
| Resposta sem campo esperado | | RF-n |
| Estado vazio (sem seleção/sem resultados) | | RF-n |

## Decisões e Trade-offs

### D-1: [Título]
- **Decisão:**
- **Alternativas consideradas:**
- **Justificativa:**

## Estratégia de Verificação

<!-- Sem runner de testes no projeto ainda: descrever o roteiro manual por RF-n (tela, ação, resultado esperado) e o que conferir no Network/console. -->

## Impacto e Riscos

<!-- Depende de deploy do backend primeiro? Quebra telas que reutilizam o mesmo service/hook? -->
