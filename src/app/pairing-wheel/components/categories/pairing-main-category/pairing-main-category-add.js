import React from 'react';
import classNames from 'classnames';

import CategoryHeadPlaceholder from 'images/icons/category-placeholder1.png';
import CategoryBodyPlaceholder from 'images/icons/category-placeholder2.png';

class PairingMainCategoryAdd extends React.Component {
  render() {
    const {
      createCategory,
      toggleSelectIconModal,
      changeTitle,
      title,
      selectedIcon,
      createCategoryAttempting,
      uploadedImage
    } = this.props;
    return (
      <div className="pairing-wheel__main-category__content__add-container">
        <div className="pairing-wheel__main-category__content__add-container__head">
          <div className="pairing-wheel__main-category__content__add-title">
            {!(selectedIcon || uploadedImage) && (
              <img src={CategoryHeadPlaceholder} alt="" />
            )}
            {selectedIcon && <i className="material-icons">{selectedIcon}</i>}
            {!selectedIcon && uploadedImage && (
              <img src={uploadedImage} alt="" />
            )}
            <div>Add Main Category</div>
          </div>
          <div>Pairings(0)</div>
          <div>0 Sub Categories</div>
        </div>
        <div className="pairing-wheel__main-category__content__add">
          <div className="pairing-wheel__main-category__content__add-icon__title">
            Wheel Icon
          </div>
          {!(selectedIcon || uploadedImage) && (
            <img src={CategoryBodyPlaceholder} alt="" />
          )}
          {selectedIcon && <i className="material-icons">{selectedIcon}</i>}
          {!selectedIcon && uploadedImage && <img src={uploadedImage} alt="" />}
          <button
            className="button pairing-wheel__main-category__content__add-icon__btn"
            type="button"
            onClick={toggleSelectIconModal}
          >
            Add
          </button>
        </div>
        <div className="pairing-wheel__main-category__content__add-field-container">
          <div className="pairing-wheel__main-category__content__add-field__label">
            Category
          </div>
          <input
            type="text"
            placeholder="Add your category title"
            onChange={changeTitle}
          />
          <button
            onClick={createCategory}
            disabled={createCategoryAttempting || title === ''}
            className={classNames('button', 'is-success', {
              'is-loading': createCategoryAttempting
            })}
          >
            Add Category
          </button>
        </div>
      </div>
    );
  }
}

export default PairingMainCategoryAdd;
