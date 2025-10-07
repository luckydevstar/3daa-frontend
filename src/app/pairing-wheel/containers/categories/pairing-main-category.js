import React from 'react';
import { filter } from 'ramda';
import { connect } from 'react-redux';
import { Creators } from '../../actions';
import common from 'app/common';

import {
  PairingMainCategoryAdd,
  PairingMainCategoryList,
  PairingMainCategoryPhone,
  SelectIconModal
} from '../../components';

import icon_names from '../../components/modal/icon_names';
const {
  components: { ContentModalNew }
} = common;

class PairingMainCategory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      uploadedImage: null
    };
    this.getSubCategories = this.getSubCategories.bind(this);
    this.createCategory = this.createCategory.bind(this);
    this.changeTitle = this.changeTitle.bind(this);
    this.setLocalUploadedImage = this.setLocalUploadedImage.bind(this);
    this.selectIconModal = null;
  }
  componentDidMount() {
    this.selectIconModal.open();
  }
  getSubCategories(categoryId) {
    const { items } = this.props;
    return filter(item => item.pairing_category_id === categoryId, items);
  }
  createCategory() {
    const { createPairingCategory, icon_name } = this.props;
    const { title } = this.state;
    createPairingCategory({
      title,
      icon_name
    });
  }
  changeTitle(e) {
    this.setState({ title: e.target.value });
  }
  setLocalUploadedImage(imageObj) {
    this.setState({ uploadedImage: imageObj });
  }
  render() {
    const {
      categories,
      subCategories,
      categoriesAttempting,
      createCategoryAttempting,
      deletePairingCategory,
      getPairingSubCategories,
      selectIcon,
      icon_name: selectedIcon,
      setUploadedImage
    } = this.props;
    const { title, uploadedImage } = this.state;
    return (
      <div className="pairing-wheel__main-category">
        <div className="pairing-wheel__main-category__content">
          <PairingMainCategoryAdd
            {...{
              createCategory: this.createCategory,
              changeTitle: this.changeTitle,
              createCategoryAttempting,
              toggleSelectIconModal: this.selectIconModal
                ? this.selectIconModal.open
                : () => {},
              title,
              selectedIcon,
              uploadedImage: this.props.uploadedImage
            }}
          />
          <PairingMainCategoryList
            {...{
              categories,
              loading: categoriesAttempting,
              getSubCategories: this.getSubCategories,
              deletePairingCategory
            }}
          />
        </div>

        <div className="pairing-wheel__main-category__mobile">
          <PairingMainCategoryPhone
            {...{ categories, subCategories, getPairingSubCategories }}
          />
        </div>
        <ContentModalNew
          className="pairing-wheel__select-icon-modal"
          ref={node => {
            this.selectIconModal = node;
          }}
        >
          <SelectIconModal
            {...{
              selectIcon,
              setLocalUploadedImage: this.setLocalUploadedImage,
              setUploadedImage,
              uploadedImage,
              selectedIcon,
              closeModal: this.selectIconModal
                ? this.selectIconModal.close
                : () => {}
            }}
          />
        </ContentModalNew>
      </div>
    );
  }
}

const mapStateToProps = ({ pairing }) => ({ ...pairing });

const mapDispatchToProps = dispatch => ({
  createPairingCategory: params =>
    dispatch(Creators.createPairingCategoryAttempt(params)),
  deletePairingCategory: pairing_category_id =>
    dispatch(Creators.deletePairingCategoryAttempt(pairing_category_id)),
  getPairingSubCategories: parent_pairing_category_id =>
    dispatch(
      Creators.getPairingSubCategoriesAttempt(parent_pairing_category_id)
    ),
  selectIcon: icon_name => dispatch(Creators.selectIcon(icon_name)),
  setUploadedImage: url => dispatch(Creators.setUploadedImage(url))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PairingMainCategory);
