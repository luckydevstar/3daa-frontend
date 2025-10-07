import React from 'react';
import { Text } from 'app/intl';

const VideoPlayerTabs = ({ video, memberActions, toggleCurrentVideoLike }) =>
  <section className="video-player-tabs-container content-section navigation-section">
    <div className="container navigation">
      <ul className="tabs">
        <li className="is-active">
          <a>
            <Text iKey="related" />
          </a>
        </li>
      </ul>
      <ul className="tabs right">
        <li>
          <a
            className={memberActions.liked ? 'liked' : null}
            onClick={toggleCurrentVideoLike}
          >
            <span className="icon is-small">
              <i className="fa fa-heart-o is-text-danger" />
              <i className="fa fa-heart is-text-danger" />
            </span>
            <span>
              {video.liked + memberActions.liked} <Text iKey="likes" />
            </span>
          </a>
        </li>
        {/* <li>
            <a onClick={null}>
              <span className="icon is-small">
                <i className={'fa fa-flag is-text-danger'} />
              </span>
              <span>text</span>
            </a>
          </li> */}
      </ul>
    </div>
  </section>;

export default VideoPlayerTabs;
