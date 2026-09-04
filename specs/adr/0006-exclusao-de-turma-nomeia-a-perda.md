# ADR-0006 — Excluir turma nomeia a perda; excluir é o único caminho oferecido

> **Status:** decidido · **Dono:** Ingrid Aylana · **Data:** 2026-09-04
> **Pode ser adiada:** sim (o `window.confirm` funcionava; o risco é de erro do operador, não de bug)
> **Contexto(s):** `FCF` · **Specs:** `specs/curso-cipa/`

## Contexto

Excluir uma turma já funcionava: `DELETE /cursos-cipa/{id}/` apaga a turma, as inscrições em cascata e a reserva espelho na agenda. O problema era o caminho na tela.

O botão "Excluir turma" existia **só dentro do formulário de edição** — para apagar uma turma era preciso abrir "Editar turma" primeiro, o que é um passo a mais numa ação que não tem desfazer. E a confirmação era um `window.confirm` com uma frase genérica: não dizia qual turma, quantas pessoas saíam, nem de quais condomínios. Uma turma cheia no auditório são 30 inscrições apagadas atrás de um "OK" do navegador — enquanto remover **um** inscrito já tinha modal estilizado nomeando a pessoa. A ação mais destrutiva da tela era a menos cuidadosa.

Cancelar a turma (situação `cancelada`) existe e faz outra coisa: preserva a turma e a lista de inscritos no histórico, e ainda assim libera a sala na agenda e o dia para uma turma nova. Chegou-se a oferecer isso como desvio dentro da confirmação de exclusão, e o dono recusou em 2026-09-04: o operador que pediu para excluir quer excluir, e a confirmação não é lugar de propor outra ação.

## Decisão

A exclusão passa pelo `ConfirmarModal` da própria tela, no mesmo padrão da remoção de inscrito, e a confirmação **nomeia a perda**: local e dia da turma, quantos inscritos saem, a lista de condomínios afetados com quantas pessoas cada um perde, e o aviso de que a reserva da sala é liberada quando o local é a sala de reunião.

A confirmação tem dois caminhos e só dois: **Cancelar** (não faz nada) e **Excluir turma**. Cancelar a turma continua disponível como **situação**, no formulário de edição, onde as outras situações já estão — não como desvio de uma ação destrutiva.

O botão "Excluir turma" passa a existir também na barra do painel de inscritos, ao lado de "Editar turma" — é de lá que se olha a turma antes de decidir.

## Opções consideradas

| Opção | Custo de reverter | Observações |
|---|---|---|
| Manter o `window.confirm` | baixo | Fora do padrão da tela e sem dizer o que se perde; a ação mais grave ficava a menos cuidadosa |
| Exigir digitar a data para confirmar | baixo | Protege, mas trava também o caso comum (turma vazia criada por engano); atrito sem proporção |
| Bloquear a exclusão de turma com inscritos | médio | Impede desfazer um cadastro errado que já tem gente; empurra o operador a apagar um por um |
| Nomear a perda + oferecer "só cancelar" na confirmação | baixo | Implementado e **recusado pelo dono em 2026-09-04**: transforma a confirmação em escolha de estratégia, quando o operador já decidiu; cancelar tem o próprio lugar, no campo de situação |
| Nomear a perda, excluir como único caminho (escolhida) | baixo | Confirmação faz uma pergunta só, e ela é fechada: exclui ou não |

## Consequências

O `ConfirmarModal` segue com a assinatura que já tinha (título, mensagem, itens, tom, texto do botão) — a prop de ação alternativa foi implementada e removida junto com a decisão, e não ficou código morto para trás.

A perda por condomínio vem de `turma.inscricoes`, que a listagem do mês já devolve — sem requisição extra para montar a confirmação.

Se a turma aberta na lista de inscritos for a excluída, os dois painéis fecham juntos.

Quem quiser preservar a lista continua tendo como: editar a turma e marcar a situação como cancelada. A diferença entre os dois caminhos passa a ser aprendida na tela de edição e na ajuda, não no meio de uma confirmação.

Fica um caminho ainda não coberto: excluir direto da etiqueta do calendário, sem abrir a turma. Não foi feito de propósito — a etiqueta é pequena e um alvo de exclusão ali erra fácil.
