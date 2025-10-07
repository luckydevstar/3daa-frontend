import React from 'react';
import cx from 'classnames';
import config from 'brand/config';
import { Text } from 'app/intl';

const PaymentSalaryMethod = ({ input: { value, onChange } }) =>
  value > 1
    ? <div className="m-b-20">
        <h2 className="subtitle">
          <Text iKey="choose_your_billing_cycle" />
        </h2>
        <div className="payment-salary-method">
          <div
            className={cx('salary-method', {
              active: value === 3
            })}
            onClick={() => onChange(3)}
          >
            <Text iKey="pay_monthly" />
          </div>
          <div
            className={cx('salary-method', {
              active: value === 2
            })}
            onClick={() => onChange(2)}
          >
            <Text iKey="pay_yearly" />
          </div>
        </div>
        <div className="payment-salary-label">
          <Text iKey="per_month" vals={[config.membershipBusinessMonthly]} />
          <Text iKey="per_year" vals={[config.membershipBusinessYearly]} />
        </div>
      </div>
    : null;

export default PaymentSalaryMethod;
