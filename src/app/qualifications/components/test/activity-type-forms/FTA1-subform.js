import React from 'react';

class FreeTextActivity1 extends React.Component {
  constructor(props) {
    super(props);

    const defaultFormState = {
      promptTitles: [''],
      questionTitles: ['']
    };

    this.state = {
      formState: props.formState || defaultFormState
    };
    this.setQuestionTitle = this.setQuestionTitle.bind(this);
    this.elementAddQuestionTitle = this.elementAddQuestionTitle.bind(this);
    this.elementQuestionTitles = this.elementQuestionTitles.bind(this);
    this.addQuestionTitle = this.addQuestionTitle.bind(this);
    this.removeQuestionTitle = this.removeQuestionTitle.bind(this);

    this.setPromptTitle = this.setPromptTitle.bind(this);
    this.elementAddPromptTitle = this.elementAddPromptTitle.bind(this);
    this.elementPromptTitles = this.elementPromptTitles.bind(this);
    this.addPromptTitle = this.addPromptTitle.bind(this);
    this.removePromptTitle = this.removePromptTitle.bind(this);
  }

  setQuestionTitle(e, i) {
    const { formState } = this.state;
    const value = e.target.value;
    const newQuestionTitles = [...formState.questionTitles];
    newQuestionTitles[i] = value;
    this.setState({
      formState: {
        ...formState,
        ...{ questionTitles: newQuestionTitles }
      }
    });
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

  /**
   * Form elements
   */
  elementAddQuestionTitle() {
    const { addQuestionTitle } = this;
    return (
      <div className="p-t-10 p-b-5">
        <label
          htmlFor="prompt-title"
          style={{ display: 'inline-block' }}
          className="label"
        >
          Activity question or answer prompt(s)
          <span className="is-text-danger">*</span>
        </label>
        <a className="pull-right" onClick={addQuestionTitle}>
          <span className="is-text-info">Add More&nbsp;&nbsp;</span>
          <i
            className="fa fa-plus is-text-info"
            style={{ textStroke: '2px white' }}
            aria-hidden="true"
          />
        </a>
      </div>
    );
  }

  elementQuestionTitles() {
    const { formState } = this.state;
    const { setQuestionTitle, removeQuestionTitle } = this;
    return formState.questionTitles.map((value, i) => (
      <div className="columns is-marginless" key={i}>
        <div className="column">
          <div className="control">
            <input
              placeholder=""
              className="input"
              onChange={e => setQuestionTitle(e, i)}
              value={value}
              type="text"
            />
          </div>
        </div>
        <div className="column no-grow">
          <a className="nav-right" onClick={() => removeQuestionTitle(i)}>
            <span className="is-text-info">Delete</span>
            <span className="icon">
              <i className="fa fa-trash is-text-info" aria-hidden="true" />
            </span>
          </a>
        </div>
      </div>
    ));
  }

  addQuestionTitle() {
    const { formState } = this.state;
    this.setState({
      formState: {
        ...formState,
        ...{ questionTitles: [...formState.questionTitles, ''] }
      }
    });
  }

  removeQuestionTitle(i) {
    const { formState } = this.state;
    const newQuestionTitles = [...formState.questionTitles];
    newQuestionTitles.splice(i, 1);
    this.setState({
      formState: {
        ...formState,
        ...{ questionTitles: newQuestionTitles }
      }
    });
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
          <span className="is-text-info">Add More&nbsp;&nbsp;</span>
          <i className="fa fa-plus is-text-info" aria-hidden="true" />
        </a>
      </div>
    );
  }

  elementPromptTitles() {
    const { formState } = this.state;
    const { setPromptTitle, removePromptTitle } = this;
    return formState.promptTitles.map((value, i) => (
      <div className="columns is-marginless" key={i}>
        <div className="column">
          <div className="control">
            <input
              placeholder="Prompt title"
              className="input"
              onChange={e => setPromptTitle(e, i)}
              value={value}
              type="text"
            />
          </div>
        </div>
        <div className="column no-grow">
          <a className="nav-right" onClick={() => removePromptTitle(i)}>
            <span className="is-text-info">Delete</span>
            <span className="icon">
              <i className="fa fa-trash is-text-info" aria-hidden="true" />
            </span>
          </a>
        </div>
      </div>
    ));
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

  removePromptTitle(i) {
    const { formState } = this.state;
    const newPromptTitles = [...formState.promptTitles];
    newPromptTitles.splice(i.length - 1, 1);
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
      elementQuestionTitles,
      elementAddQuestionTitle,

      elementPromptTitles,
      elementAddPromptTitle
    } = this;

    return (
      <div className="margin-container">
        {elementAddQuestionTitle()}
        {elementQuestionTitles()}
        {elementAddPromptTitle()}
        {elementPromptTitles()}
      </div>
    );
  }
}

export default FreeTextActivity1;
