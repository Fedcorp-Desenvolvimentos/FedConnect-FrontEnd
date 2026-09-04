# ADR-0005 — Vínculo no formulário do inscrito; turma identificada por local + ocupação

> **Status:** decidido · **Dono:** Ingrid Aylana · **Data:** 2026-09-04
> **Pode ser adiada:** não (a tela cadastra turma com um cliente que não existe mais)
> **Contexto(s):** `FCF` · **Specs:** `specs/curso-cipa/`
> **Par no backend:** `FedConnect-Back-End/specs/adr/0004-vinculo-do-inscrito-nao-da-turma.md`
> **Substitui parcialmente:** ADR-0002 (a parte "etiqueta com o condomínio no dia")

## Contexto

A tela nasceu sobre a premissa de que uma turma atende um condomínio: o `TurmaModal` pedia administradora e condomínio, e o condomínio era o **nome** da turma em três lugares — a etiqueta dentro do dia no calendário, a linha no painel lateral e o título da lista de inscritos.

A operação é outra: a turma é um dia de curso em um local, e as 30 vagas do auditório são preenchidas com funcionários de várias administradoras e condomínios. Com o vínculo na turma, o operador não tem onde dizer de quem é cada participante.

Removido o cliente da turma, some o nome dela — e a tela precisa de algo para mostrar no lugar.

## Decisão

**Vínculo no inscrito.** Administradora (select digitável sobre `/vistorias/administradoras/`) e condomínio (digitado) saem do `TurmaModal` e entram no formulário do `InscritosPanel`, obrigatórios. A tabela de inscritos ganha as duas colunas.

**Turma identificada por local + ocupação.** Onde havia o condomínio, passa a haver "Auditório · 12/30". Escolhido pelo dono em 2026-09-04 entre um campo livre de identificação da turma e a lista derivada das administradoras presentes.

**Repetição do vínculo.** Ao adicionar um inscrito depois de outro na mesma sessão, o formulário já vem com a administradora e o condomínio do anterior, editáveis.

**Busca sobre as listas derivadas.** O backend passa a devolver `administradoras` e `condominios` de cada turma, derivados dos inscritos. A busca da barra de filtros casa contra elas — a pergunta que ela responde deixa de ser "qual turma é do condomínio X" e passa a ser "quais turmas têm gente da administradora X".

## Opções consideradas

| Opção | Custo de reverter | Observações |
|---|---|---|
| Campo livre de identificação na turma | baixo | Dá nome à etiqueta, mas é um dado que ninguém consulta e que envelhece; recusado pelo dono |
| Etiqueta com as administradoras presentes | baixo | Informativo, mas turma vazia fica sem rótulo e o texto varia de tamanho a cada inscrição |
| Local + ocupação (escolhida) | baixo | O que o operador realmente pergunta ao olhar o mês: onde é, e quanto ainda cabe |
| Repetir o vínculo do inscrito anterior | baixo | Ganho de digitação sem inventar estrutura; se não bastar, o próximo passo é uma ação em lote na lista |

## Consequências

O `TurmaModal` encurta: local, data, situação e observação. O formulário de inscrito cresce em dois campos e passa a validar quatro obrigatórios (nome, CPF, função, e mais administradora e condomínio) — vale acomodar em duas colunas para o painel não ficar alto demais.

Com "12/30" na etiqueta, a ocupação passa a ser lida no calendário sem abrir a turma, o que o condomínio como rótulo não dava. Turma vazia aparece como "Auditório · 0/30" — legível, ao contrário de uma etiqueta sem nome.

O aviso de CPF em outra turma (ADR-0003) melhora: a resposta passa a trazer a administradora e o condomínio de cada inscrição encontrada, o que distingue "o operador repetiu a pessoa" de "a mesma pessoa vem por dois condomínios".

`CursoCipaHelp` precisa ser reescrito na parte de inscritos e de agendamento, porque descreve o formulário antigo. O texto que fala em "condomínio cliente da turma" deixa de valer.
