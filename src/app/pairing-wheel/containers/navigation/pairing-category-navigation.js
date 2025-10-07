import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';

import { Creators } from '../../actions';
import MenuActiveIcon from 'images/icons/menu-active.png';
import LinkIcon from 'images/icons/link.png';

class PairingCategoryNavigation extends React.Component {
  render() {
    const { categoryType, setCategoryType, categories } = this.props;
    return (
      <div
        className={classNames('pairing-category__navigation', {
          'pairing-category__navigation--shadow': categoryType === 'main'
        })}
      >
        <div
          className={classNames('pairing-category__navigation__item', {
            'pairing-category__navigation__item--active':
              categoryType === 'main'
          })}
          onClick={() => {
            setCategoryType('main');
          }}
        >
          <i className="fa fa-bars" aria-hidden="true" />
          <div className="pairing-category__navigation__item__title">
            Main Category
          </div>
          <div>({categories.length})</div>
        </div>
        <div
          className={classNames('pairing-category__navigation__item', {
            'pairing-category__navigation__item--active': categoryType === 'sub'
          })}
          onClick={() => {
            setCategoryType('sub');
          }}
        >
          <img src={MenuActiveIcon} alt="" />
          <div className="pairing-category__navigation__item__title">
            Sub Category
          </div>
          <div />
        </div>
        <div
          className={classNames('pairing-category__navigation__item', {
            'pairing-category__navigation__item--active':
              categoryType === 'recommended'
          })}
          onClick={() => {
            setCategoryType('recommended');
          }}
        >
          <img src={LinkIcon} alt="" />
          <div className="pairing-category__navigation__item__title">
            Recommended pairing
          </div>
          <div />
        </div>
      </div>
    );
  }
}

PairingCategoryNavigation.propTypes = {
  categoryType: PropTypes.string,
  setCategoryType: PropTypes.func
};
PairingCategoryNavigation.defaultProps = {
  categoryType: 'main',
  setCategoryType: () => {}
};

const mapStateToProps = ({ pairing }) => ({
  ...pairing
});

const mapDispatchToProps = dispatch => ({
  setCategoryType: categoryType =>
    dispatch(Creators.setCategoryType(categoryType))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PairingCategoryNavigation);
