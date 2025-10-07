import React from 'react';
import PropTypes from 'prop-types';
import Isvg from 'react-inlinesvg';
import { map } from 'ramda';

import common from 'app/common';
import helpers from '../util/helpers';
import IconMore from 'images/icon_options_blue.svg';

const { ProfileAvatar } = common.components;
const { noop } = common.util.helpers;

const ChatHeader = ({
  chat,
  closePanel,
  onAvatarClick,
  onBack,
  panelOpen,
  showActions,
  side
}) => {
  const members = helpers.participants(chat);

  return (
    <div className="header align-left">
      {side && (
        <div>
          <button className="backarrow" onClick={onBack} />
        </div>
      )}
      <div className="avatars">
        <div>
          {map(
            p => (
              <div
                className="mini-avatar"
                key={`ch-p-${p.object_id}`}
                onClick={() => onAvatarClick(p)}
              >
                <ProfileAvatar
                  fileId={p.photo}
                  title={p.screen_name}
                  avatarSize={32}
                />
              </div>
            ),
            members
          )}
        </div>
        <div className="subtitle">
          <span className="status online" />
          <span>Online</span>
        </div>
      </div>
      <div className="chat-title has-text-centered">
        <h2 className="title">{chat.title}</h2>
      </div>
      {!side && (
        <div>
          <div className="show-panel">
            {panelOpen ? (
              <div onClick={closePanel}>
                <i className="fa fa-angle-right" />
              </div>
            ) : (
              <div onClick={showActions}>
                <Isvg src={IconMore} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

ChatHeader.propTypes = {
  chat: PropTypes.object,
  closePanel: PropTypes.func,
  onAvatarClick: PropTypes.func,
  onBack: PropTypes.func,
  panelOpen: PropTypes.bool,
  showActions: PropTypes.func,
  side: PropTypes.bool
};

ChatHeader.defaultProps = {
  chat: {},
  closePanel: noop,
  onAvatarClick: noop,
  onBack: noop,
  panelOpen: false,
  showActions: noop,
  side: false
};

export default ChatHeader;
