import React from 'react';
import CommunityFeaturedCarousel from './community-featured-carousel';

const CommunityFeatureView = ({
  featuredUsers,
  role,
  canAccessWorkbooks,
  canSeeOthersProgress,
  list
}) => {
  return (
    <section className="community-feature-view">
      <CommunityFeaturedCarousel
        {...{
          role,
          featuredUsers,
          canAccessWorkbooks,
          canSeeOthersProgress
        }}
      />
      {list}
    </section>
  );
};

export default CommunityFeatureView;
