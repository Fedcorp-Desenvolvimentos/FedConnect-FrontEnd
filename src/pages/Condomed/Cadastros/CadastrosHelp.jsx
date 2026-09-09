import { FaChalkboardTeacher, FaFileSignature, FaMapMarkerAlt, FaToggleOff } from "react-icons/fa";

const secao = { marginBottom: "1.5rem" };
const titulo = { display: "flex", alignItems: "center", gap: "0.5rem", color: "#0F3D5D", marginBottom: "0.6rem" };
const texto = { margin: 0, color: "#475569", fontSize: "0.9rem", lineHeight: 1.55 };

export default function CadastrosHelp() {
  return (
    <>
      <div style={secao}>
        <h2 style={titulo}>
          <FaChalkboardTeacher /> Palestrantes
        </h2>
        <p style={texto}>
          Quem ministra o curso e assina o certificado. Nome, título e registro MTE saem
          impressos no certificado exatamente como estão aqui. O registro MTE + UF identifica o
          profissional: não pode repetir.
        </p>
      </div>

      <div style={secao}>
        <h3 style={titulo}>
          <FaFileSignature /> Assinatura digitalizada
        </h3>
        <p style={texto}>
          Imagem PNG ou JPEG de até 500 KB, de preferência com fundo branco. É opcional no
          cadastro, mas <strong>sem ela o certificado não sai</strong>: a lista marca quem
          ainda não tem. O arquivo fica guardado no servidor e não é exibido de volta; para
          trocar, envie outro.
        </p>
      </div>

      <div style={secao}>
        <h3 style={titulo}>
          <FaMapMarkerAlt /> Locais
        </h3>
        <p style={texto}>
          Onde o curso acontece. A capacidade é referência: a tela avisa quando a turma passa
          dela, mas não impede inscrever. A unidade emissora é o endereço que sai no cabeçalho
          da lista de presença e do certificado. Só um local pode ser marcado como a sala de
          reunião da Agenda geral, porque é o que bloqueia a sala por lá.
        </p>
      </div>

      <div
        style={{ border: "1px solid #bfdbfe", background: "#eff6ff", borderRadius: "12px", padding: "0.85rem 1rem" }}
      >
        <strong style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#1e40af" }}>
          <FaToggleOff /> Desativar, não excluir
        </strong>
        <p style={{ ...texto, marginTop: "0.5rem" }}>
          Palestrante ou local que já tem turma não pode ser excluído: o histórico e os
          certificados emitidos citam o registro. Desative-o. Ele sai das opções de turma nova
          e continua aparecendo nas turmas antigas. Sem turma vinculada, excluir é permitido.
        </p>
      </div>
    </>
  );
}
