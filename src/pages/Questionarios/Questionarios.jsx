// src/pages/Questionarios/Questionarios.jsx
import { useState, useMemo, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import {
  FaClipboardList,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaSearch,
  FaEye,
  FaSpinner,
  FaPlus,
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import * as S from './QuestionariosStyles';
import PageLayout from '../../Layouts/PageLayout/PageLayout';
import { 
    enviarQuestionario, listarQuestionarios, atualizarQuestionario, excluirQuestionario 
} from '../../services/questionarioService';

// Configuração dos setores e subáreas
const SETORES_CONFIG = {
  "Mapa de Setores": {
    type: "main",
    options: [
      "Tecnologia da Informação",
      "Seguro Fiança",
      "Seguro de Automóvel",
      "Seguro de Vida Individual",
      "Seguro de Condomínio",
      "Financeiro",
      "Sinistro",
      "RH",
      "Faturamentos",
      "Medicina e Segurança do Trabalho"
    ]
  },
  "Faturamentos": {
    type: "subarea",
    parent: "Faturamentos",
    options: [
      "Vida Coletivo",
      "BAPS",
      "BOAT",
      "Incêndio Locação",
      "Incêndio Conteúdo",
      "Benefícios"
    ]
  },
  "Medicina e Segurança do Trabalho": {
    type: "subarea",
    parent: "Medicina e Segurança do Trabalho",
    options: [
      "Atendimento ao BOAT e BAPS",
      "Envio ao eSocial",
      "Cadastro de atendimentos realizados nas clínicas",
      "Manipulação de inconsistências no sistema SOC",
      "Gerenciamento das clínicas",
      "Emissão de propostas",
      "Agendamento de visitas",
      "Elaboração de documentos"
    ]
  }
};

const initialForm = {
  setor: "",
  subarea: "",
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
  atividadesManuaisRetrabalho: "Atividades manuais, repetitivas ou retrabalho",
  melhoriasImpacto: "Automatização, simplificação ou melhoria",
};

function QuestionarioBloco({ titulo, perguntas, form, onChange }) {
  return (
    <S.Card>
      <h3>{titulo}</h3>
      <S.QuestionsGrid>
        {perguntas.map((pergunta) => (
          <S.FormGroup key={pergunta.name}>
            <label>{pergunta.label}</label>
            <textarea
              name={pergunta.name}
              value={form[pergunta.name]}
              onChange={onChange}
              placeholder="Digite a resposta..."
              required={pergunta.required}
            />
          </S.FormGroup>
        ))}
      </S.QuestionsGrid>
    </S.Card>
  );
}

function ResumoItem({ titulo, valor }) {
  return (
    <S.ResumoItem>
      <strong>{titulo}</strong>
      <p>{valor || "Não informado"}</p>
    </S.ResumoItem>
  );
}

function Questionarios() {
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const podeVisualizarQuestionarios =
    user?.nivel_acesso?.toLowerCase() === "admin" ||
    user?.nivel_acesso?.toLowerCase() === "ti";

  const [questionarios, setQuestionarios] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editandoId, setEditandoId] = useState(null);
  const [visualizando, setVisualizando] = useState(null);
  const [modalExcluir, setModalExcluir] = useState(null);
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [carregandoLista, setCarregandoLista] = useState(false);
  const [formVisible, setFormVisible] = useState(false);

  const setorOptions = SETORES_CONFIG["Mapa de Setores"].options;

  const hasSubareas = (setor) => {
    return SETORES_CONFIG[setor] && SETORES_CONFIG[setor].type === "subarea";
  };

  const getSubareas = (setor) => {
    if (hasSubareas(setor)) {
      return SETORES_CONFIG[setor].options;
    }
    return [];
  };

  const handleSetorChange = (e) => {
    const newSetor = e.target.value;
    setForm((prev) => ({ 
      ...prev, 
      setor: newSetor,
      subarea: ""
    }));
  };

  const handleSubareaChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const limparFormulario = () => {
    setForm(initialForm);
    setEditandoId(null);
    setFormVisible(false);
  };

  const validarFormulario = () => {
    const camposInvalidos = camposObrigatorios.filter(
      (campo) => !form[campo]?.trim()
    );

    if (camposInvalidos.length > 0) {
      const campos = camposInvalidos
        .map((campo) => labelsCamposObrigatorios[campo])
        .join(", ");
      enqueueSnackbar(`Preencha os campos obrigatórios: ${campos}.`, { variant: 'error' });
      return false;
    }
    return true;
  };

  const questionariosFiltrados = useMemo(() => {
    const termo = busca.toLowerCase().trim();
    if (!termo) return questionarios;
    return questionarios.filter((item) => {
      const setorCompleto = item.subarea ? `${item.setor} - ${item.subarea}` : item.setor;
      return (
        setorCompleto?.toLowerCase().includes(termo) ||
        item.responsavelEntrevista?.toLowerCase().includes(termo) ||
        item.participantes?.toLowerCase().includes(termo)
      );
    });
  }, [busca, questionarios]);

  const carregarQuestionarios = async () => {
    if (!podeVisualizarQuestionarios) return;

    setCarregandoLista(true);
    try {
      const response = await listarQuestionarios();
      // O response já é o array de dados diretamente, não response.data
      const dados = Array.isArray(response) ? response : (response.data || []);
      const dadosConvertidos = dados.map(item => ({
        id: item.id,
        setor: item.setor,
        subarea: item.subarea || "",
        responsavelEntrevista: item.responsavel_entrevista,
        participantes: item.participantes,
        data: item.data_entrevista,
        principaisProcessos: item.principais_processos,
        atividadesFrequencia: item.atividades_frequencia,
        informacoesConsultadas: item.informacoes_consultadas,
        sistemasUtilizados: item.sistemas_utilizados,
        multiplasFontes: item.multiplas_fontes,
        atividadesManuaisRetrabalho: item.atividades_manuais_retrabalho,
        errosPerdaTempo: item.erros_perda_tempo,
        dependenciaOutroSetor: item.dependencia_outro_setor,
        relatoriosIndicadores: item.relatorios_indicadores,
        melhoriasImpacto: item.melhorias_impacto,
        consideracoesFinais: item.consideracoes_finais,
      }));
      setQuestionarios(dadosConvertidos);
    } catch (error) {
      console.error('Erro ao carregar questionários:', error);
      enqueueSnackbar('Erro ao carregar lista de questionários', { variant: 'error' });
    } finally {
      setCarregandoLista(false);
    }
  };

  useEffect(() => {
    carregarQuestionarios();
  }, [podeVisualizarQuestionarios]);

  const salvarQuestionario = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;
    
    const dadosParaEnvio = {
      ...form,
      setor: form.subarea ? `${form.setor} - ${form.subarea}` : form.setor
    };
    
    // Remove subarea do envio se não for necessário
    delete dadosParaEnvio.subarea;
    
    setSubmitting(true);
    try {
      if (editandoId) {
        await atualizarQuestionario(editandoId, dadosParaEnvio);
        enqueueSnackbar('Questionário atualizado com sucesso.', { variant: 'success' });
      } else {
        await enviarQuestionario(dadosParaEnvio);
        enqueueSnackbar('Questionário enviado com sucesso.', { variant: 'success' });
      }
      await carregarQuestionarios();
      limparFormulario();
    } catch (error) {
      console.error('Erro ao salvar:', error);
      enqueueSnackbar(error.response?.data?.message || 'Erro ao salvar questionário', { variant: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const editarQuestionario = (item) => {
    let setorOriginal = item.setor;
    let subareaOriginal = item.subarea || "";
    
    if (!subareaOriginal && setorOriginal.includes(" - ")) {
      const partes = setorOriginal.split(" - ");
      setorOriginal = partes[0];
      subareaOriginal = partes.slice(1).join(" - ");
    }
    
    setForm({
      setor: setorOriginal || "",
      subarea: subareaOriginal || "",
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
    setFormVisible(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const confirmarExclusao = async () => {
    if (!modalExcluir) return;
    
    setLoading(true);
    try {
      await excluirQuestionario(modalExcluir.id);
      enqueueSnackbar('Questionário excluído com sucesso.', { variant: 'success' });
      await carregarQuestionarios();
      setModalExcluir(null);
    } catch (error) {
      console.error('Erro ao excluir:', error);
      enqueueSnackbar('Erro ao excluir questionário', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const formatarData = (data) => {
    if (!data) return "-";
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
  };

  const exibirSetorCompleto = (item) => {
    return item.subarea ? `${item.setor} - ${item.subarea}` : item.setor;
  };

  // Botão de enviar/submit reutilizável
  const SubmitButton = () => (
    <S.PrimaryButton type="submit" disabled={submitting}>
      {submitting ? <S.SpinnerIcon as={FaSpinner} /> : <FaSave />}
      {submitting ? "Salvando..." : (editandoId ? "Salvar alterações" : "Enviar questionário")}
    </S.PrimaryButton>
  );

  return (
    <PageLayout
      title="Questionários"
      subtitle="Cadastro de respostas para mapear processos, gargalos, oportunidades de automação e melhorias operacionais."
    >
      <S.PageContainer>
        <S.Header>
          <S.HeaderContent>
            <S.HeaderTag>
              <FaClipboardList />
              Levantamento de Processos
            </S.HeaderTag>
            <S.HeaderTitle>Questionários</S.HeaderTitle>
            <S.HeaderSubtitle>
              Cadastro de respostas para mapear processos, gargalos, oportunidades
              de automação e melhorias operacionais.
            </S.HeaderSubtitle>
          </S.HeaderContent>
          {!formVisible && !editandoId && (
            <S.NewButton onClick={() => setFormVisible(true)}>
              <FaPlus />
              Novo Questionário
            </S.NewButton>
          )}
        </S.Header>

        {(formVisible || editandoId) && (
          <S.Form onSubmit={salvarQuestionario}>
            <S.FormTitleRow>
              <div>
                <h2>{editandoId ? "Editar questionário" : "Novo questionário"}</h2>
                <p>Campos com * são obrigatórios.</p>
              </div>
              <S.FormActionsTop>
                {editandoId && (
                  <S.SecondaryButton type="button" onClick={limparFormulario}>
                    <FaTimes />
                    Cancelar edição
                  </S.SecondaryButton>
                )}
                {!editandoId && (
                  <S.SecondaryButton type="button" onClick={limparFormulario}>
                    <FaTimes />
                    Cancelar
                  </S.SecondaryButton>
                )}
                <SubmitButton />
              </S.FormActionsTop>
            </S.FormTitleRow>

            <S.Card>
              <h3>1. Identificação</h3>
              <S.FormGrid>
                <S.FormGroup>
                  <label>Setor *</label>
                  <S.StyledSelect
                    name="setor"
                    value={form.setor}
                    onChange={handleSetorChange}
                    required
                  >
                    <option value="">Selecione um setor</option>
                    {setorOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </S.StyledSelect>
                </S.FormGroup>

                {hasSubareas(form.setor) && (
                  <S.FormGroup>
                    <label>Subárea *</label>
                    <S.StyledSelect
                      name="subarea"
                      value={form.subarea}
                      onChange={handleSubareaChange}
                      required
                    >
                      <option value="">Selecione uma subárea</option>
                      {getSubareas(form.setor).map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </S.StyledSelect>
                  </S.FormGroup>
                )}

                <S.FormGroup>
                  <label>Responsável pela entrevista *</label>
                  <input
                    type="text"
                    name="responsavelEntrevista"
                    value={form.responsavelEntrevista}
                    onChange={handleChange}
                    placeholder="Nome do responsável"
                    required
                  />
                </S.FormGroup>

                <S.FormGroup>
                  <label>Participantes</label>
                  <input
                    type="text"
                    name="participantes"
                    value={form.participantes}
                    onChange={handleChange}
                    placeholder="Participantes da entrevista"
                  />
                </S.FormGroup>

                <S.FormGroup>
                  <label>Data *</label>
                  <input
                    type="date"
                    name="data"
                    value={form.data}
                    onChange={handleChange}
                    required
                  />
                </S.FormGroup>
              </S.FormGrid>
            </S.Card>

            <QuestionarioBloco
              titulo="2. Processos"
              perguntas={[
                { label: "Quais são os principais processos executados pelo setor? *", name: "principaisProcessos", required: true },
                { label: "Quais atividades são feitas com frequência diária, semanal ou mensal?", name: "atividadesFrequencia" },
                { label: "Quais informações o setor mais precisa consultar?", name: "informacoesConsultadas" },
              ]}
              form={form}
              onChange={handleChange}
            />

            <QuestionarioBloco
              titulo="3. Sistemas"
              perguntas={[
                { label: "Quais sistemas, planilhas ou ferramentas são usados hoje? *", name: "sistemasUtilizados", required: true },
                { label: "Existe necessidade de consultar mais de uma fonte para concluir uma atividade?", name: "multiplasFontes" },
              ]}
              form={form}
              onChange={handleChange}
            />

            <QuestionarioBloco
              titulo="4. Gargalos"
              perguntas={[
                { label: "Quais atividades são manuais, repetitivas ou geram retrabalho? *", name: "atividadesManuaisRetrabalho", required: true },
                { label: "Onde acontecem mais erros, inconsistências ou perda de tempo?", name: "errosPerdaTempo" },
                { label: "Quais processos dependem de outro setor?", name: "dependenciaOutroSetor" },
              ]}
              form={form}
              onChange={handleChange}
            />

            <QuestionarioBloco
              titulo="5. Gestão e Melhoria"
              perguntas={[
                { label: "Quais relatórios, indicadores ou dashboards seriam úteis?", name: "relatoriosIndicadores" },
                { label: "O que poderia ser automatizado, simplificado ou melhorado com maior impacto? *", name: "melhoriasImpacto", required: true },
              ]}
              form={form}
              onChange={handleChange}
            />

            <S.Card>
              <h3>Considerações Finais</h3>
              <S.FormGroup>
                <label>Sugestões adicionais ou oportunidades não citadas</label>
                <textarea
                  name="consideracoesFinais"
                  value={form.consideracoesFinais}
                  onChange={handleChange}
                  placeholder="Digite as considerações finais..."
                />
              </S.FormGroup>
            </S.Card>

            {/* Botão enviar no rodapé */}
            <S.FormFooter>
              <SubmitButton />
            </S.FormFooter>
          </S.Form>
        )}

        {podeVisualizarQuestionarios && (
          <S.ListSection>
            <S.ListHeader>
              <div>
                <h2>Respostas cadastradas</h2>
                <p>Consulte, edite ou exclua respostas já registradas.</p>
              </div>
              <S.SearchBox>
                <FaSearch />
                <input
                  type="text"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="Buscar por setor, responsável ou participante"
                />
              </S.SearchBox>
            </S.ListHeader>

            {carregandoLista ? (
              <S.EmptyState>
                <FaSpinner style={{ animation: 'spin 0.6s linear infinite' }} />
                <h3>Carregando...</h3>
              </S.EmptyState>
            ) : questionariosFiltrados.length === 0 ? (
              <S.EmptyState>
                <FaClipboardList />
                <h3>Nenhum questionário encontrado</h3>
                <p>
                  {!formVisible && !editandoId ? (
                    <>Clique em "Novo Questionário" para começar.</>
                  ) : (
                    "Cadastre a primeira resposta usando o formulário acima."
                  )}
                </p>
              </S.EmptyState>
            ) : (
              <S.TableWrapper>
                <S.Table>
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
                        <td>{exibirSetorCompleto(item)}</td>
                        <td>{item.responsavelEntrevista}</td>
                        <td>{item.participantes || "-"}</td>
                        <td>{formatarData(item.data)}</td>
                        <td>
                          <S.ActionsCell>
                            <S.ViewIconButton
                              type="button"
                              onClick={() => setVisualizando(item)}
                              title="Visualizar"
                            >
                              <FaEye />
                            </S.ViewIconButton>
                            <S.EditIconButton
                              type="button"
                              onClick={() => editarQuestionario(item)}
                              title="Editar"
                            >
                              <FaEdit />
                            </S.EditIconButton>
                            <S.DeleteIconButton
                              type="button"
                              onClick={() => setModalExcluir(item)}
                              title="Excluir"
                            >
                              <FaTrash />
                            </S.DeleteIconButton>
                          </S.ActionsCell>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </S.Table>
              </S.TableWrapper>
            )}
          </S.ListSection>
        )}

        {/* Modais... */}
        {modalExcluir && (
          <S.ModalOverlay>
            <S.ModalCardSmall>
              <h2>Excluir questionário?</h2>
              <p>
                Tem certeza que deseja excluir o questionário do setor{" "}
                <strong>{exibirSetorCompleto(modalExcluir)}</strong>?
              </p>
              <S.ModalActions>
                <S.SecondaryButton type="button" onClick={() => setModalExcluir(null)}>
                  Cancelar
                </S.SecondaryButton>
                <S.DangerButton type="button" onClick={confirmarExclusao} disabled={loading}>
                  {loading ? <S.SpinnerIcon as={FaSpinner} /> : <FaTrash />}
                  Excluir
                </S.DangerButton>
              </S.ModalActions>
            </S.ModalCardSmall>
          </S.ModalOverlay>
        )}

        {visualizando && (
          <S.ModalOverlay>
            <S.ModalCard>
              <S.ModalHeader>
                <div>
                  <h2>Visualizar questionário</h2>
                  <p>
                    {exibirSetorCompleto(visualizando)} — {formatarData(visualizando.data)}
                  </p>
                </div>
                <S.ModalCloseButton onClick={() => setVisualizando(null)}>
                  <FaTimes />
                </S.ModalCloseButton>
              </S.ModalHeader>
              <S.ModalContent>
                <ResumoItem titulo="Responsável" valor={visualizando.responsavelEntrevista} />
                <ResumoItem titulo="Participantes" valor={visualizando.participantes} />
                <ResumoItem titulo="Principais processos" valor={visualizando.principaisProcessos} />
                <ResumoItem titulo="Atividades por frequência" valor={visualizando.atividadesFrequencia} />
                <ResumoItem titulo="Informações consultadas" valor={visualizando.informacoesConsultadas} />
                <ResumoItem titulo="Sistemas utilizados" valor={visualizando.sistemasUtilizados} />
                <ResumoItem titulo="Consulta em múltiplas fontes" valor={visualizando.multiplasFontes} />
                <ResumoItem titulo="Atividades manuais, repetitivas ou retrabalho" valor={visualizando.atividadesManuaisRetrabalho} />
                <ResumoItem titulo="Erros, inconsistências ou perda de tempo" valor={visualizando.errosPerdaTempo} />
                <ResumoItem titulo="Dependência de outro setor" valor={visualizando.dependenciaOutroSetor} />
                <ResumoItem titulo="Relatórios, indicadores ou dashboards" valor={visualizando.relatoriosIndicadores} />
                <ResumoItem titulo="Automatização, simplificação ou melhoria" valor={visualizando.melhoriasImpacto} />
                <ResumoItem titulo="Considerações finais" valor={visualizando.consideracoesFinais} />
              </S.ModalContent>
            </S.ModalCard>
          </S.ModalOverlay>
        )}
      </S.PageContainer>
    </PageLayout>
  );
}

export default Questionarios;