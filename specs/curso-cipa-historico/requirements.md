# Requisitos — Histórico, consulta e documentos do CIPA (fase 2)

> **Rastreabilidade** — RF: RF-HIS-001..006 · RNF: RNF-HIS-001 · ADR: ADR-0009 · Questões: PA-026, PA-028, PA-030
> **Fase 3 (presença): `RF-HIS-005` em revisão — aguardando aprovação do dono antes do design.**
> **Fase D (certificado): `RF-HIS-006` em rascunho (2026-09-08) — aguarda aprovação e depende da fase 3 e de `specs/curso-cipa-cadastros/`.**
> **Status:** aprovado · **Dono:** Ingrid Aylana · **Atualizado:** 2026-09-08

## Contexto e Problema

`[E]` A tela `/condomed/cursos-cipa` é uma agenda: mostra um mês por vez e a lista de inscritos num modal (`InscritosPanel`). Não há onde ver seis meses de turmas nem responder "em quais turmas esta pessoa esteve" fora do aviso de CPF duplicado. `[D]` O solicitante pediu, em 2026-09-04, histórico, consulta e documentos (lista de presença, presença, certificado); a resposta em página própria está no ADR-0009. Mapeamento em `../../../FedConnect-Back-End/docs/curso-cipa/MAPEAMENTO_CIPA_FASE2.md`; esta spec cobre a **fase A**. Lado backend em `FedConnect-Back-End/specs/curso-cipa-historico/`.

## Escopo

**Dentro do escopo (fase A):** página `/condomed/turmas` com duas abas (Turmas, Participantes); página `/condomed/turmas/:id` com a lista de inscritos da turma, editável; card na home da Condomed; atalho "Ver detalhe" no painel da agenda.

**Dentro do escopo (fase B):** baixar a lista de presença em PDF a partir do detalhe da turma.

**Dentro do escopo (fase C — fase 3 para o dono):** aba Presença no detalhe da turma, com marcação em lote e situação inferida.

**Dentro do escopo (fase D):** aba Certificados no detalhe da turma — emitir em lote para os presentes, baixar todos num PDF e baixar um por um.

**Fora do escopo por enquanto:** verificação pública do certificado (fase E); envio por e-mail (PA-027). Atalho na home principal do sistema (é um carrossel de banners, não uma grade — ver mapeamento, seção 2).

## User Stories e Critérios de Aceitação

### RF-HIS-001: Histórico de turmas

**Como** operador da Condomed, **quero** ver as turmas de um período com filtros, **para** não folhear o calendário mês a mês.

- **QUANDO** abro `/condomed/turmas`, **ENTÃO** a aba Turmas **DEVE** listar os últimos seis meses, da mais recente para a mais antiga, paginada de 25 em 25, com **código**, data, local, situação, `inscritos/capacidade` e instrutor. Condomínios e administradoras são dados dos inscritos, não da turma, e não aparecem nesta lista (decisão do dono, 2026-09-08). `[D]` ADR-0009
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

### RF-HIS-004: Baixar a lista de presença

**Como** operador, **quero** baixar a lista de presença da turma em PDF pelo detalhe, **para** imprimir e levar no dia.

- **QUANDO** clico em "Lista de presença (PDF)" no detalhe da turma, **ENTÃO** a interface **DEVE** baixar o PDF gerado pelo backend com o nome de arquivo que ele indicar no `Content-Disposition`. `[E]` `useTurmaDetalhe.baixarListaPresenca`, `cursoCipaService.baixarListaPresenca`
- **ENQUANTO** o PDF está sendo gerado, **ENTÃO** o botão **DEVE** ficar desabilitado com "Gerando..."; falha vira snackbar. `[E]` `TurmaDetalhe.jsx`
- **QUANDO** a turma é futura ou sem inscritos, **ENTÃO** o botão **DEVE** continuar disponível — a lista é para levar impressa. `[E]` regra do backend (ADR de documentos de lá)

### RF-HIS-005: Aba Presença

**Como** operador, **quero** marcar no detalhe da turma quem veio e quem faltou, **para** a turma virar realizada e o certificado sair só para quem participou.

- **QUANDO** abro o detalhe de uma turma cuja data já chegou, **ENTÃO** a interface **DEVE** mostrar a aba **Presença** com todos os inscritos, ordenados por condomínio e nome (a mesma ordem da lista impressa), cada um com o estado presente / ausente / não registrado. `[D]` PA-026
- **QUANDO** marco presenças e clico em Salvar, **ENTÃO** a interface **DEVE** enviar o lote inteiro ao backend de uma vez e, ao receber sucesso, recarregar a turma — a situação passa a **Realizada** sem clique adicional. `[D]` PA-026
- **QUANDO** uso "Marcar todos presentes", **ENTÃO** a interface **DEVE** preencher presente para quem está não registrado, sem mexer em quem já foi marcado ausente. `[E]` decisão local de tela
- **ENQUANTO** há marcações não salvas, a interface **DEVE** sinalizar e pedir confirmação ao sair da aba ou da página. `[E]` decisão local de tela
- **QUANDO** a presença já foi registrada, **ENTÃO** a aba **DEVE** mostrar quem registrou e quando, e permitir regravar a qualquer tempo. `[D]` PA-026 (sem prazo)
- **SE** a turma está cancelada, **ENTÃO** a aba **DEVE** aparecer desabilitada com o motivo. `[E]` regra do backend
- **SE** a data da turma ainda não chegou, **ENTÃO** a aba **DEVE** aparecer desabilitada com "disponível a partir de <data>". `[P]` PA-028
- **QUANDO** edito a turma, **ENTÃO** o formulário **NÃO DEVE** mais oferecer "Realizada" como situação escolhível — ela é consequência da presença; mostra-se como estado, não como opção. `[D]` PA-026
- **QUANDO** olho o histórico e a lista de inscritos, **ENTÃO** as contagens de presentes/ausentes **DEVEM** vir do backend, nunca calculadas na tela. `[E]` regra do `CLAUDE.md`

**Verificação prevista (detalhada no design, após aprovação):** CT-HIS-006 — aba Presença lista na ordem da lista impressa; marcar e salvar envia um lote e a situação vira Realizada sem clique extra; "Marcar todos presentes" não altera ausentes; sair com marcações pendentes pede confirmação; turma cancelada e turma futura mostram a aba desabilitada com o motivo; "Realizada" não aparece mais como opção no formulário.

### RF-HIS-006: Aba Certificados

**Como** operador da Condomed, **quero** emitir e baixar os certificados de quem esteve na turma a partir do detalhe, **para** fechar a turma no mesmo lugar em que marquei a presença: dos 30 inscritos, confirmo os 18 presentes e saio com os 18 certificados.

- **QUANDO** abro o detalhe de uma turma realizada com presença registrada, **ENTÃO** a interface **DEVE** mostrar a aba **Certificados** com um resumo vindo do backend (presentes, emitidos, aptos sem certificado, impedidos) e a lista dos presentes, cada um com o estado: **emitido** (número e data), **apto** ou **impedido** (motivo, ex.: sem CNPJ do condomínio). `[E]` `FedConnect-Back-End/specs/curso-cipa-historico/` RF-HIS-005 (contagens e estados vêm do backend)
- **QUANDO** clico em "Emitir certificados (N)", **ENTÃO** a interface **DEVE** pedir confirmação, enviar uma única chamada ao backend e, ao receber a resposta, recarregar a turma e mostrar o resultado: quantos foram emitidos e quem ficou impedido, com atalho para editar o inscrito e um novo "Emitir" só para os pendentes. `[P]` PA-030
- **SE** a turma está sem instrutor ou o instrutor está sem assinatura, **ENTÃO** a aba **DEVE** mostrar o aviso com atalho para editar a turma (ou o palestrante) e manter "Emitir" desabilitado — a regra é a do backend, a tela só antecipa. `[E]` `FedConnect-Back-End/specs/curso-cipa-historico/` RF-HIS-005
- **QUANDO** há certificados emitidos, **ENTÃO** a aba **DEVE** oferecer "Baixar todos (PDF)" e, em cada linha emitida, "Baixar", ambos com o nome de arquivo indicado pelo backend no `Content-Disposition`, como já faz a lista de presença. `[E]` `useTurmaDetalhe.baixarListaPresenca`
- **ENQUANTO** um PDF está sendo gerado, o botão correspondente **DEVE** ficar desabilitado com "Gerando..."; falha vira snackbar. `[E]` padrão de `TurmaDetalhe.jsx`
- **SE** a turma está cancelada ou ainda sem presença registrada, **ENTÃO** a aba **DEVE** aparecer desabilitada com o motivo ("registre a presença primeiro"). `[E]` regra do backend
- **QUANDO** tento excluir uma turma ou um inscrito com certificado emitido, **ENTÃO** a interface **DEVE** explicar que a turma só pode ser cancelada e o inscrito não pode ser removido, mostrando a mensagem do backend. `[E]` regra do backend (RF-HIS-005 de lá)
- **QUANDO** olho o histórico, **ENTÃO** a coluna de situação **DEVE** indicar turmas realizadas com certificados pendentes (aptos sem certificado > 0), com o número vindo do backend. `[E]` regra do `CLAUDE.md`

**Verificação prevista (detalhada no design, após aprovação):** CT-HIS-007 — aba lista presentes com estado emitido/apto/impedido; "Emitir" faz uma chamada, recarrega e mostra impedidos com atalho; sem instrutor/assinatura o botão fica desabilitado com aviso; "Baixar todos" e "Baixar" usam o nome do servidor; aba desabilitada em turma cancelada ou sem presença; excluir turma/inscrito com certificado mostra a recusa do backend.

## Requisitos Não Funcionais

### RNF-HIS-001: Fonte única das operações de inscrito

Adicionar, editar, remover e checar CPF vivem em um hook (`useInscritos`) e num componente (`InscritosConteudo`) usados pela agenda e pelo detalhe. Nenhuma cópia. `[E]` regra do `CLAUDE.md`

## Questões em Aberto

- PA-026: perguntas ao solicitante sobre presença e certificado (espelha a questão de mesmo teor no registro do backend, número 007). Travam as fases C e D; não travam esta.
- PA-030: apresentação da emissão parcial (espelha a 012 do backend) — trava um critério de RF-HIS-006.
- PA-029 (`specs/curso-cipa-cadastros/`): a aba lê instrutor e assinatura do cadastro; a fase D depende dessa spec.
