import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { browserHistory } from 'react-router';
import { path } from 'ramda';
// import Swiper from 'swiper-r';
import classNames from 'classnames';
import common from 'app/common';

import profileHeaderConfig from '../helpers/profile-header-config';

const {
  components: { QualificationLevel },
  util: {
    helpers: { createCloudinaryUrl }
  }
} = common;

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ...profileHeaderConfig
    };
  }

  heroSliderInit(swiper) {
    this.setState({ heroSlider: swiper });
  }

  toggleHeroSliderPlay() {
    const { heroSlider, heroSliderPlaying } = this.state;

    this.setState({ heroSliderPlaying: !heroSliderPlaying });

    if (heroSliderPlaying) {
      heroSlider.stopAutoplay();
    } else {
      heroSlider.startAutoplay();
    }
  }

  createSwiperElement() {
    const { coverPhotos } = this.props;
    const { heroSliderPlaying } = this.state;

    return (
      <div
        className={classNames('hero-slider', {
          'stop-animation': !heroSliderPlaying
        })}
      >
        {/* <Swiper
          swiperConfig={this.state.heroSliderSettings}
          onSwiperMount={swiper => this.heroSliderInit(swiper)}
        >
          {coverPhotos.map(photo => this.createCoverPhoto(photo))}
        </Swiper> */}
      </div>
    );
  }

  createSwiperControls() {
    const { heroSliderPlaying } = this.state;

    const playButtonClasses = classNames('profile-hero__slider-control', {
      'play-button': !heroSliderPlaying,
      'pause-button': heroSliderPlaying
    });

    return (
      <div
        className={playButtonClasses}
        onClick={() => this.toggleHeroSliderPlay()}
      />
    );
  }

  createCoverPhoto(photo) {
    return (
      <div
        key={photo.media_id}
        className="slide"
        style={{
          backgroundImage: `url(${createCloudinaryUrl(
            photo.cloudinary_file_id,
            'image'
          )})`
        }}
      />
    );
  }

  createSubTitle() {
    const { profile } = this.props;

    return (
      path(['current_qualification', 'sector'], profile) && (
        <h2 className="profile-hero__subtitle">
          <QualificationLevel
            {...{ current_qualification: profile.current_qualification }}
          />
        </h2>
      )
    );
  }

  hasCoverPhoto() {
    const { coverPhotos } = this.props;
    return coverPhotos && coverPhotos.length > 0;
  }

  hasQualification() {
    const { profile } = this.props;
    return !!profile && !!profile.current_qualification;
  }

  render() {
    const { profile, openCvPreviewModal, prevPath } = this.props;

    return (
      <section className="profile-hero">
        {this.hasCoverPhoto() && this.createSwiperElement()}

        <div className="profile-hero__body">
          <div className="container profile-hero__body__container">
            {this.hasCoverPhoto() && this.createSwiperControls()}
            <button
              className="back button is-primary is-outlined column m-r-30 flex-none"
              onClick={browserHistory.goBack}
            >
              <i className="fa fa-angle-left" />
            </button>
            <div>
              <h1 className="profile-hero__title">
                {profile && profile.screen_name}
              </h1>
              {this.hasQualification() && this.createSubTitle()}
            </div>
          </div>

          {!!prevPath && (
            <div className="is-flex back-button-container">
              <button
                className="back button is-primary column m-r-10"
                onClick={() => {
                  browserHistory.replace(prevPath);
                }}
              >
                <i className="fa fa-angle-left" />
              </button>
              <div className="semibold">Back to Gallery</div>
            </div>
          )}
        </div>

        <button
          className="button is-primary download-cv"
          onClick={() => openCvPreviewModal()}
        >
          Download CV
        </button>
      </section>
    );
  }
}

Header.defaultProps = {
  coverPhotos: [],
  gettingPhotos: false,
  prevPath: false
};

Header.PropTypes = {
  profile: PropTypes.object.isRequired,
  coverPhotos: PropTypes.arrayOf(PropTypes.object),
  gettingPhotos: PropTypes.bool,
  prevPath: PropTypes.bool
};

export default Header;
