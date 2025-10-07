import React from 'react';
import cx from 'classnames';
import common from 'app/common';

import Isvg from 'react-inlinesvg';
import IconImagePreview from 'images/icon_image_preview.svg';

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

const DashboardBusinessNews = ({ openNewsViewModal, data, newsLoadMore }) => {
  return (
    <div className="dashboard-business-news">
      <div className="columns is-multiline is-marginless">
        {data.map((news, i) => {
          let newsContent = '';
          if (news.description) {
            const commas = news.description.length > 190 ? ' ...' : '';
            newsContent = news.description.slice(0, 190) + commas;
          }
          return (
            <div
              key={`news-${i}`}
              className={cx('column is-12-desktop is-12-tablet is-12-mobile', {
                'is-12-widescreen p-t-0': i === 0,
                'is-6-widescreen': i >= 1
              })}
            >
              <div className="news" onClick={() => openNewsViewModal(news)}>
                <div className="photo">
                  {news.cover ? (
                    createPhotoPreview(news.cover)
                  ) : (
                    <p className="has-text-black has-text-centered">No Image</p>
                  )}
                </div>
                <div className="content">
                  <div className="title">{news.title}</div>
                  <div className="desc">
                    <ConvertDraftObjectToHtml
                      object={news && news.short_content}
                      errorMesage="No content"
                    />
                  </div>
                  <div className="infos p-t-20">
                    <div className="date">
                      <i className="fa fa-clock-o p-r-10" /> {news.created}
                    </div>
                    <div className="view">
                      <i className="fa fa-eye p-r-10" /> {news.viewed || 0}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="buttons">
        <button className="button is-outlined" onClick={() => newsLoadMore()}>
          Load more...
        </button>
      </div>
    </div>
  );
};

export default DashboardBusinessNews;
