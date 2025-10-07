import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import {
  pickAll,
  path,
  filter,
  equals,
  findIndex,
  find,
  merge,
  propEq,
  update
} from 'ramda';
import cx from 'classnames';
import Isvg from 'react-inlinesvg';

import IconFavourite from 'images/icon-video-favourite.svg';
import IconFeatured from 'images/icon-video-featured.svg';
import IconHistory from 'images/icon-video-history.svg';

import { Roles } from 'app/core/config/constants';
import common from 'app/common';
import { createCloudinaryUrl } from 'app/common/util/helpers';
import { Creators } from '../../actions';

const getImage = img =>
  createCloudinaryUrl(img, 'image', {
    width: '31',
    height: '31'
  });

const { SuperAdmin, CentreAdmin } = Roles;

const helpers = common.util.helpers;
const extractUserRole = helpers.extractUserRole;

class VideoLeftMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      menus: null,
      isSticky: false
    };

    this.generateMenu = this.generateMenu.bind(this);
    this.getCategoryMenus = this.getCategoryMenus.bind(this);
    this.selectMenu = this.selectMenu.bind(this);
    this.checkActive = this.checkActive.bind(this);
    this.updateLayout = this.updateLayout.bind(this);
  }

  componentDidMount() {
    const {
      sectors,
      categories,
      selectedCategory,
      selectedSector
    } = this.props;

    this.setState({
      menus: this.generateMenu(sectors, categories)
    });

    if (!selectedCategory && !selectedSector) {
      if (categories !== null) {
        const categorieImage = categories[0].cloudinary_image_id;
        this.props.setSelectedHeader(categorieImage);
      } else {
        const sectorImage = sectors[1].image;
        this.props.setSelectedHeader(sectorImage);
      }
    }

    document
      .querySelector('.video-left-menu')
      .addEventListener('scroll', this.updateLayout);
    window.addEventListener('resize', this.updateLayout);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { sectors, categories } = this.props;

    if (
      !equals(sectors, nextProps.sectors) ||
      !equals(categories, nextProps.categories)
    ) {
      this.setState({
        menus: this.generateMenu(nextProps.sectors, nextProps.categories)
      });
    }
  }

  updateLayout() {
    if (!this.elNav) {
      return;
    }

    if (this.elContainer.scrollTop > this.elNav.offsetTop) {
      this.setState({
        isSticky: true
      });
    } else {
      this.setState({
        isSticky: false
      });
    }
  }

  getCategoryMenus(sector_id, categories, sector_image) {
    const { selectedCategory } = this.props;

    const filteredCategories =
      categories &&
      categories.filter(category => category.abstract_sector_id === sector_id);

    let subMenus = [];
    if (filteredCategories) {
      filteredCategories.map(category => {
        subMenus.push({
          sector_id: sector_id,
          category_id: category.video_category_id,
          sub_category_id: 0,
          icon: category.icon,
          name: category.title,
          image: category.cloudinary_image_id || sector_image
        });
      });
    }

    return subMenus;
  }

  getSubCategoryMenus(subcategories) {
    const {
      selectedSector,
      selectedCategory,
      selectedSubCategory
    } = this.props;

    let subMenus = [];
    if (subcategories && subcategories.length > 0) {
      subcategories.map(category => {
        subMenus.push({
          sector_id: selectedSector,
          category_id: selectedCategory,
          sub_category_id: category.video_category_id,
          icon: category.icon,
          name: category.title,
          image: category.cloudinary_image_id
        });
      });
    }
    return subMenus;
  }

  generateMenu(sectors = null, categories = null) {
    const {
      user,
      selectedSector,
      selectedSubCategory,
      selectedCategory
    } = this.props;
    const userRole = extractUserRole(user);

    let menus = [];
    if (userRole === SuperAdmin || userRole === CentreAdmin) {
      if (sectors && sectors.length > 0) {
        sectors.map(sector => {
          menus.push({
            sector_id: sector.sector_id,
            category_id: 0,
            icon: sector.sector_icon,
            name: sector.title,
            image: sector.image,
            subMenus: this.getCategoryMenus(
              sector.sector_id,
              categories,
              sector.image
            ),
            is_admin: true
          });
        });
      }
    } else {
      if (categories && categories.length > 0) {
        categories.map(category => {
          menus.push({
            sector_id: category.abstract_sector_id,
            category_id: category.video_category_id,
            icon: category.icon,
            name: category.title,
            image: category.cloudinary_image_id,
            subMenus: this.getSubCategoryMenus(category.subcategories),
            is_admin: false
          });
        });
      }
    }
    return menus;
  }

  selectMenu(id, image, is_admin) {
    const {
      selectSector,
      selectedSector,
      selectCategory,
      selectedCategory,
      selectSubCategory,
      setSelectedHeader,
      getVideos,
      getVideoAllQualificationsAttempt
    } = this.props;

    if (is_admin) {
      if (selectedSector !== id) {
        selectSector(id);
        getVideoAllQualificationsAttempt();
      }
      selectCategory(0);
      selectSubCategory(0);
    } else {
      if (selectedCategory !== id) {
        selectCategory(id);
        getVideos(id);
      }
      selectSubCategory(0);
    }
    setSelectedHeader(image);
  }

  selectSubMenu(id, image, is_admin) {
    if (is_admin) {
      this.props.selectCategory(id);
      this.props.selectSubCategory(0);
    } else {
      this.props.selectSubCategory(id);
    }
    this.props.getVideos(id);
    this.props.setSelectedHeader(image);
  }

  checkActive(id, is_admin) {
    const {
      selectedSector,
      selectedCategory,
      selectedSubCategory
    } = this.props;

    let active = false;

    if (is_admin) {
      active = selectedSector === id;
    } else {
      active = selectedCategory === id;
    }

    return active;
  }

  render() {
    const {
      toggleLeftMenu,
      selectedCategory,
      selectedSubCategory
    } = this.props;
    const { menus, isSticky } = this.state;
    return (
      <div
        className="video-left-menu"
        ref={el => {
          this.elContainer = el;
        }}
      >
        {!selectedCategory && isSticky && (
          <div className="menu-title sticky-title">
            <div className="name">CATEGORIES</div>
          </div>
        )}
        <div className="menu-close p-r-10" onClick={toggleLeftMenu}>
          <i className="fa fa-angle-left" /> Close
        </div>
        <div className="main-menus">
          <Link
            className={cx('menu-item', {
              active: window.location.pathname === '/videos'
            })}
            to={'/videos'}
          >
            <div className="icon">
              <Isvg className="small" src={IconFeatured} />
            </div>
            <div className="name">Featured Videos</div>
          </Link>
          <Link
            className={cx('menu-item', {
              active: window.location.pathname === '/videos/favourites'
            })}
            to={'/videos/favourites'}
          >
            <div className="icon">
              <Isvg className="small" src={IconFavourite} />
            </div>
            <div className="name">Favourites</div>
          </Link>
          <Link
            className={cx('menu-item', {
              active: window.location.pathname === '/videos/history'
            })}
            to={'/videos/history'}
          >
            <div className="icon">
              <Isvg className="small" src={IconHistory} />
            </div>
            <div className="name">History</div>
          </Link>
        </div>
        <div
          className="menu-title"
          ref={el => {
            this.elNav = el;
          }}
        >
          <div className="name">CATEGORIES</div>
        </div>

        <div className="category-menus">
          {menus &&
            menus.map(menu => {
              const id = menu.is_admin ? menu.sector_id : menu.category_id;
              const sector_id = menu.sector_id;
              if (sector_id === 0) {
                return null;
              }
              return (
                <div
                  key={`category-menu-${menu.sector_id}-${menu.name}`}
                  className={cx('menu-list', {
                    active: this.checkActive(id, menu.is_admin)
                  })}
                >
                  <div
                    className="menu"
                    onClick={() =>
                      this.selectMenu(id, menu.image, menu.is_admin)
                    }
                  >
                    <div className="menu-inner">
                      <div className="icon">
                        {menu.icon && <img src={getImage(menu.icon)} />}
                      </div>
                      <div className="name" title={menu.name}>
                        {menu.name}
                      </div>
                      {this.checkActive(id, menu.is_admin) &&
                      menu.subMenus.length > 0 ? (
                        <i className="fa fa-angle-down" />
                      ) : (
                        <i className="fa fa-angle-right" />
                      )}
                    </div>
                  </div>
                  {menu.subMenus && menu.subMenus.length > 0 && (
                    <div
                      className={cx('sub-menus', {
                        collapsed: !this.checkActive(id, menu.is_admin)
                      })}
                    >
                      {menu.subMenus.map(sMenu => {
                        const sub_id = menu.is_admin
                          ? sMenu.category_id
                          : sMenu.sub_category_id;
                        return (
                          <div
                            key={`sub-menus-${sMenu.category_id}-${sMenu.name}`}
                            className={cx('s-menu', {
                              active:
                                sub_id === selectedCategory ||
                                sub_id === selectedSubCategory
                            })}
                            onClick={() =>
                              this.selectSubMenu(
                                sub_id,
                                sMenu.image,
                                menu.is_admin
                              )
                            }
                          >
                            {sMenu.name}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ video, profile: { user } }) => {
  const picked = pickAll(
    ['categories', 'selectedSector', 'selectedSubCategory', 'selectedCategory'],
    video
  );
  return {
    ...picked,
    sectors: path(['sectors'])(user),
    user
  };
};

const mapDispatchToProps = dispatch => ({
  selectSector: sectorId => dispatch(Creators.selectSector(sectorId)),
  selectCategory: categoryId => dispatch(Creators.selectCategory(categoryId)),
  selectSubCategory: subCategoryId =>
    dispatch(Creators.selectSubCategory(subCategoryId)),
  setSelectedHeader: data => dispatch(Creators.setSelectedHeader(data)),
  getVideos: categoryId =>
    dispatch(Creators.getVideosAttempt(parseInt(categoryId))),
  getVideoAllQualificationsAttempt: () =>
    dispatch(Creators.getVideoAllQualificationsAttempt())
});

export default connect(mapStateToProps, mapDispatchToProps)(VideoLeftMenu);
