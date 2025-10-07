import React from 'react';
import PropTypes from 'prop-types';
import Isvg from 'react-inlinesvg';
import common from 'app/common';

import IconMore from 'images/icon_options_blue.svg';
const { noop } = common.util.helpers;

const ChatSideHeader = ({ title, onBack }) => {
  return (
    <div className="chat-side-header align-left">
      <div className="arrows">
        <button className="backarrow" onClick={onBack} />
      </div>
      <div className="chat-title">
        <h2 className="title">{title}</h2>
      </div>
      {/* <div className="btns" onClick={onBack}>
        <Isvg src={IconMore} />
      </div> */}
    </div>
  );
};

ChatSideHeader.propTypes = {
  title: PropTypes.string,
  onBack: PropTypes.func
};

ChatSideHeader.defaultProps = {
  title: '',
  onBack: noop
};

export default ChatSideHeader;
