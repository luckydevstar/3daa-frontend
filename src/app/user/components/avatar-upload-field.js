import React, { Component } from 'react';
import common from 'app/common';
import { Text } from 'app/intl';
import classnames from 'classnames';

const ProfileAvatar = common.components.ProfileAvatar;

class AvatarUploadField extends Component {
  constructor(props) {
    super(props);

    this.handlePhoto = this.handlePhoto.bind(this);
    this.state = {
      profilePhoto: ''
    };
  }

  handlePhoto(ev) {
    const { target: { files } } = ev;
    if (!files[0].type || !files[0].type.match('image.*')) {
      alert('You did not upload an image.');
      return;
    }

    this.setState({
      profilePhoto: window.URL.createObjectURL(files[0])
    });
    this.props.input.onChange(files[0]);
  }

  render() {
    const { label, isCentred, input: { value, name } } = this.props;
    const { profilePhoto } = this.state;

    const avatarClass = classnames('profile-avatar m-t-10', {
      'has-text-centred': isCentred
    });

    return (
      <div>
        <div className="label">
          <Text iKey={label} />
        </div>
        <div className={avatarClass}>
          {profilePhoto
            ? <div
                className="photo"
                style={{
                  backgroundImage: `url(${profilePhoto})`
                }}
              />
            : <ProfileAvatar
                fileId={value}
                avatarSize={90}
                title={'profile avatar'}
              />}
          <div className="button is-outlined is-primary">
            Change
            <div className="photo-upload">
              <input type="file" name={name} onChange={this.handlePhoto} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AvatarUploadField;
