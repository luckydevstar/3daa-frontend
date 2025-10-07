import React from 'react';
import common from 'app/common';
import Moment from 'react-moment';
import IconImagePreview from 'images/icon_image_preview.svg';
import Isvg from 'react-inlinesvg';

const {
  components: { CloudinaryMedia, ConvertDraftObjectToHtml },
  util: { dateUtils }
} = common;

const content =
  'Paris taxi drivers are not known for their flawless knowledge of the Paris street map; if you have a preferred route, say so. Taxis can also be hard to find, especially at rush hour or early in the morning. Your best bet is to find a taxi rank (station de taxis, marked with a blue sign) on major roads, crossroads and at stations. A white light on a taxi’s roof indicates the car is free; an orange light means the cab is busy. There is a service charge of €2.10. The rates are then based on zone and time of day';
const commas = content.length > 280 ? ' ...' : '';
let newsContent = content.slice(0, 280) + commas;

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
          margin: 'auto'
        }}
      >
        <div className="column">
          <Isvg className="small" src={IconImagePreview} />
        </div>
      </div>
    );
  }
  return result;
};

const NewsMainCard = ({ news }) => (
  <div className="news-card main">
    <div className="columns">
      <div className="column is-4">
        <div className="news-title is-size-4 p-t-10">{news.title}</div>
        <div
          className="news-content p-t-20"
          style={{ minHeight: '180px', maxHeight: '180px', overflow: 'hidden' }}
        >
          <ConvertDraftObjectToHtml
            object={news && news.short_content}
            errorMesage="No content"
          />
        </div>
        <div className="news-date p-t-20">
          <i className="fa fa-clock-o" /> &nbsp;
          <Moment fromNow interval={60000}>
            {news.created}
          </Moment>
        </div>
      </div>
      <div className="column is-8">{createPhotoPreview(news.cover)}</div>
    </div>
  </div>
);

export default NewsMainCard;
