import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import common from 'app/common';

const { components: { ProgressBadge } } = common;

const UserRow = ({ user, select, selected }) => {
  const {
    cloudinary_file_id,
    screen_name,
    member_id,
    current_qualification,
    registration_number
  } = user;
  let progress_percentage;
  let sector;
  let short_title;
  if (current_qualification) {
    progress_percentage = current_qualification.progress_percentage;
    sector = current_qualification.sector;
    short_title = current_qualification.short_title;
  }
  return (
    <tr className="users-table-row">
      <td>
        <ProgressBadge
          dimensions={60}
          strokeWidth={4}
          innerMargin={1}
          percentage={0} // comming soon
          percentageFontSize={20}
          strokeColorSecondary="#E5F2F5"
          strokeColor="#00a287"
          image={cloudinary_file_id || 'assets/user_card_seat_olhtg1'}
        />
      </td>
      <td>
        {member_id
          ? <Link to={`/profile/${member_id}`}>
              {screen_name}
            </Link>
          : <div>
              {registration_number}
            </div>}
      </td>
      <td>
        {sector || 'n/a'}
      </td>
      <td className="text-center">
        {`${Math.round(progress_percentage || 0)}%`}
      </td>
      <td>
        {short_title || 'n/a'}
      </td>
      <td>
        <div
          onClick={() => select(user)}
          className={`icon-check ${selected ? 'selected' : ''}`}
        />
      </td>
    </tr>
  );
};

UserRow.propTypes = {
  user: PropTypes.object.isRequired,
  select: PropTypes.func.isRequired
};

export default UserRow;
