export const GOOGLE_DRIVE_MATERIAIS_COMERCIAIS_URL =
  "https://drive.google.com/drive/folders/1qIa6IXMykI6Vo56jPCcXBVGY9GqA5OwW";

export const MATERIAL_CATEGORIES = {
  convencoes: "Convenções Coletivas",
  folders: "Folders",
};

export const materiaisComerciaisMock = [
  {
    id: "convencoes-drive",
    nome: "Convenções Coletivas",
    categoria: MATERIAL_CATEGORIES.convencoes,
    tipo: "Google Drive",
    atualizadoEm: "2026-06-12",
    url: GOOGLE_DRIVE_MATERIAIS_COMERCIAIS_URL,
  },
  {
    id: "folders-drive",
    nome: "Folders comerciais",
    categoria: MATERIAL_CATEGORIES.folders,
    tipo: "Google Drive",
    atualizadoEm: "2026-06-12",
    url: GOOGLE_DRIVE_MATERIAIS_COMERCIAIS_URL,
  },
];
