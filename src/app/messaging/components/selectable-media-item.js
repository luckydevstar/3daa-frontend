import React from 'react';
import PropTypes from 'prop-types';
import common from 'app/common';
import helpers from '../util/helpers';
import cx from 'classnames';
import { Text } from 'app/intl';

const { ProfileAvatar, UICheckbox } = common.components;

const SelectableMediaItem = ({
  count,
  gender,
  isGroup,
  multiSelect,
  onSelect,
  photo,
  subtitle,
  time,
  title,
  selected
}) => (
  <li
    className={cx('media selectable', {
      'single-select': !multiSelect && selected
    })}
    onClick={onSelect || undefined}
    tabIndex={onSelect ? 0 : undefined}
  >
    {multiSelect ? <UICheckbox checked={selected} /> : null}
    <div className="media-left user-badge">
      <ProfileAvatar
        avatarSize={56}
        title={title}
        fileId={photo}
        gender={gender}
        isGroup={isGroup}
      />
    </div>
    <div className="media-content">
      <div className="content">
        {title}
        {time && <time>{helpers.formatTimestamp(time)}</time>}
      </div>
      <div className="level">
        <div className="level-left last-chat">{subtitle}</div>
        {count > 0 && (
          <div className="level-right">
            <span className="count chat-unread">{count}</span>
          </div>
        )}
      </div>
    </div>
  </li>
);

SelectableMediaItem.defaultProps = {
  count: 0,
  gender: 1,
  isGroup: false,
  multiSelect: false,
  onSelect: null,
  photo: '',
  subtitle: '',
  time: '',
  title: ''
};

SelectableMediaItem.propTypes = {
  count: PropTypes.number,
  gender: PropTypes.number,
  isGroup: PropTypes.bool,
  multiSelect: PropTypes.bool,
  onSelect: PropTypes.func,
  photo: PropTypes.string,
  subtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  time: PropTypes.string,
  title: PropTypes.string
};

export default SelectableMediaItem;
