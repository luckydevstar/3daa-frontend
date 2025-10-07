import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import UploadMedia from './upload-media';
import CustomiseBlock from './customise-block';
import AssetLibrary from './asset-library';
import { path } from 'ramda';

import common from 'app/common';
import { Creators } from 'app/qualifications/actions';

const {
  components: { Navigation, ContentModal }
} = common;

class ImageInsertionModal extends Component {
  constructor(props) {
    super(props);
    this.tabs = ['Asset Library', 'New Upload', 'Customise'];
    this.elementsPerPage = 12;
    this.state = {
      currentPage: 0,
      currentImage: null,
      params: {
        offset: 0,
        limit: this.elementsPerPage,
        search: null,
        type: 'photo'
      }
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!this.state.currentImage && nextProps.currentState.image) {
      this.setState({ currentImage: nextProps.currentState.image }, () => {
        this.navigateToCustomise();
      });
    }
  }

  setCurrentImage(image) {
    this.setState({ currentImage: image }, () => this.navigateToCustomise());
  }

  open() {
    this.modal.open();
  }

  close() {
    const paramsCopy = this.state.params;

    paramsCopy.search = null;
    paramsCopy.offset = 0;
    this.setState({ params: paramsCopy, currentPage: 2 }, () => {
      this.modal.close();
    });
  }

  resetModalState() {
    const params = {
      offset: 0,
      limit: this.elementsPerPage,
      search: null,
      type: 'photo'
    };
    this.setState({ currentPage: 0, currentImage: null, params });
  }

  loadImages() {
    if (!this.props.images) {
      this.props.getImages(this.state.params);
    }
  }

  reloadImages() {
    this.props.getImages(this.state.params);
  }

  handleModalOpen(isOpen) {
    if (isOpen) {
      this.reloadImages();
      if (this.state.currentImage) {
        this.navigateToCustomise();
      }
    } else {
      this.resetModalState();
    }
  }

  navigateToCustomise() {
    this.setState({ currentPage: 2 });
  }

  filterImages(phrase) {
    const paramsCopy = this.state.params;

    paramsCopy.offset = 0;
    paramsCopy.search = phrase;
    this.setState({ params: paramsCopy }, () => {
      this.reloadImages();
    });
  }

  resetImagesFilter() {
    const paramsCopy = this.state.params;

    paramsCopy.offset = 0;
    paramsCopy.search = null;
    this.setState({ params: paramsCopy }, () => {
      this.reloadImages();
    });
  }

  handleSearchKeyUp(e) {
    const phrase = e.target.value.trim().toLowerCase();

    if (e.key === 'Enter' || e.keyCode === 13) {
      this.filterImages(phrase);
    }

    if (e.key === 'Escape' || e.key === 'Esc' || e.keyCode === 27) {
      e.target.value = '';
      this.resetImagesFilter();
    }
  }

  handleSearchChange(e) {
    const phrase = e.target.value;
    if (!phrase || phrase === '') {
      this.resetImagesFilter();
    }
  }

  handleTabChange(newTab) {
    const paramsCopy = this.state.params;

    if (paramsCopy.search !== null || paramsCopy.offset !== 0) {
      paramsCopy.search = null;
      paramsCopy.offset = null;
      this.setState({ currentPage: newTab, params: paramsCopy }, () => {
        this.reloadImages();
      });
    }
    this.setState({ currentPage: newTab });
  }

  handleMediaDelete(media_id) {
    // TODO need some better handling for media delete
    this.props.deleteImage(media_id);
    this.reloadImages();
  }

  handlePaginationChange(newPage) {
    const newOffset = (newPage - 1) * this.elementsPerPage;
    const paramsCopy = this.state.params;

    paramsCopy.offset = newOffset;
    this.setState({ params: paramsCopy }, () => {
      this.reloadImages();
    });
  }

  render() {
    let Subpage;

    const {
      images,
      postImage,
      attemptingPostImage,
      image_max_size,
      recentlyUploaded,
      saveChanges,
      currentState,
      image_max_resolution,
      image_min_resolution,
      total
    } = this.props;

    const {
      currentPage,
      currentImage,
      params: { search }
    } = this.state;

    switch (currentPage) {
      case 0:
        Subpage = (
          <AssetLibrary
            media={images}
            mediaType="image"
            totalMedia={total}
            setCurrentMedia={e => this.setCurrentImage(e)}
            close={() => this.close()}
            elementsPerPage={this.elementsPerPage}
            handleMediaDelete={media_id => this.handleMediaDelete(media_id)}
            handlePaginationChange={newPage =>
              this.handlePaginationChange(newPage)
            }
            search={search}
          />
        );
        break;
      case 1:
        Subpage = (
          <UploadMedia
            file_max_size={image_max_size}
            fileType="image"
            uploadMedia={postImage}
            attempting={attemptingPostImage}
            recentlyUploaded={recentlyUploaded}
            close={() => this.close()}
            image_max_resolution={image_max_resolution}
            image_min_resolution={image_min_resolution}
            setCurrentMedia={e => this.setCurrentImage(e)}
          />
        );
        break;
      case 2:
        Subpage = (
          <CustomiseBlock
            mediaType="image"
            currentMedia={currentImage}
            currentColor={currentState.color}
            currentTitle={currentState.title}
            currentDescription={currentState.description}
            close={() => this.close()}
            saveChanges={saveChanges}
          />
        );
        break;
      default:
        Subpage = null;
    }

    return (
      <ContentModal
        ref={e => {
          this.modal = e;
        }}
        onStateChange={isOpen => this.handleModalOpen(isOpen)}
      >
        <div className="workbooks-media-insertion-modal">
          <div className="workbooks-media-insertion-modal-header">
            <h3 className="title is-4">Insert Image</h3>
            <Navigation
              tabs={this.tabs}
              activeTab={currentPage}
              callback={e => this.handleTabChange(e)}
            >
              {!currentPage && (
                <ul className="is-right">
                  <p className="control search">
                    <input
                      onChange={e => {
                        this.handleSearchChange(e);
                      }}
                      onKeyUp={e => {
                        this.handleSearchKeyUp(e);
                      }}
                      className="input"
                      type="text"
                      placeholder="Search asset library"
                    />
                  </p>
                </ul>
              )}
            </Navigation>
          </div>
          {Subpage}
        </div>
      </ContentModal>
    );
  }
}

ImageInsertionModal.propTypes = {
  saveChanges: PropTypes.func.isRequired,
  currentState: PropTypes.object
};

ImageInsertionModal.defaultProps = {
  currentState: null
};

const mapStateToProps = state => ({
  total: path(['qualifications', 'media', 'total'])(state),
  images: path(['qualifications', 'media', 'images'])(state),
  image_max_size: path(['config', 'config', 'image', 'max_file_size'])(state),
  image_max_resolution: path(['config', 'config', 'image', 'max'])(state),
  image_min_resolution: path(['config', 'config', 'image', 'min'])(state),
  member_id: path(['profile', 'user', 'member_id'])(state),
  attemptingPostImage: path([
    'qualifications',
    'media',
    'attemptingPostWorkbookMedia'
  ])(state),
  recentlyUploaded: path(['qualifications', 'media', 'recentlyUploaded'])(state)
});

const mapDispatchToProps = dispatch => ({
  getImages: params => dispatch(Creators.getWorkbookMediaAttempt(params)),
  postImage: data => dispatch(Creators.postWorkbookMediaAttempt(data)),
  deleteImage: media_id =>
    dispatch(Creators.deleteWorkbookMediaAttempt(media_id))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  {
    withRef: true
  }
)(ImageInsertionModal);
