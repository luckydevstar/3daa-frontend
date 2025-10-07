import React from 'react';
import common from 'app/common';

import CategoryBodyPlaceholder from 'images/icons/category-placeholder2.png';

const { UILoading } = common.components;

export const PairingMainCategoryListItem = ({
  title,
  subCategories,
  deleteCategory,
  icon_name
}) => (
  <div className="pairing-main-category-list__item">
    <div className="pairing-main-category-list__item__title">{title}</div>
    <div className="pairing-main-category-list__item__body">
      {icon_name && (
        <i className="material-icons pairing-main-category-list__item__body__img">
          {icon_name}
        </i>
      )}
      {!icon_name && (
        <img
          src={CategoryBodyPlaceholder}
          alt=""
          className="pairing-main-category-list__item__body__img"
        />
      )}
      <div className="pairing-main-category-list__item__body__sub-categories">{`(${subCategories}) Sub Categories`}</div>
      <div className="pairing-main-category-list__item__body__summary-view">
        <span>VIEW SUMMARY</span>
        <i className="fa fa-sort-desc" aria-hidden="true" />
      </div>
      <div className="pairing-main-category-list__item__body__edit">
        <span>Edit</span>
        <i className="fa fa-pencil" aria-hidden="true" />
      </div>
      <div
        className="pairing-main-category-list__item__body__remove"
        onClick={deleteCategory}
      >
        <span>Remove</span>
        <i className="fa fa-trash-o" aria-hidden="true" />
      </div>
    </div>
  </div>
);

const PairingMainCategoryList = ({
  categories,
  loading,
  getSubCategories,
  deletePairingCategory
}) => (
  <div className="pairing-main-category-list">
    {!loading &&
      categories.map(category => (
        <PairingMainCategoryListItem
          key={category.pairing_category_id}
          title={category.title}
          icon_name={category.icon_name}
          subCategories={getSubCategories(category.pairing_category_id).length}
          deleteCategory={() => {
            deletePairingCategory(category.pairing_category_id);
          }}
        />
      ))}
    {loading && <UILoading marginTop="50px" />}
  </div>
);

export default PairingMainCategoryList;
