import React, { Component } from 'react';
import PropTypes from 'prop-types';
import common from 'app/common';
import Isvg from 'react-inlinesvg';

// import IconLock1 from 'images/icon-lock1.svg';
import IconImagePreview from 'images/icon_image_preview.svg';
// import IconWorkbooks from 'images/icon_workbooks.svg';
// import IconTrash from 'images/icon-trash.svg';

const {
  util: {
    helpers: { createCloudinaryUrl }
  },
  components: { CloudinaryMedia }
} = common;

class NewsPanel extends Component {
  createPhotoPreview(photo, width = 50, height = 50, mode = 0) {
    let result = null;

    if (photo) {
      result = (
        <CloudinaryMedia
          fileId={photo}
          mediaType="image"
          transformations={{
            width: width,
            height: height,
            crop: 'fill',
            gravity: 'center'
          }}
        />
      );
    } else if (mode == 0) {
      result = <Isvg className="small" src={IconImagePreview} />;
    }
    return result;
  }

  render() {
    const { item, onEdit } = this.props;

    return (
      <div className="item-panel">
        <div className="columns is-marginless">
          <div className="column is-11 is-paddingless">
            <div className="is-flex">
              {item.news_provider_cover && (
                <div className="news-provider-cover">
                  {this.createPhotoPreview(item.news_provider_cover, 20, 20, 1)}
                </div>
              )}
              <div>
                <span className="item-secondary-title">
                  {item.news_provider_title
                    ? item.news_provider_title
                    : 'News provider title goes Here'}
                </span>
              </div>
            </div>
          </div>
          <div className="column is-1 has-text-right is-paddingless">
            {/* <Isvg src={IconLock1} /> */}
          </div>
        </div>
        <div className="columns is-marginless p-t-5">
          <div
            className="column is-paddingless no-grow"
            style={{ minWidth: '50px', height: '50px' }}
          >
            {this.createPhotoPreview(item.cover)}
          </div>
          <div className="column is-paddingless m-l-10">
            <div className="p-t-5">
              <span className="item-title">
                {item.title ? item.title : 'Article title goes Here'}
              </span>
            </div>
            <div className="columns is-marginless">
              <div className="column is-4 is-paddingless">
                <span>{item.modified}</span>
              </div>
              <div className="column is-paddingless">
                <a onClick={() => onEdit()}>View</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

NewsPanel.propTypes = {
  item: PropTypes.object.isRequired,
  onEdit: PropTypes.func
};

NewsPanel.defaultProps = {
  item: null,
  onEdit: () => {}
};

export default NewsPanel;
