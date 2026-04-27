import React from 'react';
import { FaLightbulb, FaExclamationTriangle, FaFilePdf, FaImage, FaDownload } from 'react-icons/fa';

export const ProdutosHelp = () => {
  return (
    <>
      {/* Seção principal */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0F3D5D', marginBottom: '0.5rem' }}>
          <FaFilePdf /> Portfólio de Produtos
        </h2>
        <p style={{ margin: 0, color: '#475569' }}>
          Apresente rapidamente os produtos da FedCorp durante o atendimento.
        </p>
      </div>

      {/* Seção: Funcionalidades */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#0F3D5D' }}>
          <FaImage /> Funcionalidades
        </h3>
        <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#475569' }}>
          <li><strong>Filtros por categoria:</strong> Selecione a categoria para visualizar produtos específicos</li>
          <li><strong>Visualização de folhetos:</strong> Clique em "Ver folheto" para abrir imagens do produto</li>
          <li><strong>Apresentações em PDF:</strong> Acesse apresentações completas dos produtos</li>
          <li><strong>Download de arquivos:</strong> Baixe PDFs e imagens para uso offline</li>
        </ul>
      </div>

      {/* Seção: Como Usar */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#0F3D5D' }}>
          <FaDownload /> Como Utilizar
        </h3>
        <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#475569' }}>
          <li>Utilize os filtros para encontrar rapidamente o produto desejado</li>
          <li>Clique em "Ver folheto" para visualizar imagens do produto em tela cheia</li>
          <li>Navegue pelas imagens usando as setas ou clicando nos pontos de navegação</li>
          <li>Use o botão "Download" para salvar imagens e PDFs localmente</li>
        </ul>
      </div>

      {/* Seção: Dicas */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <FaLightbulb style={{ color: '#f59e0b' }} /> Dicas
        </h3>
        <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#475569' }}>
          <li>Utilize os filtros para navegar rapidamente entre as categorias</li>
          <li>Apresentações em PDF podem ser abertas diretamente no navegador</li>
          <li>Produtos institucionais estão disponíveis para todos os usuários</li>
          <li>Utilize o modo tela cheia para melhor visualização dos folhetos</li>
        </ul>
      </div>

      {/* Seção: Atenção */}
      <div>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <FaExclamationTriangle style={{ color: '#dc2626' }} /> Atenção
        </h3>
        <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#475569' }}>
          <li>Alguns produtos podem ter restrição de acesso conforme permissão do usuário</li>
          <li>Materiais institucionais são atualizados periodicamente</li>
          <li>Para informações detalhadas, consulte a equipe comercial</li>
          <li>Em caso de dificuldades, entre em contato com o suporte</li>
        </ul>
      </div>
    </>
  );
};

export default ProdutosHelp;