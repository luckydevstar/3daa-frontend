import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import * as lodash from 'lodash';
import moment from 'moment';
import { Text } from 'app/intl';

class RecentOrdersTable extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const {
      orders,
      activeOrder,
      detailView,
      onChat,
      isViewButton,
      isViewChat
    } = this.props;
    const temp = lodash.get(orders, 'orders') || [];

    return (
      <div className="accounts-table is-detail p-t-25">
        <table>
          <thead>
            <tr>
              <th className="th-order-number p-l-40 semibold">Order Number</th>
              <th className="th-date semibold">Date</th>
              <th className="th-level semibold">Status</th>
              <th className="th-available semibold">Total</th>
              <th
                className={classNames('th-action semibold', {
                  'th-chat': isViewChat
                })}
              >
                {isViewButton && 'Action'}
              </th>
            </tr>
          </thead>
          <tbody>
            {temp.map((item, i) => {
              const isActive =
                lodash.get(item, 'qualification_license_transaction_id') ==
                lodash.get(activeOrder, 'qualification_license_transaction_id');

              return (
                <tr
                  key={`order_${i}`}
                  className={classNames({
                    selected: isActive
                  })}
                  onClick={() => detailView(item)}
                >
                  <td className="td-order-number p-l-40">
                    <h2>{item.qualification_license_transaction_id || ''}</h2>
                  </td>
                  <td className="td-date">
                    {item.created &&
                      moment(item.created)
                        .tz('Europe/London')
                        .format('ll')}
                  </td>
                  <td className="td-level">
                    {item.status ? 'Complete' : 'Incomplete'}
                  </td>
                  <td className="td-available">£{item.total || 0}</td>
                  {isViewButton && (
                    <td className="td-action">
                      <button
                        className={classNames('button is-primary ', {
                          'is-outlined': !isActive
                        })}
                      >
                        View
                      </button>
                    </td>
                  )}

                  {isViewChat && (
                    <td className="td-action td-chat">
                      <div
                        className="action"
                        style={{
                          borderLeft: '1px solid #dbdbdb',
                          borderRight: 'none'
                        }}
                        onClick={() => openChat(item)}
                      >
                        <div className="action-message" />
                        <div className="action-title">
                          <Text iKey="message" />
                        </div>
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

RecentOrdersTable.propTypes = {
  isViewButton: PropTypes.bool,
  isViewChat: PropTypes.bool,
  orders: PropTypes.object,
  activeOrder: PropTypes.object,

  detailView: PropTypes.func,
  onChat: PropTypes.func
};

RecentOrdersTable.defaultProps = {
  isViewButton: true,
  isViewChat: false,
  orders: {
    orders: [],
    total: 0
  },
  activeOrder: null,

  detailView: () => {},
  onChat: e => {}
};

export default RecentOrdersTable;
