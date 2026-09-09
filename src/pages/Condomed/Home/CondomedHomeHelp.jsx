import { FaUserMd, FaChalkboardTeacher, FaHistory, FaRobot, FaUserCog, FaLock } from "react-icons/fa";

const secao = { marginBottom: "1.5rem" };

const titulo = {
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  color: "#0F3D5D",
  marginBottom: "0.6rem",
};

const texto = { margin: 0, color: "#475569", fontSize: "0.9rem", lineHeight: 1.55 };

export const CondomedHomeHelp = () => (
  <>
    <div style={secao}>
      <h2 style={titulo}>
        <FaUserMd /> O que é esta área
      </h2>
      <p style={texto}>
        A <strong>Condomed</strong> é o setor de medicina e segurança do trabalho da
        Fedcorp. Esta é a porta de entrada das ferramentas do setor: cada cartão abaixo
        leva a uma delas. Conforme novas rotinas entrarem no FedConnect, elas aparecem
        aqui.
      </p>
    </div>

    <div style={secao}>
      <h3 style={titulo}>
        <FaChalkboardTeacher /> Cursos CIPA
      </h3>
      <p style={texto}>
        Agendamento das turmas do curso CIPA para os condomínios das administradoras, no
        auditório ou na sala de reunião, com a lista de funcionários inscritos em cada
        turma. A tela tem a própria ajuda, no mesmo botão de interrogação.
      </p>
    </div>

    <div style={secao}>
      <h3 style={titulo}>
        <FaHistory /> Turmas e participantes
      </h3>
      <p style={texto}>
        Histórico das turmas por período e consulta de participantes: em quais turmas
        uma pessoa, um condomínio ou uma administradora apareceram. Cada turma abre
        numa página própria, com a lista de inscritos — e, em breve, presença e
        documentos.
      </p>
    </div>

    <div style={secao}>
      <h3 style={titulo}>
        <FaUserCog /> Cadastros
      </h3>
      <p style={texto}>
        Palestrantes (nome, título, registro MTE e assinatura digitalizada, que sai no
        certificado) e locais do curso (capacidade e unidade emissora). Quem já tem turma não
        se exclui: desativa, e continua no histórico. Só um local pode ser a sala de reunião
        da Agenda geral.
      </p>
    </div>

    <div style={secao}>
      <h3 style={titulo}>
        <FaRobot /> Robô eSocial (SOC)
      </h3>
      <p style={texto}>
        Automação que lê a planilha de controle e busca, no Portal eSocial do SOC, o
        recibo S-2220 de cada funcionário pendente. O robô <strong>roda na máquina do
        operador</strong>, não no FedConnect. Ao clicar em &ldquo;Abrir robô&rdquo;, o
        cartão abre o painel se ele já estiver de pé; se não estiver, inicia o robô por
        um atalho do Windows (<code>fedrobo://</code>) e abre o painel assim que ele
        responder. Esse atalho é instalado uma vez por PC, com o
        <code> instalar-atalho-fedconnect.bat</code> que fica na pasta do robô. Se o
        navegador perguntar se pode abrir o &ldquo;fedrobo&rdquo;, marque para lembrar a
        escolha.
      </p>
    </div>

    <div
      style={{
        border: "1px solid #bfdbfe",
        background: "#eff6ff",
        borderRadius: "12px",
        padding: "0.85rem 1rem",
      }}
    >
      <strong
        style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#1e40af" }}
      >
        <FaLock /> Quem tem acesso
      </strong>
      <p style={{ ...texto, marginTop: "0.5rem" }}>
        Os níveis <strong>Condomed</strong>, <strong>Condomed eSocial</strong> e{" "}
        <strong>Administrador</strong>. O cartão do robô eSocial aparece só para o nível
        Condomed eSocial (e Administrador). Os cartões respeitam o nível de quem está
        logado, e as rotas são bloqueadas mesmo se o endereço for digitado direto na barra
        do navegador.
      </p>
    </div>
  </>
);

export default CondomedHomeHelp;
