import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import common from 'app/common';

const { ConvertDraftObjectToHtml } = common.components;
const createCloudinaryUrl = common.util.helpers.createCloudinaryUrl;
class StoreCardBack extends Component {
  constructor(props) {
    super(props);

    this.state = {
      more: false
    };
  }

  viewMore(more) {
    this.setState({ more });
  }

  render() {
    const { more } = this.state;
    const { qualification, addToCart } = this.props;
    return (
      <div className="store-card-back">
        {qualification && qualification.digital_badge && (
          <img
            className="badge"
            src={
              qualification.digital_badge
                ? createCloudinaryUrl(
                    qualification.digital_badge.cloudinary_file_id,
                    'image'
                  )
                : ''
            }
            alt="qualification"
          />
        )}
        {/* <img className="m-t-40" src={badge} alt="qualification" /> */}
        <h4>{qualification && qualification.title}</h4>
        <div className="desc">
          <div className={cx({ more })}>
            <ConvertDraftObjectToHtml
              object={qualification && qualification.course_overview}
              errorMesage="No summary"
            />
          </div>
        </div>
        <div className="view-more">
          {!more ? (
            <a onClick={() => this.viewMore(true)}>View More</a>
          ) : (
            <a onClick={() => this.viewMore(false)}>View Less</a>
          )}
        </div>
        <div className="price p-20">
          <span className="semibold">Single License</span>
          <span className="is-primary semibold">
            £{qualification && qualification.price}
          </span>
        </div>
        <button
          className="button is-primary is-outlined is-fullwidth"
          onClick={() =>
            addToCart(qualification && qualification.qualification_id)
          }
        >
          Quick Buy
        </button>
      </div>
    );
  }
}

StoreCardBack.propTypes = {
  qualification: PropTypes.object,
  addToCart: PropTypes.func
};

StoreCardBack.defaultProps = {
  qualification: null,
  addToCart: () => {}
};

export default StoreCardBack;
