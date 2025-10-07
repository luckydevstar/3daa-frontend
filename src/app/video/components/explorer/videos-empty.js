import React from 'react';
import AddImage from 'images/video/add_video.png';
import EmptyImage from 'images/video/empty_video.png';

import { Text } from 'app/intl';

const DefaultEmpty = ({ toggleAddVideo }) =>
  toggleAddVideo ? (
    <div className="column">
      <h2>
        <Text iKey="add_video" />
      </h2>
      <p>
        <Text iKey="msg_add_video_to_this_category" />
      </p>
    </div>
  ) : (
    <div className="column">
      <h2>
        <Text iKey="no_videos" />
      </h2>
      <p>
        <Text iKey="msg_contact_an_administrator" />
      </p>
    </div>
  );

const SearchEmpty = ({ searchTerm }) => (
  <div className="column">
    <h2>
      <Text iKey="no_results" />
    </h2>
    <p>
      <Text iKey="msg_there_are_no_matches_for_search" /> {` "${searchTerm}"`}.
    </p>
  </div>
);

const VideosEmpty = ({ searchTerm, toggleAddVideo, selectedSubCategory }) => (
  <div className="videos-empty min-content-height-inner">
    <div className="columns">
      {searchTerm ? (
        <SearchEmpty {...{ searchTerm }} />
      ) : (
        <DefaultEmpty {...{ toggleAddVideo }} />
      )}
      <div className="column">
        {toggleAddVideo && selectedSubCategory > 0 ? (
          <img onClick={toggleAddVideo} src={AddImage} alt="Add a video" />
        ) : (
          <img src={EmptyImage} alt="No videos" />
        )}
      </div>
    </div>
  </div>
);

export default VideosEmpty;
