import React from 'react';
import classNames from 'classnames';
import { Link, browserHistory } from 'react-router';
import common from 'app/common';
import { Text } from 'app/intl';
import { contains } from 'ramda';
import moment from 'moment';
import { RoleNameMap } from 'app/core/config/constants';

const {
  isEmptySeat,
  isGroup,
  isLearner,
  createCloudinaryUrl
} = common.util.helpers;

const CommunityCardItemBackAdmin = ({
  activeSection,
  itemData,
  roleString
}) => {
  const {
    member_id,
    centre_roles,
    centre_name,
    centre_address,
    roles,
    screen_name
  } = itemData;

  return (
    <div className="view">
      <div className="user-name">{screen_name}</div>
      <div className="has-text-centered p-5 m-b-40">
        <span className="role-view">
          <Text iKey={roleString} />
        </span>
      </div>
      <hr />
      <div className="control is-marginless m-t-40">
        <button
          onClick={() => {}}
          className="button is-medium is-primary is-rounded"
        >
          <Text iKey="Preference Settings" />
        </button>
      </div>
    </div>
  );
};

export default CommunityCardItemBackAdmin;
