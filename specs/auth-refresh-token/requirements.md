# Requisitos — Autenticação com Refresh Token

> **Status:** Aprovado (2026-08-24)
> **Autor:** Daniel Mello (com Claude) | **Data:** 2026-08-24 | **Área(s):** `src/services/api.js`, `src/context/AuthContext.jsx`, `src/pages/Login/`, backend `bigcorp/urls.py` + `bigcorp/settings.py`

## Contexto e Problema

Hoje o front guarda apenas o `access` token (vida de 120 min) e **descarta o `refresh`** que o `/login/` já retorna. Quando o access expira, toda requisição passa a falhar com 401; o interceptor remove o token do localStorage mas **não desloga nem redireciona** — o usuário fica numa tela quebrada dando 401 em sequência até recarregar na mão. A rota `TokenRefreshView` existe no Django porém está comentada no `urls.py`. Bug adjacente: o `isPublic` do `api.js` é calculado uma única vez no load do módulo (pathname daquele instante), não no momento do erro.

## Escopo

**Dentro do escopo:**
- Front: armazenar o par `access`/`refresh` no login (normal e Google).
- Front: interceptor de resposta com refresh automático — num 401, renovar o access via refresh e repetir a requisição original uma vez.
- Front: refresh *single-flight* — N requisições concorrentes com 401 disparam **um** refresh e aguardam o mesmo resultado.
- Front: quando o refresh falhar (refresh expirado/inválido), deslogar de verdade: limpar tokens, resetar o AuthContext, redirecionar para `/login` com aviso de sessão expirada.
- Front: `logout()` limpa os dois tokens.
- Backend: habilitar a rota de refresh (`POST /login/refresh/`, `TokenRefreshView` do simplejwt).
- Backend: ajustar tempos de vida dos tokens (ver Questões em Aberto).

**Fora do escopo:**
- Migrar de localStorage para cookie HttpOnly (mudança de arquitetura maior — CORS, `withCredentials`, CSRF; fica para uma fase 2 se desejado).
- Refresh proativo por timer/decodificação do `exp` (o refresh reativo no 401 já resolve a dor).
- Mexer nos fluxos de recuperação/reset de senha.

## User Stories e Critérios de Aceitação

### RF-1: Sessão sobrevive à expiração do access token

**Como** usuário logado, **quero** continuar usando o sistema depois que o access token expira, **para** não perder trabalho nem ver telas quebradas.

Critérios (EARS):

- **QUANDO** uma requisição autenticada receber 401 e existir `refreshToken` armazenado, **ENTÃO** o front **DEVE** chamar `POST /login/refresh/` com `{refresh}`, armazenar o novo `access` e **repetir a requisição original uma única vez** com o novo token.
- **QUANDO** várias requisições receberem 401 simultaneamente, **ENTÃO** o front **DEVE** disparar **apenas um** refresh e reutilizar a promessa em andamento para as demais (single-flight).
- **SE** a requisição repetida falhar novamente com 401, **ENTÃO** o front **NÃO DEVE** tentar novo refresh para essa requisição (sem loop).
- **SE** a própria chamada for `/login/` ou `/login/refresh/`, **ENTÃO** o interceptor **NÃO DEVE** tentar refresh (evita loop e não interfere na mensagem de credencial inválida do login).

### RF-2: Logout real quando a sessão expira

**Como** usuário com sessão vencida, **quero** ser deslogado e avisado, **para** não ficar numa tela quebrada com erros silenciosos.

Critérios (EARS):

- **QUANDO** o refresh falhar (401/400 no `/login/refresh/`) ou não existir `refreshToken`, **ENTÃO** o front **DEVE** limpar `accessToken` e `refreshToken`, zerar o estado do AuthContext (`user`, `isAuthenticated`) e redirecionar para `/login`.
- **QUANDO** o redirecionamento por sessão expirada ocorrer, **ENTÃO** a tela de login **DEVE** exibir a mensagem "Sua sessão expirou. Faça login novamente." (via estado de navegação, não alert).
- **SE** o usuário já estiver numa rota pública (`/`, `/login`, `/recuperar-senha`, `/resetar-senha/*`, `/404`) no momento do erro, **ENTÃO** o front **NÃO DEVE** redirecionar (apenas limpar os tokens) — e a checagem de rota pública **DEVE** ser feita no momento do erro, não no load do módulo.

### RF-3: Login guarda o par de tokens

**Como** usuário, **quero** que o login (normal e Google) prepare a sessão completa, **para** que a renovação funcione desde o início.

Critérios (EARS):

- **QUANDO** `POST /login/` ou `POST /google-login/` responder sucesso, **ENTÃO** o front **DEVE** armazenar `access` **e** `refresh` (chaves `accessToken` e `refreshToken` no localStorage).
- **QUANDO** `logout()` for chamado, **ENTÃO** o front **DEVE** remover os dois tokens antes de navegar para `/login`.
- **SE** o login falhar, **ENTÃO** nenhum dos dois tokens **DEVE** permanecer armazenado.

### RF-4: Contrato do backend — rota de refresh ativa

**Como** front, **quero** um endpoint de refresh estável, **para** renovar o access sem novo login.

Critérios (EARS):

- **QUANDO** `POST /login/refresh/` receber `{refresh: <token válido>}`, **ENTÃO** o backend **DEVE** responder 200 com `{access}` (payload padrão do simplejwt).
- **SE** o refresh estiver expirado/inválido, **ENTÃO** o backend **DEVE** responder 401 com `detail` legível.
- A mudança de contrato é registrada em `FedConnect-Back-End/specs/auth-refresh-token/`.

## Requisitos Não Funcionais

- **Contrato:** payloads seguem o padrão simplejwt (`access`, `refresh` no login; `{refresh}` → `{access}` no refresh). Campos case-sensitive.
- **Sem regressão nos services:** os services que montam `Authorization` manualmente continuam funcionando (o header do interceptor é a fonte; remoção das duplicações pode ser feita, mas sem alterar comportamento).
- **Feedback de erro:** sessão expirada vira mensagem legível na tela de login, nunca tela quebrada silenciosa.
- **Sem loop:** nenhuma combinação de 401s pode gerar refresh em cascata ou redirecionamento em loop.

## Questões em Aberto

- [x] **Tempo de vida dos tokens:** decidido — `access` 30 min, `refresh` 7 dias (aprovado em 2026-08-24).
- [x] **Rotação + blacklist de refresh no Django:** decidido — SIM (`ROTATE_REFRESH_TOKENS` + `BLACKLIST_AFTER_ROTATION` + app `token_blacklist`); o deploy do backend precisa rodar `migrate`. Consequência no front: a resposta do refresh passa a incluir um novo `refresh`, que **DEVE** substituir o armazenado.
- [x] **URL do refresh:** decidido — `POST /login/refresh/`.
