import React from 'react';

const VideoSearch = ({ onSearch, searchTerm }) => (
  <p className="control search">
    <input
      className="input"
      type="text"
      placeholder="Search videos"
      onChange={({ target: { value } }) => onSearch(value)}
      value={searchTerm}
    />
  </p>
);

export default VideoSearch;
