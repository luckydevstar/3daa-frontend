import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import JobsLearnerFindForm, { validate } from './jobs-learner-find-form';

const ConnectedForm = reduxForm({
  form: 'jobs-find',
  validate,
  destroyOnUnmount: false
})(JobsLearnerFindForm);

class JobsLearnerFind extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMoreView: false
    };

    this.toggleMoreView = this.toggleMoreView.bind(this);
  }

  toggleMoreView() {
    const { isMoreView } = this.state;
    this.setState({ isMoreView: !isMoreView });
  }

  render() {
    const { getLearnerJobs, uiLoadingJobs, user } = this.props;
    const { isMoreView } = this.state;
    return (
      <div className="find-card">
        <div className="card">
          <div className="card-content">
            <ConnectedForm
              {...{
                onSubmit: data => getLearnerJobs(data, true),
                uiLoadingJobs,
                isMoreView,
                toggleMoreView: this.toggleMoreView,
                user
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default JobsLearnerFind;
