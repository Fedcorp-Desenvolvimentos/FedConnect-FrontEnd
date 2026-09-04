# Registro de questões abertas

> **Atualizado:** 2026-08-31

Toda `PA-###` citada em qualquer spec deste repositório nasce e vive aqui. Questão fechada não some: recebe status `fechada`, a resposta e a data. O número nunca é reciclado.

Formato de cada entrada: título, status (`aberta` | `fechada`), dono, severidade (`bloqueia` | `alta` | `média` | `baixa`), o que trava, e — quando fechada — a resposta.

---

## PA-001 — Renderização da Reserva espelho (510 min) na grade da agenda atual

- **Status:** aberta · **Dono:** Ingrid Aylana · **Severidade:** média
- **Trava:** CT-CIP-006 (verificação); não trava os RF.
- **Questão:** `src/utils/agendaSlots.js` calcula bloqueio para qualquer duração, mas a UI só oferece 60–240 min; uma reserva 09:00–17:30 (510 min) deve pintar todos os slots do dia como "Reservado". Confirmar em `/agenda` após a primeira turma na sala; se quebrar, ajustar `Agenda.jsx`/`AgendaDetalhe.jsx`.

## PA-002 — `src/pages/RH` é mock com rotas inexistentes

- **Status:** aberta · **Dono:** Ingrid Aylana · **Severidade:** baixa
- **Trava:** nada.
- **Questão:** `RH.jsx` usa dados fixos, testa nível `rh` inexistente e navega para `/rh/*` sem rotas. Remover, concluir ou manter oculto? Fora do escopo do CIPA (que é Condomed, não RH).

## PA-003 — Não existe fonte de condomínios por administradora

- **Status:** aberta · **Dono:** Ingrid Aylana · **Severidade:** média
- **Trava:** o seletor em cascata de RF-CIP-002 (implementado como campo digitado).
- **Questão:** o design previa "administradora → condomínio via selects existentes", mas não há endpoint que liste condomínios de uma administradora — nem no FedConnect-Back-End nem no FedHub (o condomínio aparece só como `NOME_SEGURADO`/`CO_ESTIPULANTE` dentro de faturas). Implementado por ora: administradora vem de `/vistorias/administradoras/` (select) e o condomínio é digitado (código + nome), que é o que o backend armazena. Decidir se vale criar um endpoint de condomínios por administradora no FedHub.

## PA-023 — Níveis autorizados no Envio Porto (nasceu no FedHub)

- **Status:** fechada (2026-08-27) · **Dono:** Ingrid Aylana · **Severidade:** baixa
- **Trava:** nada.
- **Questão:** a spec `envio-porto` deste repositório cita `PA-023`, mas a questão nasceu no registro do **FedHub-Backend**. Registrada aqui para o número resolver neste repo — a numeração não é reciclada.
- **Resposta:** `admin`, `faturamento` (faturista) e `ti`, sem distinção entre gerar, baixar e enviar. A tela esconde o card e a rota, e o Django reforça o gate.

## PA-024 — Uma turma atende um condomínio ou vários?

- **Status:** fechada (2026-09-04) · **Dono:** Ingrid Aylana · **Severidade:** bloqueia
- **Trava:** o `TurmaModal`, o `InscritosPanel` e a identificação da turma no calendário.
- **Questão:** a tela nasceu tratando a turma como o curso de um condomínio (administradora e condomínio no formulário da turma, condomínio como nome da etiqueta). Uma turma pode receber funcionários de administradoras diferentes?
- **Resposta:** sim, e é a regra. O vínculo (administradora + condomínio) passa para o formulário do inscrito, obrigatório, e a turma é identificada por local + ocupação — "Auditório · 12/30" (ADR-0005). Par no backend: a questão de mesmo teor no registro do `FedConnect-Back-End` (número 006) e o `ADR-0004` de lá.

## PA-025 — Ocupação total do mês na faixa de medidas

- **Status:** fechada (2026-09-04) · **Dono:** Ingrid Aylana · **Severidade:** baixa
- **Trava:** nada.
- **Questão:** a faixa mostrava "Ocupação 5% · 2 de 40", somando as vagas dos dois locais, enquanto o painel lateral mostrava 3% no auditório e 10% na sala de reunião. O número está certo e não conversa com nenhum dos dois: os locais têm capacidades muito diferentes (30 e 10), então a média do mês não descreve nem um nem outro.
- **Resposta:** retirar a medida de ocupação total. Ocupação passa a existir só por local, no painel lateral. A faixa fica com turmas no mês, inscritos e próximas turmas.

## PA-026 — Presença e certificado: regras que só o solicitante pode dar

- **Status:** aberta · **Dono:** Ingrid Aylana · **Severidade:** alta
- **Trava:** fases C (presença) e D (certificado) do `MAPEAMENTO_CIPA_FASE2.md`. Não trava a fase A (`specs/curso-cipa-historico/`).
- **Questão:** carga horária do certificado; texto e base legal; quem assina (reabre o instrutor da turma); numeração; layout; prazo para marcar presença; presença parcial; quem pode marcar; envio por e-mail; linhas extras na lista de presença. Lista completa na seção 7 do mapeamento. Espelha a questão de mesmo teor no registro do `FedConnect-Back-End` (número 007).
