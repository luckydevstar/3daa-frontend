import React, { Component } from 'react';
import PropTypes from 'prop-types';

class SearchBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: props.searchPhrase ? props.searchPhrase : ''
    };

    this.onChange = this.onChange.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }
  onChange(e) {
    this.setState({
      text: e.target.value
    });

    const { onChange } = this.props;
    if (onChange) onChange(e.target.value);
  }
  handleKeyUp(e) {
    const { onKeyUp, onEnter } = this.props;
    if (onKeyUp) onKeyUp(e.target.value);
    if (onEnter && e.keyCode === 13) onEnter(e.target.value);
    if (e.key === 'Escape' || e.key === 'Esc' || e.keyCode === 27) {
      this.props.onChange(null);
      e.target.value = '';
    }
  }
  render() {
    const { placeholder, searching } = this.props;
    const { text } = this.state;

    return (
      <div className="search-bar-container">
        <p className={`control search ${searching ? 'is-loading' : ''}`}>
          <input
            type="text"
            className="input"
            value={text}
            onKeyUp={this.handleKeyUp}
            onChange={this.onChange}
            placeholder={placeholder}
          />
        </p>
      </div>
    );
  }
}

SearchBar.defaultProps = {
  onKeyUp: null,
  onChange: null,
  onEnter: null,
  placeholder: 'Search with Profile name, Sector and Qualification'
};

SearchBar.propTypes = {
  onKeyUp: PropTypes.func,
  onChange: PropTypes.func,
  onEnter: PropTypes.func,
  placeholder: PropTypes.string
};

export default SearchBar;
