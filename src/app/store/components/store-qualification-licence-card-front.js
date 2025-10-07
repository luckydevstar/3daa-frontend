import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { IntercomAPI } from 'react-intercom';
import * as lodash from 'lodash';
import common from 'app/common';
import { Text } from 'app/intl';
import Isvg from 'react-inlinesvg';
import IconMessage from 'images/icon_message.svg';

const {
  components: { CloudinaryMedia, ConvertDraftObjectToHtml },
  util: {
    helpers: { extractUserRole }
  }
} = common;

class StoreQualificationLicenceCardFront extends Component {
  constructor(props) {
    super(props);

    this.openIntercom = this.openIntercom.bind(this);
  }

  openIntercom() {
    IntercomAPI('showNewMessage', 'Hi');
  }

  render() {
    const { className, qualification, thumbnail } = this.props;

    const imageDimesnions = {
      width: 390,
      height: 230
    };

    const title = lodash.get(qualification, 'title', '');
    const price = lodash.get(qualification, 'price', 0);
    const free_licenses = lodash.get(qualification, 'free_licenses', 0);
    const cover = lodash.get(qualification, 'cover', null);
    const cover_type = lodash.get(qualification, 'cover_type', 'image');
    const video = lodash.get(qualification, 'video', null);
    const digital_badge = lodash.get(
      qualification,
      'digital_badge.cloudinary_file_id',
      null
    );
    const overview = lodash.get(qualification, 'overview', {});

    return (
      <div className={`store-qualification-licence-card-front ${className}`}>
        <div className="card-image">
          {video ? (
            <CloudinaryMedia
              style={{ ...imageDimesnions }}
              mediaType="video"
              fileId={video}
              attributes={{ autoPlay: true, loop: true }}
              thumbnail={thumbnail}
              transformations={{
                width: imageDimesnions.width,
                height: imageDimesnions.height,
                crop: 'fill',
                gravity: 'north',
                quality: 100
              }}
            />
          ) : (
            <div
              className="no-video"
              style={{
                width: imageDimesnions.width,
                height: imageDimesnions.height
              }}
            >
              No Video
            </div>
          )}
        </div>

        <div className="card-content actions">
          <div className="title opensans-semibold p-t-10">
            {title.length > 78 ? `${title.slice(0, 75)}...` : title}
          </div>

          <div className="is-flex space-between">
            <div className="price">
              <span className="numbers opensans-semibold">£{price}</span>
              <span>&nbsp;&nbsp;each</span>
            </div>
            <div className="licences">
              <span>Licences Available &nbsp;</span>
              <span className="numbers opensans-semibold">{free_licenses}</span>
            </div>
          </div>

          <hr />

          <div className="">
            <div className="columns m-b-0" onClick={this.openIntercom}>
              <div className="column flex-none">
                <a className="speech">
                  <Isvg src={IconMessage} />
                </a>
              </div>
              <div className="column">
                <h3 style={{ color: 'black' }}>Have a question?</h3>
                <div className="em">
                  Help and advice available 24 hours a day, 7 days a week
                </div>
              </div>
            </div>
          </div>

          <hr />

          <div className="">
            <div className="opensans-semibold p-b-15 has-text-black">
              Qualification aim
            </div>
          </div>
          <div className="overview">
            <ConvertDraftObjectToHtml
              object={overview}
              errorMesage="No summary"
            />
          </div>
        </div>
      </div>
    );
  }
}

StoreQualificationLicenceCardFront.propTypes = {
  className: PropTypes.string,
  qualification: PropTypes.object,
  thumbnail: PropTypes.bool
};

StoreQualificationLicenceCardFront.defaultProps = {
  className: '',
  qualification: {},
  thumbnail: false
};

export default StoreQualificationLicenceCardFront;
