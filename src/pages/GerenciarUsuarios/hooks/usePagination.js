import { useState, useEffect, useMemo } from 'react';

export const usePagination = (items, itemsPerPage = 15) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return items;

    return items.filter((item) => {
      const nome = (item.nome_completo || '').toLowerCase();
      const email = (item.email || '').toLowerCase();
      const nivel = (item.nivel_acesso || '').toLowerCase();
      return nome.includes(term) || email.includes(term) || nivel.includes(term);
    });
  }, [items, searchTerm]);

  const totalItems = filteredItems.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
    if (currentPage < 1) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  return {
    currentPage,
    totalPages,
    totalItems,
    currentItems,
    searchTerm,
    goToPage,
    handleSearch
  };
};