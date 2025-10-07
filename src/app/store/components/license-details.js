import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import * as lodash from 'lodash';
import Isvg from 'react-inlinesvg';

import common from 'app/common';
import Quantity from './quantity';
import IconMessage from 'images/icon_message.svg';
import { IntercomAPI } from 'react-intercom';

const {
  components: { CloudinaryMedia, UILoading }
} = common;

const videoDimesnions = {
  width: 338,
  height: 170
};

class LicenseDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      quantity: 1
    };

    this.handleQuantityUpdate = this.handleQuantityUpdate.bind(this);
    this.handleAddToCart = this.handleAddToCart.bind(this);
    this.openIntercom = this.openIntercom.bind(this);
  }

  UNSAFE_componentWillMount() {
    this.setState({
      quantity: this.props.count
    });
  }

  handleQuantityUpdate(q) {
    this.setState({
      quantity: q
    });
  }

  handleAddToCart() {
    const { qualification, addToCart } = this.props;
    const { quantity } = this.state;

    const qualification_id = lodash.get(qualification, 'qualification_id');

    if (!qualification_id) return;

    addToCart(qualification_id, quantity);
    // browserHistory.push('/store/basket');
  }

  openIntercom() {
    IntercomAPI('showNewMessage', 'Hi');
  }

  render() {
    const {
      cart,
      qualification,
      visibleVideo,
      attemptingQualificationLicense
    } = this.props;
    const { quantity } = this.state;

    const qualificationId = lodash.get(qualification, 'qualification_id');
    const title = lodash.get(qualification, 'qualification_title', '');
    const price = lodash.get(qualification, 'price', 0);
    const videoId = lodash.get(qualification, 'video');
    const visibleAddToBasket =
      cart.findIndex(item => item.qualification_id == qualificationId) < 0;

    if (attemptingQualificationLicense) {
      return (
        <div className="license-details p-t-30">
          <UILoading />
        </div>
      );
    }

    return (
      <div className="license-details">
        {qualification ? (
          <div>
            <h1 className="title opensans-semibold">
              {title.length > 78 ? `${title.slice(0, 75)}...` : title}
            </h1>
            <div className="video-section">
              {visibleVideo && (
                <div className="">
                  {videoId ? (
                    <CloudinaryMedia
                      style={{ ...videoDimesnions }}
                      mediaType="video"
                      fileId={videoId}
                      attributes={{ autoPlay: true, loop: true }}
                      transformations={{
                        width: videoDimesnions.width,
                        height: videoDimesnions.height,
                        crop: 'fill',
                        gravity: 'north',
                        quality: 100
                      }}
                    />
                  ) : (
                    <div
                      className="no-video"
                      style={{
                        width: videoDimesnions.width,
                        height: videoDimesnions.height
                      }}
                    >
                      No Video
                    </div>
                  )}
                </div>
              )}
              <div className="price">
                <span className="semibold">£{price}</span> Each
              </div>
            </div>

            <div className="quantity-section">
              <div className="quantity-container">
                <Quantity
                  quantity={quantity}
                  onUpdate={this.handleQuantityUpdate}
                />
              </div>
              {visibleAddToBasket && (
                <button
                  className="button basket"
                  onClick={() => this.handleAddToCart()}
                >
                  Add To Basket
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="has-text-centered" style={{ fontSize: '1.5rem' }}>
            Please select the qualification.
          </div>
        )}

        <div className="is-flex m-t-30" onClick={() => this.openIntercom()}>
          <div style={{ padding: '5px 15px 15px' }}>
            <a className="speech">
              <Isvg src={IconMessage} />
            </a>
          </div>
          <div>
            <h3 style={{ color: 'black' }}>Have a question?</h3>
            <div className="em">
              Help and advice available 24 hours a day, 7 days a week
            </div>
            <div>Please note: Live chat is available in English only</div>
          </div>
        </div>
      </div>
    );
  }
}

LicenseDetails.propTypes = {
  qualification: PropTypes.any,
  visibleVideo: PropTypes.bool,
  count: PropTypes.number,
  addToCart: PropTypes.func
};

LicenseDetails.defaultProps = {
  qualification: null,
  visibleVideo: true,
  count: 1,
  addToCart: () => {}
};

const mapStateToProps = ({ store, profile }) => ({
  cart: lodash.get(store, 'cart')
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(LicenseDetails);
