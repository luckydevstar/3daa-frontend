import React, { Component } from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import { browserHistory } from 'react-router';
import * as lodash from 'lodash';

import common from 'app/common';
import { Creators as Actions } from '../../actions';

class RegisterPaymentVourcherCheckRoute extends Component {
  constructor(props) {
    super(props);

    this.state = {
      membershipId: null,
      type: null,
      voucherCode: null
    };

    this.handleTextInputChange = this.handleTextInputChange.bind(this);
    this.isValid = this.isValid.bind(this);
    this.onMembershipVoucherCheck = this.onMembershipVoucherCheck.bind(this);
    this.onNext = this.onNext.bind(this);
  }

  UNSAFE_componentWillMount() {
    const { getAvailableMemberships } = this.props;

    getAvailableMemberships();
  }

  componentDidMount() {}

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      params: { account_type }
    } = this.props;

    const { availableMemberships, checkingVoucher, voucherCode } = nextProps;

    if (!checkingVoucher && voucherCode) {
      browserHistory.replace(`/register/${account_type}/create/payment`);
    }

    if (
      !this.state.membershipId &&
      lodash.get(availableMemberships, 'length')
    ) {
      const is_business = account_type === 'personal' ? 0 : 1;
      const filteredMemberships = lodash.filter(
        availableMemberships,
        membership => membership.is_business == is_business
      );

      this.setState({
        membershipId:
          lodash.get(lodash.head(filteredMemberships), 'membership_id', 1) || 1,
        type: 'cc'
      });
    }
  }

  onMembershipVoucherCheck() {
    const { membershipVoucherCheck } = this.props;
    const { membershipId, voucherCode } = this.state;

    if (this.isValid()) {
      const data = {
        membership_id: membershipId,
        voucher_code: voucherCode
      };

      membershipVoucherCheck(data);
    }
  }

  onNext() {
    const {
      params: { account_type },
      updateOwnProfileSuccess
    } = this.props;
    updateOwnProfileSuccess({ canMoveToPayment: true });
    browserHistory.replace(`/register/${account_type}/create/payment`);
  }

  handleTextInputChange(e) {
    this.setState({ voucherCode: e.target.value });
  }

  isValid() {
    const { membershipId, voucherCode } = this.state;
    return membershipId && voucherCode;
  }

  render() {
    const { checkingVoucher } = this.props;

    return (
      <div className="container has-text-centered">
        <div className="voucher-check-form">
          <p className="voucher-check-title">
            Let's start building your organisation profile
          </p>
          <p className="voucher-check-subtitle">
            Please enter your voucher code
          </p>
          <p className="m-t-15">
            If your organisation is registered with NCFE you should have been
            provided this number.
          </p>
          <div className="voucher-check-code">
            <input
              type="text"
              className="input"
              placeholder="Voucher Code"
              onChange={e => this.handleTextInputChange(e)}
            />
          </div>
          <div>
            <a
              className={cx('button is-primary m-0', {
                'is-loading': checkingVoucher
              })}
              disabled={!this.isValid()}
              onClick={() => this.onMembershipVoucherCheck()}
            >
              Next
            </a>
          </div>
          <hr />
          <p className="voucher-check-subtitle">Don't have a voucher code</p>

          <div className="m-t-15 m-b-30">
            <a
              className={cx('button is-danger is-outlined m-0')}
              onClick={() => this.onNext()}
            >
              Click if you don't have a voucher
            </a>
          </div>

          <div>
            Centre numbers are given to organisations who are officially
            enrolled to deliver training recognised and approved by NCFE.
          </div>
          <div>
            If you would like your organisation to be enrolled then please
            complete this enrollment form and we will get in touch.
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  availableMemberships: lodash.get(state, 'registration.availableMemberships'),
  voucherCode: lodash.get(state, 'registration.voucherCode'),
  checkingVoucher: lodash.get(state, 'registration.checkingVoucher')
});

const mapDispatchToProps = dispatch => ({
  getAvailableMemberships: () =>
    dispatch(Actions.getAvailableMembershipsAttempt()),

  membershipVoucherCheck: data =>
    dispatch(Actions.membershipVoucherCheckAttempt(data)),

  updateOwnProfileSuccess: data =>
    dispatch(Actions.updateOwnProfileSuccess(data))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RegisterPaymentVourcherCheckRoute);
