import React from 'react';
import VideoPlayerMain from './video-player-main';
import VideoPlayerInfo from './video-player-info';
import VideoPlayerTabs from './video-player-tabs';
import common from 'app/common';

const UILoading = common.components.UILoading;

const VideoPlayer = ({
  video,
  showInfo,
  activeTab,
  memberActions,
  toggleCurrentVideoLike,
  setViewVideo
}) => (
  <div>
    {video ? (
      <div>
        <VideoPlayerMain {...{ video, setViewVideo }} />
        {showInfo ? <VideoPlayerInfo {...{ video, activeTab }} /> : null}
        <VideoPlayerTabs
          {...{ video, memberActions, toggleCurrentVideoLike }}
        />
      </div>
    ) : (
      <UILoading />
    )}
  </div>
);

export default VideoPlayer;
