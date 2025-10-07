import React from 'react';
import FinanceCardItem from './finance-card-item';

const FinanceCardView = ({
  items,
  activeItem,

  openChat,
  onActive,

  activating,
  suspending
}) => (
  <section className="finance-card-view">
    {items.map((itemData, i) => (
      <FinanceCardItem
        {...{
          key: i,
          itemData,

          openChat,
          onActive,

          activating,
          suspending
        }}
      />
    ))}
  </section>
);

export default FinanceCardView;
