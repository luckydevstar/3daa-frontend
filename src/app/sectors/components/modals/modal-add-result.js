import React, { Component } from 'react';
import Isvg from 'react-inlinesvg';
import IconSaveDone from 'images/icon-save-done.svg';

class ModalAddResult extends Component {
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
      handleSubmit
    } = this.props;

    return (
      <div className="has-text-centered p-20">
        <div className="p-t-20">
          <Isvg className="small" src={IconSaveDone} />
        </div>
        <div>
          <h3 className="title is-4">{title}</h3>
        </div>
        <div className="m-b-25">
          <h4>{content}</h4>
        </div>
        <div>
          <div className="m-b-10 has-text-centered">
            <a
              className="button is-rounded is-success"
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

ModalAddResult.defaultProps = {
  success: true,
  title: '',
  content: '',
  button_text: 'Add Unit',
  closeModal: () => {},
  handleSubmit: () => {}
};

export default ModalAddResult;
