# Requisitos — Tela de agendamento de cursos CIPA (Condomed)

> **Rastreabilidade** — RF: RF-CIP-001..004 · RNF: RNF-CIP-001..002 · ADR: ADR-0002..0004 · Questões: PA-001..003
> **Status:** aprovado · **Dono:** Ingrid Aylana · **Atualizado:** 2026-09-04

## Contexto e Problema

Lado frontend da spec `FedConnect-Back-End/specs/curso-cipa/` (domínio, modelo e regras de conflito estão lá). `[E]` Não há tela de cursos; a agenda atual (`src/pages/Agenda/Agenda.jsx`) assume sala única (`src/utils/agendaSlots.js:1-2`) e grade por hora; o CIPA precisa de calendário por dia em dois locais. `[E]` A restrição por nível hoje é só visual: `src/routes/PrivateRouter.jsx` checa apenas autenticação; o filtro por nível fica no menu (`src/components/Sidebar/Sidebar.jsx:78-91,135`).

## Escopo

**Dentro do escopo:** home da área Condomed com um cartão por ferramenta; página `CursoCipa` com faixa de medidas, filtros (mês, local, situação, busca), calendário mensal dos dois locais e painel lateral (hoje, próximas, alertas, ocupação por local); modal de turma (data, local, administradora, condomínio, situação, observação); painel de inscritos; service; rota, item de menu e guarda de rota por nível.

**Fora do escopo:** alterações na agenda atual; cadastro de funcionários; `src/pages/RH` (mock, PA-002).

## User Stories e Critérios de Aceitação

### RF-CIP-001: Painel mensal dos dois locais

**Como** operador da Condomed, **quero** ver as turmas dos dois locais em um painel mensal com os números do mês, **para** escolher dias livres e enxergar o que exige ação.

- **QUANDO** abro a tela, **ENTÃO** a interface **DEVE** exibir as medidas do mês (turmas, inscritos, ocupação, turmas nos próximos 7 dias), a barra de filtros, o calendário do mês corrente com as turmas dos dois locais e o painel lateral com hoje, próximas turmas, alertas e ocupação por local. `[D]` ADR-0002
- **QUANDO** clico em um dia do calendário, **ENTÃO** a interface **DEVE** abrir o formulário de nova turma com aquela data; o local é escolhido no próprio formulário. `[D]` ADR-0002
- **QUANDO** filtro por local, situação ou texto, **ENTÃO** calendário, painel lateral e medidas **DEVEM** refletir o mesmo recorte. `[P]` PA-001 (renderização do espelho na agenda atual — registrada, não bloqueia)
- **SE** o backend responde 409, **ENTÃO** a interface **DEVE** exibir a mensagem de conflito recebida (turma ou reunião existente). `[E]` padrão `extrairMensagemApi` em `src/pages/Agenda/Agenda.jsx:48-56`

### RF-CIP-002: Cliente e inscritos

**Como** operador, **quero** informar o condomínio cliente e cadastrar os funcionários inscritos, **para** que a turma tenha a lista de participantes.

- **QUANDO** digito no campo de administradora, **ENTÃO** a interface **DEVE** filtrar a lista de administradoras enquanto digito e só aceitar uma opção da lista; o condomínio é o nome digitado. `[P]` PA-003 (não há fonte de condomínios por administradora)
- **QUANDO** salvo uma turma nova, **ENTÃO** a interface **DEVE** abrir a lista de inscritos dessa turma com o cursor no campo Nome. `[D]` ADR-0002
- **QUANDO** adiciono um inscrito, **ENTÃO** o formulário **DEVE** exigir nome, CPF (com máscara e validação de dígitos) e função; e-mail e telefone opcionais. `[E]` não existe máscara de CPF em `src/utils/formatters.js` — será criada
- **QUANDO** clico em editar um inscrito, **ENTÃO** o formulário **DEVE** carregar os dados dele e passar a salvar alterações, com a linha correspondente destacada na tabela; editar continua permitido com a turma lotada. `[D]` ADR-0002
- **QUANDO** peço para remover um inscrito, **ENTÃO** a interface **DEVE** pedir confirmação nomeando a pessoa antes de excluir. `[D]` ADR-0002
- **SE** o CPF informado já consta **nesta** turma, **ENTÃO** a interface **DEVE** avisar assim que o CPF for completado, nomeando quem já está inscrito, destacar a linha correspondente na tabela e desabilitar o envio. `[D]` ADR-0003
- **SE** o CPF informado já consta em **outra** turma, **ENTÃO** a interface **DEVE** avisar antes de gravar, listando condomínio, local e data de cada turma, e só inscrever após confirmação — a duplicidade entre turmas é permitida. `[D]` ADR-0003 (par no backend: `FedConnect-Back-End/specs/adr/0003-duplicidade-de-inscrito-entre-turmas.md`)
- **ENQUANTO** a turma está na capacidade, a interface **DEVE** mostrar `inscritos/capacidade` e desabilitar novas inscrições. `[E]` capacidade e contagem vêm do backend na resposta da turma

### RF-CIP-003: Acesso e navegação

- **QUANDO** o usuário tem nível `condomed` ou `admin`, **ENTÃO** o item "Condomed" **DEVE** aparecer no menu, levando à home da área, e as rotas `/condomed` e `/condomed/cursos-cipa` **DEVEM** abrir. `[E]` `Sidebar.jsx:78-91` (`allowed`), `src/utils/accessLevels.js` (sem `condomed` hoje)
- **SE** o usuário tem outro nível, **ENTÃO** as rotas **DEVEM** redirecionar para a home mesmo digitadas na URL. `[E]` gap atual em `src/routes/PrivateRouter.jsx` (só autenticação)

### RF-CIP-004: Home da área e concessão do nível

**Como** administrador, **quero** uma porta de entrada da Condomed e poder conceder o nível pela interface, **para** que o setor use as ferramentas sem depender do Django admin.

- **QUANDO** abro `/condomed`, **ENTÃO** a interface **DEVE** listar as ferramentas da área em cartões, no mesmo padrão de Financeiro e Faturamento, mostrando apenas as permitidas para o meu nível. `[D]` ADR-0004
- **SE** nenhuma ferramenta é permitida para o meu nível, **ENTÃO** a interface **DEVE** exibir a mensagem de área vazia em vez de uma grade em branco. `[E]` `CardGridLayout` (`empty`/`emptyMessage`)
- **QUANDO** cadastro ou edito um usuário, **ENTÃO** o seletor de nível de acesso **DEVE** oferecer `condomed` — e todos os demais níveis aceitos pelo backend. `[E]` os dois formulários tinham listas fixas e divergentes; nenhuma citava `condomed` (nem `recepcionista` ou `vistoria`), enquanto `users.Usuario.NIVEL_ACESSO_CHOICES` aceita dez níveis

## Requisitos Não Funcionais

### RNF-CIP-001: Contrato

Payloads e campos seguem a spec do backend (`FedConnect-Back-End/specs/curso-cipa/design.md`, "Modelo de Dados e Contratos"); nomes de campo com o case exato. `[E]` lição documentada em `CONVENCOES.md` §7

### RNF-CIP-002: Consistência

Contagem de inscritos e capacidade exibidas vêm da resposta do backend, não do estado local. `[E]` regra do repo (`CLAUDE.md`, "Contexto crítico")

## Questões em Aberto

- PA-001: renderização da Reserva espelho (510 min) na grade da agenda atual
- PA-002: `src/pages/RH` mock com rotas inexistentes (fora do escopo; registrado)
- PA-003: não existe fonte de condomínios por administradora — condomínio digitado
