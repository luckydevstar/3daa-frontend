import 'moment-duration-format';
import React from 'react';
import { Link } from 'react-router';
import moment from 'moment';
import { cond, indexOf, always, T } from 'ramda';
import { Text } from 'app/intl';

const VideoPlayerInfo = ({ video: { title, duration, description } }) =>
  <section className="content-section video-player-info">
    <div className="container">
      <div className="align-left top columns">
        <div className="info hero column is-three-quarters">
          <div className="media">
            <div className="media-left">
              <Link
                to={cond([
                  [
                    x => indexOf('content-manager', x) !== -1,
                    always('/videos/content-manager')
                  ],
                  [
                    x => indexOf('favourites', x) !== -1,
                    always('/videos/favourites')
                  ],
                  [T, always('/videos')]
                ])(window.location.pathname)}
                className="back-button"
              />
            </div>
            <div className="media-content">
              <div className="title">
                {title || 'No video!'}
              </div>
              <p>
                {description}
              </p>
            </div>
          </div>
        </div>
        <div className="actions align-right column">
          <div className="runtime">
            <Text iKey="runtime" />
            <span>
              {' '}{moment
                .duration(duration, 'seconds')
                .format('h:mm:ss', { trim: false })}
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>;

export default VideoPlayerInfo;
