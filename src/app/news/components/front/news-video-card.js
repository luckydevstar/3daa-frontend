import React from 'react';
import Moment from 'react-moment';
import ExImage from 'images/other/news3.png';

const NewsVideoCard = () => (
  <div className="news-card">
    <div className="news-video">
      <img className="news-img" src={ExImage} />
      <div className="video-info">
        <i className="fa fa-play p-r-5" /> 4:13
      </div>
    </div>
    <div className="news-title is-size-5 p-t-10">
      How did a music video end in tragedy?
    </div>
  </div>
);

export default NewsVideoCard;
