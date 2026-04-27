//src/Layouts/CardGridLayout.jsx

import React from 'react';
import * as S from './CardGridLayoutStyles';
import PageTemplate from '../../components/PageTemplate/PageTemplate';

const CardGridLayout = ({ 
  title,
  subtitle,
  icon,
  loading,
  empty,
  emptyMessage,
  helpContent,
  items,
  renderCard,
  gridProps = {}
}) => {
  if (empty && (!items || items.length === 0)) {
    return (
      <PageTemplate
        title={title}
        subtitle={subtitle}
        icon={icon}
        loading={loading}
        empty={empty}
        emptyMessage={emptyMessage}
        helpContent={helpContent}
      />
    );
  }

  return (
    <PageTemplate
      title={title}
      subtitle={subtitle}
      icon={icon}
      loading={loading}
      helpContent={helpContent}
    >
      <S.CardsGrid {...gridProps}>
        {items?.map((item, index) => renderCard(item, index))}
      </S.CardsGrid>
    </PageTemplate>
  );
};

export default CardGridLayout;