import React from 'react';
import AddImage from 'images/video/empty_category.png';
import common from 'app/common';

const UILoading = common.components.UILoading;

const VideoCategoriesEmpty = ({ uiLoadingCategories }) =>
  <div className="categories-empty min-content-height-inner">
    {uiLoadingCategories
      ? <UILoading />
      : <div className="columns">
          <div className="column">
            <h2>No Categories Yet</h2>
            <p>
              Please wait for administrator to add catergories for video
              contents
            </p>
          </div>
          <div className="column">
            <img src={AddImage} alt="No videos" />
          </div>
        </div>}
  </div>;

export default VideoCategoriesEmpty;
