import {
  FaCalendarAlt,
  FaUsers,
  FaFileExcel,
  FaExclamationTriangle,
} from "react-icons/fa";

const secao = { marginBottom: "1.5rem" };

const titulo = {
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  color: "#0F3D5D",
  marginBottom: "0.6rem",
};

const texto = { margin: 0, color: "#475569", fontSize: "0.9rem", lineHeight: 1.55 };

export const CursoCipaHelp = () => (
  <>
    <div style={secao}>
      <h2 style={titulo}>
        <FaCalendarAlt /> Agendar uma turma
      </h2>
      <p style={texto}>
        Clique em qualquer dia do calendário para abrir o formulário já com aquela data,
        ou use <strong>Nova turma</strong> e escolha a data no formulário. O curso ocupa o
        dia inteiro, das 09:00 às 17:30, e cabe uma turma por dia em cada local — por isso
        não há campo de horário. Se o dia já estiver ocupado, o sistema recusa e diz o que
        está no caminho.
      </p>
      <p style={{ ...texto, marginTop: "0.5rem" }}>
        A turma <strong>não tem um condomínio dono</strong>: ela é um dia de curso em um
        local, e as vagas são preenchidas com funcionários de administradoras e
        condomínios diferentes. Por isso o formulário da turma pede só local, data,
        situação e observação — a administradora e o condomínio de cada pessoa são
        informados na lista de inscritos. No calendário, a turma aparece pelo local e pela
        ocupação (por exemplo, <strong>Auditório · 12/30</strong>).
      </p>
    </div>

    <div style={secao}>
      <h3 style={titulo}>
        <FaUsers /> Inscritos
      </h3>
      <p style={texto}>
        Clique na turma dentro do calendário para abrir a lista.{" "}
        <strong>Administradora, condomínio, nome, CPF e função</strong> são obrigatórios;
        e-mail e telefone, opcionais. A administradora vem da lista da companhia (digite
        para filtrar) e o condomínio é digitado. O contador mostra{" "}
        <strong>inscritos / capacidade</strong> — 30 no auditório, 10 na sala de reunião —
        e o botão desabilita quando a turma lota.
      </p>
      <p style={{ ...texto, marginTop: "0.5rem" }}>
        Depois de adicionar alguém, o formulário já vem com a mesma administradora e o
        mesmo condomínio, porque em geral as pessoas entram em blocos — cadastre o
        condomínio inteiro e só troque o vínculo ao passar para o próximo. Os dois campos
        continuam editáveis a qualquer momento, inclusive ao corrigir um inscrito já
        gravado.
      </p>
    </div>

    <div style={secao}>
      <h3 style={titulo}>
        <FaFileExcel /> Turma por planilha
      </h3>
      <p style={texto}>
        Use <strong>Turma por planilha</strong> quando a lista já vier pronta do
        condomínio. Escolha o local e o dia na tela, baixe o <strong>modelo</strong>{" "}
        e preencha uma linha por pessoa — a planilha não tem colunas de local e data
        de propósito: uma planilha é uma turma.
      </p>
      <p style={{ ...texto, marginTop: "0.5rem" }}>
        Ao anexar o arquivo, a tela mostra linha por linha o que entra e o que tem
        problema (CPF inválido, campo em branco, CPF repetido, administradora que
        não existe na base) — <strong>nada é gravado antes de você conferir</strong>.
        Dá para importar só as linhas boas ou corrigir a planilha e anexar de novo.
        Se a lista tiver mais gente do que as vagas do local, a importação não sai:
        quem fica de fora do curso é decisão sua, não da ordem das linhas.
      </p>
    </div>

    <div style={secao}>
      <h3 style={titulo}>
        <FaCalendarAlt /> Painel à direita
      </h3>
      <p style={texto}>
        <strong>Hoje</strong> e <strong>Próximas turmas</strong> levam direto à lista de
        inscritos. <strong>Pedem atenção</strong> junta o que precisa de providência:
        turmas sem ninguém inscrito, turmas lotadas e turmas na sala de reunião que
        perderam a reserva na agenda. Os filtros do topo valem para o calendário e para o
        painel ao mesmo tempo.
      </p>
    </div>

    <div
      style={{
        border: "1px solid #fcd34d",
        background: "#fffbeb",
        borderRadius: "12px",
        padding: "0.85rem 1rem",
      }}
    >
      <strong
        style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#92400e" }}
      >
        <FaExclamationTriangle /> A sala de reunião é compartilhada
      </strong>
      <p style={{ ...texto, marginTop: "0.5rem" }}>
        Marcar uma turma na sala de reunião reserva a sala na Agenda pelo dia todo, e uma
        reunião já marcada impede o curso naquele dia. Excluir a turma libera a sala.
      </p>
    </div>
  </>
);

export default CursoCipaHelp;
