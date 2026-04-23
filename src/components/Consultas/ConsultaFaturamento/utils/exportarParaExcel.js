export const exportarParaExcel = async () => {
    try {
        setLoadingMessage("Exportando Excel...");
        setLoading(true);
        const filtrosAtivos = Object.fromEntries(
            Object.entries(formData).filter(([_, value]) => value && value.toString().trim() !== "")
        );
        await exportarFaturasParaExcel(filtrosAtivos);
    } catch (error) {
        console.error("Erro na exportação:", error);
        setErro(`Erro ao exportar para Excel: ${error.message}`);
        setTimeout(() => setErro(""), 5000);
    } finally {
        setLoading(false);
    }
};
