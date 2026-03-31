import { getNFSePorBoleto } from "../../services/consultaNFSeService";
import "../../styles/Consulta.css";
import PageTemplate from "../PageTemplate/PageTemplate";
import { useEffect, useState } from "react";
import { FaFileInvoice } from "react-icons/fa";

const ConsultaNotasFiscais = () => {
    const [dados, setDados] = useState([]);
    console.log("Dados NFSe:", dados);

    useEffect(() => {
        const carregarNFSe = async () => {
            try {
                const response = await getNFSePorBoleto('0001480721');
                setDados(response);
            } catch (e) {
                console.error("Erro ao carregar NFSe:", e);
            }
        };
        carregarNFSe();
    }, []);

    return (
        <PageTemplate 
            title="Consulta Notas Fiscais"
            subtitle="Consulte notas fiscais de maneira detalhada com parâmetros de pesquisa."
            icon={<FaFileInvoice />}
        >
            <div className="consulta-container">
                <h2>Em desenvolvimento...</h2>
            </div>
        </PageTemplate>
    );
}

export default ConsultaNotasFiscais;