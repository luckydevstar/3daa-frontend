import React, { Component } from 'react';
import { Label, Text } from 'app/intl';
import classNames from 'classnames';
import common from 'app/common';

class ModalColour extends Component {
  constructor(props) {
    super(props);
    this.state = {
      colours: ['#8459A2', '#BAD635', '#01B2BE', '#FF664C', '#000000'],
      selectedColour: ''
    };
  }

  UNSAFE_componentWillMount() {
    const { colour } = this.props;
    this.setState({ selectedColour: colour });
  }

  render() {
    const { onSetColour, closeModal, colour } = this.props;

    const { colours, selectedColour } = this.state;

    return (
      <div className="modal-content-inner modal-body qualifications qualification-modal-colour">
        <div className="has-text-centered">
          <h2>
            <Text iKey={'Select a Workbook colour'} />
          </h2>
        </div>
        <div className="has-text-centered">
          <h5 className="subtitle m-b-25">
            <Text iKey="Please select a colour for your Workbook and your Workbook header" />
          </h5>
        </div>
        <div className="has-text-centered m-b-25">
          <Text iKey="Select a colour" />
        </div>
        <div
          className="columns m-b-25 colour-container"
          style={{ justifyContent: 'center' }}
        >
          {colours.map((c, i) => (
            <div
              key={'colour' + i}
              className={classNames('colour-item', { active: c == colour })}
              style={{ background: c }}
              onClick={() => onSetColour(c)}
            />
          ))}
        </div>
        <div className="has-text-centered">
          <a
            onClick={() => closeModal(selectedColour)}
            className="button is-rounded m-r-20"
          >
            Cancel
          </a>
          <a
            type="submit"
            disabled={colour == selectedColour}
            className={classNames(
              'button p-l-40 p-r-40 is-rounded',
              'is-primary'
            )}
            onClick={() => closeModal(colour)}
          >
            Done
          </a>
        </div>
      </div>
    );
  }
}

ModalColour.defaultProps = {
  colour: '',
  onSetColour: e => {}
};

export default ModalColour;
