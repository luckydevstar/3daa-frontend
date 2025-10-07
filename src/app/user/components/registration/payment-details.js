// import React from 'react';
// import PropTypes from 'prop-types';
// import { Field, reduxForm, getFormValues } from 'redux-form';
// import { connect } from 'react-redux';
// import * as lodash from 'lodash';
// import config from 'brand/config';
// import { Text } from 'app/intl';
// import FormUtil from '../../util/form-util';
// import cx from 'classnames';
// import { cond, equals, always, T } from 'ramda';

// import PaymentSalaryMethod from './payment-salary-method';
// import PaymentMembershipCard from './payment-membership-card';
// import PaymentMethod from './payment-method';
// import PaymentCardFields from './payment-card-fields';
// import PaymentDebitFields from './payment-debit-fields';
// import PaymentCouponFields from './payment-coupon-fields';

// const FORM_NAME = 'payment-details-form';

// const PaymentDetails = ({
//   values: { membership_id, type },
//   loading,
//   memberships,
//   valid,
//   pristine,
//   submitting,
//   handleSubmit,
//   onConfirmPurchase
// }) => {

//   const membership = lodash.find(memberships, item => item.membership_id == membership_id);

//   return (
//     <div className="payment">
//       <form onSubmit={handleSubmit(onConfirmPurchase)}>
//         <div className="columns content m-t-30">
//           <div className="column has-text-left p-r-10">
//             <div className="billing-information">
//               <h2 className="subtitle">
//                 <Text iKey="your_billing_information" />
//               </h2>
//               <div className="billing-title">
//                 <Text iKey="total_billed_today" />
//                 <span className="money">
//                   £{
//                     [
//                       config.membershipPersonal,
//                       config.membershipBusinessYearly,
//                       config.membershipBusinessMonthly
//                     ][membership_id - 1]
//                   }
//                 </span>
//               </div>
//               <p className="billing-desc p-t-10 p-b-30">
//                 <Text iKey="msg_you_will_be_charged_now" vals={['monthly']} />
//               </p>
//               <Field
//                 name="type"
//                 component={PaymentMethod}
//                 membership_id={membership_id}
//               />
//               {cond([
//                 [
//                   equals('paypal'),
//                   always(
//                     <div>
//                       <PaymentCouponFields />
//                       <button
//                         className={cx('button is-primary', {
//                           'is-loading': loading
//                         })}
//                       >
//                         <Text iKey="pay_with_paypal" />
//                       </button>
//                     </div>
//                   )
//                 ],
//                 [
//                   equals('debit'),
//                   always(
//                     <PaymentDebitFields
//                       {...{
//                         type,
//                         loading,
//                         invalid: !valid || pristine || submitting
//                       }}
//                     />
//                   )
//                 ],
//                 [
//                   T,
//                   always(
//                     <PaymentCardFields
//                       {...{
//                         type,
//                         loading,
//                         invalid: !valid || pristine || submitting
//                       }}
//                     />
//                   )
//                 ]
//               ])(type)}
//             </div>
//           </div>
//           <div className="column p-l-10">
//             <Field name="membership_id" component={PaymentSalaryMethod} />
//             <h2 className="subtitle m-t-0 m-b-20">
//               <Text iKey="you_are_purchasing" />
//             </h2>

//             <PaymentMembershipCard method={membership_id} availableMemberships={availableMemberships}/>
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// }

// PaymentDetails.propTypes = {
//   onConfirmPurchase: PropTypes.func
// };

// PaymentDetails.defaultProps = {
//   onConfirmPurchase: null
// };

// const mapStateToProps = state => ({
//   values: getFormValues(FORM_NAME)(state),
//   loading: lodash.get(state, 'registration.sendingRequest')
// });

// const validate = values => {
//   const errors = {};

//   // Check fields
//   FormUtil.validate(values, errors, 'type').required();
//   FormUtil.validate(values, errors, 'name_on_card').required();
//   FormUtil.validate(values, errors, 'card_number').required();
//   FormUtil.validate(values, errors, 'expire').required();
//   FormUtil.validate(values, errors, 'cvc').length(3).required();
//   FormUtil.validate(values, errors, 'name_of_account').required();
//   FormUtil.validate(values, errors, 'sort_code').required();
//   FormUtil.validate(values, errors, 'account_number').required();

//   return errors;
// };

// const PaymentDetailsForm = reduxForm({
//   form: FORM_NAME,
//   validate
// })(connect(mapStateToProps, null)(PaymentDetails));

// export default PaymentDetailsForm;

import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm, getFormValues } from 'redux-form';
import { connect } from 'react-redux';
import * as lodash from 'lodash';
import config from 'brand/config';
import { Text } from 'app/intl';
import FormUtil from '../../util/form-util';
import cx from 'classnames';
import { cond, equals, always, T } from 'ramda';

import PaymentSalaryMethod from './payment-salary-method';
import PaymentMembershipCard from './payment-membership-card';
import PaymentMethod from './payment-method';
import PaymentCardFields from './payment-card-fields';
import PaymentDebitFields from './payment-debit-fields';
import PaymentCouponFields from './payment-coupon-fields';

const FORM_NAME = 'payment-details-form';

const PaymentDetails = ({
  values: { membership_id, type },
  loading,
  memberships,
  valid,
  pristine,
  submitting,
  handleSubmit,
  onConfirmPurchase
}) => {
  const membership = lodash.find(
    memberships,
    item => item.membership_id == membership_id
  );

  return (
    <div className="payment">
      <form onSubmit={handleSubmit(onConfirmPurchase)}>
        <div className="columns content m-t-30">
          <div
            className="column has-text-left p-r-10"
            style={{ maxWidth: '300px' }}
          >
            <div className="billing-information">
              <h2 className="subtitle">
                <Text iKey="your_billing_information" />
              </h2>
              <div className="billing-title">
                <Text iKey="total_billed_today" />
                <span className="money">
                  £{(lodash.get(membership, 'price') || 0).toFixed(2)}
                </span>
              </div>
              <p className="billing-desc p-t-10 p-b-30">
                <Text
                  iKey="msg_you_will_be_charged_now"
                  vals={[lodash.get(membership, 'membership_type')]}
                />
              </p>
              <Field
                name="type"
                component={PaymentMethod}
                membership_id={membership_id}
              />
              {cond([
                [
                  equals('paypal'),
                  always(
                    <div>
                      <PaymentCouponFields />
                      <button
                        className={cx('button is-primary', {
                          'is-loading': loading
                        })}
                      >
                        <Text iKey="pay_with_paypal" />
                      </button>
                    </div>
                  )
                ],
                [
                  equals('debit'),
                  always(
                    <PaymentDebitFields
                      {...{
                        type,
                        loading,
                        invalid: !valid || pristine || submitting
                      }}
                    />
                  )
                ],
                [
                  T,
                  always(
                    <PaymentCardFields
                      {...{
                        type,
                        loading,
                        invalid: !valid || pristine || submitting
                      }}
                    />
                  )
                ]
              ])(type)}
            </div>
          </div>
          <div className="column p-l-10">
            <Field name="membership_id" component={PaymentSalaryMethod} />
            <h2 className="subtitle m-t-0 m-b-20">
              <Text iKey="you_are_purchasing" />
            </h2>

            <PaymentMembershipCard
              method={membership_id}
              membership={membership}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

PaymentDetails.propTypes = {
  onConfirmPurchase: PropTypes.func
};

PaymentDetails.defaultProps = {
  onConfirmPurchase: null
};

const mapStateToProps = state => ({
  values: getFormValues(FORM_NAME)(state),
  loading: lodash.get(state, 'registration.sendingRequest')
});

const validate = values => {
  const errors = {};

  // Check fields
  FormUtil.validate(values, errors, 'type').required();
  FormUtil.validate(values, errors, 'name_on_card').required();
  FormUtil.validate(values, errors, 'card_number').required();
  FormUtil.validate(values, errors, 'expire').required();
  FormUtil.validate(values, errors, 'cvc')
    .length(3)
    .required();
  FormUtil.validate(values, errors, 'name_of_account').required();
  FormUtil.validate(values, errors, 'sort_code').required();
  FormUtil.validate(values, errors, 'account_number').required();

  return errors;
};

const PaymentDetailsForm = reduxForm({
  form: FORM_NAME,
  validate
})(
  connect(
    mapStateToProps,
    null
  )(PaymentDetails)
);

export default PaymentDetailsForm;
