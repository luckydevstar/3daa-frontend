import React from 'react';
import common from 'app/common';
import CommunityCardItem from './community-card-item';

const { components: { ContentCarousel } } = common;

const CommunityFeatureCarousel = ({
  role,
  featuredUsers,
  canAccessWorkbooks,
  canSeeOthersProgress
}) => {
  return (
    <section className="community-featured-carousel">
      <div className="carousel-container">
        <div className="arrow-container left">
          <div className="arrow" />
        </div>
        <div className="arrow-container right">
          <div className="arrow" />
        </div>
        <ContentCarousel
          data={featuredUsers}
          childComponent={CommunityCardItem}
          itemWidth={330}
          itemGap={20}
          {...{
            role,
            canAccessWorkbooks,
            canSeeOthersProgress
          }}
        />
      </div>
    </section>
  );
};

export default CommunityFeatureCarousel;
