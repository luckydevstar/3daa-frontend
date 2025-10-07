import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import common from 'app/common';
import { Text, Field } from 'app/intl';

import PaymentCouponFields from './payment-coupon-fields';

const FormRegisterField = common.components.Form.registerfield;

const PaymentCardFields = ({ type, loading, invalid }) => (
  <div>
    <div className="columns">
      <Field
        name="name_on_card"
        type="text"
        placeholder="name_on_card"
        component={FormRegisterField}
      />
    </div>
    <div className="columns">
      <Field
        name="card_number"
        type="text"
        method={type}
        placeholder="card_number"
        component={FormRegisterField}
      />
    </div>
    <div className="columns">
      <div className="column">
        <Field
          name="expire"
          type="text"
          placeholder="MM / YY"
          component={FormRegisterField}
        />
      </div>
      <div className="column payment-cvc">
        <Field
          name="cvc"
          type="text"
          placeholder="CVC"
          component={FormRegisterField}
        />
      </div>
    </div>
    <PaymentCouponFields />
    <button
      className={cx('button is-primary', {
        'is-loading': loading
      })}
      disabled={invalid}
    >
      <Text iKey="confirm_purchase" />
    </button>
  </div>
);

PaymentCardFields.propTypes = {
  type: PropTypes.string,
  invalid: PropTypes.bool
};

PaymentCardFields.defaultProps = {
  type: 'paypal',
  invalid: false
};

export default PaymentCardFields;
