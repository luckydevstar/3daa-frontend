import React from 'react';
import PropTypes from 'prop-types';
import Isvg from 'react-inlinesvg';

import IconLicenseOrder from 'images/icon-license-order.svg';

const LatestOrders = ({ adminOrders, title }) => {
  return (
    <div className="dashboard-latest-orders box chart-block">
      <div className="block-header">
        <h4 className="opensans-semibold">{title}</h4>
      </div>
      <div className="block-content">
        <div className="orders">
          {adminOrders &&
            adminOrders.orders &&
            adminOrders.orders.map(order => {
              return (
                <div
                  className="order"
                  key={`latest-order-${order.order_number}`}
                >
                  <div className="icon">
                    <Isvg src={IconLicenseOrder} />
                  </div>
                  <div className="desc">
                    <p className="license semibold">{`${order.quantity}x Licenses`}</p>
                    <p className="provider">{order.centre_name}</p>
                  </div>
                  <div className="price semibold">{`£${order.total}`}</div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

LatestOrders.propTypes = {
  title: PropTypes.string
};

LatestOrders.defaultProps = {
  title: 'Latest 5 Orders'
};

export default LatestOrders;
