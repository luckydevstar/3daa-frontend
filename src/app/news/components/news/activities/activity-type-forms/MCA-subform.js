import React from 'react';

class MultipleChoiceActivity extends React.Component {
  constructor(props) {
    super(props);

    const promptFields = {
      question: '',
      answer: '',
      wrongAnswer1: '',
      wrongAnswer2: '',
      wrongAnswer3: ''
    };

    const defaultFormState = {
      activityText: '',
      prompts: [promptFields]
    };

    this.state = {
      formState: props.formState || defaultFormState,
      promptFields: { ...promptFields }
    };
    this.setPromptField = this.setPromptField.bind(this);
    this.setActivityText = this.setActivityText.bind(this);
    this.elementActivityText = this.elementActivityText.bind(this);
    this.elementPrompts = this.elementPrompts.bind(this);
    this.elementAddPrompt = this.elementAddPrompt.bind(this);
    this.removePrompt = this.removePrompt.bind(this);
    this.addPrompt = this.addPrompt.bind(this);
  }

  setPromptField(field, e, i) {
    const { formState } = this.state;
    const value = e.target.value;
    const newPrompts = [...formState.prompts];
    newPrompts[i][field] = value;
    this.setState({
      formState: {
        ...formState,
        ...{ prompts: newPrompts }
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
      <div className="control m-b-25">
        <label htmlFor="activity-text" className="label">
          Activity text
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

  elementPrompts() {
    const { formState } = this.state;
    const { setPromptField, removePrompt } = this;
    return formState.prompts.map((prompt, i) => (
      <div key={i} className="mca-prompt bg-is-info-light m-b-25">
        <div className="control">
          <label htmlFor="question" className="label p-t-5 p-b-5">
            Activity question or answer prompt
            <span className="is-text-danger">*</span>
            {formState.prompts.length > 1 ? (
              <a
                style={{ display: 'inline-block' }}
                className="pull-right"
                onClick={() => removePrompt(i)}
              >
                <span className="is-text-info">Remove Prompt Area</span>
                <span className="icon">
                  <i className="fa fa-minus is-text-info" />
                </span>
              </a>
            ) : null}
          </label>
          <input
            className="input"
            type="text"
            onChange={e => setPromptField('question', e, i)}
            value={prompt.question}
          />
        </div>
        <div className="control">
          <label htmlFor="correct-answer" className="label">
            Correct Answer
            <span className="is-text-danger">*</span>
          </label>
          <input
            className="input"
            type="text"
            onChange={e => setPromptField('answer', e, i)}
            value={prompt.answer}
          />
        </div>
        <div className="columns-head">
          <label htmlFor="incorect-answer" className="control label">
            Incorrect Answers
            <span className="is-text-danger">*</span>
          </label>
          <p className="control">
            <input
              className="input"
              type="text"
              onChange={e => setPromptField('wrongAnswer1', e, i)}
              value={prompt.wrongAnswer1}
            />
          </p>
          <p className="control">
            <input
              className="input"
              type="text"
              onChange={e => setPromptField('wrongAnswer2', e, i)}
              value={prompt.wrongAnswer2}
            />
          </p>
          <p className="control">
            <input
              className="input"
              type="text"
              onChange={e => setPromptField('wrongAnswer3', e, i)}
              value={prompt.wrongAnswer3}
            />
          </p>
        </div>
      </div>
    ));
  }

  elementAddPrompt() {
    const { addPrompt } = this;
    return (
      <div className="has-text-right">
        <a onClick={addPrompt}>
          <span className="is-text-info">Add Prompt Area + </span>
        </a>
      </div>
    );
  }

  /**
   * Form functions
   */

  removePrompt(i) {
    const { formState } = this.state;
    const newPrompts = [...formState.prompts];
    newPrompts.splice(i, 1);
    this.setState({
      formState: {
        ...formState,
        ...{ prompts: newPrompts }
      }
    });
  }

  addPrompt() {
    const { formState, promptFields } = this.state;
    const newPrompts = [...formState.prompts, { ...promptFields }];
    this.setState({
      formState: {
        ...formState,
        ...{ prompts: newPrompts }
      }
    });
  }

  /**
   * Form functions end
   */

  render() {
    const { elementActivityText, elementPrompts, elementAddPrompt } = this;

    return (
      <div className="mca-container margin-container">
        <p className="content">
          Multiple choice asks users to select the correct answer from a series
          of options. You can place as many options as you like and the final
          order will be randomly presented.
        </p>
        {elementActivityText()}
        <div className="m-b-10">{elementPrompts()}</div>
        {elementAddPrompt()}
      </div>
    );
  }
}

export default MultipleChoiceActivity;
