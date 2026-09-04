# Requisitos — Histórico, consulta e documentos do CIPA (fase 2)

> **Rastreabilidade** — RF: RF-HIS-001..003 · RNF: RNF-HIS-001 · ADR: ADR-0009 · Questões: PA-026
> **Status:** aprovado · **Dono:** Ingrid Aylana · **Atualizado:** 2026-09-04

## Contexto e Problema

`[E]` A tela `/condomed/cursos-cipa` é uma agenda: mostra um mês por vez e a lista de inscritos num modal (`InscritosPanel`). Não há onde ver seis meses de turmas nem responder "em quais turmas esta pessoa esteve" fora do aviso de CPF duplicado. `[D]` O solicitante pediu, em 2026-09-04, histórico, consulta e documentos (lista de presença, presença, certificado); a resposta em página própria está no ADR-0009. Mapeamento em `../../MAPEAMENTO_CIPA_FASE2.md`; esta spec cobre a **fase A**. Lado backend em `FedConnect-Back-End/specs/curso-cipa-historico/`.

## Escopo

**Dentro do escopo (fase A):** página `/condomed/turmas` com duas abas (Turmas, Participantes); página `/condomed/turmas/:id` com a lista de inscritos da turma, editável; card na home da Condomed; atalho "Ver detalhe" no painel da agenda.

**Fora do escopo desta fase:** presença, lista de presença em PDF, certificado (fases B–D; dependem de PA-026). Atalho na home principal do sistema (é um carrossel de banners, não uma grade — ver mapeamento, seção 2).

## User Stories e Critérios de Aceitação

### RF-HIS-001: Histórico de turmas

**Como** operador da Condomed, **quero** ver as turmas de um período com filtros, **para** não folhear o calendário mês a mês.

- **QUANDO** abro `/condomed/turmas`, **ENTÃO** a aba Turmas **DEVE** listar os últimos seis meses, da mais recente para a mais antiga, paginada de 25 em 25, com data, local, situação, `inscritos/capacidade`, condomínios e número de administradoras. `[D]` ADR-0009
- **QUANDO** altero os filtros (período, local, situação, busca), **ENTÃO** a lista **DEVE** ser consultada ao confirmar (Enter ou Buscar), não a cada tecla. `[D]` ADR-0009
- **QUANDO** clico numa linha, **ENTÃO** a interface **DEVE** abrir `/condomed/turmas/:id`. `[E]` `HistoricoTurmas.jsx`
- **SE** a turma está acima da capacidade, **ENTÃO** a linha **DEVE** marcar o excesso (`+N`). `[E]` `acima_da_capacidade` do backend (ADR-0008)

### RF-HIS-002: Consulta de participantes

**Como** operador, **quero** procurar uma pessoa, um condomínio ou uma administradora, **para** ver em quais turmas apareceram.

- **QUANDO** busco na aba Participantes, **ENTÃO** a interface **DEVE** mostrar uma linha por inscrição — nome, CPF, condomínio, administradora, turma (data e local) e situação da turma —, paginada. `[D]` ADR-0009
- **QUANDO** clico numa linha, **ENTÃO** a interface **DEVE** abrir a turma daquela inscrição. `[E]` `HistoricoTurmas.jsx`

### RF-HIS-003: Detalhe da turma

**Como** operador, **quero** abrir uma turma numa página própria, **para** trabalhar a lista sem o modal da agenda — e, nas fases seguintes, marcar presença e emitir documentos ali.

- **QUANDO** abro `/condomed/turmas/:id`, **ENTÃO** a interface **DEVE** mostrar data, local, situação, administradoras, condomínios e a lista de inscritos, com adicionar, editar e remover funcionando **exatamente** como na agenda. `[D]` ADR-0009 (mesmo componente e mesmo hook)
- **QUANDO** edito ou excluo a turma pelo detalhe, **ENTÃO** a interface **DEVE** usar os mesmos formulário e confirmação da agenda. `[D]` ADR-0009
- **SE** o id não existe, **ENTÃO** a página **DEVE** dizer que a turma não existe mais e oferecer voltar ao histórico. `[E]` `TurmaDetalhe.jsx` (404)
- **QUANDO** estou no painel de inscritos da agenda, **ENTÃO** ele **DEVE** oferecer "Ver detalhe" para a página da turma. `[E]` `InscritosPanel.jsx`

## Requisitos Não Funcionais

### RNF-HIS-001: Fonte única das operações de inscrito

Adicionar, editar, remover e checar CPF vivem em um hook (`useInscritos`) e num componente (`InscritosConteudo`) usados pela agenda e pelo detalhe. Nenhuma cópia. `[E]` regra do `CLAUDE.md`

## Questões em Aberto

- PA-026: perguntas ao solicitante sobre presença e certificado (espelha a questão de mesmo teor no registro do backend, número 007). Travam as fases C e D; não travam esta.
