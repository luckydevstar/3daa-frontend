import React, { Component } from 'react';
import common from 'app/common';
import classNames from 'classnames';
import { Link, browserHistory } from 'react-router';
import { connect } from 'react-redux';
import * as lodash from 'lodash';

import { Roles } from 'app/core/config/constants';
import { Text } from 'app/intl';

import Isvg from 'react-inlinesvg';

import IconTraining from 'images/icon_training.svg';
import IconTraining1 from 'images/icon_training1.svg';
import IconWorkbook from 'images/icon_workbooks_fat_grey.svg';
import IconPDF from 'images/icon_pdf_white.svg';
import IconRemove from 'images/icon_remove.svg';

const { SuperAdmin } = Roles;

const { UICheckbox } = common.components;

const {
  getCommunityProfilePhotoUrl,
  isEmptySeat,
  isGroup,
  isLearner,
  getCommunityProfilePhotoId
} = common.util.helpers;

const CommuntyInviteListItem = ({ whatFor, item, selected, onChange }) => {
  const profilePhotoUrl = getCommunityProfilePhotoUrl(item);
  const profilePhotoId = getCommunityProfilePhotoId(item);

  return (
    <tr className="community-list-item">
      <td>
        {whatFor == 'learner' && (
          <div
            className={classNames('cover-photo', {
              'photo-exists': !!item.cloudinary_file_id
            })}
            style={{
              backgroundImage: item.cloudinary_file_id
                ? `url(${profilePhotoUrl})`
                : ''
            }}
          />
        )}

        {whatFor == 'centre' && (
          <div
            className="has-text-centered"
            style={{
              borderRadius: '50px',
              backgroundColor: 'aliceblue',
              padding: '12px',
              width: '60px',
              height: '60px'
            }}
          >
            <Isvg src={IconTraining} />
          </div>
        )}

        {whatFor == 'qualification' && (
          <div
            className="has-text-centered"
            style={{ width: '60px', height: '60px' }}
          >
            <Isvg src={IconPDF} />
          </div>
        )}
      </td>

      <td>
        {whatFor == 'invites' && <div>{item.name}</div>}

        {whatFor == 'learner' && (
          <div>
            {item.profile_name}
            <div className="reg-id">
              <Text iKey="registration_id" /> {item.member_id}
            </div>
          </div>
        )}

        {whatFor == 'centre' && (
          <div>
            {item.centre_name}
            <div className="reg-id">
              <span>Reg. ID: </span>
              <span>{item.centre_id}</span>
            </div>
          </div>
        )}

        {whatFor == 'qualification' && <div>{item.title}</div>}
      </td>

      {whatFor == 'invites' && (
        <td>
          <div>{item.centre_number}</div>
        </td>
      )}

      {whatFor == 'qualification' && (
        <td>
          <div>{item.level}</div>
        </td>
      )}

      {whatFor == 'qualification' && (
        <td>
          <div>{item.reference}</div>
        </td>
      )}

      {whatFor == 'qualification' && (
        <td>
          <div>{item.sector}</div>
        </td>
      )}

      <td>
        {whatFor == 'invites' && <div>{item.email}</div>}
        {whatFor == 'learner' && (
          <div className="has-text-centered">
            <Link to={`/profile/${item.member_id}`}>
              <div className="action-profile" />
              <div className="action-title">
                <Text iKey="profile" />
              </div>
            </Link>
          </div>
        )}

        {whatFor == 'centre' && (
          <div className="has-text-centered">
            <Isvg src={IconTraining1} />
          </div>
        )}

        {whatFor == 'qualification' && (
          <div className="has-text-centered">
            <Isvg src={IconWorkbook} />
          </div>
        )}
      </td>

      {whatFor == 'invites' ? (
        <td
          className="text-center"
          onClick={e => onChange(e)}
          style={{ cursor: 'pointer' }}
        >
          <Isvg src={IconRemove} />
        </td>
      ) : (
        <td className="text-center">
          <UICheckbox checked={selected} onChange={e => onChange(e)} />
        </td>
      )}
    </tr>
  );
};

export default connect()(CommuntyInviteListItem);
