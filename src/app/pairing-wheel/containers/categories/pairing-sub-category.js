import React from 'react';
import { filter } from 'ramda';
import { connect } from 'react-redux';
import { Creators } from '../../actions';

import {
  PairingSubCategorySearch,
  PairingSubCategoryList
} from '../../components';

class PairingSubCategory extends React.Component {
  constructor(props) {
    super(props);
    this.getSubCategories = this.getSubCategories.bind(this);
  }
  getSubCategories(categoryId) {
    const { items } = this.props;
    return filter(item => item.pairing_category_id === categoryId, items);
  }
  render() {
    const {
      categories,
      subCategories,
      items,
      getPairingSubCategories,
      createPairingCategory,
      deletePairingCategory,
      createPairingCategoryItem,
      deletePairingCategoryItem,
      categoriesAttempting,
      createCategoryAttempting
    } = this.props;
    return (
      <div>
        <PairingSubCategorySearch />
        <PairingSubCategoryList
          {...{
            categories,
            subCategories,
            items,
            getPairingSubCategories,
            createPairingCategory,
            deletePairingCategory,
            createPairingCategoryItem,
            deletePairingCategoryItem,
            categoriesAttempting,
            createCategoryAttempting,
            getSubCategories: this.getSubCategories
          }}
        />
      </div>
    );
  }
}

const mapStateToProps = ({ pairing }) => ({ ...pairing });
const mapDispatchToProps = dispatch => ({
  getPairingSubCategories: parent_pairing_category_id =>
    dispatch(
      Creators.getPairingSubCategoriesAttempt(parent_pairing_category_id)
    ),
  createPairingCategory: (params, isSub) =>
    dispatch(Creators.createPairingCategoryAttempt(params, isSub)),
  deletePairingCategory: (pairing_category_id, parent_pairing_category_id) =>
    dispatch(
      Creators.deletePairingCategoryAttempt(
        pairing_category_id,
        parent_pairing_category_id
      )
    ),
  createPairingCategoryItem: params =>
    dispatch(Creators.createPairingCategoryItemAttempt(params)),
  deletePairingCategoryItem: pairing_category_id =>
    dispatch(Creators.deletePairingCategoryItemAttempt(pairing_category_id))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PairingSubCategory);
