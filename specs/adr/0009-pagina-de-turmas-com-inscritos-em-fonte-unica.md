# ADR-0009 — Página própria para histórico e detalhe, com os inscritos em fonte única

> **Status:** decidido · **Dono:** Ingrid Aylana · **Data:** 2026-09-04
> **Pode ser adiada:** não (as fases de presença e certificado precisam de um lugar para existir)
> **Contexto(s):** `FCF` · **Specs:** `specs/curso-cipa-historico/`
> **Par no backend:** `FedConnect-Back-End/specs/curso-cipa-historico/`

## Contexto

O solicitante pediu histórico de turmas, consulta de participantes e documentos (lista de presença, presença, certificado). A tela que existe, `/condomed/cursos-cipa`, é uma **agenda**: calendário de um mês, criar turma, inscrever. É boa para o antes do curso e ruim para o depois — não tem onde listar seis meses de turmas nem onde marcar presença, e a lista de inscritos vive num modal.

A tentação era acrescentar abas ao modal. Isso deixaria um modal com quatro responsabilidades (inscritos, presença, documentos, edição) e nenhuma URL para "esta turma" — o operador não conseguiria mandar um link nem voltar de um PDF para o lugar de onde saiu.

Havia um segundo problema, técnico: a lista de inscritos e as suas cinco operações (carregar, adicionar, editar, remover, checar CPF) estavam dentro do `useCursoCipa`, o hook do calendário. Uma segunda tela que mostrasse inscritos teria de copiar tudo — e o `CLAUDE.md` do repo proíbe cópia local de função compartilhada, por causa de dessincronização que já quebrou seleção e somatório noutro módulo.

## Decisão

**Uma segunda página com detalhe por turma.** `/condomed/turmas` (histórico em uma aba, consulta de participantes em outra) e `/condomed/turmas/:id` (a turma, com espaço para as abas Presença e Documentos das fases seguintes). Card na home da Condomed, no padrão da área. A agenda continua igual e ganha "Ver detalhe" no painel de inscritos.

**Inscritos em fonte única.** O corpo do `InscritosPanel` virou `InscritosConteudo`, sem moldura; o `InscritosPanel` ficou só o modal que o envolve na agenda; o detalhe renderiza o `InscritosConteudo` direto na página. As operações saíram do `useCursoCipa` para `useInscritos({ turma, aoMudar })`, que os dois lugares usam — a agenda passa `aoMudar = recarregar o mês`, o detalhe passa `aoMudar = recarregar a turma`. A confirmação de exclusão da turma virou `ExcluirTurmaModal` pelo mesmo motivo.

**Filtros aplicados ao confirmar**, não por tecla: a lista é paginada no servidor, e uma requisição por caractere seria carga sem ganho.

**Sem atalho na home principal do sistema.** Ela é um carrossel de banners, não uma grade de atalhos; um "atalho" ali seria um banner, e o menu lateral já leva à Condomed em um clique. Registrado como opção recusada; se o solicitante insistir, é um banner apontando para `/condomed/turmas`.

## Opções consideradas

| Opção | Custo de reverter | Observações |
|---|---|---|
| Abas no modal de inscritos da agenda | baixo | Modal com quatro responsabilidades e sem URL por turma; presença e documentos ficariam presos ao calendário do mês |
| Página de detalhe copiando o painel de inscritos | baixo | Duas implementações da mesma lista; a regra de fonte única do repo existe porque isso já quebrou antes |
| Página de detalhe com o painel em fonte única (escolhida) | médio | Exige dividir componente e hook que já estavam em produção na branch; o build e a agenda continuam iguais |
| Atalho na home principal como banner | baixo | A home é carrossel; um banner para uma ferramenta de setor destoa e o menu já resolve |

## Consequências

`useCursoCipa` encolheu: perdeu o estado de inscritos e as cinco operações, e mantém a mesma API para a agenda (`inscritos`, `adicionarInscrito`, …) delegando ao `useInscritos`. `extrairMensagemApi` mudou de dono para o `useInscritos`, com re-export no `useCursoCipa` para quem já importava — o que evitou um import circular entre os dois hooks.

Refatorar o painel que já estava na branch traz risco de regressão na agenda. O conteúdo foi movido sem alteração de lógica e o build passa; sem runner de testes, CT-HIS-004 é a verificação manual dessa regressão.

As fases seguintes ganham o lugar que precisavam: Presença e Documentos entram como abas em `/condomed/turmas/:id`, e a lista de presença em PDF é um botão ali — sem tocar na agenda.
