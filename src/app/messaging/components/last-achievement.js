import React from 'react';
import Isvg from 'react-inlinesvg';
import IconDigitalBadge from 'images/icon-digital-badge.svg';

const LastAchievement = () => (
  <div className="last-achievement">
    <Isvg src={IconDigitalBadge} />
    <h6 className="title is-6">Lastest Achievement</h6>
  </div>
);

export default LastAchievement;
