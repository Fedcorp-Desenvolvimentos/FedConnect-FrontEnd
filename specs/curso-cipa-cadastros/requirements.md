# Requisitos — Cadastros da Condomed (palestrantes e locais)

> **Rastreabilidade** — RF: RF-CIP-006..007 · RNF: RNF-CIP-003 · ADR: ADR-0009 · Questões: PA-029
> **Status:** aprovado · **Dono:** Ingrid Aylana · **Atualizado:** 2026-09-09
> **Aprovado em 2026-09-08 pela resposta do dono a PA-029 e pela instrução "segue o que dá pra fazer"; implementado em 2026-09-09.**

## Contexto e Problema

`[E]` O select de instrutor da turma (`useInstrutores.js`) e as abas de local do calendário (`useCursoCipa.js`, `listarLocais`) leem listas fixas do backend; não há tela para mantê-las. `[D]` O dono pediu em 2026-09-08 uma área na Condomed onde o usuário cadastre palestrantes e locais (PA-029, fechada no mesmo dia). Lado backend em `FedConnect-Back-End/specs/curso-cipa-cadastros/`.

## Escopo

**Dentro do escopo:**
- Card "Cadastros" na home da Condomed e página `/condomed/cadastros` com duas abas: Palestrantes e Locais.
- Formulários de criar/editar, com upload da assinatura do palestrante e ativar/desativar.
- Calendário e formulários de turma passando a usar os cadastros (ids) em vez dos códigos fixos.

**Fora do escopo:**
- Cadastro de condomínios e funcionários.
- Editar a unidade emissora (endereço do cabeçalho do certificado).

## User Stories e Critérios de Aceitação

### RF-CIP-006: Tela de palestrantes

**Como** operador da Condomed, **quero** cadastrar e manter os palestrantes, **para** escolher um instrutor novo na turma sem pedir ao desenvolvimento.

- **QUANDO** abro `/condomed/cadastros` na aba Palestrantes, **ENTÃO** a interface **DEVE** listar os palestrantes com nome, registro (`MTE/UF número`), se tem assinatura e se está ativo, com filtro "mostrar inativos". `[D]` PA-029
- **QUANDO** clico em Novo ou Editar, **ENTÃO** o formulário **DEVE** pedir nome, título (pré-preenchido "Técnico em Segurança no Trabalho"), número e UF do registro MTE e a assinatura (PNG ou JPEG até 500 KB) com prévia da imagem. `[D]` PA-029
- **SE** o backend recusar (registro duplicado, imagem grande), **ENTÃO** a interface **DEVE** mostrar a mensagem do servidor no campo correspondente, sem inventar a regra na tela. `[E]` regra do `CLAUDE.md` (regras vêm do backend)
- **QUANDO** desativo um palestrante, **ENTÃO** ele **DEVE** sumir do select da turma e da importação, mas continuar visível no histórico das turmas antigas. `[D]` PA-029
- **QUANDO** um palestrante não tem assinatura, **ENTÃO** a lista **DEVE** sinalizar — sem assinatura não sai certificado. `[E]` regra do backend (`FedConnect-Back-End/specs/curso-cipa-cadastros/` RF-CIP-006)

### RF-CIP-007: Tela de locais

**Como** operador da Condomed, **quero** cadastrar os locais do curso, **para** abrir turma numa sala nova e ajustar capacidade sem deploy.

- **QUANDO** abro a aba Locais, **ENTÃO** a interface **DEVE** listar nome, prédio, capacidade, unidade emissora, se compartilha a sala de reunião da agenda e se está ativo. `[D]` PA-029
- **QUANDO** crio ou edito um local, **ENTÃO** o formulário **DEVE** pedir nome, prédio, capacidade e unidade (select das unidades que o backend oferece) e a marca "compartilha a sala de reunião da agenda", explicando que só um local pode ter essa marca. `[D]` PA-029
- **QUANDO** um local é criado, desativado ou renomeado, **ENTÃO** as abas do calendário em `/condomed/cursos-cipa` **DEVEM** refletir a lista ativa na próxima carga, sem código fixo de local na tela. `[E]` `useCursoCipa.js` já carrega `listarLocais`; hoje `CalendarioMensal` e `PainelLateral` tratam `SALA_REUNIAO` por código
- **QUANDO** a capacidade muda, **ENTÃO** `inscritos/capacidade` e o `+N` do excesso **DEVEM** vir do backend, como já vêm. `[E]` `acima_da_capacidade` (ADR-0008)

## Requisitos Não Funcionais

### RNF-CIP-003: Contrato

Turma, importação e filtros continuam enviando o **código** do local e do instrutor (o backend manteve o contrato por código, com códigos gerados para registros novos); a planilha de inscritos não carrega esses campos. Os campos derivados (`local_nome`, `instrutor_nome`, `capacidade`, `acima_da_capacidade`, `tem_espelho`) não mudam. `[E]` `FedConnect-Back-End/specs/curso-cipa-cadastros/` RNF-CIP-004 (2026-09-08)

**Verificação prevista (detalhada no design, após aprovação):**
- CT-CIP-020 — palestrantes: listar, criar com assinatura e prévia, editar, desativar some do select da turma, erro do servidor aparece no campo.
- CT-CIP-021 — locais: listar, criar, editar capacidade reflete no calendário, desativar some das abas, marca de sala de reunião única.

## Questões em Aberto

- Nenhuma. PA-029 fechada em 2026-09-08 com as respostas do dono (espelha a questão de número 010 do registro do backend).
