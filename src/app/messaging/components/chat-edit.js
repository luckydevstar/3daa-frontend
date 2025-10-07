import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import common from 'app/common';
import Isvg from 'react-inlinesvg';
import IconClose from 'images/icon_close.svg';

const ProfileAvatar = common.components.ProfileAvatar;
const noop = common.util.helpers.noop;

class ChatEdit extends Component {
  constructor(props) {
    super(props);

    this.handlePhoto = this.handlePhoto.bind(this);
    this.state = {
      profilePhoto: '',
      file: null,
      title: props.chat.title
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { chat: chat0 } = this.props;
    const { chat: chat1 } = nextProps;

    if (chat1 && (!chat0 || chat0.chat_id !== chat1.chat_id)) {
      this.setState({
        profilePhoto: '',
        title: chat1.title
      });
    }
  }

  handlePhoto(files) {
    if (!files[0].type || !files[0].type.match('image.*')) {
      alert('You did not upload an image.');
      return;
    }

    this.setState({
      profilePhoto: window.URL.createObjectURL(files[0]),
      file: files[0]
    });
  }

  render() {
    const { attempting, chat, isOwner, onClose, onSave } = this.props;
    const { profilePhoto, title, file } = this.state;

    const saveClass = classnames('button is-primary', {
      'is-loading': attempting
    });

    const chatChanged = title !== chat.title || profilePhoto;

    return (
      <div className="chat-properties-edit">
        <div className="avatar">
          <div className="photo">
            {profilePhoto ? (
              <div
                style={{
                  backgroundImage: `url(${this.state.profilePhoto})`
                }}
              />
            ) : (
              <ProfileAvatar
                avatarSize={140}
                fileId={chat.cloudinary_file_id}
                title={title}
              />
            )}
          </div>
          <br />
          {isOwner && (
            <div className="button is-outlined is-primary">
              Choose Image
              <input
                className="photo-upload"
                type="file"
                onChange={({ target: { files } }) => this.handlePhoto(files)}
              />
            </div>
          )}
        </div>
        <div className="field m-t-10">
          <label htmlFor="title" className="label">
            Chat Name
          </label>
          <div className="control">
            <input
              className="input"
              name="title"
              type="text"
              value={title}
              placeholder="Chat name"
              disabled={!isOwner}
              onChange={({ target: { value } }) =>
                this.setState({ title: value })
              }
            />
          </div>
        </div>
        <div className="close" onClick={onClose}>
          <Isvg src={IconClose} />
        </div>
        {isOwner && (
          <div className="save">
            <a
              className={saveClass}
              disabled={!chatChanged}
              onClick={() => onSave(title, file)}
            >
              Save
            </a>
          </div>
        )}
      </div>
    );
  }
}

ChatEdit.propTypes = {
  attempting: PropTypes.bool,
  chat: PropTypes.object,
  isOwner: PropTypes.bool,
  onClose: PropTypes.func,
  onSave: PropTypes.func
};

ChatEdit.defaultProps = {
  attempting: false,
  chat: {},
  isOwner: false,
  onClose: noop,
  onSave: noop
};

export default ChatEdit;
