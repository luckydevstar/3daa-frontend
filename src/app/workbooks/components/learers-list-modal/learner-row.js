import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { path } from 'ramda';
import common from 'app/common';

const { components: { ProgressBadge } } = common;

const Learner = props => {
  const {
    cloudinary_file_id,
    screen_name,
    member_id,
    current_qualification
  } = props.learner;
  const { onAssessClick } = props;
  const percentage = path(['progress_percentage'])(current_qualification) || 0;
  const qualificationName =
    path(['short_title'])(current_qualification) || 'N/A';
  const sectorName = path(['sector'])(current_qualification) || 'N/A';
  return (
    <tr className="users-table-row">
      <td>
        <ProgressBadge
          dimensions={60}
          strokeWidth={4}
          innerMargin={1}
          percentage={percentage}
          percentageFontSize={20}
          image={cloudinary_file_id || 'assets/user_card_seat_olhtg1'}
        />
      </td>
      <td>
        <Link to={`/profile/${member_id}`}>
          {screen_name}
        </Link>
      </td>
      <td>
        {sectorName}
      </td>
      <td>{`${Math.round(percentage)}%`}</td>
      <td>
        {qualificationName}
      </td>
      <td onClick={() => onAssessClick(member_id)}>
        <div className="icon-workbook" />
        <span>Assess</span>
      </td>
    </tr>
  );
};

Learner.propTypes = {
  learner: PropTypes.object.isRequired
};

export default Learner;
