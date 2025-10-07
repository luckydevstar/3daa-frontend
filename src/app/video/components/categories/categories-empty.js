import React from 'react';
import AddImage from 'images/video/add_category.png';
import { Text } from 'app/intl';

const VideoCategoriesEmpty = ({ toggleAddCategory }) =>
  <div className="categories-empty min-content-height-inner">
    <div className="columns">
      <div className="column">
        <h2>
          <Text iKey="add_category" />
        </h2>
        <p>
          <Text iKey="msg_add_video_category" />
        </p>
      </div>
      <div className="column">
        <img onClick={toggleAddCategory} src={AddImage} alt="Add a category" />
      </div>
    </div>
  </div>;

export default VideoCategoriesEmpty;
