import { useState, useEffect, useRef, useMemo } from "react";

export function PessoaSelect({ pessoas = [], value, onChange, placeholder }) {
  const [termo, setTermo] = useState(value || "");
  const [mostrarDropdown, setMostrarDropdown] = useState(false);
  const wrapperRef = useRef(null);

  const pessoasNormalizadas = useMemo(() => {
    return pessoas.map((p) => ({
      ...p,
      nome: p.nome || p.razao_social || p.nome_fantasia || p.NOME || "",
      codigo: p.codigo || p.id || p.cod_pessoa || p.PESSOA || "",
      documento: p.documento || p.cpf_cnpj || p.cnpj || p.cpf || p.CPF_CNPJ || "",
    }));
  }, [pessoas]);

  const filtradas = useMemo(() => {
    if (!termo || termo.length < 2) return [];
    const t = termo.toLowerCase();
    return pessoasNormalizadas.filter(
      (p) =>
        p.nome.toLowerCase().includes(t) ||
        String(p.codigo).toLowerCase().includes(t) ||
        String(p.documento).toLowerCase().includes(t)
    );
  }, [pessoasNormalizadas, termo]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setMostrarDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (value && pessoasNormalizadas.length > 0) {
      const encontrada = pessoasNormalizadas.find((p) => p.codigo === value);
      if (encontrada) {
        setTermo(encontrada.nome);
      }
    }
  }, [value, pessoasNormalizadas]);

  function handleChange(e) {
    const novoTermo = e.target.value;
    setTermo(novoTermo);
    setMostrarDropdown(novoTermo.length >= 2);

    if (!novoTermo) {
      onChange("");
    }
  }

  function handleFocus() {
    if (termo.length >= 2) {
      setMostrarDropdown(true);
    }
  }

  function selecionarPessoa(pessoa) {
    setTermo(pessoa.nome);
    setMostrarDropdown(false);
    onChange(pessoa.codigo);
  }

  return (
    <div ref={wrapperRef} style={{ position: "relative", width: "100%" }}>
      <input
        type="text"
        value={termo}
        onChange={handleChange}
        onFocus={handleFocus}
        placeholder={placeholder || "Nome, código ou documento"}
        autoComplete="off"
        style={{
          width: "100%",
          height: "40px",
          padding: "0 12px",
          border: "1px solid #dbe3ef",
          borderRadius: "8px",
          background: "#ffffff",
          color: "#172033",
          outline: "none",
          fontSize: "inherit",
          boxSizing: "border-box",
        }}
      />

      {mostrarDropdown && filtradas.length > 0 && (
        <ul
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            maxHeight: "250px",
            overflowY: "auto",
            backgroundColor: "white",
            border: "1px solid #dbe3ef",
            borderTop: "none",
            borderRadius: "0 0 8px 8px",
            zIndex: 1000,
            margin: 0,
            padding: 0,
            listStyle: "none",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          {filtradas.map((pessoa, index) => (
            <li
              key={pessoa.codigo || index}
              onClick={() => selecionarPessoa(pessoa)}
              style={{
                padding: "10px 12px",
                cursor: "pointer",
                borderBottom: "1px solid #f0f0f0",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#f5f5f5")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "white")
              }
            >
              <strong>{pessoa.nome}</strong>
              {(pessoa.codigo || pessoa.documento) && (
                <span
                  style={{
                    color: "#64748b",
                    marginLeft: "8px",
                    fontSize: "12px",
                  }}
                >
                  {[pessoa.codigo, pessoa.documento].filter(Boolean).join(" | ")}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}

      {mostrarDropdown && filtradas.length === 0 && termo.length >= 2 && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            padding: "10px 12px",
            backgroundColor: "white",
            border: "1px solid #dbe3ef",
            borderTop: "none",
            borderRadius: "0 0 8px 8px",
            color: "#64748b",
            textAlign: "center",
            fontSize: "13px",
            zIndex: 1000,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          Nenhuma pessoa encontrada para "{termo}"
        </div>
      )}
    </div>
  );
}