import React, { Component } from 'react';
import common from 'app/common';
import components from '../components';

const {
  BookTestModal,
  SideCalendar,
  ValidateTestModal,
  TestStartModal
} = components;

const { components: { ContentModalNew } } = common;

class ExamStaff extends Component {
  constructor(props) {
    super(props);

    this.openBookTestModal = this.openBookTestModal.bind(this);
    this.openValidateModal = this.openValidateModal.bind(this);
    this.openStartTestModal = this.openStartTestModal.bind(this);
  }

  openBookTestModal() {
    this.inviteModal.open();
  }

  openValidateModal() {
    this.validateModal.open();
  }

  openStartTestModal() {
    this.startTestModal.open();
  }

  render() {
    return (
      <div className="exam-staff">
        <div className="main">
          <button
            className="button is-primary m-30"
            onClick={this.openBookTestModal}
          >
            Book the Test
          </button>
          <button
            className="button is-primary m-30"
            onClick={this.openValidateModal}
          >
            Validate
          </button>
          <button
            className="button is-primary m-30"
            onClick={this.openStartTestModal}
          >
            Start Test
          </button>
          <ContentModalNew
            size="large"
            ref={e => {
              this.inviteModal = e;
            }}
          >
            <BookTestModal />
          </ContentModalNew>
          <ContentModalNew
            size="large"
            ref={e => {
              this.validateModal = e;
            }}
          >
            <ValidateTestModal />
          </ContentModalNew>
          <ContentModalNew
            ref={e => {
              this.startTestModal = e;
            }}
          >
            <TestStartModal />
          </ContentModalNew>
        </div>
        <div className="sidebar">
          <SideCalendar onBack={() => console.log('on back')} />
        </div>
      </div>
    );
  }
}

export default ExamStaff;
