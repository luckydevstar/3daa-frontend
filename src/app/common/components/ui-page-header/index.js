import React from 'react';
import PropTypes from 'prop-types';
import { createCloudinaryUrl } from 'app/common/util/helpers';

import { Text } from 'app/intl';

const UIPageHeader = ({ title, subTitle, children, sector }) => (
  <section
    className="content-section hero smaller gray"
    style={{
      backgroundImage:
        sector && sector.image
          ? `url(${createCloudinaryUrl(sector.image, 'image')}`
          : null,
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat'
    }}
  >
    <div className="hero-body">
      <div className="container">
        <div className="columns">
          <div className="column">
            <h1 className="title m-b-0">
              <Text iKey={title} />
            </h1>
            <h2 className="subtitle">
              <Text iKey={subTitle} />
            </h2>
          </div>
          <div className="column has-text-right">{children}</div>
        </div>
      </div>
    </div>
  </section>
);

UIPageHeader.propTypes = {
  title: PropTypes.string,
  subTitle: PropTypes.string
};

UIPageHeader.defaultProps = {
  title: '',
  subTitle: ''
};

export default UIPageHeader;
