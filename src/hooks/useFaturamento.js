

import { useState, useCallback } from "react";
import { getFaturamento } from "../../../../services/consultaFatura";
import { getCorretores } from "../../../../services/corretoresService";
import { traduzirErroApi } from "../../../../utils/traduzir_erro_api";
import { getEmpresas } from "../../../../services/empresasService";
import { useGlobal } from "../../../../context/GlobalContext";

export const useFaturamento = () => {
    const [resultados, setResultados] = useState([]);
    const [empresasMap, setEmpresasMap] = useState({});
    const [corretoresMap, setCorretoresMap] = useState({});
    const [erro, setErro] = useState("");
    const { loading, setLoading, setLoadingMessage } = useGlobal();

    // Carregar empresas
    const carregarEmpresas = useCallback(async () => {
        try {
            const response = await getEmpresas();
            if (response?.status === "success") {
                const mapa = {};
                (response.data || []).forEach((empresa) => {
                    mapa[empresa.CODIGO] = empresa.CEDENTE;
                });
                setEmpresasMap(mapa);
            }
        } catch (e) {
            console.error("Erro ao carregar empresas:", e);
        }
    }, []);

    // Buscar corretor individual
    const buscarCorretor = useCallback(async (codigo) => {
        if (!codigo) return;
        try {
            const response = await getCorretores(codigo);
            if (response?.status === "success") {
                setCorretoresMap(prev => ({
                    ...prev,
                    [codigo]: response.data?.NOME || "-"
                }));
            }
        } catch (e) {
            console.error("Erro ao buscar corretor:", e);
        }
    }, []);

    // Carregar corretores dos resultados
    const carregarCorretoresDosResultados = useCallback((resultados) => {
        if (!resultados?.length) return;
        resultados.forEach((fatura) => {
            if (fatura.CORRETOR && !corretoresMap[fatura.CORRETOR]) {
                buscarCorretor(fatura.CORRETOR);
            }
            if (fatura.CORRETOR2 && !corretoresMap[fatura.CORRETOR2]) {
                buscarCorretor(fatura.CORRETOR2);
            }
        });
    }, [corretoresMap, buscarCorretor]);

    // Carregar página de resultados
    const carregarPagina = useCallback(async (formData, pageNumber = 1, pageSize = 10) => {
        setLoadingMessage("Carregando Fatura(s)...");
        setLoading(true);
        setErro("");

        try {
            const filtrosAtivos = Object.fromEntries(
                Object.entries(formData).filter(([_, value]) => value && value.toString().trim() !== "")
            );

            if (filtrosAtivos.data_ini && filtrosAtivos.data_fim) {
                const ini = new Date(filtrosAtivos.data_ini);
                const fim = new Date(filtrosAtivos.data_fim);
                if (ini > fim) throw new Error("Data inicial não pode ser maior que data final");
            }

            const response = await getFaturamento({
                ...filtrosAtivos,
                page: pageNumber,
                page_size: pageSize,
            });

            if (response?.sucesso) {
                const dados = response.resultado?.data || [];
                setLoadingMessage("Carregando informações...");
                setResultados(dados);
                
                const pagination = response.resultado?.pagination || {
                    current_page: pageNumber,
                    page_size: pageSize,
                    total_records: response.resultado?.total_registros || 0,
                    total_pages: Math.ceil((response.resultado?.total_registros || 0) / pageSize) || 1,
                    has_next: pageNumber < (Math.ceil((response.resultado?.total_registros || 0) / pageSize)),
                    has_previous: pageNumber > 1,
                };
                
                if (!dados.length) setErro("Nenhuma fatura encontrada com os filtros informados.");
                
                return { dados, pagination };
            } else {
                setErro(traduzirErroApi(response?.erro || "Erro ao consultar faturas"));
                setResultados([]);
                return { dados: [], pagination: null };
            }
        } catch (err) {
            setErro(traduzirErroApi(err?.message || "Erro ao consultar faturas. Tente novamente."));
            setResultados([]);
            return { dados: [], pagination: null };
        } finally {
            setLoading(false);
        }
    }, [setLoading, setLoadingMessage]);

    const obterNomeCedente = useCallback((codigo) => empresasMap[codigo] || codigo || "-", [empresasMap]);
    const obterNomeCorretor = useCallback((codigo) => corretoresMap[codigo] || codigo || "-", [corretoresMap]);

    return {
        resultados,
        setResultados,
        erro,
        setErro,
        empresasMap,
        corretoresMap,
        carregarEmpresas,
        carregarPagina,
        carregarCorretoresDosResultados,
        obterNomeCedente,
        obterNomeCorretor,
        loading,
    };
};