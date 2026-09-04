import { FaUserMd, FaChalkboardTeacher, FaLock } from "react-icons/fa";

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
        Somente os níveis <strong>Condomed</strong> e <strong>Administrador</strong>. Os
        cartões respeitam o nível de quem está logado, e as rotas são bloqueadas mesmo se
        o endereço for digitado direto na barra do navegador.
      </p>
    </div>
  </>
);

export default CondomedHomeHelp;
