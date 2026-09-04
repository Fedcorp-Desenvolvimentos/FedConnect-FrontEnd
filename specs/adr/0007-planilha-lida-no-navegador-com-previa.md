# ADR-0007 — Planilha lida no navegador, com prévia antes de gravar

> **Status:** decidido · **Dono:** Ingrid Aylana · **Data:** 2026-09-04
> **Pode ser adiada:** não (define onde a planilha é validada e o que o operador vê antes de gravar)
> **Contexto(s):** `FCF` · **Specs:** `specs/curso-cipa/`
> **Par no backend:** `FedConnect-Back-End/specs/adr/0005-importacao-de-turma-por-planilha.md`

## Contexto

As listas de participantes chegam à Condomed em planilha, mandadas pelos condomínios. Digitar 30 pessoas com cinco campos obrigatórios cada, uma a uma, é exatamente o trabalho que a tela deveria poupar.

O outro caminho do sistema — a consulta em massa de CPF/CNPJ/CEP — manda o arquivo para o Django, que processa e devolve outra planilha. Ali funciona: o resultado é um arquivo, e errar significa refazer a consulta. Aqui o resultado é **escrita no banco**, com regras que não perdoam: capacidade do local, CPF único por turma, conflito de dia. Uma importação que grava metade é um estrago que o operador vai limpar à mão, inscrito por inscrito.

## Decisão

**A planilha é lida no navegador** (`lerPlanilhaInscritos.js`, sobre a lib `xlsx` que o projeto já usa) e o resultado aparece **linha a linha antes de qualquer gravação**: o que ela tem, se entra, e o motivo de não entrar. Nada é enviado sem o operador ver.

**Quem decide sobre as linhas ruins é o operador.** Com linhas inválidas, a tela deixa importar só as válidas (avisando que as outras ficam de fora) ou corrigir a planilha e anexar de novo — o mesmo arquivo pode ser reenviado.

**Capacidade excedida bloqueia.** Com mais linhas válidas do que vagas, o botão desabilita e a tela diz quantas sobram. Não se corta a lista: quem fica de fora do curso é decisão da operação, não da ordem das linhas.

**Local e data ficam na tela, não na planilha.** A planilha modelo — baixada do backend, que é quem a gera — tem só as sete colunas do inscrito.

**A validação da tela não substitui a do servidor.** As mesmas regras rodam no `POST cursos-cipa/importar/`, que é tudo-ou-nada. Esta camada é conversa com o operador; a garantia é do backend.

## Opções consideradas

| Opção | Custo de reverter | Observações |
|---|---|---|
| Enviar o arquivo ao Django e mostrar o relatório da resposta | médio | Padrão do app `planilha`, mas o operador só descobre o problema depois de enviar, e o servidor teria de ler xlsx para escrever no banco |
| Ler no navegador e enviar só o que passou (escolhida) | baixo | Prévia imediata, decisão informada, servidor recebendo JSON já limpo |
| Ler no navegador e gravar direto, sem prévia | baixo | Rápido e cego: uma coluna trocada viraria 30 inscritos errados |
| Cortar a lista na capacidade e avisar | baixo | A ordem das linhas escolheria os participantes |

## Consequências

Os cabeçalhos aceitam variação (`adm`, `administradora`, `cliente`, `condominio`, `funcionario`, `cargo`…) porque a planilha é preenchida por gente de fora, e recusar por causa de um sinônimo seria atrito sem ganho. O que não varia é a existência das cinco colunas obrigatórias.

O número da linha exibido é o **número da linha no Excel**, não o índice do array: é onde o operador vai corrigir.

`semAcento` é importado do `useCursoCipa` em vez de reescrito no parser — a mesma função que a busca da tela usa, conforme a regra de fonte única do `CLAUDE.md`.

A administradora é validada contra a lista da companhia porque o backend grava o **código** e a planilha traz o nome. Enquanto essa lista não carrega, o botão de anexar fica desabilitado: sem ela, toda linha erraria por "administradora não encontrada" e o operador acharia que a planilha está errada.

O CPF é reformatado na prévia (`000.000.000-00`) mesmo quando inválido, para o operador comparar com a planilha dele sem traduzir dígitos.

Fica de fora, de propósito: importar planilha para uma turma que já existe. Uma turma criada à mão continua crescendo pelo formulário de inscrito.
