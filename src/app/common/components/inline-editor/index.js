import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class InlineEditor extends Component {
  constructor() {
    super();
    this.state = {
      body: '',
      newBody: '',
      inputControlVisible: false,
      editMode: false
    };
    this.inputWidth = 'auto';
  }

  componentDidMount() {
    if (this.props.body && this.props.body !== this.state.body) {
      this.setState(
        {
          body: this.props.body,
          newBody: this.props.body
        },
        () => {
          if (this.measure) {
            this.inputWidth = this.measure.offsetWidth;
          }
        }
      );
    }
  }

  setControlsVisibility(value) {
    // Don't hide buttons when editMode is active
    if (this.state.editMode) return;
    this.setState({ inputControlVisible: value });
  }

  toggleEditMode() {
    this.setState({ editMode: !this.state.editMode });
    if (this.state.body !== this.state.newBody) {
      this.setState({ newBody: this.state.body });
    }
  }

  handleTextInputChange(event) {
    this.setState({ newBody: event.target.value });
  }

  saveChanges() {
    this.setState(
      {
        body: this.state.newBody,
        editMode: false,
        inputControlVisible: false
      },
      () => {
        if (this.props.callback) {
          this.props.callback(this.state.body);
        }
      }
    );
  }

  handleKeyUp(e) {
    if (e.key === 'Enter' || e.keyCode === 13) {
      this.saveChanges();
    }
    if (e.key === 'Escape' || e.key === 'Esc' || e.keyCode === 27) {
      this.toggleEditMode();
    }
  }

  render() {
    const { body, newBody, inputControlVisible, editMode } = this.state;

    return (
      <div className="inline-editor">
        <div
          className={classNames('inline-editor-body', {
            [this.props.className]: this.props.className
          })}
          onMouseOver={() => this.setControlsVisibility(true)}
          onMouseOut={() => this.setControlsVisibility(false)}
        >
          {/* BODY */}
          <span
            ref={e => {
              this.measure = e;
            }}
            className={classNames({
              hidden: editMode,
              [this.props.spanClassName]: this.props.spanClassName
            })}
          >
            {this.props.prefix ? this.props.prefix + body : body}
          </span>

          {/* INPUT */}
          <input
            value={editMode ? newBody : body}
            type="text"
            style={{ width: this.inputWidth }}
            className={classNames('inline-editor-input', {
              hidden: !editMode,
              [this.props.inputClassName]: this.props.inputClassName
            })}
            onKeyUp={e => this.handleKeyUp(e)}
            onChange={e => this.handleTextInputChange(e)}
          />

          {/* CONTROLS */}
          <div
            className={classNames('inline-editor-body-controls', {
              hidden: !inputControlVisible
            })}
          >
            <button onClick={() => this.toggleEditMode()}>
              {editMode ? 'close' : 'edit'}
            </button>
            {editMode
              ? <button onClick={() => this.saveChanges()}>save</button>
              : false}
          </div>
        </div>
      </div>
    );
  }
}

InlineEditor.defaultProps = {
  callback: () => null,
  className: '',
  spanClassName: '',
  inputClassName: ''
};

InlineEditor.propTypes = {
  // This is line of text that can be edited
  body: PropTypes.string.isRequired,
  // This function will be called with new body value paramter on save action.
  callback: PropTypes.func,
  // custom className for input field
  inputClassName: PropTypes.string,
  // custom className for span field
  spanClassName: PropTypes.string,
  // custom className for parent div element
  className: PropTypes.string
};

export default InlineEditor;
