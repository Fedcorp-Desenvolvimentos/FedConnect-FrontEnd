import { useEffect, useMemo, useState } from "react";
import { listarMateriaisComerciais } from "../services/materiaisComerciaisService";
import {
  filterMaterials,
  groupMaterialsByCategory,
} from "../utils/materiaisComerciaisUtils";

export function useMateriaisComerciais() {
  const [materials, setMaterials] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadMaterials() {
    try {
      setLoading(true);
      setError("");
      const result = await listarMateriaisComerciais();
      setMaterials(Array.isArray(result) ? result : []);
    } catch {
      setError("Não foi possível carregar os materiais comerciais.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMaterials();
  }, []);

  const filteredMaterials = useMemo(
    () => filterMaterials(materials, searchTerm),
    [materials, searchTerm]
  );

  const groupedMaterials = useMemo(
    () => groupMaterialsByCategory(filteredMaterials),
    [filteredMaterials]
  );

  return {
    error,
    filteredMaterials,
    groupedMaterials,
    loading,
    refreshMaterials: loadMaterials,
    searchTerm,
    setSearchTerm,
    totalMaterials: materials.length,
  };
}
