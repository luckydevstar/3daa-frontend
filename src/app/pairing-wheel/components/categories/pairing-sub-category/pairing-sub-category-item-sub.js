import React from 'react';
import classNames from 'classnames';
import { filter } from 'ramda';

class PairingSubCategoryItemSub extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subOpen: false,
      itemTitle: ''
    };
    this.changeSubState = this.changeSubState.bind(this);
    this.getItems = this.getItems.bind(this);
    this.createCategoryItem = this.createCategoryItem.bind(this);
    this.changeItemTitle = this.changeItemTitle.bind(this);
  }
  getItems() {
    const { items, pairing_category_id } = this.props;
    return filter(
      item => item.pairing_category_id === pairing_category_id,
      items
    );
  }
  changeSubState() {
    this.setState({
      subOpen: !this.state.subOpen
    });
  }
  createCategoryItem() {
    const { createPairingCategoryItem, pairing_category_id } = this.props;
    const { itemTitle } = this.state;
    const params = {
      title: itemTitle,
      pairing_category_id
    };
    createPairingCategoryItem(params);
  }
  deleteCategoryItem(pairing_category_id) {
    const { deletePairingCategoryItem } = this.props;
    deletePairingCategoryItem(pairing_category_id);
  }
  changeItemTitle(e) {
    this.setState({ itemTitle: e.target.value });
  }
  render() {
    const { title, index, deleteSubCategory } = this.props;
    const { subOpen, itemTitle } = this.state;
    const items = this.getItems();
    return (
      <div
        className={classNames('pairing-sub-category-item__sub', {
          'pairing-sub-category-item__sub--open': subOpen
        })}
      >
        <div className="pairing-sub-category-item__sub__body">
          <div
            className="pairing-sub-category-item__sub__title"
            onClick={this.changeSubState}
          >
            <div className="pairing-sub-category-item__sub__title__index">
              {index}
            </div>
            <div className="pairing-sub-category-item__sub__title__text">
              {title}
            </div>
          </div>
          <i
            className={classNames(
              'fa',
              'fa fa-chevron-down',
              'pairing-sub-category-item__sub__caret',
              {
                'pairing-sub-category-item__sub__caret--open': subOpen
              }
            )}
            aria-hidden="true"
            onClick={this.changeSubState}
          />
          <div className="pairing-sub-category-item__sub__controls">
            <div className="pairing-sub-category-item__sub__control">
              <span>Edit</span>
              <i className="fa fa-pencil" aria-hidden="true" />
            </div>
            <div
              className="pairing-sub-category-item__sub__control"
              onClick={deleteSubCategory}
            >
              <span>Remove</span>
              <i className="fa fa-trash-o" aria-hidden="true" />
            </div>
          </div>
        </div>
        <div className="pairing-sub-category-item__sub__items">
          <div className="pairing-sub-category-item__sub__items__input">
            <input
              type="text"
              placeholder="Add your Sub Category item title"
              onChange={this.changeItemTitle}
            />
            <button
              type="button"
              className="button"
              disabled={itemTitle === ''}
              onClick={this.createCategoryItem}
            >
              Add List Item
            </button>
          </div>
          <div className="pairing-sub-category-item__sub__item__scroll">
            {items.map((item, i) => (
              <div
                key={item.pairing_item_id}
                className="pairing-sub-category-item__sub__item"
              >
                <div className="pairing-sub-category-item__sub__item__title">
                  <div className="pairing-sub-category-item__sub__item__title__index">
                    {index}.{i + 1}
                  </div>
                  <div className="pairing-sub-category-item__sub__item__title__text">
                    {item.title}
                  </div>
                </div>
                <div className="pairing-sub-category-item__sub__item__editor">
                  <span>Content Editor</span>
                  <i className="fa fa-pencil-square-o" aria-hidden="true" />
                </div>
                <div className="pairing-sub-category-item__sub__item__controls">
                  <div className="pairing-sub-category-item__sub__item__control">
                    <span>Edit</span>
                    <i className="fa fa-pencil" aria-hidden="true" />
                  </div>
                  <div
                    className="pairing-sub-category-item__sub__item__control"
                    onClick={() => {
                      this.deleteCategoryItem(item.pairing_item_id);
                    }}
                  >
                    <span>Remove</span>
                    <i className="fa fa-trash-o" aria-hidden="true" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default PairingSubCategoryItemSub;
