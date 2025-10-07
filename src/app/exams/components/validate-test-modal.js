import React, { Component } from 'react';

import ValidateTestForm from './validate-test-form';
import ValidateTestNotice from './validate-test-notice';
import ValidateTestEmailSent from './validate-test-email-sent.js';

class ValidateTestModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      step: 1,
      idType: 1
    };

    this.gotoValidationForm = this.gotoValidationForm.bind(this);
    this.validateTester = this.validateTester.bind(this);
  }

  gotoValidationForm() {
    this.setState({
      step: 2
    });
  }

  validateTester(data) {
    console.log('validate test', data);
    this.setState({
      step: 3
    });
  }

  render() {
    const { step } = this.state;

    return (
      <div className="validate-test-modal p-30">
        {step === 1 && <ValidateTestNotice onNext={this.gotoValidationForm} />}
        {step === 2 && <ValidateTestForm onSubmit={this.validateTester} />}
        {step === 3 && <ValidateTestEmailSent />}
      </div>
    );
  }
}

export default ValidateTestModal;
