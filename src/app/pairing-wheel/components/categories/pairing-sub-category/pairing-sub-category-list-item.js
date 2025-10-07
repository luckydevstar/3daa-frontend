import React from 'react';

import PairingSubCategoryItemSub from './pairing-sub-category-item-sub';
import CategoryBodyPlaceholder from 'images/icons/category-placeholder2.png';
import MenuActiveIcon from 'images/icons/menu-active.png';

class PairingSubCategoryListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentHeight: '90px',
      open: false,
      subCategoryTitle: ''
    };

    this.setItemState = this.setItemState.bind(this);
    this.changeSubCategoryTitle = this.changeSubCategoryTitle.bind(this);
    this.addSubCategory = this.addSubCategory.bind(this);
    this.deleteSubCategory = this.deleteSubCategory.bind(this);
    this.item = null;
  }
  componentDidMount() {
    const { pairing_category_id, getPairingSubCategories } = this.props;
    getPairingSubCategories(pairing_category_id);
  }
  setItemState() {
    if (!this.item) return;
    const { open } = this.state;
    if (open) {
      const maxHeight = this.item.scrollHeight;
      this.setState(
        {
          currentHeight: `${maxHeight}px`
        },
        () => {
          setTimeout(() => {
            this.setState({
              currentHeight: '90px',
              open: false
            });
          }, 0);
        }
      );
    } else {
      const maxHeight = this.item.scrollHeight;
      this.setState(
        {
          currentHeight: `${maxHeight}px`,
          open: true
        },
        () => {
          setTimeout(() => {
            this.setState({
              currentHeight: 'auto'
            });
          }, 400);
        }
      );
    }
  }
  changeSubCategoryTitle(e) {
    this.setState({ subCategoryTitle: e.target.value });
  }
  addSubCategory() {
    const { createPairingCategory, pairing_category_id } = this.props;
    const { subCategoryTitle } = this.state;
    const params = {
      title: subCategoryTitle,
      parent_pairing_category_id: pairing_category_id
    };
    createPairingCategory(params, true);
  }
  deleteSubCategory(pairing_category_id) {
    const {
      deletePairingCategory,
      pairing_category_id: parent_pairing_category_id
    } = this.props;
    deletePairingCategory(pairing_category_id, parent_pairing_category_id);
  }
  render() {
    const {
      title,
      subCategories,
      items,
      createPairingCategoryItem,
      deletePairingCategoryItem,
      deletePairingCategory,
      pairing_category_id
    } = this.props;
    const { currentHeight, subCategoryTitle } = this.state;
    return (
      <div
        ref={node => {
          this.item = node;
        }}
        style={{ height: currentHeight }}
        className="pairing-sub-category-item"
      >
        <div className="pairing-sub-category-item__head">
          <div className="pairing-sub-category-item__title-container">
            <img
              className="pairing-sub-category-item__title__img"
              src={CategoryBodyPlaceholder}
              alt=""
            />
            <div className="pairing-sub-category-item__title">{title}</div>
          </div>
          <div
            className="pairing-sub-category-item__sub-categories"
            onClick={this.setItemState}
          >
            <img src={MenuActiveIcon} alt="" />
            <span>Sub Categories ({subCategories.length})</span>
          </div>
          <div className="pairing-sub-category-item__edit">
            <span>Edit</span>
            <i className="fa fa-pencil" aria-hidden="true" />
          </div>
          <div
            className="pairing-sub-category-item__remove"
            onClick={() => {
              deletePairingCategory(pairing_category_id, '');
            }}
          >
            <span>Remove</span>
            <i className="fa fa-trash-o" aria-hidden="true" />
          </div>
        </div>
        <div className="pairing-sub-category-item__body">
          <div className="pairing-sub-category-item__body__title">
            Add a Sub Category
          </div>
          <input
            type="text"
            placeholder="Add your Sub Category title"
            onChange={this.changeSubCategoryTitle}
          />
          <button
            className="button"
            disabled={subCategoryTitle === ''}
            onClick={this.addSubCategory}
          >
            Add Category
          </button>
        </div>
        <div className="pairing-sub-category-item__subs">
          {subCategories.map((sub, index) => (
            <PairingSubCategoryItemSub
              key={sub.pairing_category_id}
              title={sub.title}
              pairing_category_id={sub.pairing_category_id}
              deleteSubCategory={() => {
                this.deleteSubCategory(sub.pairing_category_id);
              }}
              createPairingCategoryItem={createPairingCategoryItem}
              deletePairingCategoryItem={deletePairingCategoryItem}
              items={items}
              index={index + 1}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default PairingSubCategoryListItem;
