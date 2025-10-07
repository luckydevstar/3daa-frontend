import React from 'react';

const ContentCarouselItemB = props => {
  const { itemData } = props;

  if (!itemData) return null;

  return (
    <div className="content-carousel-item-b">
      <h1>{itemData.feature}</h1>
      <p>{itemData.description}</p>
    </div>
  );
};

export default ContentCarouselItemB;
