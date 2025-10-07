import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import common from 'app/common';
import { Creators as Actions } from '../actions';
import IconAddMedia from 'images/icon_profile_add_media.svg';

const { CloudinaryMedia, UILoading } = common.components;

const MediaItem = ({ media }) => {
  return media ? (
    <CloudinaryMedia
      alt={media.title}
      fileId={media.cloudinary_file_id}
      mediaType="image"
      thumbnail
    />
  ) : (
    <img alt="title" src={IconAddMedia} />
  );
};

class MediaList extends Component {
  UNSAFE_componentWillMount() {
    this.fetchMedia(this.props);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.member_id !== nextProps.member_id) {
      this.fetchMedia(nextProps);
    }
  }

  fetchMedia(props) {
    const { getMedia, mediaList, member_id } = props;

    if (!mediaList[member_id]) {
      getMedia(member_id);
    }
  }

  render() {
    const { gettingMedia, mediaList, member_id } = this.props;

    const list = mediaList[member_id];

    return (
      <div className="profile-media-list">
        {gettingMedia ? (
          <div className="columns">
            <UILoading alignMiddle />
          </div>
        ) : (
          <div className="columns">
            <div className="column is-two-thirds img-container">
              <MediaItem media={list && list[0]} />
            </div>
            <div className="column right-column">
              <div className="row img-container">
                <MediaItem media={list && list[1]} />
              </div>
              <div className="row img-container">
                <MediaItem media={list && list[2]} />
              </div>
            </div>
          </div>
        )}

        <Link to={`/profile/${member_id}`}>View full profile</Link>
      </div>
    );
  }
}

MediaList.propTypes = {
  member_id: PropTypes.number
};

MediaList.defaultProps = {
  member_id: 0
};

const mapStateToProps = ({ chats: { mediaList, gettingMedia } }) => ({
  gettingMedia,
  mediaList
});

const mapDispatchToProps = dispatch => ({
  getMedia: member_id => dispatch(Actions.getMediaAttempt(member_id))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MediaList);
