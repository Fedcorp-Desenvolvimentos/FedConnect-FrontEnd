# ADR-0006 — Excluir turma nomeia a perda e oferece cancelar como saída

> **Status:** decidido · **Dono:** Ingrid Aylana · **Data:** 2026-09-04
> **Pode ser adiada:** sim (o `window.confirm` funcionava; o risco é de erro do operador, não de bug)
> **Contexto(s):** `FCF` · **Specs:** `specs/curso-cipa/`

## Contexto

Excluir uma turma já funcionava: `DELETE /cursos-cipa/{id}/` apaga a turma, as inscrições em cascata e a reserva espelho na agenda. O problema era o caminho na tela.

O botão "Excluir turma" existia **só dentro do formulário de edição** — para apagar uma turma era preciso abrir "Editar turma" primeiro, o que é um passo a mais numa ação que não tem desfazer. E a confirmação era um `window.confirm` com uma frase genérica: não dizia qual turma, quantas pessoas saíam, nem de quais condomínios. Uma turma cheia no auditório são 30 inscrições apagadas atrás de um "OK" do navegador — enquanto remover **um** inscrito já tinha modal estilizado nomeando a pessoa. A ação mais destrutiva da tela era a menos cuidadosa.

Há também uma confusão de intenção frequente: quase sempre que uma turma "não vai mais acontecer", o que se quer é **cancelar** — o registro fica no histórico e a sala é liberada na agenda do mesmo jeito. Apagar é para quando a turma foi criada por engano. A tela não distinguia as duas coisas, e a mais destrutiva era a única oferecida.

## Decisão

A exclusão passa pelo `ConfirmarModal` da própria tela, no mesmo padrão da remoção de inscrito, e a confirmação **nomeia a perda**: local e dia da turma, quantos inscritos saem, a lista de condomínios afetados com quantas pessoas cada um perde, e o aviso de que a reserva da sala é liberada quando o local é a sala de reunião.

Quando a turma tem inscritos, a confirmação oferece **"Só cancelar a turma"** como ação alternativa — marca `cancelada`, preserva a lista e ainda libera a sala. O `ConfirmarModal` ganha a prop `acaoAlternativa`, discreta e à esquerda, para não competir com o botão vermelho. Turma vazia não recebe a alternativa: não há nada a preservar.

O botão "Excluir turma" passa a existir também na barra do painel de inscritos, ao lado de "Editar turma" — é de lá que se olha a turma antes de decidir.

## Opções consideradas

| Opção | Custo de reverter | Observações |
|---|---|---|
| Manter o `window.confirm` | baixo | Fora do padrão da tela e sem dizer o que se perde; a ação mais grave ficava a menos cuidadosa |
| Exigir digitar a data para confirmar | baixo | Protege, mas trava também o caso comum (turma vazia criada por engano); atrito sem proporção |
| Bloquear a exclusão de turma com inscritos | médio | Impede desfazer um cadastro errado que já tem gente; empurra o operador a apagar um por um |
| Nomear a perda + oferecer cancelar (escolhida) | baixo | Trata as duas intenções distintas e mantém o padrão da tela |

## Consequências

`ConfirmarModal` fica reutilizável para qualquer decisão com saída intermediária, e `BotaoAlternativo` entra no `CursoCipaStyles`.

A perda por condomínio vem de `turma.inscricoes`, que a listagem do mês já devolve — sem requisição extra para montar a confirmação.

Se a turma aberta na lista de inscritos for a excluída, os dois painéis fecham juntos. Cancelar pela alternativa fecha o formulário de turma e mantém a lista visível, porque a turma continua existindo.

Fica um caminho ainda não coberto: excluir direto da etiqueta do calendário, sem abrir a turma. Não foi feito de propósito — a etiqueta é pequena e um alvo de exclusão ali erra fácil.
