import {
  FaExternalLinkAlt,
  FaFileAlt,
  FaFolderOpen,
  FaRedo,
  FaSearch,
} from "react-icons/fa";
import PageLayout from "../../../Layouts/PageLayout/PageLayout";
import { GOOGLE_DRIVE_MATERIAIS_COMERCIAIS_URL } from "./data/materiaisComerciaisMock";
import { useMateriaisComerciais } from "./hooks/useMateriaisComerciais";
import { formatMaterialDate } from "./utils/materiaisComerciaisUtils";
import "./ComercialMateriais.css";

function MaterialCard({ material }) {
  return (
    <article className="material-card">
      <div className="material-card-icon">
        <FaFileAlt />
      </div>

      <div className="material-card-content">
        <div className="material-card-header">
          <strong>{material.nome}</strong>
          <span>{material.categoria}</span>
        </div>

        <div className="material-card-meta">
          <span>{material.tipo}</span>
          <span>Atualizado em {formatMaterialDate(material.atualizadoEm)}</span>
        </div>
      </div>

      <a
        className="material-card-action"
        href={material.url}
        target="_blank"
        rel="noreferrer"
      >
        <FaExternalLinkAlt />
        Abrir
      </a>
    </article>
  );
}

export default function ComercialMateriais() {
  const {
    error,
    filteredMaterials,
    groupedMaterials,
    loading,
    refreshMaterials,
    searchTerm,
    setSearchTerm,
    totalMaterials,
  } = useMateriaisComerciais();

  const hasMaterials = filteredMaterials.length > 0;

  return (
    <PageLayout
      title="Materiais Comerciais"
      subtitle="Convenções coletivas e folders para apoio à equipe comercial"
      icon={<FaFolderOpen />}
      loading={loading}
    >
      <div className="materiais-page">
        <section className="materiais-toolbar">
          <div className="materiais-search">
            <FaSearch />
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Buscar por nome, tipo ou categoria"
            />
          </div>

          <div className="materiais-actions">
            <button type="button" onClick={refreshMaterials}>
              <FaRedo />
              Atualizar
            </button>

            <a
              href={GOOGLE_DRIVE_MATERIAIS_COMERCIAIS_URL}
              target="_blank"
              rel="noreferrer"
            >
              <FaFolderOpen />
              Abrir Drive
            </a>
          </div>
        </section>

        <section className="materiais-summary">
          <div>
            <span>Total de materiais</span>
            <strong>{totalMaterials}</strong>
          </div>
          <div>
            <span>Exibindo</span>
            <strong>{filteredMaterials.length}</strong>
          </div>
          <div>
            <span>Origem</span>
            <strong>Google Drive</strong>
          </div>
        </section>

        {error && <div className="materiais-error">{error}</div>}

        {!error && !hasMaterials && (
          <div className="materiais-empty">Nenhum material encontrado</div>
        )}

        {Object.entries(groupedMaterials).map(([category, items]) => (
          <section className="materiais-section" key={category}>
            <div className="materiais-section-header">
              <h2>{category}</h2>
              <span>{items.length} item(ns)</span>
            </div>

            <div className="materiais-list">
              {items.map((material) => (
                <MaterialCard key={material.id} material={material} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </PageLayout>
  );
}
