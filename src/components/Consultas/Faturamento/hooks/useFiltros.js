import { useState, useCallback } from "react";

const initialState = {
    fatura: "",
    apolice: "",
    administradora: "",
    data_ini: "",
    data_fim: "",
    status: "",
};

export const useFiltros = () => {
    const [formData, setFormData] = useState(initialState);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }, []);

    const handleAdministradoraSelect = useCallback((administradora) => {
        if (administradora) console.log("Administradora selecionada:", administradora);
    }, []);

    const limparFiltros = useCallback(() => {
        setFormData(initialState);
    }, []);

    const filtrosAtivosCount = Object.values(formData).filter(
        (v) => v && v.toString().trim() !== ""
    ).length;

    return {
        formData,
        handleChange,
        handleAdministradoraSelect,
        limparFiltros,
        filtrosAtivosCount,
    };
};