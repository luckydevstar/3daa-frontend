import React from 'react';

class EvidenceUploadActivity extends React.Component {
  constructor(props) {
    super(props);

    const defaultFormState = {
      activityText: ''
    };

    this.state = {
      formState: props.formState || defaultFormState
    };
    this.setActivityText = this.setActivityText.bind(this);
    this.elementActivityText = this.elementActivityText.bind(this);
  }

  setActivityText(e) {
    const value = e.target.value;
    this.setState({
      formState: {
        activityText: value
      }
    });
  }

  /**
   * Form elements
   */
  elementActivityText() {
    const { formState } = this.state;
    const { setActivityText } = this;
    return (
      <div className="control">
        <label htmlFor="answer-prompt" className="label">
          Activity question or answer prompt
          <span className="is-text-danger">*</span>
        </label>
        <textarea
          className="textarea"
          onChange={setActivityText}
          value={formState.activityText}
        />
      </div>
    );
  }

  render() {
    const { elementActivityText } = this;
    return (
      <div className="margin-container">
        <p className="content">
          Evidence upload asks your learners to provide some form of visual
          evidence that they have completed a requested task. You can specify an
          image or video file as evidence.
        </p>
        {elementActivityText()}
      </div>
    );
  }
}

export default EvidenceUploadActivity;
