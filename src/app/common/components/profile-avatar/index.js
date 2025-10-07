import React from 'react';
import PropTypes from 'prop-types';
import icon_male from 'images/icon_male_profile.svg';
import icon_female from 'images/icon_female_profile.svg';
import icon_group from 'images/icon_group.svg';
import util from '../../util';

const createCloudinaryUrl = util.helpers.createCloudinaryUrl;

const ProfileAvatar = ({
  avatarSize,
  className,
  fileId,
  gender,
  isGroup,
  title,
  transformations
}) => {
  const createImageUrl = image =>
    createCloudinaryUrl(image, 'image', {
      ...transformations,
      width: avatarSize * 2,
      height: avatarSize * 2
    });

  let defaultImageUrl;

  let styles = null;

  if (fileId) {
    defaultImageUrl = createImageUrl(fileId);
  } else {
    if (isGroup) defaultImageUrl = icon_group;
    else if (gender === 2) defaultImageUrl = icon_female;
    else defaultImageUrl = icon_male;
    styles = {
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      border: `${avatarSize * 0.2}px solid transparent`
    };
  }

  return (
    <figure title={title}>
      <div
        style={{
          ...styles,
          width: avatarSize,
          height: avatarSize,
          backgroundImage: `url(${defaultImageUrl})`
        }}
        className={className}
      />
    </figure>
  );
};

ProfileAvatar.propTypes = {
  avatarSize: PropTypes.number,
  className: PropTypes.string,
  fileId: PropTypes.string,
  gender: PropTypes.number,
  isGroup: PropTypes.bool,
  title: PropTypes.string,
  transformations: PropTypes.object
};

ProfileAvatar.defaultProps = {
  avatarSize: 85,
  className: 'profile-thumbnail is-round',
  fileId: null,
  gender: 1,
  isGroup: false,
  title: PropTypes.string,
  transformations: {
    radius: 'max',
    crop: 'thumb',
    gravity: 'face'
  }
};

export default ProfileAvatar;
