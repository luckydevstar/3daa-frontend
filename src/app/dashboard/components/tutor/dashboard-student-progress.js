import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { filter, propEq } from 'ramda';
import cx from 'classnames';
import common from 'app/common';

import Isvg from 'react-inlinesvg';
import IconPerson from 'images/icon_profile_person.svg';
import IconMessage from 'images/icon_message.svg';

import { Creators as MessagingActions } from 'app/messaging/actions';

const {
  components: { ProgressBadge, CloudinaryMedia },
  util: {
    helpers: { noop }
  }
} = common;

const ProgressItem = ({
  title,
  member_id,
  learner,
  qualificationTitle,
  credit_value,
  cloudinary_file_id,
  progress_percentage,
  mandatory,
  screen_name,
  selected,
  onSelect,
  openChat
}) => (
  <div className={cx('progress-list', { active: selected })} onClick={onSelect}>
    <div className="inner">
      <div className="user-badge">
        {cloudinary_file_id && (
          <ProgressBadge
            image={cloudinary_file_id}
            dimensions={60}
            strokeWidth={3}
            percentage={40}
            strokeColorSecondary="rgba(0, 0, 0, .1)"
          />
        )}
        {!cloudinary_file_id && (
          <div className="no-photo">
            <Isvg src={IconPerson} />
          </div>
        )}
      </div>
      <div className="info">
        <div className="progress-title b">{screen_name}</div>
        <div className="progress-values">
          <span>{qualificationTitle}</span>
        </div>
      </div>
      <div className="person">
        <Link to={`/profile/${member_id}`}>
          <Isvg src={IconPerson} />
        </Link>
      </div>

      <div
        className="message"
        onClick={() => {
          openChat(learner, screen_name);
        }}
      >
        <Isvg src={IconMessage} />
      </div>
      <div className="oval">
        <div className="offline" />
      </div>
    </div>
  </div>
);

const DashboardStudentProgress = ({
  learners,
  qualificationTitle,
  selected,
  onItemSelect,
  startChatAttempt
}) => {
  const openChat = (member, screen_name) => {
    startChatAttempt([member], screen_name, true);
  };
  return (
    <div className="student-progress">
      {learners &&
        learners.map((learner, i) => (
          <ProgressItem
            key={`pi-${learner.member_id}`}
            {...learner}
            learner={learner}
            qualificationTitle={qualificationTitle}
            selected={selected === i}
            onSelect={() => onItemSelect(learner.member_id)}
            openChat={openChat}
          />
        ))}
    </div>
  );
};

DashboardStudentProgress.propTypes = {
  learners: PropTypes.array,
  onItemSelect: PropTypes.func,
  selected: PropTypes.number
};

DashboardStudentProgress.defaultProps = {
  learners: [],
  onItemSelect: noop,
  selected: 0
};

const { startChatAttempt } = MessagingActions;

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      startChatAttempt
    },
    dispatch
  );

export default connect(null, mapDispatchToProps)(DashboardStudentProgress);
