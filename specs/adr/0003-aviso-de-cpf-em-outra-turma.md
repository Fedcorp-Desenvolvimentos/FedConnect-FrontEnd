# ADR-0003 — O aviso de CPF repetido vive na tela

> **Status:** decidido · **Dono:** Ingryd Aylana · **Data:** 2026-09-01
> **Pode ser adiada:** não (define o passo a mais no cadastro de inscrito)
> **Contexto(s):** `FCF` · **Specs:** `specs/curso-cipa/`
> **Par no backend:** `FedConnect-Back-End/specs/adr/0003-duplicidade-de-inscrito-entre-turmas.md`

## Contexto

A API aceita o mesmo CPF em turmas diferentes — decisão registrada no ADR par, no backend: o curso se repete, e a mesma pessoa pode aparecer em condomínios diferentes. Só que a tela carrega um mês por vez e apenas os inscritos da turma aberta, então o operador não enxerga que aquele CPF já está em outro lugar e não tem como perceber o próprio engano.

## Decisão

O aviso é da tela. Antes de gravar um inscrito novo — ou uma edição em que o CPF mudou — a página consulta `GET cursos-cipa/verificar-cpf/` e, havendo resultado, abre o `ConfirmarModal` em tom de aviso listando condomínio, local e data de cada turma onde o CPF consta. O operador confirma ou desiste.

## Opções consideradas

| Opção | Custo de reverter | Observações |
|---|---|---|
| Bloquear na tela | baixo | Contraria a regra do backend e deixa o caso legítimo sem saída |
| Avisar depois de gravar | baixo | Tarde demais: o engano já está na lista e o operador precisa desfazer |
| Avisar antes de gravar, com confirmação (escolhida) | baixo | Uma requisição a mais por cadastro, só quando o CPF é novo ou mudou |

## Consequências

O `ConfirmarModal`, criado para a exclusão, ganhou `tom` (`perigo`/`aviso`) e `itens` — passa a servir aos dois usos com um componente só.

A consulta falhando devolve lista vazia e o cadastro segue: perder o aviso é aceitável, perder o cadastro não. Como a decisão mora na tela, quem chamar a API direto grava sem aviso — coerente com o ADR par, onde a API permite o caso de propósito.
