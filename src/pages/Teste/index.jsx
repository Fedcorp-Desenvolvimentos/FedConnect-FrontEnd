import React from 'react'
import { Link } from "react-router-dom";
import PageTemplate from '../../components/PageTemplate/PageTemplate'

import { Button, Card, CardBody, Grid, Badge } from "../../styles/ui";
import { FaSearch } from 'react-icons/fa';

const TestePage = () => {
  return (
    <PageTemplate
      title="Teste"
      subtitle="Página de teste para desenvolvimento e demonstração de funcionalidades"
      emptyMessage="Nada para mostrar aqui ainda!"
    >
        <Button 
            as={Link} 
            to={"/"} 
            $variant="primary"
            $size="md"
            >
            <FaSearch size={14} />
            Pesquisar
        </Button>
    </PageTemplate>
  );
};

export default TestePage