import React from 'react';
import Isvg from 'react-inlinesvg';

import IconSocialFacebook from 'images/social/icon-social-facebook.svg';
import IconSocialTwitter from 'images/social/icon-social-twitter.svg';
import IconSocialPinterest from 'images/social/icon-social-pinterest.svg';
import IconSocialLinkedin from 'images/social/icon-social-linkedin.svg';
import IconSocialInstagram from 'images/social/icon-instagram.svg';

const SocialLinks = ({ user }) => {
  return (
    <div className="profile-section social-block">
      <div className="profile-title">Social Links</div>
      <div className="columns m-b-0">
        <div className="column is-2">
          <Isvg className="small" src={IconSocialFacebook} />
        </div>
        <div className="column is-10">{user.facebook}</div>
      </div>
      <div className="columns m-b-0">
        <div className="column is-2">
          <Isvg className="small" src={IconSocialTwitter} />
        </div>
        <div className="column is-10">{user.twitter}</div>
      </div>
      <div className="columns m-b-0">
        <div className="column is-2">
          <Isvg className="small" src={IconSocialPinterest} />
        </div>
        <div className="column is-10">{user.pinterest}</div>
      </div>
      <div className="columns m-b-0">
        <div className="column is-2">
          <Isvg className="small" src={IconSocialLinkedin} />
        </div>
        <div className="column is-10">{user.linkedin}</div>
      </div>
      <div className="columns m-b-0">
        <div className="column is-2">
          <Isvg className="small" src={IconSocialInstagram} />
        </div>
        <div className="column is-10" />
      </div>
    </div>
  );
};

export default SocialLinks;
