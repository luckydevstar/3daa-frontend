import React from 'react';
import { connect } from 'react-redux';
import { Creators } from '../../actions';

import { PairingRecommendedCategoryContainer } from '../../components';

class PairingRecommendedCategory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mainCategoryId: '',
      subCategoryId: ''
    };
    this.selectMainCategory = this.selectMainCategory.bind(this);
    this.selectSubCategory = this.selectSubCategory.bind(this);
  }
  selectMainCategory(pairing_category_id) {
    const { getPairingSubCategories } = this.props;
    this.setState({
      mainCategoryId: pairing_category_id
    });
    getPairingSubCategories(pairing_category_id);
  }
  selectSubCategory(subCategoryId) {
    this.setState({ subCategoryId });
  }
  render() {
    const {
      categories,
      subCategories,
      searchPairingTargets,
      subCategoriesAttempting,
      categoriesAttempting,
      searchAttempting,
      searchItems
    } = this.props;
    const { mainCategoryId, subCategoryId } = this.state;
    return (
      <div>
        <PairingRecommendedCategoryContainer
          {...{
            categories,
            mainCategoryId,
            subCategoryId,
            subCategoriesAttempting,
            categoriesAttempting,
            searchAttempting,
            searchPairingTargets,
            searchItems,
            subCategories: mainCategoryId ? subCategories[mainCategoryId] : [],
            selectMainCategory: this.selectMainCategory,
            selectSubCategory: this.selectSubCategory
          }}
        />
      </div>
    );
  }
}

const mapStateToProps = ({ pairing }) => ({ ...pairing });

const mapDispatchToProps = dispatch => ({
  getPairingSubCategories: pairing_category_id =>
    dispatch(Creators.getPairingSubCategoriesAttempt(pairing_category_id)),
  searchPairingTargets: params =>
    dispatch(Creators.searchPairingTargetsAttempt(params))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PairingRecommendedCategory);
