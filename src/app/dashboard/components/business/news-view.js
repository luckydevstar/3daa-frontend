import React from 'react';
import ReactTooltip from 'react-tooltip';
import common from 'app/common';

import NewsArticlePreview from 'app/news/components/news/preview/news-article-preview';

const {
  components: { CloudinaryMedia },
  util: { dateUtils }
} = common;

const getInitData = content => {
  let response = {};
  if (content) {
    response = JSON.parse(content);
  }
  return JSON.stringify(response);
};

const createBothPreview = (file, cloudinaryMediaType) => {
  let result = null;
  if (file) {
    if (typeof file === 'string') {
      switch (cloudinaryMediaType) {
        case 'image':
          result = (
            <CloudinaryMedia
              fileId={file}
              mediaType={cloudinaryMediaType}
              transformations={{
                crop: 'fill',
                gravity: 'center'
              }}
            />
          );
          break;
        case 'video':
          result = (
            <CloudinaryMedia
              fileId={file}
              mediaType={cloudinaryMediaType}
              thumbnail
              transformations={{
                crop: 'fill',
                gravity: 'center'
              }}
            />
          );
          break;
        default:
      }
    } else {
      if (file.type.includes('video')) {
        result = (
          <video
            src={file.preview}
            controls
            style={{ width: '100%', height: '100%', objectFit: 'fill' }}
          />
        );
      } else if (file.type.includes('image')) {
        result = (
          <img
            src={file.preview}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'fill' }}
          />
        );
      } else {
        result = <div />;
      }
    }
  }
  return result;
};

const DashboardBusinessNewsView = ({
  selectedNews,
  news,
  newsLeft,
  newsRight,
  openFacebookShare,
  openTwitterShare,
  openPinterestShare
}) => (
  <div>
    <div className="dashboard-business-news-view__header">
      {selectedNews.news_provider_header && (
        <div
          className="header-background"
          style={{
            overflow: 'hidden'
          }}
        >
          {createBothPreview(selectedNews.news_provider_header, 'image')}
        </div>
      )}
      <div className="header__share-block">
        <p
          data-tip
          data-for="news-share-tooltip"
          data-iscapture="true"
          data-event="click focus"
        >
          <div className="header__share-block__title">
            <i className="fa fa-share-alt" />
            <div>Share it</div>
          </div>
        </p>
        <ReactTooltip effect="solid" isCapture={true} id="news-share-tooltip">
          <div className="header__share-block__shares">
            <i
              className="fa fa-facebook-official"
              onClick={openFacebookShare}
            />
            <i className="fa fa-twitter" onClick={openTwitterShare} />
            <i
              className="fa fa-pinterest-square"
              onClick={openPinterestShare}
            />
          </div>
        </ReactTooltip>
      </div>
      {news && news.length > 0 && (
        <div className="header__news__pagination">
          <div className="header__news__pagination__left" onClick={newsLeft}>
            <i className="fa fa-chevron-left" />
          </div>
          <div className="header__news__pagination__count">
            {news.findIndex(item => item.news_id === selectedNews.news_id) + 1}
          </div>
          <div className="header__news__pagination__right" onClick={newsRight}>
            <i className="fa fa-chevron-right" />
          </div>
        </div>
      )}
    </div>
    <div className="dashboard-business-news-view">
      <div className="news">
        {selectedNews ? (
          <div>
            <NewsArticlePreview content={getInitData(selectedNews.content)} />
            <div className="is-flex p-t-20">
              <div className="column date">
                <i className="fa fa-clock-o p-r-10" />{' '}
                {dateUtils.formatDate(
                  new Date(selectedNews.created),
                  'yyyy-MM-dd'
                )}
              </div>
              <div className="column view" style={{ textAlign: 'right' }}>
                <i className="fa fa-eye p-r-10" /> {selectedNews.viewed || 0}
              </div>
            </div>
          </div>
        ) : (
          <div className="is-size-1 has-text-centered p-t-50 p-b-50">
            No Content
          </div>
        )}
      </div>
    </div>
  </div>
);

export default DashboardBusinessNewsView;
