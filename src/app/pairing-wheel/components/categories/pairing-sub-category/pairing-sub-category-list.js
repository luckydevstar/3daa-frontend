import React from 'react';

import common from 'app/common';
import PairingSubCategoryListItem from './pairing-sub-category-list-item';

const { UILoading } = common.components;

class PairingSubCategoryList extends React.Component {
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
      <div className="pairing-sub-category-list">
        {(categoriesAttempting || createCategoryAttempting) && (
          <UILoading marginTop="100px" />
        )}
        {!categoriesAttempting &&
          !createCategoryAttempting &&
          categories.map(category => (
            <PairingSubCategoryListItem
              title={category.title}
              pairing_category_id={category.pairing_category_id}
              subCategories={subCategories[category.pairing_category_id] || []}
              items={items}
              getPairingSubCategories={getPairingSubCategories}
              createPairingCategory={createPairingCategory}
              deletePairingCategory={deletePairingCategory}
              createPairingCategoryItem={createPairingCategoryItem}
              deletePairingCategoryItem={deletePairingCategoryItem}
            />
          ))}
      </div>
    );
  }
}

export default PairingSubCategoryList;
