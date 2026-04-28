import { useState, useRef, useEffect, useCallback } from 'react';
import { getAdministradoraEspecificaPorNome } from '../../../services/consultaAdmService';

const AdministradoraAutocomplete = ({ value, onChange, onSelect, placeholder, disabled }) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');
  const debounceTimeout = useRef(null);
  const wrapperRef = useRef(null);

  // Sincroniza o input com o valor do form quando mudar externamente
  useEffect(() => {
    if (value && value !== selectedValue) {
      // Se tem value e é diferente, precisamos buscar o nome
      if (typeof value === 'string' || typeof value === 'number') {
        setSelectedValue(value);
        // Opcional: buscar nome da adm pelo código se necessário
        setInputValue(''); // Limpa ou mostra loading
      }
    } else if (!value) {
      setSelectedValue('');
      setInputValue('');
    }
  }, [value, selectedValue]);

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const buscarAdministradoras = async (termo) => {
    if (!termo || termo.trim().length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    setLoading(true);
    
    try {
      const response = await getAdministradoraEspecificaPorNome(termo.trim());
      
      if (response?.sucesso && Array.isArray(response.data) && response.data.length > 0) {
        setSuggestions(response.data.slice(0, 10));
        setShowDropdown(true);
      } else {
        setSuggestions([]);
        setShowDropdown(false);
      }
    } catch (error) {
      console.error('Erro ao buscar administradoras:', error);
      setSuggestions([]);
      setShowDropdown(false);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const valor = e.target.value;
    setInputValue(valor);
    
    // Se o usuário está digitando, limpa o código selecionado
    if (selectedValue) {
      setSelectedValue('');
      if (onChange) {
        onChange({
          target: { name: 'administradora', value: '' }
        });
      }
    }
    
    // Debounce para não fazer requisições a cada tecla
    clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      buscarAdministradoras(valor);
    }, 300);
  };

  const handleSelect = (adm) => {
    const nomeAdm = adm.NOME_ADM || adm.nome_adm || '';
    const codAdm = adm.COD_ADM || adm.cod_adm || '';
    
    setInputValue(nomeAdm);
    setSelectedValue(codAdm);
    setShowDropdown(false);
    
    // Notifica o componente pai sobre a seleção
    if (onSelect) {
      onSelect(codAdm, nomeAdm);
    }
    
    // Também mantém compatibilidade com o onChange padrão
    if (onChange) {
      onChange({
        target: { name: 'administradora', value: codAdm }
      });
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setInputValue('');
    setSelectedValue('');
    setSuggestions([]);
    setShowDropdown(false);
    
    if (onChange) {
      onChange({
        target: { name: 'administradora', value: '' }
      });
    }
    
    if (onSelect) {
      onSelect('', '');
    }
  };

  return (
    <div ref={wrapperRef} style={{ position: 'relative', width: '100%' }}>
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          className="form-control"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => inputValue.length >= 2 && buscarAdministradoras(inputValue)}
          placeholder={placeholder || "Digite o nome da administradora..."}
          disabled={disabled}
          autoComplete="off"
          style={{
            width: '100%',
            paddingRight: inputValue ? '35px' : '10px',
            backgroundColor: disabled ? '#f5f5f5' : 'white'
          }}
        />
        
        {loading && (
          <div style={{
            position: 'absolute',
            right: '35px',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '12px',
            color: '#999'
          }}>
            <i>Buscando...</i>
          </div>
        )}
        
        {inputValue && !disabled && (
          <button
            onClick={handleClear}
            type="button"
            style={{
              position: 'absolute',
              right: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              color: '#999',
              fontSize: '18px',
              cursor: 'pointer',
              padding: '0',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = '#666';
              e.currentTarget.style.background = '#f0f0f0';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = '#999';
              e.currentTarget.style.background = 'none';
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
          borderTop: 'none',
          borderRadius: '0 0 4px 4px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          zIndex: 1000,
          maxHeight: '250px',
          overflowY: 'auto',
          marginTop: '2px'
        }}>
          {suggestions.map((adm, idx) => (
            <div
              key={idx}
              onClick={() => handleSelect(adm)}
              style={{
                padding: '10px 12px',
                borderBottom: '1px solid #f0f0f0',
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'background 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f5f5f5'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}
            >
              <div style={{ fontWeight: '500', color: '#333' }}>
                {adm.NOME_ADM || adm.nome_adm}
              </div>
              {adm.COD_ADM && (
                <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>
                  Código: {adm.COD_ADM}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {showDropdown && suggestions.length === 0 && !loading && inputValue.length >= 2 && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: 'white',
          border: '1px solid #ddd',
          borderTop: 'none',
          borderRadius: '0 0 4px 4px',
          padding: '10px',
          textAlign: 'center',
          color: '#999',
          fontSize: '13px',
          zIndex: 1000
        }}>
          Nenhuma administradora encontrada
        </div>
      )}
    </div>
  );
};

export default AdministradoraAutocomplete;