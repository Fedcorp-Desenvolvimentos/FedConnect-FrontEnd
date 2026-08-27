# Tasks — Envio Porto (tela na área Automação)

> **Status:** Em andamento (2026-08-27)
> **Design:** [design.md](design.md) (Aprovado 2026-08-27)

## Backend (FedConnect-Back-End) — proxy, sem spec própria

- [x] **T1** — `fedhub/services/envio_porto_service.py` (proxy das rotas `/api/envio-porto/*`, envelope `{http_status, body}`, 503 legível). _Verificação: `py_compile` ok._
- [x] **T2** — `fedhub/views/envio_porto_view.py` (JWT + gate por nível provisório `admin`/`ti`; `operador` = e-mail do JWT; envio exige `confirmacao: "ENVIAR"`). _Verificação: `py_compile` ok._
- [x] **T3** — Rotas `envio-porto/*` em `bigcorp/urls.py`. _Verificação: `py_compile` ok._

## Frontend

- [x] **T4** — `src/services/envioPortoService.js` _(RF-1..RF-6)_. _Verificação: build._
- [x] **T5** — `EnvioPortoStyles.js` + `EnvioPorto.jsx`: gate por nível, abas, formulário Assistência com `localStorage`, painel de job com polling, download por blob, modal `ENVIAR`, aba Vida (subgrupos, gerar, inconsistências), aba Dental, histórico _(RF-1..RF-8)_. _Verificação: build._
- [x] **T6** — Card "Envio Porto" em `AutomacaoHome.jsx` e rota `/automacao/envio-porto` em `AppRouter.jsx` _(RF-7)_. _Verificação: build._
- [ ] **T7** — Roteiro manual do design por RF contra o FedHub com a API publicada (gerar com Quantidade 5; **não enviar** sem o Alberto).

## Verificação Final

- [x] Build passa (`npm run build`) — Vite ✓ em 2026-08-27 (6.5 s)
- [ ] Roteiro manual do design executado por RF-n (tela + Network)
- [ ] Critérios EARS do requirements.md conferidos um a um
- [x] PA-023 respondida (2026-08-27) → `NIVEIS` = admin, faturamento, ti na tela e no Django
