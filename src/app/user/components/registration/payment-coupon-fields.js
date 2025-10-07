import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import cx from 'classnames';

import * as lodash from 'lodash';

import common from 'app/common';
import { Text, Field } from 'app/intl';
import { Creators as Actions } from '../../actions';

const FormRegisterField = common.components.Form.registerfield;

class PaymentCouponFields extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isPromotionalCode: true,
      btnVoucher: 'Apply',
      voucherCode: ''
    };

    this.togglePromotionalCode = this.togglePromotionalCode.bind(this);
    this.applyVoucher = this.applyVoucher.bind(this);
    this.isValid = this.isValid.bind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { voucherCode, paymentDetailsForm } = nextProps;
    const voucher_code = lodash.get(
      paymentDetailsForm,
      'values.voucher_code',
      ''
    );

    if (voucherCode) {
      this.setState({ btnVoucher: 'Code Accepted' });
    }

    if (voucherCode && this.state.voucherCode != voucher_code) {
      this.setState({ voucherCode: voucherCode, btnVoucher: 'Apply' });
    }
  }

  togglePromotionalCode() {
    this.setState({
      isPromotionalCode: !this.state.isPromotionalCode
    });
  }

  applyVoucher() {
    const { paymentDetailsForm, membershipVoucherCheck } = this.props;
    const values = lodash.get(paymentDetailsForm, 'values');

    if (this.isValid()) {
      const data = {
        membership_id: lodash.get(values, 'membership_id'),
        voucher_code: lodash.get(values, 'voucher_code')
      };

      this.setState({ voucherCode: lodash.get(values, 'voucher_code') });

      membershipVoucherCheck(data);
    }
  }

  isValid() {
    const { paymentDetailsForm } = this.props;
    const values = lodash.get(paymentDetailsForm, 'values', {});
    return (
      lodash.get(values, 'membership_id') && lodash.get(values, 'voucher_code')
    );
  }

  render() {
    const { checkingVoucher } = this.props;
    const { isPromotionalCode, btnVoucher } = this.state;

    return (
      <div>
        <div className="columns">
          <div className="column">
            <p
              className="billing-desc p-t-10 p-b-10 promotional-code"
              onClick={this.togglePromotionalCode}
            >
              <Text iKey="Got a promotional code?" />
            </p>
          </div>
        </div>
        {isPromotionalCode && (
          <div className="columns">
            <div className="column">
              <Field
                name="voucher_code"
                type="text"
                placeholder="Voucher Code"
                component={FormRegisterField}
              />
            </div>
            <div className="column payment-cvc">
              <a
                className={cx('button is-primary is-outlined m-0', {
                  'is-loading': checkingVoucher
                })}
                disabled={!this.isValid()}
                onClick={this.applyVoucher}
              >
                <Text iKey={btnVoucher} />
              </a>
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  checkingVoucher: lodash.get(state, 'registration.checkingVoucher'),
  paymentDetailsForm: lodash.get(state, 'form.payment-details-form'),
  voucherCode: lodash.get(state, 'registration.voucherCode')
});

const mapDispatchToProps = dispatch => ({
  membershipVoucherCheck: data =>
    dispatch(Actions.membershipVoucherCheckAttempt(data))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PaymentCouponFields);
