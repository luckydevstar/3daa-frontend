import React from 'react';

const ContentCarouselItemA = props => {
  const { itemData } = props;

  if (!itemData) return null;

  return (
    <div className="content-carousel-item-a">
      <h1>{itemData.title}</h1>
      <p>{itemData.paragraph}</p>
    </div>
  );
};

export default ContentCarouselItemA;
