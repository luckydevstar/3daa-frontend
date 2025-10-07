import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as lodash from 'lodash';
import common from 'app/common';
import Quantity from './quantity';

const { noop } = common.util.helpers;

const StoreCheckoutTable = ({
  items,
  total,
  showQuantity,
  selectedCentreMembers,
  removeItem,
  onQuantityUpdate
}) => {
  return (
    <div className="store-checkout-table">
      <div className="store-checkout-table-header">
        <div className="checkout-description"> Description </div>

        {showQuantity && <div className="price"> Price </div>}

        {showQuantity && <div className="checkout-quantity"> Quantity </div>}

        <div className="total"> Total </div>
        <div className="remove-button-box" />
      </div>

      {items.map((item, i) => {
        return (
          <div key={i} className="store-checkout-table-row border-bottom">
            <div className="checkout-description">
              <h2>{item.title}</h2>
            </div>
            {showQuantity && (
              <div className="price">
                <div>£{item.price}</div>
              </div>
            )}

            {showQuantity && (
              <div className="checkout-quantity">
                <Quantity
                  quantity={item.count}
                  onUpdate={v => onQuantityUpdate(i, v)}
                  showLabel={false}
                />
              </div>
            )}

            {showQuantity ? (
              <div className="total">
                <div>
                  <h2>£{(item.price * item.count).toFixed(2)}</h2>
                </div>
              </div>
            ) : (
              <div className="total">
                <span>{lodash.get(selectedCentreMembers, 'length', 0)}</span>
                <span> Licences </span>
              </div>
            )}

            <div className="remove-button-box">
              <button
                className="button is-primary is-outlined is-round"
                onClick={() => removeItem(item)}
              >
                <i className="fa fa-times" />
              </button>
            </div>
          </div>
        );
      })}

      {showQuantity && (
        <div className="store-checkout-table-row">
          <div className="checkout-description">
            <h2>Total:</h2>
          </div>
          <div style={{ width: '140px', minWidth: '140px', maxWidth: '140px' }}>
            <h2>£{total || 0}</h2>
          </div>
        </div>
      )}
    </div>
  );
};

StoreCheckoutTable.propTypes = {
  items: PropTypes.array,
  total: PropTypes.number,
  showQuantity: PropTypes.bool,
  selectedCentreMembers: PropTypes.array, // for only Assign Licences
  onQuantityUpdate: PropTypes.func,
  removeItem: PropTypes.func
};

StoreCheckoutTable.defaultProps = {
  items: [],
  total: 0,
  showQuantity: true,
  selectedCentreMembers: [],
  onQuantityUpdate: noop,
  removeItem: noop
};

export default StoreCheckoutTable;

// <div>{item.count} Credits</div>
