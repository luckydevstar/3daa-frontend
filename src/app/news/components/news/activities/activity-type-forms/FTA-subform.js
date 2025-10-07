import React from 'react';

class FreeTextActivity extends React.Component {
  constructor(props) {
    super(props);

    const defaultFormState = {
      activityText: '',
      promptTitles: ['']
    };

    this.state = {
      formState: props.formState || defaultFormState
    };
    this.setPromptTitle = this.setPromptTitle.bind(this);
    this.setActivityText = this.setActivityText.bind(this);
    this.elementActivityText = this.elementActivityText.bind(this);
    this.elementPromptTitles = this.elementPromptTitles.bind(this);
    this.elementRemovePromptTitle = this.elementRemovePromptTitle.bind(this);
    this.elementAddPromptTitle = this.elementAddPromptTitle.bind(this);
    this.addPromptTitle = this.addPromptTitle.bind(this);
    this.removePromptTitle = this.removePromptTitle.bind(this);
  }

  setPromptTitle(e, i) {
    const { formState } = this.state;
    const value = e.target.value;
    const newPromptTitles = [...formState.promptTitles];
    newPromptTitles[i] = value;
    this.setState({
      formState: {
        ...formState,
        ...{ promptTitles: newPromptTitles }
      }
    });
  }

  setActivityText(e) {
    const { formState } = this.state;
    const value = e.target.value;
    this.setState({
      formState: {
        ...formState,
        ...{ activityText: value }
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
        <label htmlFor="activity-question" className="label">
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

  elementPromptTitles() {
    const { formState } = this.state;
    const { setPromptTitle } = this;
    return formState.promptTitles.map((value, i) => (
      <div className="control" key={i}>
        <input
          placeholder="Prompt title"
          className="input"
          onChange={e => setPromptTitle(e, i)}
          value={value}
          type="text"
        />
      </div>
    ));
  }

  elementRemovePromptTitle() {
    const { removePromptTitle } = this;
    return (
      <a className="nav-right" onClick={removePromptTitle}>
        <span className="is-text-info">Remove Prompt Area</span>
        <span className="icon">
          <i className="fa fa-minus is-text-info" />
        </span>
      </a>
    );
  }

  elementAddPromptTitle() {
    const { addPromptTitle } = this;
    return (
      <div className="p-t-10 p-b-5">
        <label
          htmlFor="prompt-title"
          style={{ display: 'inline-block' }}
          className="label"
        >
          Prompt Title(s)
          <span className="is-text-danger">*</span>
        </label>
        <a className="pull-right" onClick={addPromptTitle}>
          <span className="is-text-info">Add Prompt Area +</span>
        </a>
      </div>
    );
  }

  addPromptTitle() {
    const { formState } = this.state;
    this.setState({
      formState: {
        ...formState,
        ...{ promptTitles: [...formState.promptTitles, ''] }
      }
    });
  }
  /**
   * Form elements end
   */

  /**
   * Form functions
   */
  removePromptTitle() {
    const { formState } = this.state;
    const newPromptTitles = [...formState.promptTitles];
    newPromptTitles.splice(newPromptTitles.length - 1, 1);
    this.setState({
      formState: {
        ...formState,
        ...{ promptTitles: newPromptTitles }
      }
    });
  }

  /**
   * Form functions end
   */

  render() {
    const { formState } = this.state;

    const {
      elementActivityText,
      elementPromptTitles,
      elementRemovePromptTitle,
      elementAddPromptTitle
    } = this;

    return (
      <div className="margin-container">
        <p className="content">
          Free text entry will ask your learners to type or paste their answer
          to your activity question or statement.
        </p>
        {elementActivityText()}
        {elementAddPromptTitle()}
        {elementPromptTitles()}
        {formState.promptTitles.length > 1 ? elementRemovePromptTitle() : null}
      </div>
    );
  }
}

export default FreeTextActivity;
