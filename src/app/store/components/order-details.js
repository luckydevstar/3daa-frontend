import React from 'react';
import * as lodash from 'lodash';
import moment from 'moment';
import common from 'app/common';

const { ProfileAvatar, UILoading } = common.components;

const OrderDetails = ({ qualificationOrder, attemptingQualificationOrder }) => {
  const items = lodash.get(qualificationOrder, ['order', 'items']) || [];

  if (attemptingQualificationOrder) {
    return (
      <div className="order-details p-30">
        <UILoading />
      </div>
    );
  }

  return (
    <div className="order-details p-30">
      <div className="space-between m-b-30">
        <h3 className="opensans-semibold">Order details</h3>
        <h2>{lodash.get(qualificationOrder, 'order.order_number') || ''}</h2>
      </div>

      <div className="space-between m-b-20">
        <span className="opensans-semibold small">Description</span>
        <h3>
          <a
            className="opensans-semibold"
            target="_blank"
            download
            href={
              lodash.get(qualificationOrder, ['order', 'invoice_url']) || ''
            }
          >
            Download Invoice
          </a>
        </h3>
      </div>

      <span className="label m-b-10 opensans-semibold small">
        Order Placed by
      </span>

      <div className="media m-b-20">
        <div className="media-left">
          <ProfileAvatar
            avatarSize={58}
            fileId={
              lodash.get(qualificationOrder, [
                'order',
                'member',
                'cloudinary_file_id'
              ]) || ''
            }
            title="avatar"
          />
        </div>
        <div className="media-content">
          <h2 className="m-t-15 opensans-semibold">
            {lodash.get(qualificationOrder, [
              'order',
              'member',
              'screen_name'
            ]) || ''}
          </h2>
        </div>
      </div>

      <span className="label m-b-20 opensans-semibold small">
        Placed on{' '}
        {moment(lodash.get(qualificationOrder, ['order', 'created']) || '')
          .tz('Europe/London')
          .format('ll')}
      </span>

      <div className="order-content">
        <div className="columns m-b-0">
          <div className="column is-3">
            <span>LARA No</span>
          </div>
          <div className="column is-3">
            <span>Unit Price</span>
          </div>
          <div className="column is-3">
            <span>Quantity</span>
          </div>
          <div className="column has-text-right">
            <span>Total</span>
          </div>
        </div>

        {items.map((item, i) => {
          return (
            <div key={`order_item${i}`} className="columns m-b-0">
              <div className="column is-3">
                <span>
                  {lodash.get(item, ['qualification_reference']) || ''}
                </span>
              </div>
              <div className="column is-3">
                <span>{lodash.get(item, ['price']) || 0}</span>
              </div>
              <div className="column is-3">
                <span>{lodash.get(item, ['quantity']) || 0}</span>
              </div>
              <div className="column has-text-right">
                <span>£{lodash.get(item, ['total']) || 0}</span>
              </div>
            </div>
          );
        })}

        <div className="has-text-right p-t-20 p-b-20 border">
          <div>
            <span className="">Item Subtotal:</span>
            <span className="w-70">
              £{lodash.get(qualificationOrder, ['order', 'subtotal']) || 0}
            </span>
          </div>
          <div>
            <span className="">Total Before VAT:</span>
            <span className="w-70">
              £{lodash.get(qualificationOrder, ['order', 'subtotal']) || 0}
            </span>
          </div>
          <div>
            <span className="">VAT:</span>
            <span className="w-70">
              £{lodash.get(qualificationOrder, ['order', 'vat']) || 0}
            </span>
          </div>
          <div>
            <span className="">Order Grand Total:</span>
            <span className="w-70">
              £
              {(lodash.get(qualificationOrder, ['order', 'subtotal']) || 0) +
                lodash.get(qualificationOrder, ['order', 'vat']) || 0}{' '}
            </span>
          </div>
          <div className="m-t-20">
            <span className="payment-method m-b-0">Payment method:</span>
            <span className="w-170">
              {lodash.get(qualificationOrder, ['order', 'payment_type']) || ''}
            </span>
          </div>
        </div>

        <div className="m-t-20">
          <span className="label">Thank you for your purchase.</span>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;

// <h3 className="m-b-20 opensans-semibold">
//   {lodash.get(qualificationOrder, ['order','items', '0', 'qualification_title']) || ''} &nbsp;
//   Level&nbsp;{lodash.get(qualificationOrder, ['order','items', '0', 'qualification_level']) || ''}
// </h3>
