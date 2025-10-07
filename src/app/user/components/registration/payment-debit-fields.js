import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import common from 'app/common';
import { Text, Field } from 'app/intl';

import PaymentCouponFields from './payment-coupon-fields';

const FormRegisterField = common.components.Form.registerfield;

const PaymentDebitFields = ({ type, loading, invalid }) =>
  <div>
    <div className="columns">
      <Field
        name="name_of_account"
        type="text"
        placeholder="Name of Account Holder"
        component={FormRegisterField}
      />
    </div>
    <div className="columns">
      <div className="column">
        <Field
          name="sort_code"
          type="text"
          placeholder="Sort Code"
          component={FormRegisterField}
        />
      </div>
      <div className="column payment-cvc">
        <Field
          name="account_number"
          type="text"
          placeholder="Account Number"
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
  </div>;

PaymentDebitFields.propTypes = {
  type: PropTypes.string,
  invalid: PropTypes.bool
};

PaymentDebitFields.defaultProps = {
  type: 'paypal',
  invalid: false
};

export default PaymentDebitFields;
