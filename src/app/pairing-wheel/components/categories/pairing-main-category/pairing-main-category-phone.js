import React from 'react';

import PairingMainCategoryPhoneWheel from './pairing-main-category-phone-wheel';
import PairingMainCategoryPhoneRecommended from './pairing-main-category-phone-recommended';
import PairingMainCategoryPhoneRecommendedButtons from './pairing-main-category-phone-recommended-buttons';

class PairingMainCategoryPhone extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedSub: ''
    };
    this.setSelectedSub = this.setSelectedSub.bind(this);
  }
  componentDidMount() {
    const { categories } = this.props;
    if (categories.length > 0) {
      this.setSelectedSub(categories[0].pairing_category_id);
    }
  }
  componentDidUpdate(prevProps) {
    const { categories } = this.props;
    // if (
    //   prevProps.categories !== categories &&
    //   prevProps.categories.length === 0
    // ) {
    //   this.setSelectedSub(categories[0].pairing_category_id);
    // }
  }
  setSelectedSub(selectedSub) {
    const { getPairingSubCategories } = this.props;
    this.setState({ selectedSub });
    getPairingSubCategories(selectedSub);
  }
  render() {
    const { categories, subCategories } = this.props;
    const { selectedSub } = this.state;
    return (
      <div className="pairing-main-category-phone">
        <div className="pairing-main-category-phone__display">
          <PairingMainCategoryPhoneWheel
            id="wheel-container"
            {...{ categories, setSelectedSub: this.setSelectedSub }}
          />
          <PairingMainCategoryPhoneWheel
            id="wheel-sub-container"
            {...{ subCategories, selectedSub }}
            isSub
          />
          <PairingMainCategoryPhoneRecommended />
          <PairingMainCategoryPhoneRecommendedButtons />
        </div>
      </div>
    );
  }
}

export default PairingMainCategoryPhone;
