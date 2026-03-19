import { useMemo, useState } from "react";
import "../../styles/Paybox.css";

export default function Paybox() {
  const [numeroFatura, setNumeroFatura] = useState("");
  const [numeroNotaFiscal, setNumeroNotaFiscal] = useState("");
  const [erro, setErro] = useState("");

  const payload = useMemo(
    () => ({
      paybox: {
        numero_fatura: numeroFatura.trim(),
        numero_nota_fiscal: numeroNotaFiscal.trim(),
      },
      meta: {
        gerado_em: new Date().toISOString(),
        origem: "Fed Connect",
      },
    }),
    [numeroFatura, numeroNotaFiscal]
  );

  const podeGerar =
    numeroFatura.trim().length > 0 && numeroNotaFiscal.trim().length > 0;

  const onlyDigits = (value) => value.replace(/\D/g, "");

  function gerarJson() {
    setErro("");

    if (!podeGerar) {
      setErro("Preencha o número da fatura e da nota fiscal.");
      return;
    }

    const fatura = numeroFatura.trim();
    const nf = numeroNotaFiscal.trim();

    const json = JSON.stringify(payload, null, 2);
    const blob = new Blob([json], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `paybox_fatura-${fatura}_nf-${nf}.json`;
    link.click();

    URL.revokeObjectURL(url);
  }

  return (
    <div className="page-container">
      <div className="paybox-card">
        <div className="paybox-content">
          <h2 className="title-card"><i className="bi bi-tools"></i> Gerar JSON – Paybox</h2>
          <p className="subtitle">
            Informe os dados abaixo para gerar o arquivo de envio.
          </p>

          <div className="paybox-form">
            <div className="field">
              <label htmlFor="numeroFatura">Número da fatura</label>
              <input
                id="numeroFatura"
                type="text"
                value={numeroFatura}
                onChange={(e) => setNumeroFatura(onlyDigits(e.target.value))}
                placeholder="Ex: 123456"
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
                placeholder="Ex: 987654"
                inputMode="numeric"
                autoComplete="off"
              />
            </div>
          </div>

          {erro && <div className="error">{erro}</div>}

          <div className="actions actions-center">
            <button disabled={!podeGerar} onClick={gerarJson}>
              Gerar e baixar JSON
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
