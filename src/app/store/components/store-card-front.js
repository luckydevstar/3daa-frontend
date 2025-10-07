import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import * as lodash from 'lodash';
import common from 'app/common';
import cx from 'classnames';

const {
  components: { CloudinaryMedia, UILoading }
} = common;

const createCloudinaryUrl = common.util.helpers.createCloudinaryUrl;

const StoreCardFront = ({
  qualification,
  addToCart,
  openAssignLicenseModal,
  allowAssignQualification
}) => (
  <div className="store-card-front">
    <div className="img">
      <CloudinaryMedia
        fileId={lodash.get(qualification, 'cover') || ''}
        mediaType={lodash.get(qualification, 'cover_type') || 'image'}
        transformations={{
          width: 300,
          height: 400,
          crop: 'fill',
          gravity: 'north'
        }}
        attributes={{ controls: false }}
      />
      <div
        className={cx('details p-10', {
          'centre-details': allowAssignQualification
        })}
      >
        <div className="info">
          <img
            className="badge m-r-15"
            src={
              qualification.digital_badge
                ? qualification.digital_badge.cloudinary_file_id
                : ''
            }
            alt="qualification"
          />
          <span className="title">
            <b>{qualification.title}</b>
          </span>
        </div>

        <div className="price">
          <span>Available Licenses</span>
          <span className="is-primary">x5</span>
        </div>
        <div className="price p-b-10">
          <span>
            <b>Single License</b>
          </span>
          <span className="is-primary">£{qualification.price}</span>
        </div>

        <div className="buttons p-t-20 p-b-10">
          <div className="columns is-multiline">
            {allowAssignQualification && (
              <div className="column is-12 p-b-0">
                <Link
                  className="button is-primary is-fullwidth"
                  to={`/store/assign/${qualification.qualification_id}`}
                >
                  Assign to Learner
                </Link>
              </div>
            )}
            <div className="column is-6 p-t-5 p-b-0">
              <button
                className="button is-primary is-outlined is-fullwidth"
                onClick={() => addToCart(qualification.qualification_id)}
              >
                Quick Buy
              </button>
            </div>
            <div className="column is-6 p-t-5 p-b-0">
              <Link
                className="button is-primary is-outlined is-fullwidth"
                to={`/store/course/${qualification.qualification_id}`}
              >
                View
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

StoreCardFront.propTypes = {
  image: PropTypes.string,
  course_id: PropTypes.number,
  title: PropTypes.string,
  price: PropTypes.number,
  addToCart: PropTypes.func,
  openAssignLicenseModal: PropTypes.func
};

StoreCardFront.defaultProps = {
  image: '/assets/images/avatar_example.png',
  course_id: 0,
  title: '',
  price: 0,
  addToCart: () => {},
  openAssignLicenseModal: () => {}
};

export default StoreCardFront;
