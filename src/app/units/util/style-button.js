import React from 'react';

/**
 * HELPER COMPONENT
 */
export default class StyleButton extends React.Component {
  constructor(props) {
    super(props);
    this.onToggle = e => {
      e.preventDefault();
      this.props.onToggle(this.props.style);
    };
  }

  render() {
    let style;
    if (this.props.active) {
      style = { fontWeight: 'bold' };
    } else {
      style = null;
    }

    return (
      <span style={style} onMouseDown={this.onToggle}>
        {this.props.label}
      </span>
    );
  }
}
