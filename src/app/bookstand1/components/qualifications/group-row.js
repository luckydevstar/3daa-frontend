import React from 'react';
import cx from 'classnames';
import { createCloudinaryUrl } from 'app/common/util/helpers';

const GroupRow = ({
  group: { title, cloudinary_file_id, member_count, group_id },
  group,
  handleGroupClick,
  isSelected
}) => {
  const imageTransformations = {
    width: 80,
    height: 80,
    crop: 'thumb',
    gravity: 'center'
  };
  const defaultGroupAvatar = 'assets/icon_community_group';
  return (
    <tr className="users-table-row" onClick={() => handleGroupClick(group)}>
      <td>
        <div
          className="group-avatar"
          style={{
            backgroundImage: `url(${createCloudinaryUrl(
              cloudinary_file_id || defaultGroupAvatar,
              'image',
              imageTransformations
            )})`,
            backgroundSize: cloudinary_file_id ? 'cover' : 'contain',
            border: cloudinary_file_id ? 0 : '15px solid #d5eae4'
          }}
        />
      </td>
      <td>{title}</td>
      <td>{`${member_count} members`}</td>
      <td className="wide">
        <div className={cx('icon-check', { selected: isSelected(group_id) })} />
      </td>
    </tr>
  );
};

export default GroupRow;
