import React from 'react';
import PropTypes from 'prop-types';
import common from 'app/common';

const { components: { ProfileAvatar }, util: { helpers: { noop } } } = common;

const BookTestSummary = ({ onBack, onNext }) =>
  <div className="book-test-summary">
    <div className="centre-location columns">
      <div className="map is-7 column" />
      <div className="centre-img column" />
    </div>
    <div className="columns">
      <div className="column">
        <h5>Location:</h5>
        <br />
        <span>GreyFriars Bobby</span>
        <br />
        <span>29-31 George Street,</span>
        <br />
        <span>Edinburgh, EH2 2PA</span>
        <br />
        <span>T: +44(0) 131 226 9971</span>
      </div>
      <div className="column invigilator">
        <h5>Invigilator:</h5>
        <br />
        <div className="media">
          <div className="media-left">
            <ProfileAvatar avatarSize={40} title={'Invigilator'} />
          </div>
          <div className="media-content">
            <span className="highlighted">Simo McMorris</span>
            <br />
            <span>Manager</span>
          </div>
        </div>
      </div>
    </div>
    <div className="columns">
      <div className="column candidate is-5">
        <h5>Candidate:</h5>
        <br />
        <div className="media">
          <div className="media-left">
            <ProfileAvatar avatarSize={45} title={'Invigilator'} />
          </div>
          <div className="media-content">
            <span className="highlighted">Tab Briason</span>
          </div>
        </div>
      </div>
      <div className="column is-4">
        <h5>Candidate:</h5>
        <br />
        <i className="highlighted fa fa-calendar-o" />
        <span className="highlighted">19 Feb 2018</span>
      </div>
      <div className="column">
        <h5>Time of Test:</h5>
        <br />
        <span className="highlighted">14:00</span>
      </div>
    </div>
    <div className="actions">
      <button className="button is-primary is-outlined" onClick={onBack}>
        Back
      </button>
      <button className="button is-primary" onClick={onNext}>
        Next
      </button>
    </div>
  </div>;

BookTestSummary.propTypes = {
  onBack: PropTypes.func,
  onNext: PropTypes.func
};

BookTestSummary.defaultProps = {
  onBack: noop,
  onNext: noop
};

export default BookTestSummary;
