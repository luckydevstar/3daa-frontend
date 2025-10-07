import React from 'react';
import PropTypes from 'prop-types';
import { Text } from 'app/intl';
import { createCloudinaryUrl } from 'app/common/util/helpers';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { path } from 'ramda';

const Header = ({
  title,
  subtitle,
  toggleAddVideo,
  selectedHeader,
  sectorName,
  sector
}) => {
  const sectorImage =
    sector && sector.image
      ? `url(${createCloudinaryUrl(sector.image, 'image')}`
      : null;
  const categoryImage = selectedHeader
    ? `url(${createCloudinaryUrl(selectedHeader, 'image')}`
    : null;

  return (
    <section
      className="content-section hero smaller"
      style={{
        backgroundImage: categoryImage || sectorImage,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        minHeight: '200px'
      }}
    >
      <div className="hero-body">
        <div className="container">
          <div className="columns">
            <button
              className="back button is-primary is-outlined column m-r-30 flex-none"
              onClick={browserHistory.goBack}
            >
              <i className="fa fa-angle-left" />
            </button>
            <div className="column is-three-quarters video-header">
              <h1 className="title has-text-white">
                <Text iKey={title} />
              </h1>
              <h2 className="subtitle has-text-white m-b-0">
                <Text iKey={'Watch and Learn'} />
              </h2>
              <h1 className="has-text-white">{sectorName}</h1>
            </div>
            {/* <div className="column">
              {toggleAddVideo && (
                <div className="hero-nav">
                  <button
                    className="button is-primary is-outlined"
                    onClick={toggleAddVideo}
                  >
                    <Text iKey="add_video" />
                  </button>
                </div>
              )}
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
};

Header.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string
};

Header.defaultProps = {
  title: 'Videos',
  subtitle: 'watch_and_learn'
};

const mapStateToProps = state => ({
  sector: path(['persisted', 'sector'], state)
});

export default connect(mapStateToProps)(Header);
