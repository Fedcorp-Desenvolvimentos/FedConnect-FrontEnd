// components/Faturamento/FormularioHeader.jsx
import React from 'react';
import { FaSearch, FaTrash } from 'react-icons/fa';
import * as S from "./styles/ConsultaFaturamentoStyles";
import AdministradoraAutocomplete from "./AdministradoraAutocomplete";

export const FormularioHeader = ({ 
    formData, 
    handleChange, 
    handleAdministradoraSelect, 
    carregarFaturas, 
    handleLimparFiltros, 
    loading 
}) => {
    return (
        <S.Form onSubmit={carregarFaturas}>
            <S.FiltrosGrid>
                <S.FormGroup>
                    <S.Label htmlFor="fatura">Fatura:</S.Label>
                    <S.Input
                        type="text"
                        id="fatura"
                        name="fatura"
                        value={formData.fatura}
                        onChange={handleChange}
                        placeholder="Número da fatura"
                        disabled={loading}
                    />
                </S.FormGroup>

                <S.FormGroup>
                    <S.Label htmlFor="apolice">Apólice:</S.Label>
                    <S.Input
                        type="text"
                        id="apolice"
                        name="apolice"
                        value={formData.apolice}
                        onChange={handleChange}
                        placeholder="Número da apólice"
                        disabled={loading}
                    />
                </S.FormGroup>

                <S.FormGroup>
                    <S.Label htmlFor="status">Status:</S.Label>
                    <S.Select 
                        id="status" 
                        name="status" 
                        value={formData.status} 
                        onChange={handleChange}
                        disabled={loading}
                    >
                        <option value="">Todos</option>
                        <option value="A">Ativa</option>
                        <option value="C">Cancelada</option>
                    </S.Select>
                </S.FormGroup>

                <S.FormGroup>
                    <S.Label htmlFor="data_ini">Data Inicial:</S.Label>
                    <S.Input
                        type="date"
                        id="data_ini"
                        name="data_ini"
                        value={formData.data_ini}
                        onChange={handleChange}
                        disabled={loading}
                    />
                </S.FormGroup>

                <S.FormGroup>
                    <S.Label htmlFor="data_fim">Data Final:</S.Label>
                    <S.Input
                        type="date"
                        id="data_fim"
                        name="data_fim"
                        value={formData.data_fim}
                        onChange={handleChange}
                        disabled={loading}
                    />
                </S.FormGroup>

                <S.FormGroup>
                    <S.Label htmlFor="administradora">Administradora:</S.Label>
                    <AdministradoraAutocomplete
                        value={formData.administradora}
                        onChange={handleChange}
                        onSelect={handleAdministradoraSelect}
                        placeholder="Digite o nome da administradora..."
                        disabled={loading}
                    />
                </S.FormGroup>
            </S.FiltrosGrid>

            <S.ButtonGroup>
                <S.Button type="submit" disabled={loading}>
                    <FaSearch /> {loading ? "Consultando..." : "Consultar"}
                </S.Button>
                <S.Button 
                    type="button" 
                    $secondary 
                    onClick={handleLimparFiltros} 
                    disabled={loading}
                >
                    <FaTrash /> Limpar
                </S.Button>
            </S.ButtonGroup>
        </S.Form>
    );
};