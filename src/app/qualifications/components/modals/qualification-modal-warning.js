import React, { Component } from 'react';
import Isvg from 'react-inlinesvg';
import IconSaveDone from 'images/icon-save-done.svg';

class QualificationModalWarning extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      success,
      title,
      content,
      button_text,
      closeModal,
      is_cancel,
      handleSubmit
    } = this.props;

    return (
      <div className="has-text-centered p-20">
        <div>
          <h3 className="title is-4">{title}</h3>
        </div>
        <div className="m-t-15 m-b-25">
          <h4>{content}</h4>
        </div>
        <div className="m-t-15">
          <div className="m-b-10 has-text-centered">
            <a
              className="button is-rounded is-outlined m-r-15"
              style={{ minWidth: '150px' }}
              onClick={() => closeModal()}
            >
              Cancel
            </a>
            <a
              className="button is-rounded is-success"
              style={{ minWidth: '150px' }}
              onClick={() => handleSubmit()}
            >
              {button_text}
            </a>
          </div>
        </div>
      </div>
    );
  }
}

QualificationModalWarning.defaultProps = {
  success: true,
  title: '',
  content: '',
  button_text: 'OK',
  is_cancel: false,
  closeModal: () => {},
  handleSubmit: () => {},
  cancel: () => {}
};

export default QualificationModalWarning;
