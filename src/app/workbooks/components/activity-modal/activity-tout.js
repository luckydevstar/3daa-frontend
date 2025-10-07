import React from 'react';
import PropTypes from 'prop-types';
import activityPrompt from 'images/activity-prompt.svg';
import common from 'app/common';

const AmazonMedia = common.components.AmazonMedia;

const ActivityTout = props => {
  const { tout, toutType } = props;
  let content = null;

  switch (toutType) {
    case 'image':
      content = <AmazonMedia mediaType={toutType} fileId={tout} />;
      break;
    case 'video':
      content = (
        <AmazonMedia
          mediaType={toutType}
          fileId={tout}
          attributes={{ autoPlay: true, loop: true }}
        />
      );
      break;
    default:
      content = <img alt="activityPrompt" src={activityPrompt} />;
      break;
  }

  return content;
};

ActivityTout.propTypes = {
  tout: PropTypes.string.isRequired,
  toutType: PropTypes.string
};

export default ActivityTout;
