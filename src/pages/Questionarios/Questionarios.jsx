import React, { useMemo, useState } from "react";
import {
    FaClipboardList,
    FaEdit,
    FaTrash,
    FaSave,
    FaTimes,
    FaSearch,
    FaEye,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import "./Questionarios.css";

const initialForm = {
    setor: "",
    responsavelEntrevista: "",
    participantes: "",
    data: "",

    principaisProcessos: "",
    atividadesFrequencia: "",
    informacoesConsultadas: "",

    sistemasUtilizados: "",
    multiplasFontes: "",

    atividadesManuaisRetrabalho: "",
    errosPerdaTempo: "",
    dependenciaOutroSetor: "",

    relatoriosIndicadores: "",
    melhoriasImpacto: "",

    consideracoesFinais: "",
};

const camposObrigatorios = [
    "setor",
    "responsavelEntrevista",
    "data",
    "principaisProcessos",
    "sistemasUtilizados",
    "atividadesManuaisRetrabalho",
    "melhoriasImpacto",
];

const labelsCamposObrigatorios = {
    setor: "Setor",
    responsavelEntrevista: "Responsável pela entrevista",
    data: "Data",
    principaisProcessos: "Principais processos",
    sistemasUtilizados: "Sistemas utilizados",
    atividadesManuaisRetrabalho:
        "Atividades manuais, repetitivas ou retrabalho",
    melhoriasImpacto: "Automatização, simplificação ou melhoria",
};

function Questionarios() {

    const { user } = useAuth();

   const podeVisualizarQuestionarios =
  user?.nivel_acesso?.toLowerCase() === "admin" ||
  user?.nivel_acesso?.toLowerCase() === "ti";

    const [questionarios, setQuestionarios] = useState([]);
    const [form, setForm] = useState(initialForm);
    const [editandoId, setEditandoId] = useState(null);
    const [visualizando, setVisualizando] = useState(null);
    const [modalExcluir, setModalExcluir] = useState(null);
    const [busca, setBusca] = useState("");
    const [mensagem, setMensagem] = useState(null);

    const questionariosFiltrados = useMemo(() => {
        const termo = busca.toLowerCase().trim();

        if (!termo) return questionarios;

        return questionarios.filter((item) => {
            return (
                item.setor.toLowerCase().includes(termo) ||
                item.responsavelEntrevista.toLowerCase().includes(termo) ||
                item.participantes.toLowerCase().includes(termo)
            );
        });
    }, [busca, questionarios]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const limparFormulario = () => {
        setForm(initialForm);
        setEditandoId(null);
    };

    const validarFormulario = () => {
        const camposInvalidos = camposObrigatorios.filter(
            (campo) => !form[campo]?.trim()
        );

        if (camposInvalidos.length > 0) {
            const campos = camposInvalidos
                .map((campo) => labelsCamposObrigatorios[campo])
                .join(", ");

            setMensagem({
                tipo: "erro",
                texto: `Preencha os campos obrigatórios: ${campos}.`,
            });

            return false;
        }

        return true;
    };

    const salvarQuestionario = (e) => {
        e.preventDefault();

        if (!validarFormulario()) return;

        if (editandoId) {
            setQuestionarios((prev) =>
                prev.map((item) =>
                    item.id === editandoId
                        ? {
                            ...form,
                            id: editandoId,
                            atualizadoEm: new Date().toISOString(),
                        }
                        : item
                )
            );

            setMensagem({
                tipo: "sucesso",
                texto: "Questionário atualizado com sucesso.",
            });
        } else {
            const novoQuestionario = {
                ...form,
                id: Date.now(),
                criadoEm: new Date().toISOString(),
                atualizadoEm: null,
            };

            setQuestionarios((prev) => [novoQuestionario, ...prev]);

            setMensagem({
                tipo: "sucesso",
                texto: "Questionário enviado com sucesso.",
            });
        }

        limparFormulario();

        setTimeout(() => {
            setMensagem(null);
        }, 3500);
    };

    const editarQuestionario = (item) => {
        setForm({
            setor: item.setor || "",
            responsavelEntrevista: item.responsavelEntrevista || "",
            participantes: item.participantes || "",
            data: item.data || "",

            principaisProcessos: item.principaisProcessos || "",
            atividadesFrequencia: item.atividadesFrequencia || "",
            informacoesConsultadas: item.informacoesConsultadas || "",

            sistemasUtilizados: item.sistemasUtilizados || "",
            multiplasFontes: item.multiplasFontes || "",

            atividadesManuaisRetrabalho: item.atividadesManuaisRetrabalho || "",
            errosPerdaTempo: item.errosPerdaTempo || "",
            dependenciaOutroSetor: item.dependenciaOutroSetor || "",

            relatoriosIndicadores: item.relatoriosIndicadores || "",
            melhoriasImpacto: item.melhoriasImpacto || "",

            consideracoesFinais: item.consideracoesFinais || "",
        });

        setEditandoId(item.id);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const confirmarExclusao = () => {
        if (!modalExcluir) return;

        setQuestionarios((prev) =>
            prev.filter((item) => item.id !== modalExcluir.id)
        );

        setModalExcluir(null);

        setMensagem({
            tipo: "sucesso",
            texto: "Questionário excluído com sucesso.",
        });

        setTimeout(() => {
            setMensagem(null);
        }, 3500);
    };

    const formatarData = (data) => {
        if (!data) return "-";

        const [ano, mes, dia] = data.split("-");
        return `${dia}/${mes}/${ano}`;
    };

    return (
        <div className="questionarios-page">
            <section className="questionarios-header">
                <div>
                    <span className="questionarios-tag">
                        <FaClipboardList />
                        Levantamento de Processos
                    </span>

                    <h1>Questionários</h1>

                    <p>
                        Cadastro de respostas para mapear processos, gargalos, oportunidades
                        de automação e melhorias operacionais.
                    </p>
                </div>


            </section>

            {mensagem && (
                <div className={`questionarios-alert ${mensagem.tipo}`}>
                    {mensagem.texto}
                </div>
            )}

            <form className="questionarios-form" onSubmit={salvarQuestionario}>
                <div className="form-title-row">
                    <div>
                        <h2>{editandoId ? "Editar questionário" : "Novo questionário"}</h2>
                        <p>Campos com * são obrigatórios.</p>
                    </div>

                    <div className="form-actions-top">
                        {editandoId && (
                            <button
                                type="button"
                                className="btn-secondary"
                                onClick={limparFormulario}
                            >
                                <FaTimes />
                                Cancelar edição
                            </button>
                        )}

                        <button type="submit" className="btn-primary">
                            <FaSave />
                            {editandoId ? "Salvar alterações" : "Enviar questionário"}
                        </button>
                    </div>
                </div>

                <div className="questionarios-card">
                    <h3>1. Identificação</h3>

                    <div className="form-grid">
                        <div className="form-group">
                            <label>Setor *</label>
                            <input
                                type="text"
                                name="setor"
                                value={form.setor}
                                onChange={handleChange}
                                placeholder="Ex: Financeiro"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Responsável pela entrevista *</label>
                            <input
                                type="text"
                                name="responsavelEntrevista"
                                value={form.responsavelEntrevista}
                                onChange={handleChange}
                                placeholder="Nome do responsável"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Participantes</label>
                            <input
                                type="text"
                                name="participantes"
                                value={form.participantes}
                                onChange={handleChange}
                                placeholder="Participantes da entrevista"
                            />
                        </div>

                        <div className="form-group">
                            <label>Data *</label>
                            <input
                                type="date"
                                name="data"
                                value={form.data}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                </div>

                <QuestionarioBloco
                    titulo="2. Processos"
                    perguntas={[
                        {
                            label:
                                "1. Quais são os principais processos executados pelo setor? *",
                            name: "principaisProcessos",
                            required: true,
                        },
                        {
                            label:
                                "2. Quais atividades são feitas com frequência diária, semanal ou mensal?",
                            name: "atividadesFrequencia",
                        },
                        {
                            label: "3. Quais informações o setor mais precisa consultar?",
                            name: "informacoesConsultadas",
                        },
                    ]}
                    form={form}
                    onChange={handleChange}
                />

                <QuestionarioBloco
                    titulo="3. Sistemas"
                    perguntas={[
                        {
                            label:
                                "4. Quais sistemas, planilhas ou ferramentas são usados hoje? *",
                            name: "sistemasUtilizados",
                            required: true,
                        },
                        {
                            label:
                                "5. Existe necessidade de consultar mais de uma fonte para concluir uma atividade?",
                            name: "multiplasFontes",
                        },
                    ]}
                    form={form}
                    onChange={handleChange}
                />

                <QuestionarioBloco
                    titulo="4. Gargalos"
                    perguntas={[
                        {
                            label:
                                "6. Quais atividades são manuais, repetitivas ou geram retrabalho? *",
                            name: "atividadesManuaisRetrabalho",
                            required: true,
                        },
                        {
                            label:
                                "7. Onde acontecem mais erros, inconsistências ou perda de tempo?",
                            name: "errosPerdaTempo",
                        },
                        {
                            label: "8. Quais processos dependem de outro setor?",
                            name: "dependenciaOutroSetor",
                        },
                    ]}
                    form={form}
                    onChange={handleChange}
                />

                <QuestionarioBloco
                    titulo="5. Gestão e Melhoria"
                    perguntas={[
                        {
                            label:
                                "9. Quais relatórios, indicadores ou dashboards seriam úteis?",
                            name: "relatoriosIndicadores",
                        },
                        {
                            label:
                                "10. O que poderia ser automatizado, simplificado ou melhorado com maior impacto? *",
                            name: "melhoriasImpacto",
                            required: true,
                        },
                    ]}
                    form={form}
                    onChange={handleChange}
                />

                <div className="questionarios-card">
                    <h3>6. Considerações Finais</h3>

                    <div className="form-group">
                        <label>Sugestões adicionais ou oportunidades não citadas</label>
                        <textarea
                            name="consideracoesFinais"
                            value={form.consideracoesFinais}
                            onChange={handleChange}
                            placeholder="Digite as considerações finais..."
                        />
                    </div>
                </div>
            </form>
{podeVisualizarQuestionarios && (
  <section className="questionarios-lista">
            
                <div className="lista-header">
                    <div>
                        <h2>Respostas cadastradas</h2>
                        <p>Consulte, edite ou exclua respostas já registradas.</p>
                    </div>

                    <div className="search-box">
                        <FaSearch />
                        <input
                            type="text"
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                            placeholder="Buscar por setor, responsável ou participante"
                        />
                    </div>
                </div>

                {questionariosFiltrados.length === 0 ? (
                    <div className="empty-state">
                        <FaClipboardList />
                        <h3>Nenhum questionário encontrado</h3>
                        <p>
                            Cadastre a primeira resposta usando o formulário acima. O CRUD
                            está pronto, só falta alimentar o bichinho.
                        </p>
                    </div>
                ) : (
                    <div className="questionarios-table-wrapper">
                        <table className="questionarios-table">
                            <thead>
                                <tr>
                                    <th>Setor</th>
                                    <th>Responsável</th>
                                    <th>Participantes</th>
                                    <th>Data</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>

                            <tbody>
                                {questionariosFiltrados.map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.setor}</td>
                                        <td>{item.responsavelEntrevista}</td>
                                        <td>{item.participantes || "-"}</td>
                                        <td>{formatarData(item.data)}</td>
                                        <td>
                                            <div className="table-actions">
                                                <button
                                                    type="button"
                                                    className="btn-icon view"
                                                    onClick={() => setVisualizando(item)}
                                                    title="Visualizar"
                                                >
                                                    <FaEye />
                                                </button>

                                                <button
                                                    type="button"
                                                    className="btn-icon edit"
                                                    onClick={() => editarQuestionario(item)}
                                                    title="Editar"
                                                >
                                                    <FaEdit />
                                                </button>

                                                <button
                                                    type="button"
                                                    className="btn-icon delete"
                                                    onClick={() => setModalExcluir(item)}
                                                    title="Excluir"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
)}
            {modalExcluir && (
                <div className="modal-overlay">
                    <div className="modal-card small">
                        <h2>Excluir questionário?</h2>

                        <p>
                            Tem certeza que deseja excluir o questionário do setor{" "}
                            <strong>{modalExcluir.setor}</strong>?
                        </p>

                        <div className="modal-actions">
                            <button
                                type="button"
                                className="btn-secondary"
                                onClick={() => setModalExcluir(null)}
                            >
                                Cancelar
                            </button>

                            <button
                                type="button"
                                className="btn-danger"
                                onClick={confirmarExclusao}
                            >
                                Excluir
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {visualizando && (
                <div className="modal-overlay">
                    <div className="modal-card large">
                        <div className="modal-view-header">
                            <div>
                                <h2>Visualizar questionário</h2>
                                <p>
                                    {visualizando.setor} — {formatarData(visualizando.data)}
                                </p>
                            </div>

                            <button
                                type="button"
                                className="btn-close"
                                onClick={() => setVisualizando(null)}
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <div className="modal-view-content">
                            <ResumoItem
                                titulo="Responsável"
                                valor={visualizando.responsavelEntrevista}
                            />
                            <ResumoItem
                                titulo="Participantes"
                                valor={visualizando.participantes}
                            />
                            <ResumoItem
                                titulo="Principais processos"
                                valor={visualizando.principaisProcessos}
                            />
                            <ResumoItem
                                titulo="Atividades por frequência"
                                valor={visualizando.atividadesFrequencia}
                            />
                            <ResumoItem
                                titulo="Informações consultadas"
                                valor={visualizando.informacoesConsultadas}
                            />
                            <ResumoItem
                                titulo="Sistemas utilizados"
                                valor={visualizando.sistemasUtilizados}
                            />
                            <ResumoItem
                                titulo="Consulta em múltiplas fontes"
                                valor={visualizando.multiplasFontes}
                            />
                            <ResumoItem
                                titulo="Atividades manuais, repetitivas ou retrabalho"
                                valor={visualizando.atividadesManuaisRetrabalho}
                            />
                            <ResumoItem
                                titulo="Erros, inconsistências ou perda de tempo"
                                valor={visualizando.errosPerdaTempo}
                            />
                            <ResumoItem
                                titulo="Dependência de outro setor"
                                valor={visualizando.dependenciaOutroSetor}
                            />
                            <ResumoItem
                                titulo="Relatórios, indicadores ou dashboards"
                                valor={visualizando.relatoriosIndicadores}
                            />
                            <ResumoItem
                                titulo="Automatização, simplificação ou melhoria"
                                valor={visualizando.melhoriasImpacto}
                            />
                            <ResumoItem
                                titulo="Considerações finais"
                                valor={visualizando.consideracoesFinais}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function QuestionarioBloco({ titulo, perguntas, form, onChange }) {
    return (
        <div className="questionarios-card">
            <h3>{titulo}</h3>

            <div className="questions-grid">
                {perguntas.map((pergunta) => (
                    <div className="form-group" key={pergunta.name}>
                        <label>{pergunta.label}</label>
                        <textarea
                            name={pergunta.name}
                            value={form[pergunta.name]}
                            onChange={onChange}
                            placeholder="Digite a resposta..."
                            required={pergunta.required}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

function ResumoItem({ titulo, valor }) {
    return (
        <div className="resumo-item">
            <strong>{titulo}</strong>
            <p>{valor || "Não informado"}</p>
        </div>
    );
}

export default Questionarios;