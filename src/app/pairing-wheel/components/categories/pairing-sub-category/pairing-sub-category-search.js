import React from 'react';

class PairingSubCategorySearch extends React.Component {
  render() {
    return (
      <div className="pairing-sub-category-search">
        <input
          type="text"
          placeholder="Search for a Category / Sub Category or Pairing"
        />
        <button type="button" className="button">
          Search
        </button>
      </div>
    );
  }
}

export default PairingSubCategorySearch;
