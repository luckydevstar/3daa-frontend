import React from 'react';
import classNames from 'classnames';
import { map } from 'ramda';

import SelectHead from '../select-head';
import SelectPairingSearch from './select-pairing-search';
import SelectPairingList from './select-pairing-list';

class SelectPairing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: ''
    };
    this.changeSearch = this.changeSearch.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.getSearchItems = this.getSearchItems.bind(this);
  }
  onSearch() {
    const { search } = this.state;
    const { searchPairingTargets } = this.props;
    searchPairingTargets({ search });
  }
  getSearchItems() {
    const { searchItems, categories } = this.props;
    const categoryIds = [];
    for (let i = 0; i < searchItems.length; i++) {
      if (
        categoryIds.indexOf(searchItems[i].pairing_target_category_id) === -1
      ) {
        categoryIds.push(searchItems[i].pairing_target_category_id);
      }
    }
    return map(categoryId => {
      return categories.find(
        category => category.pairing_category_id === categoryId
      );
    }, categoryIds);
  }
  changeSearch(e) {
    this.setState({ search: e.target.value });
  }
  render() {
    const { subCategoryId, searchAttempting, searchItems } = this.props;
    const { search } = this.state;
    const categories = this.getSearchItems();
    return (
      <div
        className={classNames('pairing-recommended-pairing', {
          'pairing-recommended-pairing--open': subCategoryId
        })}
      >
        <SelectHead backgroundColor="#DED9CA" title="Select Pairing" />
        <SelectPairingSearch
          {...{
            changeSearch: this.changeSearch,
            onSearch: this.onSearch,
            search,
            loading: searchAttempting
          }}
        />
        <SelectPairingList {...{ categories, searchItems }} />
      </div>
    );
  }
}

export default SelectPairing;
