import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'app/intl';

let timeout = null;

class UISearch extends Component {
  constructor(props) {
    super(props);

    this.debounce = this.debounce.bind(this);
  }

  debounce(value) {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      this.props.onSearch(value);
    }, 300);
  }

  render() {
    const { placeholder, searchValue, translate, onFocus, onBlur } = this.props;

    return (
      <p className="control search">
        {translate ? (
          <Input
            onKeyUp={e => this.debounce(e.target.value)}
            type="text"
            className="input"
            value={searchValue}
            placeholder={placeholder}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        ) : (
          <input
            onKeyUp={e => this.debounce(e.target.value)}
            type="text"
            className="input"
            defaultValue={searchValue}
            placeholder={placeholder}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        )}
      </p>
    );
  }
}

UISearch.propTypes = {
  onSearch: PropTypes.func.isRequired,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  placeholder: PropTypes.string,
  searchValue: PropTypes.string,
  translate: PropTypes.bool
};

UISearch.defaultProps = {
  placeholder: 'search',
  searchValue: '',
  translate: true,
  onFocus: () => {},
  onBlur: () => {}
};

export default UISearch;
