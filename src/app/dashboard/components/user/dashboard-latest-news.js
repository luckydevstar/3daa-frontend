import React from 'react';
import common from 'app/common';
import Isvg from 'react-inlinesvg';
import IconImagePreview from 'images/icon_image_preview.svg';

const {
  components: { UILoading, CloudinaryMedia, ConvertDraftObjectToHtml },
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

const DashboardLatestNews = ({ openNewsViewModal, newsData, isLoading }) => {
  // let newsContent = '';
  // if (newsData.description) {
  //   const commas = newsData.description.length > 240 ? ' ...' : '';
  //   newsContent = newsData.description.slice(0, 240) + commas;
  // }

  return (
    <div className="latest-news is-centered">
      {isLoading ? (
        <UILoading alignMiddle />
      ) : (
        <div>
          <div className="news-media is-centered">
            {newsData && newsData.cover ? (
              createPhotoPreview(newsData.cover)
            ) : (
              <p className="has-text-black has-text-centered">No Image</p>
            )}
          </div>
          <div className="news-container">
            <h1 className="news-title">
              {`${newsData && newsData.title.slice(0, 30)}`}
            </h1>
            <div className="news-content">
              <ConvertDraftObjectToHtml
                object={newsData && newsData.short_content}
                errorMesage="No content"
              />
            </div>
            <div className="news-links">
              <span onClick={() => openNewsViewModal()}>Read More</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLatestNews;
