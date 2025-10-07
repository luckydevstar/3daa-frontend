import React from 'react';
import common from 'app/common';
import Moment from 'react-moment';
import IconImagePreview from 'images/icon_image_preview.svg';
import Isvg from 'react-inlinesvg';

const {
  components: { CloudinaryMedia, ConvertDraftObjectToHtml },
  util: { dateUtils }
} = common;

const createPhotoPreview = cloudinary_file_id => {
  let result = null;

  if (cloudinary_file_id) {
    result = (
      <CloudinaryMedia
        fileId={cloudinary_file_id}
        mediaType="image"
        transformations={{
          crop: 'fill',
          gravity: 'center'
        }}
      />
    );
  } else {
    result = (
      <div
        className="columns"
        style={{
          margin: 'auto',
          minHeight: '178px'
        }}
      >
        <div className="column has-text-centered p-t-40">
          <Isvg className="small" src={IconImagePreview} />
        </div>
      </div>
    );
  }
  return result;
};

const NewsCard = ({ news }) => (
  <div className="news-card">
    {createPhotoPreview(news.cover)}
    <div className="news-title is-size-5 p-t-10">{news.title}</div>
    <div
      className="news-content p-t-10"
      style={{ overflow: 'hidden', maxHeight: '90px', minHeight: '90x' }}
    >
      <ConvertDraftObjectToHtml
        object={news && news.short_content}
        errorMesage="No content"
      />
    </div>
    <div className="news-date p-t-5">
      <i className="fa fa-clock-o" /> &nbsp;
      <Moment fromNow interval={60000}>
        {news.created}
      </Moment>
    </div>
  </div>
);

export default NewsCard;
