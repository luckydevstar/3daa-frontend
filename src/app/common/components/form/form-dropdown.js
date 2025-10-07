import React, { Component } from 'react';
import PropTypes from 'prop-types';
import UISelectDropdown from '../ui-select-dropdown';

class FormDropdown extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: props.input.value
    };
    this.onSelect = this.onSelect.bind(this);
  }

  onSelect(value) {
    const { input } = this.props;
    input.onChange(value);
    this.setState({ value });
  }

  render() {
    const { list, defaultTxt } = this.props;

    return (
      <UISelectDropdown
        dropdownList={list}
        defaultKey={this.state.value}
        defaultTxt={defaultTxt}
        onChange={this.onSelect}
      />
    );
  }
}

FormDropdown.propTypes = {
  input: PropTypes.shape({
    value: PropTypes.string
  }),
  list: PropTypes.array,
  defaultTxt: PropTypes.string
};

FormDropdown.defaultProps = {
  input: {
    value: ''
  },
  list: [],
  defaultTxt: 'All Sectors'
};

export default FormDropdown;
