import React from 'react';

class MultipleFreeTextActivity extends React.Component {
  constructor(props) {
    super(props);

    const promptFields = {
      title: '',
      text: ''
    };

    const defaultFormState = {
      prompts: [promptFields]
    };

    this.state = {
      formState: props.formState || defaultFormState,
      promptFields: { ...promptFields }
    };
    this.setPromptField = this.setPromptField.bind(this);
    this.elementPrompts = this.elementPrompts.bind(this);
    this.elementRemovePrompt = this.elementRemovePrompt.bind(this);
    this.elementAddPrompt = this.elementAddPrompt.bind(this);
    this.addPrompt = this.addPrompt.bind(this);
    this.removePrompt = this.removePrompt.bind(this);
  }

  /**
   * Form functions start
   */

  setPromptField(field, e, i) {
    const { formState } = this.state;
    const value = e.target.value;
    const newPrompts = [...formState.prompts];
    newPrompts[i][field] = value;
    this.setState({
      formState: {
        prompts: newPrompts
      }
    });
  }

  /**
   * Form elements
   */

  elementPrompts() {
    const { formState } = this.state;
    const { elementRemovePrompt, setPromptField } = this;
    return formState.prompts.map((prompt, i) => (
      <div key={i} className="m-b-25">
        <div className="m-b-5">
          <label
            htmlFor="prompt"
            style={{ display: 'inline-block' }}
            className="label"
          >
            Prompt
          </label>
          {formState.prompts.length > 1 ? elementRemovePrompt(i) : null}
        </div>
        <div className="control">
          <textarea
            placeholder="Prompt question"
            className="textarea"
            onChange={e => setPromptField('title', e, i)}
            value={prompt.title}
            type="text"
          />
        </div>
        <div className="control">
          <input
            placeholder="Prompt text"
            className="input"
            onChange={e => setPromptField('text', e, i)}
            value={prompt.text}
            type="text"
          />
        </div>
      </div>
    ));
  }

  elementRemovePrompt(i) {
    const { removePrompt } = this;
    return (
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
    );
  }

  elementAddPrompt() {
    const { addPrompt } = this;
    return (
      <a style={{ display: 'inline-block' }} onClick={addPrompt}>
        <span className="is-text-info">Add Prompt +</span>
      </a>
    );
  }

  /**
   * Form elements end
   */

  addPrompt() {
    const { formState, promptFields } = this.state;
    const newPrompts = [...formState.prompts, { ...promptFields }];
    this.setState({
      formState: {
        prompts: newPrompts
      }
    });
  }

  removePrompt(i) {
    const { formState } = this.state;
    const newPrompts = [...formState.prompts];
    newPrompts.splice(i, 1);
    this.setState({
      formState: {
        prompts: newPrompts
      }
    });
  }

  /**
   * Form functions end
   */

  render() {
    const { elementPrompts, elementAddPrompt } = this;

    return (
      <div className="margin-container">
        <p className="content">
          Multiple free text entry will ask your learners to type or paste their
          answer to your activity question or statement.
        </p>
        {elementPrompts()}
        <div className="has-text-right">{elementAddPrompt()}</div>
      </div>
    );
  }
}

export default MultipleFreeTextActivity;
