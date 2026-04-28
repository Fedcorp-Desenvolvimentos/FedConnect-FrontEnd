import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { FaDownload, FaEye, FaFilePdf, FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import * as S from './ProdutosStyles';
import PageLayout from "../../Layouts/PageLayout/PageLayout";
import { PRODUTOS } from '../../data/produtos';
import { ProdutosHelp } from './ProdutosHelp';

const CATEGORIAS = ["Todos", "Residencial", "Condomínio", "Vida", "Saúde", "Auto", "Garantias", "Institucional"];

// Componente do modal de imagem para ser renderizado via Portal
const ImageViewerModal = ({ imagemAberta, imagensGaleria, indexAtual, onClose, onDownload, onPrev, onNext, onDotClick }) => {
  if (!imagemAberta) return null;

  return ReactDOM.createPortal(
    <S.ImageViewer onClick={onClose}>
      <S.ViewerClose onClick={onClose}>
        <FaTimes />
      </S.ViewerClose>

      <S.ViewerImage
        src={imagemAberta}
        alt="Folheto do produto"
        onClick={(e) => e.stopPropagation()}
      />

      <S.ViewerDownload
        onClick={(e) => {
          e.stopPropagation();
          onDownload();
        }}
      >
        <FaDownload />
        Download
      </S.ViewerDownload>

      {imagensGaleria.length > 1 && (
        <>
          <S.ViewerArrow $left onClick={(e) => { e.stopPropagation(); onPrev(); }}>
            <FaChevronLeft />
          </S.ViewerArrow>

          <S.ViewerArrow onClick={(e) => { e.stopPropagation(); onNext(); }}>
            <FaChevronRight />
          </S.ViewerArrow>

          <S.ViewerDots>
            {imagensGaleria.map((_, idx) => (
              <S.ViewerDot
                key={idx}
                $active={idx === indexAtual}
                onClick={(e) => {
                  e.stopPropagation();
                  onDotClick(idx);
                }}
              />
            ))}
          </S.ViewerDots>
        </>
      )}
    </S.ImageViewer>,
    document.body
  );
};

const Produtos = () => {
  const { user, loading } = useAuth();
  const [categoriaAtiva, setCategoriaAtiva] = useState("Todos");
  const [imagemAberta, setImagemAberta] = useState(null);
  const [imagensGaleria, setImagensGaleria] = useState([]);
  const [indexAtual, setIndexAtual] = useState(0);

  const nivelAcesso = user?.nivel_acesso;
  
  // Admin e comercial podem ver todos os produtos
  const podeVerTodos = nivelAcesso === "admin" || nivelAcesso === "comercial";
  
  // Se não tiver permissão, mostra apenas institucionais
  const produtosFiltradosPorPermissao = podeVerTodos 
    ? PRODUTOS 
    : PRODUTOS.filter(p => p.categoria === "Institucional");

  const produtosFiltrados =
    categoriaAtiva === "Todos"
      ? produtosFiltradosPorPermissao
      : produtosFiltradosPorPermissao.filter((p) => p.categoria === categoriaAtiva);

  const baixarArquivo = (url) => {
    if (!url) return;
    const link = document.createElement("a");
    link.href = url;
    link.download = url.split("/").pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const abrirImagem = (produto) => {
    let imagens = [];
    if (Array.isArray(produto.imagens) && produto.imagens.length > 0) {
      imagens = produto.imagens;
    } else if (typeof produto.imagem === 'string') {
      imagens = [produto.imagem];
    }
    
    if (imagens.length > 0) {
      setImagensGaleria(imagens);
      setIndexAtual(0);
      setImagemAberta(imagens[0]);
    }
  };

  const fecharImagem = () => {
    setImagemAberta(null);
    setImagensGaleria([]);
    setIndexAtual(0);
  };

  const irAnterior = () => {
    if (!imagensGaleria.length) return;
    const novoIndex = (indexAtual - 1 + imagensGaleria.length) % imagensGaleria.length;
    setIndexAtual(novoIndex);
    setImagemAberta(imagensGaleria[novoIndex]);
  };

  const irProximo = () => {
    if (!imagensGaleria.length) return;
    const novoIndex = (indexAtual + 1) % imagensGaleria.length;
    setIndexAtual(novoIndex);
    setImagemAberta(imagensGaleria[novoIndex]);
  };

  const irParaImagem = (idx) => {
    setIndexAtual(idx);
    setImagemAberta(imagensGaleria[idx]);
  };

  const headerActions = null;

  const subtitle = "Apresente rapidamente os produtos da FedCorp durante o atendimento.";

  return (
    <>
      <PageLayout
        title="Portfólio de Produtos"
        subtitle={subtitle}
        icon={<FaFilePdf />}
        loading={loading}
        empty={produtosFiltrados.length === 0}
        emptyMessage="Nenhum produto disponível para seu nível de acesso"
        actions={headerActions}
        helpContent={<ProdutosHelp />}
      >
        <S.Container>
          {/* Filtros */}
          <S.FiltersContainer>
            {CATEGORIAS.map((cat) => (
              <S.ChipButton
                key={cat}
                $active={categoriaAtiva === cat}
                onClick={() => setCategoriaAtiva(cat)}
              >
                {cat}
              </S.ChipButton>
            ))}
          </S.FiltersContainer>

          {/* Grid de Produtos */}
          <S.ProductsGrid>
            {produtosFiltrados.map((produto) => (
              <S.ProductCard key={produto.id}>
                <S.ProductBody>
                  <S.CategoryPill>{produto.categoria}</S.CategoryPill>
                  <S.ProductName>{produto.nome}</S.ProductName>

                  {produto.preco && (
                    <S.ProductPrice>{produto.preco}</S.ProductPrice>
                  )}

                  {produto.destaques && produto.destaques.length > 0 && (
                    <S.DestaquesList>
                      {produto.destaques.map((destaque, idx) => (
                        <li key={idx}>{destaque}</li>
                      ))}
                    </S.DestaquesList>
                  )}

                  {produto.observacao && (
                    <S.Observacao>{produto.observacao}</S.Observacao>
                  )}

                  {/* Ações do card */}
                  {((Array.isArray(produto.imagens) && produto.imagens.length > 0) ||
                    (produto.tipo === 'pdf' && produto.pdf)) && (
                    <S.ActionsContainer>
                      {Array.isArray(produto.imagens) && produto.imagens.length > 0 && (
                        <S.PrimaryButton onClick={() => abrirImagem(produto)}>
                          <FaEye />
                          Ver folheto
                        </S.PrimaryButton>
                      )}

                      {produto.tipo === 'pdf' && produto.pdf && (
                        <S.PdfActions>
                          <S.PrimaryButton onClick={() => window.open(produto.pdf, '_blank')}>
                            <FaFilePdf />
                            Abrir apresentação
                          </S.PrimaryButton>
                          <S.OutlineButton onClick={() => baixarArquivo(produto.pdf)}>
                            <FaDownload />
                            Baixar PDF
                          </S.OutlineButton>
                        </S.PdfActions>
                      )}
                    </S.ActionsContainer>
                  )}
                </S.ProductBody>
              </S.ProductCard>
            ))}
          </S.ProductsGrid>
        </S.Container>
      </PageLayout>

      {/* Modal de visualização de imagem - renderizado via Portal */}
      <ImageViewerModal
        imagemAberta={imagemAberta}
        imagensGaleria={imagensGaleria}
        indexAtual={indexAtual}
        onClose={fecharImagem}
        onDownload={() => baixarArquivo(imagemAberta)}
        onPrev={irAnterior}
        onNext={irProximo}
        onDotClick={irParaImagem}
      />
    </>
  );
};

export default Produtos;