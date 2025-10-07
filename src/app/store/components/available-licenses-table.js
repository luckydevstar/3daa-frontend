import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import * as lodash from 'lodash';
import common from 'app/common';
import { Text } from 'app/intl';

import Quantity from './quantity';

const {
  util: {
    helpers: { createCloudinaryUrl }
  }
} = common;

class AvailableLicensesTable extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const {
      qualifications,
      activeQualification,
      isDetailView,
      tempQuantities,
      activatingLicense,
      suspendingLicense,
      activatingAllLicenses,
      suspendingAllLicenses,

      setActiveQualification,
      onActiveLicense,
      onSuspendAllLicenses,
      onQuantityUpdate,
      onAddLicense,
      openChat
    } = this.props;

    return (
      <div
        className={classNames('accounts-table p-t-25', {
          'is-detail': isDetailView
        })}
      >
        <table>
          <thead>
            <tr>
              <th className="th-badge p-l-40 semibold">Badge</th>
              <th className="th-description semibold">Description</th>
              <th className="th-level semibold">Level</th>
              <th className="th-available semibold">Available</th>
              <th
                className={classNames('th-action ', {
                  'p-l-20 has-text-left': !isDetailView
                })}
              >
                {!isDetailView && (
                  <button
                    className={classNames('button is-small', {
                      'is-loading':
                        activatingAllLicenses || suspendingAllLicenses
                    })}
                    style={{ background: 'orange', color: 'white' }}
                    onClick={() => onSuspendAllLicenses()}
                  >
                    Suspend All Licenses
                  </button>
                )}
              </th>
            </tr>
          </thead>
          <tbody>
            {qualifications.map((q, i) => {
              const title = lodash.get(q, 'qualification_title', '');
              const badge = lodash.get(q, 'digital_badge_cloudinary_file_id');
              const isActive =
                lodash.get(q, 'qualification_id') ==
                lodash.get(activeQualification, 'qualification_id');
              const suspended = lodash.get(q, 'suspended');

              return (
                <tr
                  key={i}
                  className={classNames({
                    selected: isActive
                  })}
                  onClick={() => setActiveQualification(q)}
                >
                  <td className="p-t-10 p-l-30">
                    <img
                      src={badge ? createCloudinaryUrl(badge, 'image') : ''}
                    />
                  </td>
                  <td className="semibold td-description">{title}</td>
                  <td className="td-level">
                    Level {lodash.get(q, 'level', '')}
                  </td>
                  <td className="td-available">{lodash.get(q, 'free') || 0}</td>
                  <td className="td-action">
                    {isDetailView ? (
                      <button
                        className={classNames('button is-primary ', {
                          'is-outlined': !isActive
                        })}
                        onClick={() => setActiveQualification(q)}
                      >
                        View
                      </button>
                    ) : (
                      <div
                        className="is-flex"
                        style={{ justifyContent: 'space-around' }}
                      >
                        <div
                          className="is-flex"
                          style={{
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            width: '138px'
                          }}
                        >
                          <div className="semibold m-r-15">
                            <span>{!suspended ? 'Active' : 'Suspended'}</span>
                          </div>
                          {lodash.get(q, 'qualification_id') ==
                            lodash.get(
                              activeQualification,
                              'qualification_id'
                            ) &&
                          (activatingLicense || suspendingLicense) ? (
                            <div
                              className="control is-loading"
                              style={{ width: '56px' }}
                            />
                          ) : (
                            <div
                              className="field"
                              style={{ marginTop: '-6px' }}
                            >
                              <input
                                id={`centre${lodash.get(
                                  q,
                                  'qualification_id'
                                )}`}
                                type="checkbox"
                                name="account_suspended"
                                className="switch is-rounded is-success"
                                checked={!suspended}
                                onChange={e => onActiveLicense(e.target, q)}
                              />
                              <label
                                htmlFor={`centre${lodash.get(
                                  q,
                                  'qualification_id'
                                )}`}
                              />
                            </div>
                          )}
                        </div>
                        <div
                          className="is-flex"
                          style={{ alignItems: 'center' }}
                        >
                          <a className="m-r-15" onClick={() => onAddLicense(q)}>
                            Add More
                          </a>{' '}
                          &nbsp;
                          <div className="checkout-quantity">
                            <Quantity
                              quantity={
                                lodash.get(
                                  tempQuantities,
                                  q.qualification_id
                                ) || 1
                              }
                              onUpdate={v => onQuantityUpdate(q, v)}
                              showLabel={false}
                            />
                          </div>
                        </div>
                        <div
                          className="action"
                          style={{
                            borderLeft: '1px solid #dbdbdb',
                            borderRight: 'none',
                            padding: '10px 0 0 15px'
                          }}
                          onClick={() => openChat(q)}
                        >
                          <div className="action-message" />
                          <div className="action-title">
                            <Text iKey="message" />
                          </div>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

AvailableLicensesTable.propTypes = {
  isDetailView: PropTypes.bool,
  tempQuantities: PropTypes.object,
  activatingLicense: PropTypes.bool,
  suspendingLicense: PropTypes.bool,
  activatingAllLicenses: PropTypes.bool,
  suspendingAllLicenses: PropTypes.bool,

  setActiveQualification: PropTypes.func,
  onActiveLicense: PropTypes.func,
  onSuspendAllLicenses: PropTypes.func,
  onQuantityUpdate: PropTypes.func,
  onAddLicense: PropTypes.func,
  openChat: PropTypes.func
};

AvailableLicensesTable.defaultProps = {
  isDetailView: true,
  tempQuantities: {},
  activatingLicense: false,
  suspendingLicense: false,
  activatingAllLicenses: false,
  suspendingAllLicenses: false,

  setActiveQualification: () => {},
  onActiveLicense: () => {},
  onSuspendAllLicenses: () => {},
  onQuantityUpdate: (q, v) => {},
  onAddLicense: q => {},
  openChat: e => {}
};

export default AvailableLicensesTable;
