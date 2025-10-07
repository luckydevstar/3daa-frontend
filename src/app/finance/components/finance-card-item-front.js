import React from 'react';
import classNames from 'classnames';
import common from 'app/common';
import { Link, browserHistory } from 'react-router';
import Isvg from 'react-inlinesvg';
import * as lodash from 'lodash';

import { Text, Unit } from 'app/intl';

const { createCloudinaryUrl } = common.util.helpers;

const FrontView = ({
  itemData,
  openChat,
  onActive,

  activating,
  suspending
}) => {
  // Item data
  const {
    member_id,
    centre_id,
    number_of_learners,
    cloudinary_file_id,
    logo,
    online,
    suspended
  } = itemData;

  const screen_name = lodash.get(itemData, 'screen_name') || 'Centre Name';

  return (
    <div className="front-view">
      <div className="inner">
        <div className="user-role has-text-centered">
          <span className="role-view p-l-25 p-r-25">Centre</span>
        </div>
        <div
          className={classNames('cover-photo', {
            'photo-exists': !!cloudinary_file_id
          })}
          style={{
            background: 'salmon',
            backgroundImage: cloudinary_file_id
              ? `url(${createCloudinaryUrl(cloudinary_file_id, 'image')})`
              : null
          }}
        />
        <div className="description">
          <div
            className="user-badge"
            style={{
              width: '74px',
              height: '74px',
              backgroundImage: logo
                ? `url(${createCloudinaryUrl(logo, 'image')})`
                : null
            }}
          />
          {/* Card header/basic information */}

          <div className={classNames('status', { online })}>
            {online ? <Text iKey="online" /> : <Text iKey="offline" />}
          </div>
          <div className="title">
            {lodash.get(screen_name, 'length', 0) > 28
              ? `${screen_name.slice(0, 25)}...`
              : screen_name}
          </div>
          <div className="sub-title-container">
            <div className="learner-count opensans-semibold">
              {`${number_of_learners} Learners`}
            </div>
          </div>

          <div className="actions">
            <div className="inner">
              <div
                className="is-flex"
                style={{ justifyContent: 'flex-end', alignItems: 'center' }}
              >
                <div className="semibold m-r-15">
                  <span>Account</span>&nbsp;
                  <span>{!suspended ? 'Active' : 'Suspended'}</span>
                </div>
                {activating || suspending ? (
                  <div
                    className="control is-loading"
                    style={{ width: '56px' }}
                  />
                ) : (
                  <div className="field">
                    <input
                      id={`centre${member_id}`}
                      type="checkbox"
                      name="account_suspended"
                      className="switch is-rounded is-success"
                      checked={!suspended}
                      onChange={e => onActive(e.target, itemData)}
                    />
                    <label htmlFor={`centre${member_id}`} />
                  </div>
                )}
              </div>

              <div
                className="is-flex m-t-15"
                style={{ justifyContent: 'center' }}
              >
                <button
                  onClick={() => openChat(itemData, screen_name)}
                  className="button is-small is-primary is-outlined is-rounded m-r-10"
                >
                  <Text iKey="message" />
                </button>

                <Link to={`/finance/accounts/${centre_id}`}>
                  <button
                    className={classNames(
                      'button is-small Link is-primary is-outlined is-rounded'
                    )}
                  >
                    <Text iKey="view_profile" />
                  </button>
                </Link>
              </div>

              <hr />

              <div className="p-b-15 semibold">
                <span>
                  <Text iKey="registration_number" />: {centre_id}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrontView;
