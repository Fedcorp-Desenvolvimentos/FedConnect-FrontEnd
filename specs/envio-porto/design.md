# Design — Envio Porto (tela na área Automação)

> **Status:** Aprovado (2026-08-27, junto com o "pode criar a tela dentro de automação")
> **Baseado em:** `requirements.md` (aprovado em 2026-08-27)
> **Contrato:** `FedHub-Backend/specs/envio-porto/requirements.md` v2 (RF-EPO-001..006, 008) via proxy Django (`fedhub/views/envio_porto_view.py`)

## Visão Geral da Solução

Uma página React em `src/components/Automacao/EnvioPorto/` com três abas (Porto Assistência, Subgrupos Vida, Dental) e um painel de job compartilhado (log com polling, resultado, download, envio com confirmação digitada) mais o histórico recente. Toda a lógica é do FedHub; a tela só monta payloads, acompanha jobs por polling e apresenta resultados. O envio à Porto é um passo separado, com modal onde o operador digita `ENVIAR` — o Django recebe `{confirmacao: "ENVIAR"}` e só então repassa `confirmar: true` ao FedHub.

## Arquitetura de Componentes

| Arquivo | Mudança |
|---|---|
| `src/services/envioPortoService.js` | **Novo.** Funções por rota do proxy: `gerarAssistencia`, `listarJobs`, `obterJob`, `baixarPlanilha` (fetch + blob, nome do `Content-Disposition`), `enviarSftp`, `listarSubgrupos`, `gerarVida`, `inconsistenciasVida`; `mensagemDeErro(error)` extrai `erro`/`message` da resposta do Django. |
| `src/components/Automacao/EnvioPorto/EnvioPorto.jsx` | **Novo.** Página (gate por nível, abas, formulários, painel de job, histórico, modal de envio). Hook interno `useJob` faz polling a cada 2 s enquanto `status === "executando"`. Preferências em `localStorage["envioPorto.assistencia"]`. |
| `src/components/Automacao/EnvioPorto/EnvioPortoStyles.js` | **Novo.** styled-components no visual da tela de Cancelamento/Reemissão (cores `#0F3D5D`, cards, alertas, badges, modal). |
| `src/components/Automacao/AutomacaoHome.jsx` | Card "Envio Porto" (`/automacao/envio-porto`, níveis `admin`, `ti`). |
| `src/routes/AppRouter.jsx` | Rota `/automacao/envio-porto`. |

## Contratos de API e Estado

| Ação | Rota (Django) | Payload | Campos usados da resposta (`resultado`) |
|---|---|---|---|
| Gerar Assistência | `POST envio-porto/assistencia/gerar/` | `{inivig: "AAAA-MM-DD", produtos: {"1": null\|N, "2": ..., "3": ...}}` | `job_id`, `status` (202); 409 → `erro` + `resultado.job_id` em andamento |
| Job | `GET envio-porto/jobs/{job_id}/` | — | `tipo`, `status` (`executando`\|`concluido`\|`falhou`), `operador`, `criado_em`, `concluido_em`, `parametros`, `log[]`, `resultado{arquivo, linhas_por_produto, total}`, `envio{status, remoto, bytes, em, operador}` |
| Histórico | `GET envio-porto/jobs/?limite=20` | — | lista com os campos acima sem `log` |
| Download | `GET envio-porto/jobs/{job_id}/download/` | — | blob + `Content-Disposition` (409/410 → `erro`) |
| Enviar à Porto | `POST envio-porto/jobs/{job_id}/enviar-sftp/` | `{confirmacao: "ENVIAR", reenviar?: true}` | `envio{remoto, bytes}`; 400 confirmação inválida; 409/422/5xx → `erro` |
| Subgrupos | `GET envio-porto/vida/subgrupos/` | — | `[{subgrupo, nome}]` |
| Gerar Vida | `POST envio-porto/vida/gerar/` | `{vigencia, subgrupos: [nomes]}` | `job_id` (202) |
| Inconsistências | `GET envio-porto/vida/inconsistencias/?vigencia=` | — | `colunas[]`, `linhas[]` |

Envelope do Django: `{sucesso: true, resultado}` ou `{sucesso: false, erro, resultado}` com o mesmo HTTP status do FedHub. Estado: local à página (`useState`); nada em contexto global. `localStorage["envioPorto.assistencia"] = {produtos: {"1": {incluir, modo, quantidade}, ...}}`.

## Fluxo Principal

1. Usuário com nível autorizado abre `/automacao/envio-porto`; a página carrega o histórico e, se houver job `executando`, retoma o polling dele.
2. Aba Porto Assistência: vigência pré-preenchida (dia 01 do mês anterior), produtos restaurados do `localStorage`. Clica **Gerar Planilha** → validação local → `POST assistencia/gerar/` → `job_id` → painel do job inicia polling (2 s).
3. Log cresce em tela; ao `concluido`, mostra totais e habilita **Baixar planilha** e **Enviar para a Porto**.
4. **Baixar** → blob → download com o nome do arquivo.
5. **Enviar para a Porto** → modal (arquivo, vigência, totais, aviso) → digitar `ENVIAR` → `POST enviar-sftp/` → sucesso mostra caminho remoto e bytes; histórico atualizado.
6. Aba Vida: carrega subgrupos; **Gerar Planilha Excel** → job (mesmo painel, sem envio); **Ver inconsistências** → tabela.

## Tratamento de Erros e Casos de Borda

| Falha | Comportamento na tela | Requisito |
|---|---|---|
| API indisponível / 503 no polling | Mantém `job_id`, alerta "Sem contato com o servidor — tentando novamente", continua o polling | RF-2 |
| 409 ao gerar (job em andamento) | Alerta com o job em andamento e passa a acompanhá-lo | RF-1, RF-5 |
| Job `falhou` | Última linha `[ERRO]` em destaque; botões de download/envio desabilitados; gerar reabilitado | RF-2 |
| Download 409/410 | Mostra `erro` da API | RF-3 |
| Confirmação diferente de `ENVIAR` | Botão do modal desabilitado; nada é enviado | RF-4 |
| Job já `enviado` | Botão "Reenviar para a Porto"; modal avisa sobrescrita; envia `reenviar: true` | RF-4 |
| Vida com `total = 0` | "Nenhum dado encontrado" e sem download | RF-5 |
| Nível não autorizado | Card oculto; rota mostra acesso negado | RF-7 |
| Sem resposta `resultado` esperada | Mensagem genérica "Resposta inesperada do servidor" (nunca tela quebrada) | RNF |

## Decisões e Trade-offs

### D-1: Polling em vez de WebSocket/SSE
- **Decisão:** `GET jobs/{id}/` a cada 2 s enquanto `executando`.
- **Alternativas:** SSE/WebSocket pelo FedHub (atravessaria ngrok + Django).
- **Justificativa:** o desktop já funcionava com fila drenada a cada 100 ms; 2 s é imperceptível e não exige infraestrutura nova.

### D-2: Confirmação digitada `ENVIAR`
- **Decisão:** modal com texto exato; o Django valida antes de repassar `confirmar: true`.
- **Alternativas:** checkbox "enviar após gerar" (como o desktop).
- **Justificativa:** tudo que cai em `/Porto/Remessa` pode ser processado pela seguradora; a fricção é intencional.

### D-3: Preferências em `localStorage`
- **Decisão:** produtos/limites persistem por navegador.
- **Justificativa:** substitui o `porto_assistencia.json` do desktop sem estado no servidor.

## Estratégia de Verificação

Sem runner de testes no front: roteiro manual por RF (Network + tela) após o FedHub expor a API.
- RF-1/2: gerar com Quantidade 5 por produto; ver `POST` 202 e `GET` do job a cada 2 s; log cresce; totais 5/5/5.
- RF-3: baixar; conferir nome `relacao-envio-porto-MMYYYY.xlsx` e abas.
- RF-4: abrir modal, botão desabilitado até digitar `ENVIAR`; **não enviar em teste sem o Alberto confirmar**.
- RF-5: listar subgrupos; gerar com um subgrupo; inconsistências.
- RF-6: recarregar durante job → polling retomado do histórico.
- RF-7: logar com nível não autorizado → card oculto e rota negada.

## Impacto e Riscos

- Depende do deploy do FedHub (`/api/envio-porto/*`) **e** do back-end Django (proxy já escrito). Sem o FedHub, a tela mostra "FedHub indisponível" — nada quebra.
- Não toca serviços/hooks compartilhados; só adiciona card, rota e arquivos novos.
