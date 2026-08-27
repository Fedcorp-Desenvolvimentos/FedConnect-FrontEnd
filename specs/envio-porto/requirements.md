# Requisitos — Envio Porto (tela de geração e envio da relação à Porto Seguro)

> **Status:** Aprovado (2026-08-27 — "pode criar a tela dentro de automação")
> **Autor:** Daniel Mello (com Claude) | **Data:** 2026-08-27 | **Área(s):** `src/components/Automacao/EnvioPorto/`, `src/services/envioPortoService.js`, `src/routes/AppRouter.jsx`, `src/components/Automacao/AutomacaoHome.jsx`; backend `fedhub/views/envio_porto_view.py`, `fedhub/services/envio_porto_service.py`, `bigcorp/urls.py`
> **Spec do backend (contrato):** `FedHub-Backend/specs/envio-porto/requirements.md` (v2, 2026-08-27) — RF-EPO-001..006 e 008

## Contexto e Problema

O "Sistema de Envio Porto Seguro" é um desktop Python que só roda em estação da rede local: gera a relação mensal de segurados dos produtos Residencial/Auto/Empresarial (`relacao-envio-porto-MMYYYY.xlsx`), envia por SFTP à Porto Seguro e gera o relatório de Subgrupos Vida. A lógica está migrando para a API do FedHub (`/api/envio-porto/*`); esta spec é a **tela** no FedConnect que substitui o desktop, falando com o back-end Django, que faz proxy para o FedHub — mesmo padrão da tela de Cancelamento/Reemissão (`fedpayService.js` → `fedpay/...` → FedHub). O desktop continua em uso até a validação em paralelo.

## Escopo

**Dentro do escopo:**
- Card "Envio Porto" na home de **Automação** e rota `/automacao/envio-porto` (decisão do dono, 2026-08-27), visíveis só para os níveis autorizados (PA-023 do FedHub, fechada em 2026-08-27: `admin`, `faturamento` (faturista), `ti`).
- Aba **Porto Assistência**: data de início de vigência (pré-sugerida: dia 01 do mês anterior, editável), produtos 1/2/3 com "Base toda × Quantidade N", botão **Gerar Planilha**, log em tela por polling, **Baixar planilha**, e **Enviar para a Porto** como ação separada com modal de confirmação.
- Aba **Subgrupos Vida**: data de vigência, lista de subgrupos com checkboxes, **Gerar Planilha Excel** (job + download) e **Ver inconsistências** (tabela em tela).
- Aba **Dental**: dois botões desabilitados "em desenvolvimento" (GERA PORTO DENTAL, GERAR DENTAL SEMPRE ODONTO).
- Histórico dos jobs recentes (quem gerou, quando, status, enviado ou não) para retomar após recarregar a página.
- Preferências da tela (produtos/limites, última vigência) em `localStorage` — substitui o `porto_assistencia.json` do desktop.
- Back-end Django: proxy autenticado (JWT + nível) para as rotas do FedHub, `operador` = e-mail do usuário logado (nunca do payload).

**Fora do escopo:**
- Qualquer lógica de geração/SFTP no front ou no Django (é toda do FedHub).
- Agendamento ou envio automático.
- Aposentadoria do desktop.

## User Stories e Critérios de Aceitação

### RF-1: Gerar a relação Porto Assistência

**Como** operador do Envio Porto, **quero** informar a vigência e os produtos e disparar a geração, **para** obter a planilha sem depender da estação da rede local.

- **QUANDO** a aba abre, **ENTÃO** a interface **DEVE** pré-preencher a vigência com o dia 01 do mês anterior (editável) e restaurar do `localStorage` a última seleção de produtos/limites (padrão: os 3 incluídos, base toda).
- **QUANDO** o operador clica **Gerar Planilha** com ao menos um produto e limites válidos, **ENTÃO** a interface **DEVE** chamar `POST envio-porto/assistencia/gerar/` com `{inivig: "AAAA-MM-DD", produtos: {"1": null|N, ...}}`, guardar o `job_id` devolvido e iniciar o polling do job.
- **SE** nenhum produto estiver marcado, um limite for `≤ 0`/não numérico ou a data for inválida, **ENTÃO** a interface **DEVE** bloquear o envio e apontar o campo (sem chamar a API).
- **SE** a API responder 409 (já há geração em andamento), **ENTÃO** a interface **DEVE** mostrar "Já existe uma geração em andamento (job X)" e passar a acompanhar esse job.
- **ENQUANTO** um job Assistência estiver `executando`, o botão **Gerar Planilha** **DEVE** ficar desabilitado.

### RF-2: Acompanhar a geração (log e resultado)

- **QUANDO** houver job em andamento, **ENTÃO** a interface **DEVE** consultar `GET envio-porto/jobs/{job_id}/` a cada 2 s e exibir o `log` acumulado em área monoespaçada com rolagem automática (mesmo conteúdo do desktop: query em execução, "... N linhas", total por produto, TOTAL GERAL).
- **QUANDO** o job concluir, **ENTÃO** a interface **DEVE** parar o polling, mostrar o total por produto e o total geral e habilitar **Baixar planilha** e **Enviar para a Porto**.
- **SE** o job vier `falhou`, **ENTÃO** a interface **DEVE** mostrar a última linha `[ERRO]` do log em destaque e reabilitar **Gerar Planilha**; download e envio ficam desabilitados.
- **SE** o polling falhar (rede/503), **ENTÃO** a interface **DEVE** manter o estado, mostrar "Sem contato com o servidor — tentando novamente" e continuar tentando (não perde o `job_id`).

### RF-3: Baixar a planilha

- **QUANDO** o operador clica **Baixar planilha** de um job `concluido`, **ENTÃO** a interface **DEVE** baixar `GET envio-porto/jobs/{job_id}/download/` como blob e salvar com o nome vindo de `Content-Disposition` (`relacao-envio-porto-MMYYYY.xlsx` ou `Subgrupo_..._Relatorio_....xlsx`), como já faz a exportação de faturas (`consultaFatura.js`).
- **SE** a resposta for 409/410, **ENTÃO** a interface **DEVE** mostrar a `message` da API (job não concluído / arquivo expirado).

### RF-4: Enviar para a Porto (SFTP) com confirmação

**Como** operador, **quero** enviar a planilha em um passo separado e confirmado, **para** que nada caia em `/Porto/Remessa` por engano — a Porto processa tudo que chega lá.

- **QUANDO** o operador clica **Enviar para a Porto**, **ENTÃO** a interface **DEVE** abrir um modal com nome do arquivo, vigência, totais por produto e um campo onde o operador digita `ENVIAR`; o botão de confirmação só habilita com o texto exato.
- **QUANDO** confirmado, **ENTÃO** a interface **DEVE** chamar `POST envio-porto/jobs/{job_id}/enviar-sftp/` com `{confirmar: true}` (e `reenviar: true` quando o job já constar como `enviado`), mostrar progresso e, ao concluir, exibir o caminho remoto e os bytes confirmados.
- **SE** o job já estiver `enviado`, **ENTÃO** o botão **DEVE** exibir "Reenviar para a Porto" e o modal **DEVE** avisar que o arquivo remoto será sobrescrito.
- **SE** a API responder erro (409/422/5xx), **ENTÃO** a interface **DEVE** mostrar a `message` e manter o job disponível para nova tentativa.
- **ENQUANTO** o envio estiver em andamento, os botões de gerar/baixar/enviar **DEVEM** ficar desabilitados.
- O envio **nunca** é disparado automaticamente ao fim da geração (não existe checkbox "enviar após gerar" — diferença deliberada em relação ao desktop).

### RF-5: Subgrupos Vida

- **QUANDO** a aba abre, **ENTÃO** a interface **DEVE** carregar `GET envio-porto/vida/subgrupos/` e listar os nomes com checkboxes, com vigência pré-sugerida (dia 01 do mês anterior, editável).
- **QUANDO** o operador clica **Gerar Planilha Excel** com ao menos um subgrupo, **ENTÃO** a interface **DEVE** chamar `POST envio-porto/vida/gerar/` com `{vigencia, subgrupos: [nomes]}` e acompanhar o job como em RF-2/RF-3 (sem botão de envio SFTP — Vida é uso interno).
- **QUANDO** o operador clica **Ver inconsistências**, **ENTÃO** a interface **DEVE** chamar `GET envio-porto/vida/inconsistencias/?vigencia=` e mostrar a tabela (colunas da API) ou "Nenhuma inconsistência encontrada para esta data".
- **SE** o job concluir com `total = 0`, **ENTÃO** a interface **DEVE** mostrar "Nenhum dado encontrado para os filtros selecionados" e não oferecer download.
- **SE** a API responder 409 (job Vida em andamento), **ENTÃO** a interface **DEVE** acompanhar o job em andamento.

### RF-6: Histórico de jobs

- **QUANDO** a tela abre (e após cada job concluir), **ENTÃO** a interface **DEVE** carregar `GET envio-porto/jobs/?limite=20` e listar tipo, vigência, operador, criado em, status e situação do envio (com caminho remoto e quem enviou), com ações **Baixar** e **Enviar** conforme o estado.
- **QUANDO** existir job `executando` no histórico ao abrir a tela, **ENTÃO** a interface **DEVE** retomar o polling dele (a tela sobrevive a recarregar/fechar o navegador).

### RF-7: Acesso por nível

- **QUANDO** o usuário não tiver nível autorizado (PA-023 do FedHub, fechada em 2026-08-27: `admin`, `faturamento` (faturista), `ti`), **ENTÃO** o card não aparece na home de Automação e a rota exibe "Seu nível de acesso não permite usar o Envio Porto".
- Os mesmos níveis valem para gerar, baixar e enviar (PA-023); o Django reforça o gate (defesa em profundidade — a tela é conveniência).

### RF-8: Dental (placeholders)

- **QUANDO** a aba Dental abre, **ENTÃO** a interface **DEVE** mostrar os dois módulos como botões desabilitados com o texto "em desenvolvimento", sem chamar a API.

## Requisitos Não Funcionais

- **Contrato:** payloads e respostas seguem `FedHub-Backend/specs/envio-porto/requirements.md` v2 (RF-EPO-001..006, 008); o Django repassa `message` da API e traduz indisponibilidade para 503 legível; `operador` é sempre o e-mail do JWT — nunca vem do front.
- **Feedback de erro:** toda falha vira mensagem legível na tela (nunca console silencioso); 401 segue o refresh automático já existente (`api.js`).
- **Consistência:** totais exibidos vêm do `resultado` do job (backend), não da seleção local; o estado "enviado" vem do job, não de memória da tela.
- **Segurança:** nenhuma credencial do FedHub/SFTP no front; a confirmação digitada `ENVIAR` é obrigatória para qualquer envio.
- **Desempenho:** polling a cada 2 s só enquanto há job `executando`; download por blob (arquivos de até alguns MB).

## Questões em Aberto

- [x] Onde fica o card: home de **Automação** (`/automacao/envio-porto`) — decidido em 2026-08-27.
- [x] PA-023 (FedHub): fechada em 2026-08-27 — `admin`, `faturamento`, `ti`, sem distinção para enviar.
