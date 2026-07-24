import { useEffect } from 'react';
import { buscarTodosProdutos, buscarProdutosDinamicamente } from '../../../services/produtosService';
import { useCallback, useState } from 'react';

export const useProdutos = () => {
    const [produtos, setProdutos] = useState([]);

    const carregarTodosProdutos = useCallback(async () => {
        try {
            const response = await buscarTodosProdutos();
            if (response?.produtos) {
                setProdutos(response.produtos);
            }
        } catch (error) {
            console.error('Erro ao carregar todos os produtos:', error);
            throw error;
        }
    }, []);

    const buscarProdutos = useCallback(async (params) => {
        try {
            const produtos = await buscarProdutosDinamicamente(params);
            return produtos;
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
            throw error;
        }
    }, []);

    useEffect(() => {
        carregarTodosProdutos();
    }, [carregarTodosProdutos]);

    return {
        carregarTodosProdutos,
        buscarProdutos,
        produtos
    };
};
  