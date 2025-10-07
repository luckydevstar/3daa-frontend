import React, { Component } from 'react';
import PropTypes from 'prop-types';
import common from 'app/common';
import classNames from 'classnames';
import Isvg from 'react-inlinesvg';

import IconLock1 from 'images/icon-lock1.svg';
import IconImagePreview from 'images/icon_image_preview.svg';

import IconPlus from 'images/icon-plus.svg';
import IconWorkbooks from 'images/icon_workbooks.svg';
import IconTrash from 'images/icon-trash.svg';

const {
  util: {
    helpers: { createCloudinaryUrl }
  },
  components: { CloudinaryMedia }
} = common;

class NewsFeedPanel extends Component {
  createPhotoPreview(photo, mode = 0, width = 50, height = 50) {
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
          <div
            className="column is-paddingless no-grow news-feed-panel-img"
            style={{ minWidth: '50px', height: '50px' }}
          >
            {this.createPhotoPreview(item.cover)}
          </div>
          <div className="column is-paddingless m-l-10">
            <div>
              <a className="item-title" onClick={() => onEdit()}>
                {item.title}
              </a>
            </div>
            <div className="columns is-marginless p-t-5">
              <div className="column is-4 is-paddingless">
                <span className="has-text-black">Inspired &nbsp;</span>
                <label className="custom radio">
                  <input
                    name="status"
                    type="checkbox"
                    defaultChecked={item ? item.inspired : false}
                  />
                  <span className="ui" />
                </label>
              </div>
              <div className="column is-paddingless">
                <div className="right-icons">
                  {item.header ? <Isvg src={IconWorkbooks} /> : null}
                  {item.cover ? <Isvg src={IconPlus} /> : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

NewsFeedPanel.propTypes = {
  item: PropTypes.object.isRequired,
  onEdit: PropTypes.func
};

NewsFeedPanel.defaultProps = {
  item: null,
  onEdit: () => {}
};

export default NewsFeedPanel;
