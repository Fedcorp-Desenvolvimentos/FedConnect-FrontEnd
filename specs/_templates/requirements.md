# Requisitos — [Nome da Feature]

> **Status:** Rascunho | Em revisão | Aprovado
> **Autor:** | **Data:** | **Área(s):** `src/pages/...`, `src/services/...`

## Contexto e Problema

<!-- 2-4 frases: qual dor ou necessidade motiva esta mudança? Link para issue/print se houver. -->

## Escopo

**Dentro do escopo:**
-

**Fora do escopo:** <!-- tão importante quanto o que entra -->
-

## User Stories e Critérios de Aceitação

### RF-1: [Título da story]

**Como** [ator], **quero** [ação], **para** [benefício].

Critérios (formato EARS — cada um deve ser verificável na tela ou no payload):

- **QUANDO** [ação do usuário/evento], **ENTÃO** a interface **DEVE** [comportamento].
- **SE** [condição de erro — API fora, resposta inválida], **ENTÃO** a interface **DEVE** [feedback ao usuário].
- **ENQUANTO** [estado — carregando, sem seleção], a interface **DEVE** [invariante].

### RF-2: ...

## Requisitos Não Funcionais

<!-- Só os que se aplicam. Exemplos para o frontend: -->
- **Contrato:** [ex.: payload segue a spec X do backend; campos case-sensitive documentados]
- **Feedback de erro:** [ex.: falha da API vira mensagem legível, nunca tela silenciosa ou número errado]
- **Desempenho:** [ex.: sem buscar listas inteiras (limit alto); cache/enriquecimento só quando necessário]
- **Consistência:** [ex.: números exibidos batem com o que o backend confirmou, não com a seleção local]

## Questões em Aberto

- [ ]
