
export function formatMaterialDate(value) {
  if (!value) return '-';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  return date.toLocaleDateString('pt-BR');
}

export function groupMaterialsByCategory(materials) {
  return materials.reduce((groups, material) => {
    const category = material.categoria || "Outros";
    if (!groups[category]) groups[category] = [];
    groups[category].push(material);
    return groups;
  }, {});
}

export function filterMaterials(materials, searchTerm) {
  const term = searchTerm.trim().toLowerCase();
  if (!term) return materials;

  return materials.filter((material) => {
    return [material.nome, material.categoria, material.tipo]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(term));
  });
}
