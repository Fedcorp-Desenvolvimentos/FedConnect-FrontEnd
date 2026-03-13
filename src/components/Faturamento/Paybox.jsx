import { useEffect, useMemo, useRef, useState } from "react";
import "../styles/Paybox.css";

const STORAGE_KEY = "paybox_historico";

const MODELOS = {
  TRADICIONAL: "tradicional",
  BBZ: "bbz",
};

export default function Paybox() {
  const [modelo, setModelo] = useState(MODELOS.TRADICIONAL);
  const [numeroFatura, setNumeroFatura] = useState("");
  const [numeroNotaFiscal, setNumeroNotaFiscal] = useState("");
  const [erro, setErro] = useState("");
  const [historico, setHistorico] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    try {
      const historicoSalvo = localStorage.getItem(STORAGE_KEY);

      if (historicoSalvo) {
        setHistorico(JSON.parse(historicoSalvo));
      }
    } catch (error) {
      console.error("Erro ao carregar histórico:", error);
    }
  }, []);

  const onlyDigits = (value) => value.replace(/\D/g, "");

  const podeGerar =
    numeroFatura.trim().length > 0 && numeroNotaFiscal.trim().length > 0;

  const payload = useMemo(() => {
    const agora = new Date();
    const ano = String(agora.getFullYear());
    const mes = String(agora.getMonth() + 1).padStart(2, "0");

    return [
      {
        _meta_modelo: modelo,
        ano,
        mes,
        condominio: "",
        razao_social: "",
        valor: 0,
        vencimento: "",
        nro_banco: "",
        produto: "",
        linha_digital: "",
        cnpj_fornecedor: "",
        cnpj_condominio: "",
        cnpj_administradora: "",
        codigo_efetivo: "00",
        valor_total_nf: 0,
        vr_irrf: "0.00",
        vr_iss: "0.00",
        vr_inss: "0.00",
        vr_csll_pis_cofins: "0.00",
        vr_desconto: "0.00",
        nf_venda: false,
        data_emissao_nf: "",
        nro_nf: numeroNotaFiscal.trim(),
        csll: "0.00",
        pis: "0.00",
        cofins: "0.00",
        nro_documento: numeroFatura.trim(),
        nro_comprovante: numeroFatura.trim(),
        tipo_inscr_condo: "",
        tipo_inscr_fornec: "",
        URL: [
          {
            url: "",
          },
        ],
      },
    ];
  }, [modelo, numeroFatura, numeroNotaFiscal]);

  function salvarHistorico(novoItem) {
    const atualizado = [novoItem, ...historico];
    setHistorico(atualizado);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(atualizado));
  }

  function gerarJson() {
    setErro("");

    if (!podeGerar) {
      setErro("Preencha o número da fatura e da nota fiscal.");
      return;
    }

    const fatura = numeroFatura.trim();
    const nf = numeroNotaFiscal.trim();

    const json = JSON.stringify(payload, null, 2);
    const blob = new Blob([json], {
      type: "application/json;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `paybox_${modelo}_fatura-${fatura}_nf-${nf}.json`;
    link.click();

    URL.revokeObjectURL(url);

    salvarHistorico({
      id: Date.now(),
      tipo: "geracao",
      data: new Date().toISOString(),
      modelo,
      numero_fatura: fatura,
      numero_nota_fiscal: nf,
      origem: "Fed Connect",
    });
  }

  function abrirSeletorArquivo() {
    setErro("");
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }

  function validarJson(jsonImportado) {
    if (!Array.isArray(jsonImportado) || jsonImportado.length === 0) {
      return false;
    }

    const item = jsonImportado[0];

    return (
      item &&
      typeof item === "object" &&
      typeof item.nro_nf !== "undefined" &&
      typeof item.nro_documento !== "undefined"
    );
  }

  function importarJson(event) {
    setErro("");

    const arquivo = event.target.files?.[0];
    if (!arquivo) return;

    if (!arquivo.name.toLowerCase().endsWith(".json")) {
      setErro("Selecione um arquivo JSON válido.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const conteudo = e.target?.result;
        const jsonImportado = JSON.parse(conteudo);

        if (!validarJson(jsonImportado)) {
          setErro("O JSON não possui a estrutura esperada.");
          event.target.value = "";
          return;
        }

        const item = jsonImportado[0];

        const fatura = onlyDigits(String(item.nro_documento || ""));
        const nf = onlyDigits(String(item.nro_nf || ""));
        const modeloImportado =
          item._meta_modelo === MODELOS.BBZ
            ? MODELOS.BBZ
            : MODELOS.TRADICIONAL;

        setModelo(modeloImportado);
        setNumeroFatura(fatura);
        setNumeroNotaFiscal(nf);

        salvarHistorico({
          id: Date.now(),
          tipo: "importacao",
          data: new Date().toISOString(),
          modelo: modeloImportado,
          numero_fatura: fatura,
          numero_nota_fiscal: nf,
          origem: "Arquivo importado",
          nome_arquivo: arquivo.name,
        });
      } catch (error) {
        console.error(error);
        setErro("Não foi possível ler o arquivo JSON.");
      } finally {
        event.target.value = "";
      }
    };

    reader.onerror = () => {
      setErro("Erro ao ler o arquivo.");
      event.target.value = "";
    };

    reader.readAsText(arquivo, "utf-8");
  }

  function limparHistorico() {
    localStorage.removeItem(STORAGE_KEY);
    setHistorico([]);
  }

  function formatarData(data) {
    if (!data) return "-";

    return new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(data));
  }

  return (
    <div className="page-container">
      <div className="paybox-card">
        <div className="paybox-content">
          <h2 className="title-card">
            <i className="bi bi-tools"></i> Gerar JSON – Paybox
          </h2>

          <p className="subtitle">
            Informe os dados abaixo para gerar ou importar o arquivo de envio.
          </p>

          <div className="field field-modelo">
            <label htmlFor="modeloPaybox">Modelo do JSON</label>
            <select
              id="modeloPaybox"
              value={modelo}
              onChange={(e) => setModelo(e.target.value)}
            >
              <option value={MODELOS.TRADICIONAL}>Tradicional</option>
              <option value={MODELOS.BBZ}>BBZ</option>
            </select>
          </div>

          <div className="paybox-form">
            <div className="field">
              <label htmlFor="numeroFatura">
                Número do documento / comprovante
              </label>
              <input
                id="numeroFatura"
                type="text"
                value={numeroFatura}
                onChange={(e) => setNumeroFatura(onlyDigits(e.target.value))}
                placeholder="Ex: 0001462096"
                inputMode="numeric"
                autoComplete="off"
              />
            </div>

            <div className="field">
              <label htmlFor="numeroNotaFiscal">Número da nota fiscal</label>
              <input
                id="numeroNotaFiscal"
                type="text"
                value={numeroNotaFiscal}
                onChange={(e) => setNumeroNotaFiscal(onlyDigits(e.target.value))}
                placeholder="Ex: 172515"
                inputMode="numeric"
                autoComplete="off"
              />
            </div>
          </div>

          {erro && <div className="error">{erro}</div>}

          <div className="actions actions-center">
            <button type="button" disabled={!podeGerar} onClick={gerarJson}>
              Gerar e baixar JSON
            </button>

            <button
              type="button"
              className="btn-json"
              onClick={abrirSeletorArquivo}
            >
              Importar JSON
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              style={{ display: "none" }}
              onChange={importarJson}
            />
          </div>

          <div className="paybox-history">
            <div className="history-header">
              <h3>Histórico</h3>

              {historico.length > 0 && (
                <button
                  type="button"
                  className="btn-clear-history"
                  onClick={limparHistorico}
                >
                  Limpar histórico
                </button>
              )}
            </div>

            {historico.length === 0 ? (
              <p className="history-empty">
                Nenhuma geração ou importação realizada até o momento.
              </p>
            ) : (
              <div className="history-list">
                {historico.map((item) => (
                  <div key={item.id} className="history-item">
                    <div className="history-item-top">
                      <span className={`badge ${item.tipo}`}>
                        {item.tipo === "geracao" ? "Geração" : "Importação"}
                      </span>

                      <span className="history-date">
                        {formatarData(item.data)}
                      </span>
                    </div>

                    <div className="history-item-body">
                      <p>
                        <strong>Modelo:</strong>{" "}
                        {item.modelo === MODELOS.BBZ ? "BBZ" : "Tradicional"}
                      </p>

                      <p>
                        <strong>Documento:</strong> {item.numero_fatura}
                      </p>

                      <p>
                        <strong>Nota fiscal:</strong> {item.numero_nota_fiscal}
                      </p>

                      <p>
                        <strong>Origem:</strong> {item.origem}
                      </p>

                      {item.nome_arquivo && (
                        <p>
                          <strong>Arquivo:</strong> {item.nome_arquivo}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}