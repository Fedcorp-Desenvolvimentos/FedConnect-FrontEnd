import { useEffect, useMemo, useRef, useState } from "react";
import { parseISO, format } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import {
  FaCheckCircle,
  FaDownload,
  FaExclamationTriangle,
  FaFileExcel,
  FaTimes,
} from "react-icons/fa";
import { listarAdministradoras } from "../../../../services/vistoriasService";
import CursoCipaService from "../../../../services/cursoCipaService";
import { ORDEM_LOCAIS } from "../hooks/useCursoCipa";
import lerPlanilhaInscritos from "../lerPlanilhaInscritos";
import * as S from "../CursoCipaStyles";

/**
 * Criação da turma a partir de uma planilha de inscritos.
 *
 * A planilha traz só as pessoas: local e data são escolhidos aqui, porque data
 * em célula é o erro mais caro de achar depois. A leitura é local e o resultado
 * aparece linha a linha antes de qualquer gravação — quem decide é o operador.
 *
 * Se a planilha tem mais gente do que o local comporta, nada é enviado: deixar
 * a ordem das linhas escolher quem fica de fora do curso não é decisão de
 * software.
 */
export default function ImportarPlanilhaModal({
  aberto,
  dataInicial,
  locais,
  salvando,
  onImportar,
  onFechar,
}) {
  const [local, setLocal] = useState(ORDEM_LOCAIS[0]);
  const [data, setData] = useState("");
  const [observacao, setObservacao] = useState("");
  const [administradoras, setAdministradoras] = useState([]);
  const [carregandoAdms, setCarregandoAdms] = useState(false);
  const [arquivo, setArquivo] = useState(null);
  const [leitura, setLeitura] = useState(null);
  const [erroLeitura, setErroLeitura] = useState("");
  const [lendo, setLendo] = useState(false);
  const inputArquivo = useRef(null);

  useEffect(() => {
    if (!aberto) return;
    setLocal(ORDEM_LOCAIS[0]);
    setData(dataInicial || "");
    setObservacao("");
    setArquivo(null);
    setLeitura(null);
    setErroLeitura("");
  }, [aberto, dataInicial]);

  // A administradora de cada linha tem de existir na base: é o código que o
  // backend grava, e a planilha só traz o nome.
  useEffect(() => {
    if (!aberto || administradoras.length) return;
    setCarregandoAdms(true);
    listarAdministradoras()
      .then((resposta) => {
        setAdministradoras(
          resposta?.sucesso
            ? (resposta.data || []).map((item) => ({
                nome: item.nome,
                codigo: String(item.pessoa),
              }))
            : []
        );
      })
      .catch(() => setAdministradoras([]))
      .finally(() => setCarregandoAdms(false));
  }, [aberto, administradoras.length]);

  const capacidade = useMemo(
    () => locais.find((item) => item.codigo === local)?.capacidade,
    [locais, local]
  );

  const invalidas = leitura?.linhas.filter((linha) => !linha.valida) || [];
  const excedeCapacidade =
    Boolean(leitura) && capacidade && leitura.validas.length > capacidade;

  const podeImportar =
    Boolean(local) &&
    Boolean(data) &&
    leitura?.validas.length > 0 &&
    !excedeCapacidade &&
    !salvando;

  const escolherArquivo = async (evento) => {
    const escolhido = evento.target.files?.[0];
    evento.target.value = ""; // permite reenviar o mesmo arquivo depois de corrigir
    if (!escolhido) return;

    setArquivo(escolhido);
    setLeitura(null);
    setErroLeitura("");
    setLendo(true);
    try {
      const resultado = await lerPlanilhaInscritos(escolhido, { administradoras });
      setLeitura(resultado);
      if (resultado.colunasFaltando.length) {
        setErroLeitura(
          `A planilha não tem ${
            resultado.colunasFaltando.length === 1 ? "a coluna" : "as colunas"
          } ${resultado.colunasFaltando.join(", ")}. Baixe o modelo e use os mesmos cabeçalhos.`
        );
      } else if (resultado.totalLinhas === 0) {
        setErroLeitura("A planilha não tem nenhuma linha preenchida.");
      }
    } catch {
      setErroLeitura(
        "Não foi possível ler o arquivo. Envie um .xlsx ou .csv no formato do modelo."
      );
    } finally {
      setLendo(false);
    }
  };

  const baixarModelo = async () => {
    try {
      const blob = await CursoCipaService.baixarPlanilhaModelo();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "modelo-inscritos-cipa.xlsx";
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      setErroLeitura("Não foi possível baixar o modelo agora.");
    }
  };

  const submeter = (evento) => {
    evento.preventDefault();
    if (!podeImportar) return;
    onImportar({ local, data, observacao, inscricoes: leitura.validas });
  };

  if (!aberto) return null;

  return (
    <S.Overlay onClick={onFechar}>
      <S.Modal $largo onClick={(evento) => evento.stopPropagation()}>
        <S.ModalHeader>
          <div>
            <h2>Criar turma por planilha</h2>
            <p>
              Escolha o local e o dia, anexe a planilha de inscritos e confira antes
              de gravar
            </p>
          </div>
          <S.FecharButton type="button" onClick={onFechar} aria-label="Fechar">
            <FaTimes />
          </S.FecharButton>
        </S.ModalHeader>

        <form onSubmit={submeter}>
          <S.Linha>
            <S.Campo>
              Local
              <select value={local} onChange={(e) => setLocal(e.target.value)}>
                {ORDEM_LOCAIS.map((codigo) => {
                  const item = locais.find((l) => l.codigo === codigo);
                  return (
                    <option key={codigo} value={codigo}>
                      {item ? `${item.nome} · ${item.capacidade} lugares` : codigo}
                    </option>
                  );
                })}
              </select>
            </S.Campo>
            <S.Campo>
              Data
              <input
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
              />
            </S.Campo>
            <S.Campo>
              Observação
              <input
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                placeholder="Opcional"
              />
            </S.Campo>
          </S.Linha>

          <S.AreaPlanilha>
            <div>
              <strong>
                <FaFileExcel size={12} /> Planilha de inscritos
              </strong>
              <p>
                Colunas: administradora, condomínio, nome, CPF e função
                (obrigatórias), e-mail e telefone (opcionais). O nome da
                administradora precisa ser o mesmo da base da companhia.
              </p>
            </div>
            <S.AcoesPlanilha>
              <S.Botao type="button" $variante="secundario" onClick={baixarModelo}>
                <FaDownload size={11} /> Baixar modelo
              </S.Botao>
              <S.Botao
                type="button"
                onClick={() => inputArquivo.current?.click()}
                disabled={carregandoAdms || lendo}
              >
                {arquivo ? "Trocar arquivo" : "Escolher arquivo"}
              </S.Botao>
              <input
                ref={inputArquivo}
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={escolherArquivo}
                hidden
              />
            </S.AcoesPlanilha>
          </S.AreaPlanilha>

          {arquivo && (
            <S.NomeArquivo>
              {arquivo.name}
              {lendo && " · lendo..."}
            </S.NomeArquivo>
          )}

          {erroLeitura && (
            <S.AvisoBloco $tom="erro">
              <FaExclamationTriangle size={11} />
              {erroLeitura}
            </S.AvisoBloco>
          )}

          {leitura && !erroLeitura && (
            <>
              <S.ResumoImportacao>
                <span className="ok">
                  <FaCheckCircle size={11} /> {leitura.validas.length} de{" "}
                  {leitura.totalLinhas}{" "}
                  {leitura.totalLinhas === 1 ? "linha entra" : "linhas entram"}
                </span>
                {invalidas.length > 0 && (
                  <span className="erro">
                    <FaExclamationTriangle size={11} /> {invalidas.length} com
                    problema
                  </span>
                )}
                {capacidade && (
                  <span>
                    {capacidade} {capacidade === 1 ? "vaga" : "vagas"} no local
                  </span>
                )}
              </S.ResumoImportacao>

              {excedeCapacidade && (
                <S.AvisoBloco $tom="erro">
                  <FaExclamationTriangle size={11} />
                  A planilha tem {leitura.validas.length} pessoas válidas e o local
                  comporta {capacidade}: sobram {leitura.validas.length - capacidade}.
                  Tire gente da planilha ou use outra data — nada foi importado.
                </S.AvisoBloco>
              )}

              {invalidas.length > 0 && !excedeCapacidade && (
                <S.AvisoBloco $tom="aviso">
                  <FaExclamationTriangle size={11} />
                  As linhas com problema ficam de fora. Dá para importar só as
                  válidas agora, ou corrigir a planilha e escolher o arquivo de novo.
                </S.AvisoBloco>
              )}

              <S.Tabela>
                <thead>
                  <tr>
                    <th>Linha</th>
                    <th>Nome</th>
                    <th>CPF</th>
                    <th>Condomínio</th>
                    <th>Administradora</th>
                    <th>Situação</th>
                  </tr>
                </thead>
                <tbody>
                  {leitura.linhas.map((linha) => (
                    <tr key={linha.numero} data-invalida={!linha.valida}>
                      <td className="numero">{linha.numero}</td>
                      <td>{linha.exibicao.nome || "—"}</td>
                      <td className="numero">{linha.exibicao.cpf || "—"}</td>
                      <td>{linha.exibicao.condominio || "—"}</td>
                      <td>{linha.exibicao.administradora || "—"}</td>
                      <td>
                        {linha.valida ? (
                          <S.Selo $tom="ok">entra</S.Selo>
                        ) : (
                          <S.Selo $tom="erro" title={linha.erros.join(" · ")}>
                            {linha.erros[0]}
                            {linha.erros.length > 1
                              ? ` (+${linha.erros.length - 1})`
                              : ""}
                          </S.Selo>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </S.Tabela>
            </>
          )}

          <S.Acoes>
            <S.Botao type="button" $variante="secundario" onClick={onFechar}>
              Cancelar
            </S.Botao>
            <S.Botao type="submit" disabled={!podeImportar}>
              {salvando
                ? "Importando..."
                : leitura?.validas.length
                ? `Criar turma com ${leitura.validas.length} ${
                    leitura.validas.length === 1 ? "inscrito" : "inscritos"
                  }`
                : "Criar turma"}
            </S.Botao>
          </S.Acoes>
        </form>
      </S.Modal>
    </S.Overlay>
  );
}
