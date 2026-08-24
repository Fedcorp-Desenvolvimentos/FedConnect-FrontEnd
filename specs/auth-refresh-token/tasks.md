# Tasks — Autenticação com Refresh Token

> **Status:** Concluído (2026-08-24)
> **Design:** [design.md](design.md) (Aprovado 2026-08-24)

## Backend (FedConnect-Back-End)

- [x] **T1** — Habilitar `POST /login/refresh/` (`TokenRefreshView`) no `bigcorp/urls.py`. _Verificação: `manage.py check` sem erros; rota presente._
- [x] **T2** — `SIMPLE_JWT`: access 30 min, `ROTATE_REFRESH_TOKENS=True`, `BLACKLIST_AFTER_ROTATION=True`. _Verificação: app `token_blacklist` já estava em `INSTALLED_APPS` e `showmigrations` mostra todas aplicadas — deploy não precisa de migração._
- [x] **T3** — `LogoutView` blacklista `{refresh}` opcional, sempre responde 200. _Verificação: `manage.py check` ok._

## Frontend

- [x] **T4** — `api.js`: renovação single-flight (`renovarAccess` com axios cru), retry único via `_retry`, rotas de auth isentas, `encerrarSessao()` com rota pública calculada no momento do erro + CustomEvent `auth:sessao-expirada`. _Verificação: build ok._
- [x] **T5** — `AuthContext`: `login`/`loginGoogle` gravam `refreshToken` (e limpam nos erros); `logout()` envia `{refresh}` ao `/logout/` best-effort e limpa os dois tokens; `checkAuthStatus` limpa os dois e navega com aviso. _Verificação: build ok._
- [x] **T6** — `AuthContext`: listener de `auth:sessao-expirada` → zera estado e `navigate('/login', {state:{sessaoExpirada:true}})`. _Verificação: build ok._
- [x] **T7** — `Login.jsx`: exibe "Sua sessão expirou. Faça login novamente." quando `location.state.sessaoExpirada`, limpando o state do histórico. _Verificação: build ok._
- [x] **T8** — Build Vite sem erros. _`vite build` ✓ (6.9s)._
