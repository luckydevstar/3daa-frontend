import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import Swiper from 'swiper-r';
import common from 'app/common';

const {
  components: { ProfileAvatar, UILoading }
} = common;

class References extends Component {
  constructor() {
    super();

    this.swiperConfig = {
      pagination: '.swiper-pagination',
      effect: 'fade',
      autoHeight: true,
      nextButton: null,
      prevButton: null,
      scrollbar: null
    };
  }

  createSliderElement(references) {
    return (
      <div id="references-slider">
        {/* <Swiper swiperConfig={this.swiperConfig}>
          {references.map(reference => this.createReferenceElement(reference))}
        </Swiper> */}
        <div className="swiper-pagination" />
      </div>
    );
  }

  createReferenceElement(data) {
    const {
      reference_id,
      sender_screen_name,
      sender_gender,
      sender_cloudinary_file_id,
      reference
    } = data;

    return (
      <div key={reference_id} className="slide">
        <div className="columns">
          <div className="column is-one-third">
            <ProfileAvatar
              title={sender_screen_name}
              fileId={sender_cloudinary_file_id}
              gender={sender_gender}
            />
          </div>
          <div className="column">
            <div className="details">
              <div className="inner">
                <h3 className="name">{sender_screen_name}</h3>
                <span className="qualification">Health and Social Care</span>
              </div>
            </div>
          </div>
        </div>
        <p>{reference}</p>
      </div>
    );
  }

  render() {
    const { references, gettingReferences } = this.props;

    let referenceElement = null;
    let referencesEmptyState = null;

    if (!gettingReferences) {
      if (references.length > 1) {
        referenceElement = this.createSliderElement(references);
      }

      if (references.length === 1) {
        referenceElement = references.map(reference =>
          this.createReferenceElement(reference)
        );
      }
    }

    if (!gettingReferences && references.length === 0) {
      referencesEmptyState = (
        <div className="column has-text-centered">
          <div
            className="my-references__empty-icon m-t-40"
            title="No references received"
          />
          <p className="my-references__empty-message m-t-40 m-b-40">
            No references yet
          </p>
          {/* <button type="button" className="my-references__empty-cta button is-primary is-outlined is-large is-fullwidth m-t-40">Ask for a reference</button> */}
        </div>
      );
    }

    return (
      <div className="my-references profile-section">
        <div className="profile-title">References</div>
        <div className="references-slider">
          {gettingReferences && <UILoading />}
          {referenceElement}
          {referencesEmptyState}
        </div>
      </div>
    );
  }
}

References.defaultProps = {
  references: [],
  gettingReferences: false
};

References.propTypes = {
  references: PropTypes.arrayOf(PropTypes.object),
  gettingReferences: PropTypes.bool
};

export default References;
