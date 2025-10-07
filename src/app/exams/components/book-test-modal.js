import React, { Component } from 'react';
import moment from 'moment';
import common from 'app/common';
import BookTestForm from './book-test-form';
import BookTestSummary from './book-test-summary';
import BookTestConfirm from './book-test-confirm';

const UIArrowSteps = common.components.UIArrowSteps;

class BookTestModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      step: 0,
      formData: {
        test_location: 'UK',
        date_of_test: moment().format('YYYY-MM-DD'),
        time: '03:05',
        invigilator: 'Mark'
      }
    };

    this.previewTest = this.previewTest.bind(this);
    this.backToBookingForm = this.backToBookingForm.bind(this);
    this.nextToConfirm = this.nextToConfirm.bind(this);
  }

  previewTest(formData) {
    this.setState({
      step: 1,
      formData
    });
  }

  backToBookingForm() {
    this.setState({
      step: 0
    });
  }

  nextToConfirm() {
    this.setState({
      step: 2
    });
  }

  render() {
    const { step, formData } = this.state;

    return (
      <div className="book-test-modal">
        <h1 className="has-text-centered">Book A Test</h1>
        <h2 className="has-text-centered">
          Okay your ready to take the test - Book your learners test here
        </h2>
        <UIArrowSteps
          steps={['Book the Test', 'Summary', 'Confirm']}
          active={step}
          width={140}
        />
        {step === 0 &&
          <BookTestForm initialValues={formData} onSubmit={this.previewTest} />}
        {step === 1 &&
          <BookTestSummary
            onBack={this.backToBookingForm}
            onNext={this.nextToConfirm}
          />}
        {step === 2 && <BookTestConfirm />}
      </div>
    );
  }
}

export default BookTestModal;
