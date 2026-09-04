# ADR-0002 — Painel único dos dois locais no lugar das abas

> **Status:** decidido · **Dono:** Ingrid Aylana · **Data:** 2026-08-31
> **Pode ser adiada:** sim (a tela já funcionava com abas; a troca é de composição, não de contrato)
> **Contexto(s):** `FCF` · **Specs:** `specs/curso-cipa/`

## Contexto

A primeira versão da tela de Cursos CIPA usava uma aba por local: o operador via o auditório **ou** a sala de reunião, nunca os dois. Como só existe uma turma por local por dia, a pergunta operacional real ("que dias ainda estão livres, e onde?") exigia trocar de aba e comparar de cabeça. A tela também não respondia nada sem abrir uma turma: quantas turmas o mês tem, quantos inscritos, o que está lotado ou vazio.

## Decisão

A tela é um painel: faixa de medidas do mês no topo, barra de filtros (mês, local, situação, busca), calendário mensal único e painel lateral com hoje, próximas turmas, o que pede atenção e a ocupação de cada local. As abas por local deixam de existir.

O local **não** é uma estrutura fixa dentro do dia. A célula do dia é uma célula de calendário normal: dias livres ficam limpos e clicáveis, e cada turma existente aparece como uma etiqueta com ponto colorido do local, horário, condomínio e `inscritos/capacidade`. O local é escolhido no formulário e filtrado na barra do topo. Composição fixada pelo dono em 2026-08-31, a partir de um mockup entregue por ele.

## Opções consideradas

| Opção | Custo de reverter | Observações |
|---|---|---|
| Manter abas e só acrescentar indicadores | baixo | Não resolve a comparação entre locais, que era o incômodo original |
| Duas faixas fixas por dia, uma por local | baixo | Testada e recusada pelo dono: comprime a célula e o dia livre vira ruído |
| Calendário normal, turma como etiqueta no dia (escolhida) | baixo | Uma requisição por mês sem filtro `local`; a célula respira e cresce só quando há turma |
| Dois calendários lado a lado | médio | Dobra a largura; inviável abaixo de 1100px sem virar abas de novo |

## Consequências

A listagem do mês passa a ser pedida sem o parâmetro `local` (o backend já devolve todos quando ele é omitido) e as turmas são agrupadas por dia, ordenadas por local dentro do dia. Local, situação e busca filtram na tela, sobre o mês já carregado — não geram requisição. As medidas, as próximas turmas e os alertas são derivados da mesma resposta — nenhuma contagem local, conforme RNF-CIP-002. O painel de inscritos é o lugar de manter a lista, não só de montá-la: o mesmo formulário adiciona e edita (a linha em edição fica destacada), e remover pede confirmação nomeando a pessoa, já que a exclusão não tem desfazer. Agendar a turma e cadastrar os inscritos são um fluxo só, não duas tarefas: salvar uma turma nova abre a lista de inscritos dela com o cursor no campo Nome, e uma edição aberta a partir da lista volta para ela ao salvar (decisão do dono, 2026-08-31, depois de usar a tela). Abaixo de 1180px o painel desce para baixo do calendário. Um terceiro local cabe sem mudar nada: é mais uma cor na legenda e mais uma etiqueta possível no dia.
