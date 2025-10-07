import React from 'react';
import classNames from 'classnames';
import { Link, browserHistory } from 'react-router';
import CurrencyFormat from 'react-currency-format';

import common from 'app/common';
import { Text } from 'app/intl';
import { RoleNameMap } from 'app/core/config/constants';

const {
  isEmptySeat,
  isGroup,
  isLearner,
  createCloudinaryUrl
} = common.util.helpers;

const BackView = ({ activeSection, itemData }) => {
  // Item data
  const {
    member_id,
    screen_name,
    cloudinary_file_id,
    centre_number,
    outstanding_revenue,
    total_revenue
  } = itemData;

  return (
    <div className="back-view">
      <div className="semibold m-t-30" style={{ fontSize: '24px' }}>
        {screen_name || 'Centre Name'}
      </div>

      <div className="sub-title-container">
        <span>Registration Number: </span>
        <span>{`${centre_number || ''}`}</span>
      </div>

      <div className="p-15">
        <div className="has-text-centered">
          <span className="role-view p-l-25 p-r-25">Centre</span>
        </div>

        <div className="m-t-50 m-b-15 is-flex space-between">
          <span className="semibold">Revenue OutStanding</span>
          <CurrencyFormat
            value={outstanding_revenue}
            displayType={'text'}
            thousandSeparator={true}
            prefix={'£'}
            renderText={value => <span>{value}</span>}
          />
        </div>

        <hr />

        <div className="is-flex m-t-15 space-between">
          <span className="semibold">Total Revenue</span>
          <CurrencyFormat
            value={total_revenue}
            displayType={'text'}
            thousandSeparator={true}
            prefix={'£'}
            renderText={value => <span>{value}</span>}
          />
        </div>
      </div>
    </div>
  );
};

export default BackView;
