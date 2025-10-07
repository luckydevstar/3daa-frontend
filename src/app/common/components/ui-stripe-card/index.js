import React, { Component } from 'react';
import {
  Field,
  reduxForm,
  getFormValues,
  change,
  initialize,
  formValueSelector
} from 'redux-form';
import { connect } from 'react-redux';
import userUtil from 'app/user/util/';
import FormField from '../form/form-field';
import cx from 'classnames';

const { FormUtil } = userUtil;

const FORM_NAME = 'stripeCard';
const errorMesage = "Data doesn't exist";

class UIStripeCard extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { handleSubmit } = this.props;

    return (
      <div>
        <form onSubmit={handleSubmit(e => e.preventDefault())}>
          <div className="m-b-10">
            <Field
              placeholder="Card Type"
              name="type"
              type="text"
              component={FormField}
            />
          </div>
          <div className="m-b-10">
            <Field
              placeholder="Card Number"
              name="card_number"
              type="text"
              component={FormField}
            />
          </div>
          <div className="columns">
            <div className="column">
              <Field
                placeholder="Expiry Date"
                name="expire"
                type="text"
                component={FormField}
              />
              <div>MM/YY</div>
            </div>
            <div className="column payment-cvc">
              <Field
                placeholder="CVC"
                name="cvc"
                type="text"
                component={FormField}
              />
              <div className="has-text-right">What is CVC?</div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  values: getFormValues(FORM_NAME)(state)
});

const validate = values => {
  const errors = {};

  // Check fields
  FormUtil.validate(values, errors, 'type').required();
  FormUtil.validate(values, errors, 'card_number').required();
  FormUtil.validate(values, errors, 'expire').required();
  FormUtil.validate(values, errors, 'cvc')
    .length(3)
    .required();
  return errors;
};

const UIStripeCardForm = reduxForm({
  form: FORM_NAME,
  validate
})(
  connect(
    mapStateToProps,
    null
  )(UIStripeCard)
);

export default UIStripeCardForm;

// import React, { Component } from 'react';
// import { Field, reduxForm, change, initialize, formValueSelector } from 'redux-form';
// import { connect } from 'react-redux';
// import cx from 'classnames';

// const {
//   Form: { field },
//   UILoading,
//   ContentModal
// } = common.components;

// const FormField = field;
// const { FormUtil } = userUtil;

// const FORM_NAME = 'stripeCardForm';
// const errorMesage = "Data doesn't exist";

// class UIStripeCard extends Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       touched: {},
//       error: {}
//     };
//   }

//   touched(key) {
//     const { touched } = this.state;

//     this.setState({
//       touched: {
//         ...touched,
//         key: true
//       }
//     });
//   }

//   render() {
//     const { touched } = this.state;

//     return (
//       <div>
//         <form onSubmit={handleSubmit(onConfirmPurchase)}>
//         <div className="m-b-10">
//           <Field
//             placeholder="Name"
//             name="name_on_card"
//             type="text"
//             component={FormField}
//           />
//           <input
//             className={cx('input', {
//               error: touched.name
//             })}
//             type="text"
//             placeholder="Name"
//             onBlur={() => this.touched('name')}
//           />
//         </div>
//         <div className="m-b-10">
//           <Field
//             placeholder="Card Number"
//             name="card_number"
//             type="text"
//             component={FormField}
//           />
//           <input
//             className={cx('input', {
//               error: touched.cardNumber
//             })}
//             type="text"
//             placeholder="Card Number"
//             onBlur={() => this.touched('cardNumber')}
//           />
//         </div>
//         <div className="columns">
//           <div className="column">
//             <Field
//               placeholder="Expiry Date"
//               name="expire"
//               type="text"
//               component={FormField}
//             />
//             <input
//               className={cx('input', {
//                 error: touched.expiryDate
//               })}
//               type="text"
//               placeholder="Expiry Date"
//               onBlur={() => this.touched('expiryDate')}
//             />
//             <div>MM/YY</div>
//           </div>
//           <div className="column payment-cvc">
//             <Field
//               placeholder="CVC"
//               name="cvc"
//               type="text"
//               component={FormField}
//             />
//             <input
//               className={cx('input', {
//                 error: touched.cvc
//               })}
//               type="text"
//               placeholder="CVC"
//               onBlur={() => this.touched('cvc')}
//             />
//             <div className="has-text-right">What is CVC?</div>
//           </div>
//         </div>
//         </form>
//       </div>
//     );
//   }
// }

// const mapStateToProps = state => ({
//   values: getFormValues(FORM_NAME)(state),
//   loading: state.registration.sendingRequest
// });

// const validate = values => {
//   const errors = {};

//   // Check fields
//   FormUtil.validate(values, errors, 'name_on_card').required();
//   FormUtil.validate(values, errors, 'card_number').required();
//   FormUtil.validate(values, errors, 'expire').required();
//   FormUtil.validate(values, errors, 'cvc').length(3).required();
//   return errors;
// };

// const UIStripeCardForm = reduxForm({
//   form: FORM_NAME,
//   validate
// })(connect(mapStateToProps, null)(UIStripeCard));

// export default UIStripeCardForm;
