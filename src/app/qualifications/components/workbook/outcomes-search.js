import React from 'react';

const OutcomesSearch = props => {
  return (
    <div className="outcomes-filter">
      <p>Quick Search</p>
      <div className="search">
        <input
          onChange={props.callback}
          type="text"
          className="input"
          placeholder="Tell us what are you looking for..."
        />
      </div>
    </div>
  );
};

export default OutcomesSearch;
