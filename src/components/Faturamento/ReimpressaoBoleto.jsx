import React, { useMemo, useState, useEffect, useRef } from "react";
import "../../styles/ConsultasHome.css";
import "../../styles/ReimpressaoBoleto.css";
import { impressWebhook } from "../../services/boletofedbnk";
import { ConsultaService } from "../../services/consultaService";

const PAGE_SIZE = 15;

const normalizeErrorMessage = (error) => {
  const status = error?.response?.status;
  const detail =
    error?.response?.data?.detail ||
    error?.response?.data?.message ||
    error?.response?.data?.error;

  if (status === 401 || status === 403) return "Você não tem permissão para realizar esta ação.";
  if (status === 404) return "Não encontramos dados para as informações informadas.";
  if (status === 408) return "Tempo de resposta excedido. Tente novamente.";
  if (status >= 500) return "Serviço indisponível no momento. Tente novamente mais tarde.";
  if (detail) return String(detail);

  if (error?.message?.toLowerCase?.().includes("network")) return "Falha de rede. Verifique sua conexão.";
  if (error?.message?.toLowerCase?.().includes("timeout")) return "Tempo de resposta excedido. Tente novamente.";

  return "Ocorreu um erro inesperado. Tente novamente.";
};

const buscarBoletosPorFatura = async (numeroFatura) => {
  const response = await ConsultaService.boletosFatura(numeroFatura);

  if (!Array.isArray(response)) {
    return { ok: false, data: [], reason: "formato_invalido" };
  }

  const mapped = response.map((item) => ({
    id: item.documento,
    numero_boleto: item.nosso_numero,
    valor: item.valor,
    fatura: item.fatura,
    status: item.stat,
    original: item,
  }));

  return { ok: true, data: mapped };
};

const ReimpressaoBoleto = () => {
  const [numeroFatura, setNumeroFatura] = useState("");
  const [numeroBoleto, setNumeroBoleto] = useState("");
  const [boletos, setBoletos] = useState([]);
  const [loading, setLoading] = useState(false);

  const [downloadingAll, setDownloadingAll] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);

  const [page, setPage] = useState(1);

  const [toast, setToast] = useState({ open: false, type: "info", text: "" });
  const toastTimerRef = useRef(null);

  const showToast = (type, text, durationMs) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);

    const duration =
      durationMs ??
      (type === "success" ? 3000 : type === "info" ? 4000 : 6000);

    setToast({ open: true, type, text });

    toastTimerRef.current = setTimeout(() => {
      setToast((t) => ({ ...t, open: false }));
    }, duration);
  };

  const closeToast = () => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast((t) => ({ ...t, open: false }));
  };

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const isAnyDownloading = downloadingAll || downloadingId !== null;

  const isRegistrado = (b) => {
    const id = b?.original?.identificador;
    return id !== null && id !== undefined && String(id).trim() !== "";
  };

  const boletosFiltrados = useMemo(() => {
    const termo = numeroBoleto.trim();
    const termoNorm = termo.replace(/\s/g, "");

    const boletosRegistrados = boletos.filter(isRegistrado);

    const filtrados = termo
      ? boletosRegistrados.filter((b) =>
          String(b.numero_boleto || "")
            .replace(/\s/g, "")
            .includes(termoNorm)
        )
      : boletosRegistrados;

    return [...filtrados].sort((a, b) => {
      const na = String(a.numero_boleto || "").replace(/\D/g, "");
      const nb = String(b.numero_boleto || "").replace(/\D/g, "");
      return na.localeCompare(nb, "pt-BR", { numeric: true });
    });
  }, [boletos, numeroBoleto]);

  useEffect(() => {
    setPage(1);
  }, [numeroBoleto]);

  const totalItems = boletosFiltrados.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const startIndex = (page - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;

  const boletosPaginados = useMemo(() => {
    return boletosFiltrados.slice(startIndex, endIndex);
  }, [boletosFiltrados, startIndex, endIndex]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const baixarBlobComoPdf = (pdfBlob, filename) => {
    if (!pdfBlob) throw new Error("arquivo_vazio");

    const blob =
      pdfBlob instanceof Blob ? pdfBlob : new Blob([pdfBlob], { type: "application/pdf" });

    if (!blob || blob.size === 0) throw new Error("arquivo_vazio");

    const oldLink = document.getElementById("temp-download-link");
    if (oldLink) document.body.removeChild(oldLink);

    const fileURL = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.id = "temp-download-link";
    link.href = fileURL;
    link.setAttribute("download", filename);
    link.style.display = "none";

    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      if (document.body.contains(link)) document.body.removeChild(link);
      window.URL.revokeObjectURL(fileURL);
    }, 250);
  };

  const handleBuscar = async (e) => {
    e.preventDefault();

    const fatura = numeroFatura.trim();
    if (!fatura) {
      showToast("error", "Informe o número da fatura.");
      return;
    }

    try {
      setLoading(true);
      setBoletos([]);
      setNumeroBoleto("");
      setPage(1);

      const result = await buscarBoletosPorFatura(fatura);

      if (!result.ok && result.reason === "formato_invalido") {
        showToast("error", "Retorno inválido do serviço de boletos. Acione o suporte (API).");
        return;
      }

      const lista = result.data;

      if (!lista?.length) {
        showToast("info", "Nenhum boleto disponível para essa fatura.");
        return;
      }

      setBoletos(lista);

      const registradosCount = (lista || []).filter(isRegistrado).length;

      if (registradosCount === 0) {
        showToast("info", "Nenhum boleto registrado disponível para reimpressão nessa fatura.");
      } else {
        showToast("success", `Boletos carregados: ${registradosCount} registrado(s) (de ${lista.length}).`);
      }
    } catch (err) {
      showToast("error", normalizeErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const reimprimirBoleto = async (boleto) => {
    if (!boleto?.numero_boleto) {
      showToast("error", "Número do boleto inválido para reimpressão.");
      return;
    }

    if (!isRegistrado(boleto)) {
      showToast("info", "Esse boleto não está registrado. Reimpressão indisponível.");
      return;
    }

    setDownloadingId(boleto.id);

    try {
      const payload = { number: boleto.numero_boleto, method: "boleto" };
      const pdfBlob = await impressWebhook(payload);

      baixarBlobComoPdf(pdfBlob, `boleto_${boleto.numero_boleto}.pdf`);
      showToast("success", `Download iniciado: boleto ${boleto.numero_boleto}.`, 3000);
    } catch (error) {
      const isEmpty = String(error?.message || "").includes("arquivo_vazio");
      showToast(
        "error",
        isEmpty
          ? "O boleto retornou vazio. Verifique o número e tente novamente."
          : normalizeErrorMessage(error)
      );
    } finally {
      setDownloadingId(null);
    }
  };

  const reimprimirTodos = async () => {
    if (!boletosFiltrados.length) {
      showToast("info", "Não há boletos registrados para reimprimir.");
      return;
    }

    const fatura = numeroFatura.trim();
    if (!fatura) {
      showToast("error", "Informe o número da fatura.");
      return;
    }

    setDownloadingAll(true);

    try {
      const payload = { number: fatura, method: "fatura" };
      const pdfBlob = await impressWebhook(payload);

      baixarBlobComoPdf(pdfBlob, `fatura_${fatura}.pdf`);
      showToast("success", `Download iniciado: fatura ${fatura} (boletos registrados).`, 3500);
    } catch (error) {
      const isEmpty = String(error?.message || "").includes("arquivo_vazio");
      showToast(
        "error",
        isEmpty
          ? "A fatura retornou vazia. Verifique o número e tente novamente."
          : normalizeErrorMessage(error)
      );
    } finally {
      setDownloadingAll(false);
    }
  };

  return (
    <div className="home-grid">
      {toast.open && (
        <div className={`rb-toast ${toast.type}`} role="status" aria-live="polite">
          <div className="rb-toast-icon">
            <i
              className={`bi ${
                toast.type === "success"
                  ? "bi-check-circle-fill"
                  : toast.type === "info"
                  ? "bi-info-circle-fill"
                  : "bi-exclamation-triangle-fill"
              }`}
            ></i>
          </div>

          <div className="rb-toast-text">{toast.text}</div>

          <button className="rb-toast-close" onClick={closeToast} type="button" aria-label="Fechar">
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
      )}

      <main>
        <div className="container02">
          <h1 className="consultas-title">
            <i className="bi bi-file-earmark-check-fill"></i> Reimpressão FedBnk
          </h1>

          <div className="rb-card">
            <form onSubmit={handleBuscar} className="rb-form">
              <div className="rb-row">
                <div className="rb-field">
                  <label>Número da Fatura</label>
                  <input
                    value={numeroFatura}
                    onChange={(e) => setNumeroFatura(e.target.value)}
                    placeholder="Digite o número da fatura"
                    autoComplete="off"
                    disabled={isAnyDownloading}
                  />
                </div>

                <button className="btn-primary" type="submit" disabled={loading || isAnyDownloading}>
                  {loading ? (
                    <>
                      <i className="bi bi-arrow-repeat rb-spin"></i> Buscando...
                    </>
                  ) : (
                    "Buscar"
                  )}
                </button>
              </div>

              <div className="rb-row">
                <div className="rb-field">
                  <label>Número do Boleto</label>
                  <input
                    value={numeroBoleto}
                    onChange={(e) => setNumeroBoleto(e.target.value)}
                    placeholder="Digite o número do boleto"
                    autoComplete="off"
                    disabled={isAnyDownloading || !boletos.length}
                  />
                </div>

                <button
                  className="btn-secondary"
                  type="button"
                  onClick={reimprimirTodos}
                  disabled={!boletosFiltrados.length || downloadingAll || downloadingId !== null}
                >
                  {downloadingAll ? (
                    <>
                      <i className="bi bi-arrow-repeat rb-spin"></i> Baixando...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-printer-fill"></i>{" "}
                      Reimprimir {numeroBoleto.trim() ? "filtrados" : "todos"}
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="rb-list">
              <h3 className="rb-subtitle">
                Boletos disponíveis{" "}
                {boletos.length ? `(${boletosFiltrados.length}/${boletos.length})` : ""}
              </h3>

              {boletos.length === 0 ? (
                <div className="rb-empty">Preencha as informações para listar os boletos.</div>
              ) : boletosFiltrados.length === 0 ? (
                <div className="rb-empty">
                  Nenhum boleto registrado disponível (ou nenhum bate com esse filtro).
                </div>
              ) : (
                <>
                  <table className="rb-table">
                    <thead>
                      <tr>
                        <th>Fatura</th>
                        <th>Nº Boleto</th>
                        <th>Documento</th>
                        <th>Registrado</th>
                        <th>Status (FINANC)</th>
                        <th>Valor</th>
                        <th>Ação</th>
                      </tr>
                    </thead>
                    <tbody>
                      {boletosPaginados.map((b) => {
                        const isRowDownloading = downloadingId === b.id;

                        return (
                          <tr key={b.id}>
                            <td>{b.original.fatura}</td>
                            <td className="rb-mono">{b.numero_boleto}</td>
                            <td>{b.original.documento}</td>
                            <td>{isRegistrado(b) ? "Sim" : "Não"}</td>
                            <td>{b.original.status === "C" ? "Cancelado" : "Ativo"}</td>
                            <td>
                              {typeof b.valor === "number"
                                ? b.valor.toLocaleString("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                  })
                                : b.valor}
                            </td>
                            <td>
                              <button
                                className="btn-primary rb-btn-print"
                                type="button"
                                onClick={() => reimprimirBoleto(b)}
                                disabled={downloadingAll || (downloadingId !== null && !isRowDownloading)}
                                title="Reimprimir boleto"
                              >
                                {isRowDownloading ? (
                                  <i className="bi bi-arrow-repeat rb-spin"></i>
                                ) : (
                                  <i className="bi bi-printer-fill"></i>
                                )}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  <div className="rb-pagination">
                    <button
                      className="rb-page-btn"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      type="button"
                    >
                      Anterior
                    </button>

                    <span className="rb-page-info">
                      Página {page} de {totalPages} • Total: {totalItems}
                    </span>

                    <button
                      className="rb-page-btn"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      type="button"
                    >
                      Próxima
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReimpressaoBoleto;
