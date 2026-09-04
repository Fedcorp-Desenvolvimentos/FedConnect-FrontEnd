# ADR-0008 — Capacidade sinaliza, não bloqueia

> **Status:** decidido · **Dono:** Ingrid Aylana · **Data:** 2026-09-04
> **Pode ser adiada:** não (a tela impede hoje um cadastro que a operação precisa fazer)
> **Contexto(s):** `FCF` · **Specs:** `specs/curso-cipa/`
> **Par no backend:** `FedConnect-Back-End/specs/adr/0006-capacidade-do-local-e-referencia-nao-limite.md`
> **Revoga:** INV-CIP-001 na forma original ("a interface nunca envia inscrição quando `total_inscritos >= capacidade`")

## Contexto

A tela tratava a capacidade como parede, em três lugares: no painel de inscritos os campos do formulário ficavam desabilitados quando a turma enchia, o hook barrava o envio antes de chamar a API, e a prévia da importação bloqueava o botão quando a planilha tinha mais gente que as vagas.

A operação informou em 2026-09-04 que chegam funcionários extras de última hora e o curso os recebe. Com a parede de pé, o operador não conseguia registrar quem apareceu — e a pessoa fazia o curso fora da lista. A tela estava protegendo um número contra a realidade.

## Decisão

Nenhum dos três pontos bloqueia. Todos passam a **sinalizar**:

- **Painel de inscritos:** o contador mostra `inscritos/capacidade` e, acima da capacidade, o rótulo vira "N acima da capacidade". Um aviso em bloco explica o que providenciar ("cadeira e material para todos"), e o formulário continua funcionando.
- **Ao gravar:** o snackbar de sucesso diz quantos passaram do previsto, em tom de aviso em vez de sucesso.
- **Prévia da importação:** planilha maior que a capacidade importa, com o aviso do excesso no lugar do bloqueio.
- **Alertas do mês:** "Turmas lotadas" passa a "Turmas acima da capacidade", somando quantas pessoas estão além das vagas — o que o técnico precisa saber antes do dia.

O sinal vem de `acima_da_capacidade`, que o backend devolve por turma. A tela não recalcula a regra.

## Opções consideradas

| Opção | Custo de reverter | Observações |
|---|---|---|
| Manter o bloqueio | baixo | É o estado atual e produz lista incompleta: quem chega depois não é registrado |
| Bloquear e oferecer um "inscrever mesmo assim" | baixo | Um clique a mais em toda inscrição extra, para uma exceção que a operação já considera normal |
| Pedir confirmação na primeira inscrição acima da capacidade | baixo | Melhor que bloquear, mas o aviso permanente do contador já informa sem interromper |
| Sinalizar sempre, sem bloquear (escolhida) | baixo | A tela descreve o que está acontecendo e não decide pela operação |

## Consequências

`camposBloqueados` desaparece do `InscritosPanel` — era o único uso da capacidade como trava ali, e sete campos deixaram de ter `disabled`. O botão de enviar segue desabilitado por CPF já inscrito nesta turma, que é regra de integridade, não de lotação.

A barra de ocupação por local pode passar de 100%. É informação correta e fica assim: cortar em 100% seria voltar a fingir que o limite existe.

O rótulo do contador ganhou um terceiro estado — abaixo, exatamente na capacidade, e acima —, porque "10/10" e "11/10" contam coisas diferentes para quem vai montar a sala.

A ajuda da tela foi reescrita nos três trechos que prometiam o bloqueio: quem leu a versão anterior aprendeu uma regra que não existe mais.
