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
