import React from 'react';
import PropTypes from 'prop-types';
import Isvg from 'react-inlinesvg';
import cx from 'classnames';

import IconPaypal from 'images/icon-paypal.svg';
import IconDirectDebit from 'images/icon-direct-debit.svg';
import IconSpecCard from 'images/icon-spec-card.svg';

const PaymentMethod = ({ input: { value, onChange }, membership_id }) => {
  return (
    <div className="m-b-20">
      <div className="payment-method columns">
        {membership_id > 1 && (
          <div
            className={cx('column icon', {
              active: value === 'debit'
            })}
            onClick={() => onChange('debit')}
          >
            <Isvg src={IconDirectDebit} />
          </div>
        )}
        <div
          className={cx('column icon', {
            active: value === 'paypal'
          })}
          onClick={() => onChange('paypal')}
        >
          <Isvg src={IconPaypal} />
        </div>
        <div
          className={cx('column icon', {
            active: value === 'cc'
          })}
          onClick={() => onChange('cc')}
        >
          <Isvg src={IconSpecCard} />
        </div>
      </div>
    </div>
  );
};

PaymentMethod.propTypes = {
  membership_id: PropTypes.number
};

PaymentMethod.defaultProps = {
  membership_id: 1
};

export default PaymentMethod;
