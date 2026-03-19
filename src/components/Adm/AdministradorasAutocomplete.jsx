// components/AdministradoraAutocomplete.jsx
import { useState, useRef } from 'react';
import { getAdministradoraEspecificaPorNome } from '../../services/consultaAdmService';

// Versão MÍNIMA e funcional:
const AdministradoraAutocomplete = ({ onChange, disabled }) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceTimeout = useRef(null);

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(false);

  const buscarAdministradoras = async (termo) => {
    if (termo.length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    setErro(false);
    
    try {
      const response = await getAdministradoraEspecificaPorNome(termo);
      if (response?.sucesso && Array.isArray(response.data)) {
        setSuggestions(response.data.slice(0, 8));
        setShowDropdown(true);
      }
    } catch (error) {
      setErro(true);
      console.error('Erro:', error);
    } finally {
        setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const valor = e.target.value;
    setInputValue(valor);
    
    // Debounce
    clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      buscarAdministradoras(valor);
    }, 400);
  };

  const handleSelect = (adm) => {
    setInputValue(adm.NOME_ADM || adm.nome_adm);
    setShowDropdown(false);
    
    // Envia código para o form
    if (onChange) {
      onChange({
        target: {
          name: 'administradora',
          value: adm.COD_ADM || adm.cod_adm
        }
      });
    }
  };

  const handleClear = () => {
    setInputValue('');
    setSuggestions([]);
    if (onChange) {
      onChange({
        target: {
          name: 'administradora',
          value: ''
        }
      });
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          className="form-control"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Digite a administradora..."
          disabled={disabled}
          style={{ paddingRight: '35px' }}
        />
        {inputValue && (
          <button
            onClick={handleClear}
            style={{
              position: 'absolute',
              right: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              color: '#999',
              fontSize: '16px',
              cursor: 'pointer',
              padding: '0',
              width: '16px',
              height: '16px',
              lineHeight: '1'
            }}
          >
            ×
          </button>
        )}
      </div>
      
      {showDropdown && suggestions.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: 'white',
          border: '1px solid #ddd',
          borderRadius: '0 0 4px 4px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          zIndex: 1000,
          maxHeight: '200px',
          overflowY: 'auto'
        }}>
          {suggestions.map((adm, idx) => (
            <div
              key={idx}
              onClick={() => handleSelect(adm)}
              style={{
                padding: '8px 12px',
                borderBottom: '1px solid #f5f5f5',
                cursor: 'pointer',
                fontSize: '14px'
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#f5f5f5'}
            >
              <div style={{ fontWeight: '500' }}>{adm.NOME_ADM}</div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                Código: {adm.COD_ADM}
              </div>
            </div>
          ))}
        </div>
      )}
      
    </div>
  );
};

export default AdministradoraAutocomplete;