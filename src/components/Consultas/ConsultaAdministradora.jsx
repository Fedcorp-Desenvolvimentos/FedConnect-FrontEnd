// src/consultas/ConsultaAdministradora.jsx
import React, { useMemo, useState } from "react";
import "../styles/ConsultaAdministradora.css";

import Loading from "../Loading/Loading";

// Crie/ajuste esse service conforme seus endpoints reais
import {
  consultarAdministradoraPorCnpj,
  getProdutosAtivosDaAdministradora,
  buscarCondominioPorNumeroFatura,
} from "../../services/consultaAdministradora";

export default function ConsultaAdministradora() {
  // helpers
  const onlyDigits = (v) => (v || "").toString().replace(/\D/g, "");

  // =========================
  // 1) CONSULTA POR CNPJ
  // =========================
  const [cnpj, setCnpj] = useState("");
  const [loadingCnpj, setLoadingCnpj] = useState(false);
  const [erroCnpj, setErroCnpj] = useState("");
  const [resultadoCnpj, setResultadoCnpj] = useState(null);

  const podeConsultarCnpj = useMemo(() => onlyDigits(cnpj).length === 14, [cnpj]);

  async function onConsultarCnpj(e) {
    e.preventDefault();
    setErroCnpj("");
    setResultadoCnpj(null);

    const cnpjLimpo = onlyDigits(cnpj);
    if (cnpjLimpo.length !== 14) {
      setErroCnpj("Informe um CNPJ válido (14 dígitos).");
      return;
    }

    try {
      setLoadingCnpj(true);
      const data = await consultarAdministradoraPorCnpj(cnpjLimpo);
      setResultadoCnpj(data);
    } catch (err) {
      setErroCnpj(err?.message || "Falha ao consultar CNPJ.");
    } finally {
      setLoadingCnpj(false);
    }
  }

  // =========================
  // 2) PRODUTOS ATIVOS
  // =========================
  const [admId, setAdmId] = useState("");
  const [loadingProdutos, setLoadingProdutos] = useState(false);
  const [erroProdutos, setErroProdutos] = useState("");
  const [produtosAtivos, setProdutosAtivos] = useState([]);

  const podeConsultarProdutos = useMemo(
    () => onlyDigits(admId).length > 0,
    [admId]
  );

  async function onConsultarProdutos(e) {
    e.preventDefault();
    setErroProdutos("");
    setProdutosAtivos([]);

    const idLimpo = onlyDigits(admId);
    if (!idLimpo) {
      setErroProdutos("Informe o código/ID da administradora.");
      return;
    }

    try {
      setLoadingProdutos(true);
      const data = await getProdutosAtivosDaAdministradora(idLimpo);
      // Aceita array direto ou { results: [] }
      const lista = Array.isArray(data) ? data : data?.results || [];
      setProdutosAtivos(lista);
    } catch (err) {
      setErroProdutos(err?.message || "Falha ao buscar produtos ativos.");
    } finally {
      setLoadingProdutos(false);
    }
  }

  // =========================
  // 3) CONDOMÍNIO POR FATURA
  // =========================
  const [numeroFatura, setNumeroFatura] = useState("");
  const [loadingFatura, setLoadingFatura] = useState(false);
  const [erroFatura, setErroFatura] = useState("");
  const [condominioFatura, setCondominioFatura] = useState(null);

  const podeBuscarFatura = useMemo(
    () => onlyDigits(numeroFatura).length > 0,
    [numeroFatura]
  );

  async function onBuscarPorFatura(e) {
    e.preventDefault();
    setErroFatura("");
    setCondominioFatura(null);

    const nf = onlyDigits(numeroFatura);
    if (!nf) {
      setErroFatura("Informe o número da fatura.");
      return;
    }

    try {
      setLoadingFatura(true);
      const data = await buscarCondominioPorNumeroFatura(nf);
      setCondominioFatura(data);
    } catch (err) {
      setErroFatura(err?.message || "Falha ao buscar condomínio pela fatura.");
    } finally {
      setLoadingFatura(false);
    }
  }

  // Render helpers
  const renderKV = (label, value) => (
    <div className="adm-kv">
      <span className="adm-k">{label}</span>
      <span className="adm-v">{value ?? "-"}</span>
    </div>
  );

  return (
    <div className="consulta-adm-page">
      <h1 className="consultas-title">
        <i className="bi bi-building"></i>
        Consulta Administradora
      </h1>

      <div className="adm-grid">
        {/* CARD 1 - CNPJ */}
        <section className="adm-card">
          <header className="adm-card-header">
            <h2>
              <i className="bi bi-search"></i> Consultar por CNPJ
            </h2>
            <p>Retorna dados de condomínio / administradora.</p>
          </header>

          <form className="adm-form" onSubmit={onConsultarCnpj}>
            <label className="adm-label">CNPJ</label>
            <input
              className="adm-input"
              value={cnpj}
              onChange={(e) => setCnpj(onlyDigits(e.target.value))}
              placeholder="Somente números (14 dígitos)"
              inputMode="numeric"
              maxLength={14}
            />

            <button className="adm-btn" disabled={!podeConsultarCnpj || loadingCnpj}>
              {loadingCnpj ? "Consultando..." : "Consultar"}
            </button>
          </form>

          {loadingCnpj && (
            <div className="adm-loading">
              <Loading />
            </div>
          )}

          {erroCnpj && <div className="adm-error">{erroCnpj}</div>}

          {resultadoCnpj && (
            <div className="adm-result">
              <h3>Resultado</h3>

              {/* Ajuste aqui para bater 100% com seu payload real */}
              {renderKV("Administradora", resultadoCnpj?.administradora?.nome || resultadoCnpj?.administradora)}
              {renderKV("Condomínio", resultadoCnpj?.condominio?.nome || resultadoCnpj?.condominio)}
              {renderKV("CNPJ", resultadoCnpj?.cnpj || onlyDigits(cnpj))}
              {renderKV("Situação", resultadoCnpj?.situacao)}
              {renderKV("Código/ID Adm", resultadoCnpj?.administradora?.id || resultadoCnpj?.administradora_id)}
            </div>
          )}
        </section>

        {/* CARD 2 - PRODUTOS ATIVOS */}
        <section className="adm-card">
          <header className="adm-card-header">
            <h2>
              <i className="bi bi-box-seam"></i> Produtos ativos
            </h2>
            <p>Busca os produtos ativos vinculados à administradora.</p>
          </header>

          <form className="adm-form" onSubmit={onConsultarProdutos}>
            <label className="adm-label">Código/ID da Administradora</label>
            <input
              className="adm-input"
              value={admId}
              onChange={(e) => setAdmId(onlyDigits(e.target.value))}
              placeholder="Ex: 123"
              inputMode="numeric"
            />

            <button
              className="adm-btn"
              disabled={!podeConsultarProdutos || loadingProdutos}
            >
              {loadingProdutos ? "Buscando..." : "Buscar produtos"}
            </button>
          </form>

          {loadingProdutos && (
            <div className="adm-loading">
              <Loading />
            </div>
          )}

          {erroProdutos && <div className="adm-error">{erroProdutos}</div>}

          {!loadingProdutos && !erroProdutos && produtosAtivos?.length > 0 && (
            <div className="adm-result">
              <h3>Produtos ativos ({produtosAtivos.length})</h3>

              <div className="adm-list">
                {produtosAtivos.map((p, idx) => (
                  <div className="adm-list-item" key={p?.id ?? `${idx}`}>
                    <div className="adm-list-title">
                      {p?.nome || p?.descricao || p?.produto || `Produto ${idx + 1}`}
                    </div>
                    <div className="adm-list-sub">
                      {p?.codigo ? `Código: ${p.codigo}` : null}
                      {p?.status ? ` • Status: ${p.status}` : null}
                      {p?.vigencia ? ` • Vigência: ${p.vigencia}` : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!loadingProdutos && !erroProdutos && produtosAtivos?.length === 0 && (
            <div className="adm-hint">Nenhum produto ativo retornado.</div>
          )}
        </section>

        {/* CARD 3 - CONDOMÍNIO POR FATURA */}
        <section className="adm-card">
          <header className="adm-card-header">
            <h2>
              <i className="bi bi-receipt"></i> Condomínio por fatura
            </h2>
            <p>Localiza o condomínio usando o número da fatura.</p>
          </header>

          <form className="adm-form" onSubmit={onBuscarPorFatura}>
            <label className="adm-label">Número da fatura</label>
            <input
              className="adm-input"
              value={numeroFatura}
              onChange={(e) => setNumeroFatura(onlyDigits(e.target.value))}
              placeholder="Ex: 2025123456"
              inputMode="numeric"
            />

            <button className="adm-btn" disabled={!podeBuscarFatura || loadingFatura}>
              {loadingFatura ? "Buscando..." : "Buscar"}
            </button>
          </form>

          {loadingFatura && (
            <div className="adm-loading">
              <Loading />
            </div>
          )}

          {erroFatura && <div className="adm-error">{erroFatura}</div>}

          {condominioFatura && (
            <div className="adm-result">
              <h3>Condomínio encontrado</h3>

              {/* Ajuste conforme payload real */}
              {renderKV("Condomínio", condominioFatura?.nome || condominioFatura?.condominio?.nome)}
              {renderKV("Código", condominioFatura?.codigo || condominioFatura?.condominio?.codigo)}
              {renderKV("Administradora", condominioFatura?.administradora?.nome || condominioFatura?.administradora)}
              {renderKV("Fatura", onlyDigits(numeroFatura))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
