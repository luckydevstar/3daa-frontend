import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import cx from 'classnames';
import common from 'app/common';
import 'moment-duration-format';
import {
  cond,
  propEq,
  isEmpty,
  head,
  pipe,
  prop,
  toString,
  filter,
  indexOf,
  always,
  T
} from 'ramda';

import { Text } from 'app/intl';

const { createCloudinaryUrl, excerpt, includes } = common.util.helpers;

const prettyTimeFormat = time => {
  // Hours, minutes and seconds
  const hrs = ~~(time / 3600);
  const mins = ~~((time % 3600) / 60);
  const secs = time % 60;

  // Output like "1:01" or "4:03:59" or "123:03:59"
  let ret = '';

  if (hrs > 0) {
    ret += '' + hrs + ':' + (mins < 10 ? '0' : '');
  }

  ret += '' + mins + ':' + (secs < 10 ? '0' : '');
  ret += '' + secs;
  return ret;
};

const VideoExplorerItem = ({
  video: {
    cloudinary_file_id,
    title,
    description,
    media_id,
    duration,
    video_categories,
    thumbnail
  },
  toggleVideoDeleteModal,
  selectedCategory,
  editVideo,
  deleteVideo,
  itemClass = 'is-one-quarter'
}) => {
  let video_category_id = selectedCategory;
  if (
    isEmpty(
      filter(propEq('video_category_id', selectedCategory))(video_categories)
    )
  ) {
    video_category_id = pipe(
      head(),
      prop('video_category_id')
    )(video_categories);
  }
  const videoPath = `${video_category_id}/${media_id}`;
  const videoUrl = cond([
    [
      x => indexOf('content-manager', x) !== -1,
      always(`/videos/content-manager/${videoPath}`)
    ],
    [
      x => indexOf('favourites', x) !== -1,
      always(`/videos/favourites/${videoPath}`)
    ],
    [T, always(`/videos/${videoPath}`)]
  ])(window.location.pathname);

  return (
    <div
      className={cx('video column', itemClass, {
        'video-max-width': selectedCategory
      })}
    >
      <div
        className="hover-capture"
        style={{
          backgroundImage: `url(${createCloudinaryUrl(
            thumbnail ? thumbnail : cloudinary_file_id,
            thumbnail ? 'image' : 'thumbnail',
            { width: 300, height: 300, crop: 'fill', gravity: 'center' }
          )})`,
          backgroundPosition: 'center center',
          backgroundSize: 'cover',
          backgroundColor: '#d5eae4'
        }}
      >
        <Link className="play-arrow" to={videoUrl}>
          <i className="fa fa-play" aria-hidden="true" />
          <div className="duration" to={videoUrl}>
            {prettyTimeFormat(duration)}
          </div>
        </Link>
        <Link className="title" to={videoUrl}>
          <div className="name">{title}</div>
        </Link>
        <div className="info">
          <div className="sub-category">
            {pipe(head(), prop('title'))(video_categories)}
          </div>
          <div className="description">
            {excerpt(toString(description), 70)}
            {editVideo ? (
              <div className="video-edit-actions">
                <a className="edit" onClick={() => editVideo(media_id)}>
                  <i className="fa fa-pencil" />
                  <Text iKey="edit" />
                </a>
                <a
                  className="del is-text-danger"
                  onClick={() =>
                    toggleVideoDeleteModal(video_category_id, media_id)
                  }
                >
                  <i className="fa fa-trash is-text-danger" />
                  <Text iKey="delete" />
                </a>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

VideoExplorerItem.propTypes = {
  video: PropTypes.object.isRequired
};

export default VideoExplorerItem;
