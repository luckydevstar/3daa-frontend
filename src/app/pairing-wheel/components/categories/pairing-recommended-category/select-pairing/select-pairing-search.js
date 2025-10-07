import React from 'react';
import classNames from 'classnames';

const SelectPairingSearch = ({ changeSearch, onSearch, search, loading }) => (
  <div className="pairing-recommended-pairing__search">
    <input
      type="text"
      placeholder="Search for a Category / Sub Category or Pairing"
      onChange={changeSearch}
      value={search}
    />
    <button
      type="button"
      disabled={loading}
      className={classNames('button', 'is-summary', { 'is-loading': loading })}
      onClick={onSearch}
    >
      Search
    </button>
  </div>
);

export default SelectPairingSearch;
