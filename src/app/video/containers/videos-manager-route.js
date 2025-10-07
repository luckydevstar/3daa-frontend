import React, { Component } from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import {
  nth,
  pickAll,
  any,
  identity,
  cond,
  always,
  isEmpty,
  path,
  find,
  propEq
} from 'ramda';
import {
  VideoExplorer,
  VideoCategoriesList,
  VideoNavigation,
  EditCategoryView,
  CreateCategoryView,
  EditVideoView,
  VideoCategoriesEmpty,
  VideoLeftMenu,
  CategoryCardList
} from '../components';
import { Creators } from '../actions';
import common from 'app/common';
import { Roles } from 'app/core/config/constants';
import { noop } from 'app/common/util/helpers';
import { filterManageVideos, filterManageCategories } from '../util/selectors';

import { Text } from 'app/intl';

const {
  Footer,
  ContentModalNew,
  UILoading,
  CloudinaryMedia,
  UIExplorerNav
} = common.components;

const { SuperAdmin, CentreAdmin } = Roles;

const helpers = common.util.helpers;
const extractUserRole = helpers.extractUserRole;

class VideosRoute extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isCategoryPage: true
    };
    this.togglePage = this.togglePage.bind(this);
    this.onClickCategory = this.onClickCategory.bind(this);
  }

  UNSAFE_componentWillMount() {
    if (this.props.selectedSector === 0) {
      this.props.selectSector(this.props.sectorId);
      this.props.setSelectedHeader(this.props.currentSector.image);
      this.props.selectCategory(0);
    }

    const userRole = extractUserRole(this.props.user);
    if (userRole === SuperAdmin || userRole === CentreAdmin) {
      this.props.getAllCategories();
    } else {
      this.props.getCategories();
    }

    this.props.getVideoAllQualificationsAttempt();
  }

  togglePage(isCategoryPage, editingSubCategory) {
    this.setState({
      isCategoryPage: isCategoryPage
    });
    this.props.setEditingSubCategory(editingSubCategory);
  }

  onClickCategory(category_id) {
    this.props.getVideoCategory(category_id);
    this.props.selectCategory(category_id);
    this.props.selectSubCategory(0);
    this.togglePage(false, true);
  }

  render() {
    const {
      currentSector,
      addingCategory,
      addingVideo,
      uiLoadingVideos,
      uiEditingCategory,
      uiLoadingCategories,
      uiDeletingCategory,
      categories,
      createCategory,
      createVideo,
      confirmDeleteCategory,
      deleteCategory,
      editCategory,
      deletingCategory,
      editingCategory,
      editingVideo,
      editVideo,
      onSearch,
      searchTerm,
      selectCategory,
      selectedCategory,
      selectedSubCategory,
      selectSubCategory,
      toggleAddCategory,
      toggleAddVideo,
      updateCategory,
      updateVideo,
      videos,
      deleteVideo,
      setImagePreview,
      imagePreview,
      routes,
      lang,
      isCategoryMenu,
      toggleCategoryMenu,
      editingSubCategory,
      selectedHeader,
      qualifications,
      selectedQualifications,
      setVideoQualifications
    } = this.props;

    const modalOpen = any(identity, [
      editingVideo,
      editingCategory,
      deletingCategory,
      addingCategory
    ]);

    const closeFn = () => {
      if (addingCategory) toggleAddCategory();
      editVideo(0);
      editCategory(0);
      confirmDeleteCategory(0);
    };

    const { isCategoryPage } = this.state;

    let subCategories = [];
    if (!isCategoryPage && selectedCategory > 0 && categories.length > 0) {
      subCategories = find(propEq('video_category_id', selectedCategory))(
        categories
      ).subcategories;
    }

    let isGoingToRemoveCategory = null;
    if (deletingCategory) {
      if (isCategoryPage) {
        isGoingToRemoveCategory = find(
          propEq('video_category_id', deletingCategory)
        )(categories);
      } else {
        isGoingToRemoveCategory = find(
          propEq('video_category_id', deletingCategory)
        )(subCategories);
      }
    }

    return (
      <div className="videos-new-container videos-container min-content-height">
        <div className="min-content-height">
          <VideoNavigation
            {...{
              currentSector,
              categories: subCategories,
              selectedCategory,
              addingVideo,
              createVideo,
              toggleAddVideo,
              searchTerm,
              onSearch,
              uiLoadingVideos,
              routes,
              lang,
              selectedHeader,
              toggleLeftMenu: () => toggleCategoryMenu()
            }}
          />
          <div className="video-main-container">
            <UIExplorerNav navTop={-74}>
              <div
                className={cx('video-left', { 'is-left-menu': isCategoryMenu })}
              >
                <VideoLeftMenu
                  {...{
                    toggleLeftMenu: () => toggleCategoryMenu()
                  }}
                />
              </div>
            </UIExplorerNav>
            <div
              className={cx('video-right', {
                'is-not-left-menu': !isCategoryMenu
              })}
            >
              <div className="video-content-container">
                <div className="video-manager-container min-content-height-inner">
                  {!categories && (
                    <div className="loading-overlay align-children-middle">
                      <UILoading />
                    </div>
                  )}
                  {/* {categories &&
                    (isEmpty(categories) ? (
                      <VideoCategoriesEmpty {...{ toggleAddCategory }} />
                    ) : ( */}
                  <div className="container">
                    <div className="tabs">
                      <ul>
                        <li className={cx({ 'is-active': isCategoryPage })}>
                          <a onClick={() => this.togglePage(true, false)}>
                            Categories
                          </a>
                        </li>
                        <li className={cx({ 'is-active': !isCategoryPage })}>
                          <a onClick={() => this.togglePage(false, true)}>
                            Sub-Categories
                          </a>
                        </li>
                      </ul>
                    </div>
                    {isCategoryPage ? (
                      <CategoryCardList
                        {...{
                          uiLoadingCategories,
                          categories,
                          toggleAddCategory,
                          itemClass:
                            'is-3-widescreen is-4-desktop is-12-tablet',
                          editCategory,
                          deleteCategory: confirmDeleteCategory,
                          onCategoryChange: this.onClickCategory
                        }}
                      />
                    ) : (
                      <div>
                        {selectedCategory > 0 ? (
                          <div className="columns is-marginless">
                            <div className="column is-narrow sub-categories">
                              <VideoCategoriesList
                                {...{
                                  categories: subCategories,
                                  selectedSubCategory,
                                  onCategoryChange: selectSubCategory,
                                  onCategoryEdit: editCategory,
                                  onCategoryDelete: confirmDeleteCategory,
                                  toggleAddCategory,
                                  uiLoadingCategories
                                }}
                              />
                            </div>
                            <div className="column">
                              <VideoExplorer
                                {...{
                                  videos,
                                  onVideoClick: noop,
                                  selectedCategory,
                                  selectedSubCategory,
                                  uiLoadingVideos,
                                  itemClass:
                                    'is-4-widescreen is-6-desktop is-12-tablet',
                                  toggleAddVideo,
                                  searchTerm,
                                  editVideo,
                                  deleteVideo
                                }}
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="min-content-height-inner is-centered is-size-4">
                            Please select a category!
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                {/* ))} */}
              </div>
            </div>
          </div>
        </div>
        <Footer />

        <ContentModalNew isOpened={modalOpen} onClose={closeFn}>
          {cond([
            [
              nth(0), // editingVideo
              always(
                <EditVideoView
                  {...{
                    id: editingVideo,
                    videos,
                    updateVideo,
                    closeFn,
                    categories: subCategories,
                    uiLoadingVideos
                  }}
                />
              )
            ],
            [
              nth(1), // editingCategory
              always(
                <EditCategoryView
                  {...{
                    id: editingCategory,
                    categories: editingSubCategory ? subCategories : categories,
                    updateCategory,
                    closeFn,
                    uiEditingCategory,
                    editingSubCategory,
                    qualifications,
                    selectedQualifications,
                    setVideoQualifications
                  }}
                />
              )
            ],
            [
              nth(2), // addingCategory
              always(
                <CreateCategoryView
                  {...{
                    categories,
                    createCategory,
                    closeFn,
                    uiEditingCategory,
                    editingSubCategory,
                    qualifications,
                    selectedQualifications,
                    setVideoQualifications
                  }}
                />
              )
            ],
            [
              nth(3), // addingCategory
              always(
                <div className="confirm-delete-category-container has-text-centered p-30">
                  <div className="columns p-30">
                    {isGoingToRemoveCategory &&
                      isGoingToRemoveCategory.cloudinary_image_id && (
                        <div className="column">
                          <CloudinaryMedia
                            fileId={isGoingToRemoveCategory.cloudinary_image_id}
                            className="image-preview"
                            mediaType="image"
                            transformations={{
                              width: 200,
                              height: 150,
                              crop: 'fill',
                              gravity: 'center'
                            }}
                          />
                        </div>
                      )}
                    <div className="column">
                      <p>
                        Are you sure you want to permanently erase this item?
                      </p>
                      <p className="p-t-20 p-b-20">
                        You can't undo this action
                      </p>
                      <button
                        className={`button is-danger is-outlined ${
                          uiDeletingCategory ? 'is-loading' : ''
                        }`}
                        onClick={() => deleteCategory(deletingCategory)}
                      >
                        <Text iKey="Remove" />
                      </button>
                    </div>
                  </div>
                  {/* <div className="p-t-15 p-b-30">
                    <Text iKey="msg_are_you_sure_want_to_delete" />
                  </div>
                  <div className="modal-footer">
                    <button
                      className="button is-primary is-outlined m-r-15"
                      onClick={closeFn}
                    >
                      <Text iKey="no" />
                    </button>
                    <button
                      className={`button is-danger ${
                        uiDeletingCategory ? 'is-loading' : ''
                      }`}
                      onClick={() => deleteCategory(deletingCategory)}
                    >
                      <Text iKey="yes" />
                    </button>
                  </div> */}
                </div>
              )
            ]
          ])([editingVideo, editingCategory, addingCategory, deletingCategory])}
        </ContentModalNew>
      </div>
    );
  }
}

const mapStateToProps = ({ persisted, video, profile: { user } }) => {
  const picked = pickAll(
    [
      'addingCategory',
      'addingVideo',
      'uiLoadingCategories',
      'uiEditingCategory',
      'uiDeletingCategory',
      'uiLoadingVideos',
      'deletingCategory',
      'editingCategory',
      'editingVideo',
      'searchTerm',
      'selectedCategory',
      'selectedSector',
      'selectedSubCategory',
      'imagePreview',
      'isCategoryMenu',
      'editingSubCategory',
      'selectedHeader',
      'qualifications',
      'selectedQualifications'
    ],
    video
  );
  return {
    currentSector: path(['sector'])(persisted),
    sectorId: path(['sector', 'sector_id'])(persisted),
    lang: persisted.lang,
    ...picked,
    videos: filterManageVideos(video),
    categories: filterManageCategories(video),
    user
  };
};

const mapDispatchToProps = dispatch => ({
  createCategory: data => dispatch(Creators.createCategory(data)),
  createVideo: data => dispatch(Creators.createVideo(data)),
  deleteCategory: categoryId => dispatch(Creators.deleteCategory(categoryId)),
  confirmDeleteCategory: categoryId =>
    dispatch(Creators.confirmDeleteCategory(categoryId)),
  editCategory: categoryId => dispatch(Creators.editCategory(categoryId)),
  editVideo: videoId => dispatch(Creators.editVideo(videoId)),
  getCategories: () => dispatch(Creators.getCategoriesAttempt()),
  getAllCategories: () => dispatch(Creators.getAllCategoriesAttempt()),
  onSearch: query => dispatch(Creators.filterVideos(query)),
  selectSector: sectorId => dispatch(Creators.selectSector(sectorId)),
  selectCategory: categoryId => dispatch(Creators.selectCategory(categoryId)),
  getVideoCategory: categoryId =>
    dispatch(Creators.getVideoCategoryAttempt(categoryId)),
  selectSubCategory: subCategoryId =>
    dispatch(Creators.selectSubCategory(subCategoryId)),
  toggleAddCategory: () => dispatch(Creators.toggleAddCategory()),
  toggleAddVideo: () => dispatch(Creators.toggleAddVideo()),
  updateCategory: data => dispatch(Creators.updateCategory(data)),
  updateVideo: data => dispatch(Creators.updateVideo(data)),
  deleteVideo: (categoryId, videoId) =>
    dispatch(Creators.deleteVideo(categoryId, videoId)),
  setImagePreview: status => dispatch(Creators.setImagePreview(status)),
  toggleCategoryMenu: () => dispatch(Creators.toggleCategoryMenu()),
  setEditingSubCategory: data => dispatch(Creators.setEditingSubCategory(data)),
  setSelectedHeader: data => dispatch(Creators.setSelectedHeader(data)),
  getVideoAllQualificationsAttempt: () =>
    dispatch(Creators.getVideoAllQualificationsAttempt()),
  setVideoQualifications: qualifications =>
    dispatch(Creators.setVideoQualifications(qualifications))
});

export default connect(mapStateToProps, mapDispatchToProps)(VideosRoute);
