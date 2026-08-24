# Design — Autenticação com Refresh Token

> **Status:** Aprovado (2026-08-24)
> **Requisitos:** [requirements.md](requirements.md) (Aprovado 2026-08-24)
> **Área(s):** `src/services/api.js`, `src/context/AuthContext.jsx`, `src/pages/Login/Login.jsx`

## Visão Geral

O backend (já implementado, spec `FedConnect-Back-End/specs/auth-refresh-token/`) expõe `POST /login/refresh/` com rotação: `{refresh}` → `{access, refresh}` (o refresh usado entra na blacklist). Access dura 30 min, refresh 7 dias. O front passa a guardar o par e a renovar sozinho.

## Contratos

| Endpoint | Request | Response 200 | Erro |
|---|---|---|---|
| `POST /login/` | `{email, password}` | `{access, refresh}` | 401 `{detail}` |
| `POST /google-login/` | `{credential}` | `{access, refresh}` | 400/401 `{detail}` |
| `POST /login/refresh/` | `{refresh}` | `{access, refresh}` (novo refresh — rotação) | 401 `{detail}` (expirado/blacklisted) |
| `POST /logout/` | `{refresh}` (opcional) | 200 sempre | — |

Armazenamento: `localStorage.accessToken` e `localStorage.refreshToken` (decidido manter localStorage; cookie HttpOnly fora do escopo).

## `src/services/api.js`

1. **Request interceptor** — inalterado (anexa `Bearer accessToken`).
2. **Renovação single-flight** — variável de módulo `refreshEmAndamento` (Promise ou `null`):
   - `renovarAccess()`: se `refreshEmAndamento` existe, retorna a mesma Promise. Senão cria: `axios.post(baseURL + "login/refresh/", {refresh})` com **axios cru** (sem interceptors, evita recursão); no sucesso grava `access` novo **e o `refresh` novo** (rotação); no `finally` zera `refreshEmAndamento`.
3. **Response interceptor** (reescrito):
   - Rotas de auth (`/login/`, `/google-login/`, `login/refresh/`) → rejeita direto (sem refresh; preserva a mensagem de credencial inválida).
   - 401 com `config._retry` já marcado → `encerrarSessao()` e rejeita (sem loop).
   - 401 sem `refreshToken` armazenado → `encerrarSessao()` e rejeita.
   - 401 normal → marca `config._retry = true`, `await renovarAccess()`, substitui o `Authorization` do config e retorna `api(config)` (retry único).
   - Falha do refresh → `encerrarSessao()` e rejeita.
4. **`encerrarSessao()`**: remove os dois tokens; calcula rota pública **no momento da chamada** (corrige o `isPublic` congelado no load); se rota privada, dispara `window.dispatchEvent(new CustomEvent("auth:sessao-expirada"))`. Não navega — navegação é papel do AuthContext (api.js não tem acesso ao router).

## `src/context/AuthContext.jsx`

- `login` / `loginGoogle`: gravar `accessToken` **e** `refreshToken`; em falha, remover ambos.
- `logout()`: `POST /logout/ {refresh}` *best-effort* (erro não bloqueia), remover ambos os tokens, zerar estado, `navigate('/login')`.
- Novo `useEffect`: listener de `auth:sessao-expirada` → zera `user`/`isAuthenticated` e `navigate('/login', {replace: true, state: {sessaoExpirada: true}})`. Remove o listener no cleanup.

## `src/pages/Login/Login.jsx`

- `useLocation()`; em `useEffect` inicial: se `location.state?.sessaoExpirada`, `setError("Sua sessão expirou. Faça login novamente.")` (mesmo componente de erro já usado na tela) e limpa o state do histórico (`navigate('/login', {replace: true})` sem state) para a mensagem não reaparecer.

## Decisões e Notas

- **Services com `Authorization` manual** (ex.: `boletofedbnk.js`): não serão alterados nesta fase. No retry, o interceptor sobrescreve o header do config com o access novo, então não há regressão. Limpeza das duplicações fica como melhoria futura.
- **Sem refresh proativo por timer** — o reativo no 401 cobre a dor (requirements, fora do escopo).
- **Evento DOM em vez de import circular**: `api.js` não pode importar o AuthContext (ciclo). O CustomEvent desacopla.
- **Retry único por requisição** via flag `_retry` no config do axios.

## Verificação

- Build Vite sem erros.
- Manual (dev): login → esperar expirar o access (ou reduzir lifetime local) → ação na tela renova sozinha; invalidar o refresh (logout em outra aba / blacklist) → próxima ação desloga com a mensagem de sessão expirada na tela de login.
