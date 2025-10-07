import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, browserHistory } from 'react-router';
import Dropzone from 'react-dropzone';
import { connect } from 'react-redux';
import {
  Field,
  reduxForm,
  change,
  initialize,
  formValueSelector
} from 'redux-form';

import { uniq, without, map, addIndex, equals, path } from 'ramda';

import classNames from 'classnames';

import userUtil from 'app/user/util/';
import unitsUtil from 'app/units/util/';
import common from 'app/common';

import { Creators as NewsActions } from 'app/news/actions';
import { Creators as SectorsActions } from 'app/sectors/actions';

import Isvg from 'react-inlinesvg';
import IconImagePreview from 'images/icon_image_preview.svg';
import IconWorkbooks from 'images/icon_workbooks_fat_grey_1.svg';

import ModalAddResult from '../components/modals/modal-add-result';
import NewsProviderEdit from '../components/news-feed/news-provider-edit';

const createCloudinaryUrl = common.util.helpers.createCloudinaryUrl;
const {
  Form: { field, select, radio, textarea, file },
  CloudinaryMedia,
  Footer,
  MediaCrop,
  UILoading,
  ContentModal,
  UINavigation
} = common.components;

class NewsFeedEditContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      subpage: 0,
      fileToCrop: null,
      visibleSubmitButton: true,
      availableLevels: [],
      filteredResults: null,
      add_result_modal_success: true,
      add_result_modal_title: 'Provider Added',
      add_result_modal_content: 'Provider been successfully added.',
      add_result_modal_submit_text: 'Add Provider',

      newsProvider: null,
      headerError: null
    };

    this.goBack = this.goBack.bind(this);
    this.setActive = this.setActive.bind(this);
    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onSave = this.onSave.bind(this);
    this.onDeleteItem = this.onDeleteItem.bind(this);
    this.isValid = this.isValid.bind(this);
    this.isLoading = this.isLoading.bind(this);
    this.onVisibleSubmitButton = this.onVisibleSubmitButton.bind(this);
    this.createBothPreview = this.createBothPreview.bind(this);
  }

  UNSAFE_componentWillMount() {
    const {
      sectors,
      newsProvider,
      params,
      getSectorsAttempt,
      getNewsProviderAttempt,
      setActiveNewsProvider
    } = this.props;

    if (!sectors) {
      getSectorsAttempt();
    }

    if (params.feed_id != 'add') {
      getNewsProviderAttempt(params.feed_id);
    } else if (newsProvider) {
      setActiveNewsProvider(null);
    }
  }

  shouldComponentUpdate(nextProps) {
    if (
      nextProps.attemptingPostNewsProvider &&
      this.props.attemptingPostNewsProvider
    ) {
      return false;
    }
    return true;
  }

  componentWillUnmount() {
    // this.props.unitFilterChanged('');
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { newsProvider, subpage } = this.state;

    const params = nextProps.params;
    const path = browserHistory.getCurrentLocation().pathname;

    if (params) {
      if (params.article_id == 'amplification') {
        this.setState({ subpage: 1, visibleSubmitButton: true });
      } else {
        this.setState({ subpage: 0, visibleSubmitButton: true });
      }
    }

    if (
      nextProps.newsProvider !== newsProvider &&
      (!nextProps.newsProvider ||
        (nextProps.newsProvider && !newsProvider) ||
        (nextProps.newsProvider &&
          nextProps.newsProvider.provider_id != newsProvider.provider_id))
    ) {
      this.setState({ newsProvider: nextProps.newsProvider });
    }
  }

  goBack() {
    const { persistedSector } = this.props;
    browserHistory.push(`/news/provider`);
    // browserHistory.push(`/news/provider/${persistedSector.title}`);
  }

  onChangeTitle(e) {
    const { subpage } = this.state;
    const { changeFieldValue } = this.props;
    changeFieldValue('newsProviderEdit', 'title', e.target.value);
  }

  validateVideo(video, callback) {
    const error = [];
    const { max_video_file_size, video_formats } = this.props;

    if (
      video_formats &&
      video_formats.every(e => video.type.indexOf(e) === -1)
    ) {
      error.push(
        `We're accepting${video_formats.map(
          video_format => ` .${format}`
        )} only`
      );
      return callback(false, error);
    }

    if (video.size > max_video_file_size) {
      error.push(
        `Your video is bigger than: ${max_video_file_size / 1024 / 1024}MB`
      );
      return callback(false, error);
    }

    return callback(true);
  }

  validateImage(image, callback) {
    const img = new Image();
    const error = [];
    const {
      max_image_resolution,
      min_image_resolution,
      max_image_file_size,
      image_formats
    } = this.props;

    img.src = image.preview;
    img.type = image.type;

    if (
      image_formats &&
      image_formats.every(e => image.type.indexOf(e) === -1)
    ) {
      error.push(
        `We're accepting${image_formats.map(format => ` .${format}`)} only`
      );
      return callback(false, error);
    }

    if (image.size > max_image_file_size) {
      error.push(
        `Your image is bigger than: ${max_image_file_size / 1024 / 1024}MB`
      );
    }

    img.onload = () => {
      if (img.type.indexOf('svg') > -1) {
        return callback(true, null);
      }
      if (
        img.width > max_image_resolution.width ||
        img.height > max_image_resolution.height
      ) {
        error.push(
          `Your image is larger than ${max_image_resolution.width}x${max_image_resolution.height}`
        );
      }
      if (
        img.width < min_image_resolution.width ||
        img.height < min_image_resolution.height
      ) {
        error.push(
          `Your image is smaller than ${min_image_resolution.width}x${min_image_resolution.height}`
        );
      }
      return callback(!error.length, error.length ? error : null);
    };
    return null;
  }

  detectMediaType(file) {
    let result = null;

    if (file && file.type) {
      if (file.type.indexOf('image') > -1) {
        result = 'image';
      } else if (file.type.indexOf('video') > -1) {
        result = 'video';
      }
    }
    return result;
  }

  setHeaderMedia(file) {
    this.props.changeFieldValue('newsProviderEdit', 'header', file);
  }

  handleHeaderUpload(files) {
    const file = files[0];
    const mediaType = this.detectMediaType(file);
    const setHeader = (status, error) => {
      if (status) {
        this.setState({ headerError: null }, () => {
          this.setHeaderMedia(file);
        });
      } else {
        this.setState({ headerError: error[0] });
      }
    };

    switch (mediaType) {
      case 'video':
        this.validateVideo(file, setHeader);
        break;
      case 'image':
        this.validateImage(file, setHeader);
        this.setState({
          fileToCrop: file
        });
        break;
      default:
        break;
    }
  }

  setActive(key) {
    const { persistedSector, newsProvider } = this.props;
    let subpage = +key.substr(7);

    let route = `/news/provider/${persistedSector.title}`;

    if (newsProvider) route += `/${newsProvider.provider_id}`;
    else route += '/add';

    // this.setState({ subpage: subpage, visibleSubmitButton: subpage != 1 });
    this.setState({ visibleSubmitButton: subpage != 1 });
    browserHistory.push(route);
  }

  getTabs() {
    return this.state.availableLevels.map((label, i) => ({
      key: `wb-nav-${i}`,
      text: label
    }));
  }

  closeModalAddResult() {
    this.addModalResult.close();
  }

  handleModalAddResultSubmit() {
    this.addModalResult.close();
  }

  isValid() {
    const { subpage } = this.state;
    const { newsProvider, newsProviderEdit } = this.props;
    switch (subpage) {
      case 0:
        if (!newsProvider)
          return newsProviderEdit && !newsProviderEdit.syncErrors;
        else
          return (
            newsProviderEdit &&
            !newsProviderEdit.syncErrors &&
            !equals(newsProvider, newsProviderEdit.values)
          );
    }
  }

  isLoading() {
    const { subpage } = this.state;
    const { attemptingPostNewsProvider } = this.props;
    switch (subpage) {
      case 0:
        return attemptingPostNewsProvider;
    }
  }

  onVisibleSubmitButton(value) {
    this.setState({ visibleSubmitButton: value });
  }

  onCancel() {
    browserHistory.push('/news/provider');
  }

  onSave() {}

  onDeleteItem(id) {
    this.props.deleteNewsProviderAttempt(id);
  }

  createPhotoPreview(photo) {
    let result = null;
    const uploadedMedia =
      (photo &&
        photo.digital_badge &&
        photo.digital_badge['cloudinary_file_id']) ||
      null;

    if (uploadedMedia) {
      result = (
        <CloudinaryMedia
          fileId={uploadedMedia}
          mediaType="image"
          transformations={{
            width: 150,
            height: 150,
            crop: 'fill',
            gravity: 'center'
          }}
        />
      );
    } else if (photo && photo.preview) {
      result = <img src={photo.preview} alt="" />;
    } else {
      result = (
        <div
          className="columns"
          style={{
            maxWidth: 150,
            paddingTop: 50,
            margin: 'auto'
          }}
        >
          <div className="column">
            {/* <Isvg className="small" src={IconImagePreview} /> */}
          </div>
        </div>
      );
    }
    return result;
  }

  createBothPreview(file, cloudinaryMediaType) {
    let result = null;

    if (file) {
      if (typeof file === 'string') {
        switch (cloudinaryMediaType) {
          case 'image':
            result = (
              <CloudinaryMedia
                fileId={file}
                mediaType={cloudinaryMediaType}
                transformations={{
                  crop: 'fill',
                  gravity: 'center'
                }}
              />
            );
            break;
          case 'video':
            result = (
              <CloudinaryMedia
                fileId={file}
                mediaType={cloudinaryMediaType}
                thumbnail
                transformations={{
                  crop: 'fill',
                  gravity: 'center'
                }}
              />
            );
            break;
          default:
        }
      } else {
        if (file.type.includes('video')) {
          result = (
            <video
              src={file.preview}
              controls
              style={{ width: '100%', height: '100%', objectFit: 'fill' }}
            />
          );
        } else if (file.type.includes('image')) {
          result = (
            <img
              src={file.preview}
              alt=""
              style={{ width: '100%', objectFit: 'fill' }}
            />
          );
        } else {
          result = <div />;
        }
      }
    }
    return result;
  }

  closeCrop = () => {
    this.setState({
      fileToCrop: null
    });
  };

  acceptCrop = file => {
    this.handleHeaderUpload([file]);
    this.closeCrop();
  };

  render() {
    const {
      subpage,
      fileToCrop,
      add_result_modal_success,
      add_result_modal_title,
      add_result_modal_content,
      add_result_modal_submit_text,

      headerError
    } = this.state;

    const { goBack, onChangeTitle, createBothPreview, onDeleteItem } = this;

    const {
      persistedSector,
      newsProviderEdit,
      newsProviderTitle,

      attemptingGetSectors,
      attemptingGetNewsProvider
    } = this.props;

    const tabs = this.getTabs();

    return (
      <div className="news">
        <div className="workbook-sector-container min-content-height">
          {/* Header */}
          <ContentModal
            ref={e => {
              this.addModalResult = e;
            }}
          >
            <ModalAddResult
              title={add_result_modal_title}
              content={add_result_modal_content}
              success={add_result_modal_success}
              button_text={add_result_modal_submit_text}
              closeModal={() => this.closeModalAddResult()}
              handleSubmit={() => this.handleModalAddResultSubmit()}
            />
          </ContentModal>

          <section
            className="hero smaller gray"
            style={{ position: 'relative' }}
          >
            {
              <div
                className="header-background"
                style={{
                  position: 'absolute',
                  height: '100%',
                  width: '100%',
                  overflow: 'hidden'
                }}
              >
                {newsProviderEdit &&
                  newsProviderEdit.values &&
                  createBothPreview(newsProviderEdit.values.header, 'image')}
              </div>
            }
            <div className="hero-body">
              <div className="container">
                <div className="media">
                  <div className="media-left">
                    <a className="back-button" onClick={() => goBack()} />
                  </div>
                  <div className="media-content">
                    <h1 className="title">News Provider</h1>
                    <h2 className="subtitle">Add your news RSS feeds</h2>
                  </div>

                  {subpage == 0 && (
                    <div className="media-right align-right">
                      <Dropzone
                        className="cover-video-upload"
                        onDrop={files => this.handleHeaderUpload(files)}
                      >
                        <div
                          className="has-text-centered"
                          style={{ cursor: 'pointer' }}
                        >
                          <div style={{ opacity: '0.3' }}>
                            {<Isvg src={IconWorkbooks} />}
                          </div>

                          {newsProviderEdit &&
                          newsProviderEdit.values &&
                          newsProviderEdit.values.header ? (
                            <span>Change Header Media</span>
                          ) : (
                            <span>Add Header Image/Animation</span>
                          )}
                          {headerError ? (
                            <span className="field-error">{headerError}</span>
                          ) : null}
                        </div>
                      </Dropzone>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          <section className="content-section navigation-section">
            <div className="container">
              <UINavigation
                tabs={tabs}
                active={`wb-nav-${subpage}`}
                showSearch={false}
                change={e => {
                  this.setActive(e);
                }}
              />
            </div>
          </section>

          {attemptingGetSectors || attemptingGetNewsProvider ? (
            <UILoading isLoadingOverlay />
          ) : (
            <section
              className="content-section p-t-30"
              style={{ background: 'white' }}
            >
              <div className="container item-edit-container">
                {subpage == 0 && <NewsProviderEdit />}
                <div />
              </div>
            </section>
          )}
        </div>
        {fileToCrop &&
          newsProviderEdit &&
          newsProviderEdit.values &&
          newsProviderEdit.values.header && (
            <MediaCrop
              {...{
                mediaSrc: URL.createObjectURL(newsProviderEdit.values.header),
                onClose: this.closeCrop,
                acceptCrop: this.acceptCrop
              }}
            />
          )}
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    persistedSector: path(['persisted', 'sector'])(state),
    sectors: path(['sectors', 'sectors', 'sectors'])(state),

    newsProvider: path(['news', 'currentNewsProvider'])(state),

    newsProviderEdit: path(['form', 'newsProviderEdit'])(state),
    newsProviderTitle: path(['form', 'newsProviderEdit', 'values', 'title'])(
      state
    ),

    attemptingGetSectors: path(['sectors', 'attemptingGetSectors'])(state),
    attemptingGetNewsProvider: path(['news', 'attemptingGetNewsProvider'])(
      state
    ),
    attemptingPostNewsProvider: path(['news', 'attemptingPostNewsProvider'])(
      state
    ),

    errorCode: path(['news', 'errorCode'])(state),

    max_image_file_size: path(['config', 'config', 'image', 'max_file_size'])(
      state
    ),
    max_image_resolution: path(['config', 'config', 'image', 'max'])(state),
    min_image_resolution: path(['config', 'config', 'image', 'min'])(state),
    image_formats: path(['config', 'config', 'image', 'formats'])(state),

    max_video_file_size: path(['config', 'config', 'video', 'max_file_size'])(
      state
    ),
    video_formats: path(['config', 'config', 'video', 'formats'])(state)
  };
};

const mapDispatchToProps = dispatch => ({
  getSectorsAttempt: () => dispatch(SectorsActions.getSectorsAttempt()),

  createNewsProviderAttempt: payload =>
    dispatch(NewsActions.createNewsProviderAttempt(payload)),

  updateNewsProviderAttempt: (payload, id) =>
    dispatch(NewsActions.updateNewsProviderAttempt(payload, id)),

  getNewsProviderAttempt: id =>
    dispatch(NewsActions.getNewsProviderAttempt(id)),

  setActiveNewsProvider: news_provider_id =>
    dispatch(NewsActions.setActiveNewsProvider(news_provider_id)),

  changeFieldValue: (form_name, field_name, value) =>
    dispatch(change(form_name, field_name, value))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewsFeedEditContainer);

// {subpage < 4 ? (
//   <input
//     placeholder={'News Provider'}
//     name="title"
//     type="text"
//     value={
//       subpage == 0
//         ? newsProviderTitle || ''
//         : articleTitle || ''
//     }
//     className="control"
//     style={{
//       fontSize: '32px',
//       background: 'transparent',
//       border: 'none',
//       width: '100%'
//     }}
//     onChange={e => onChangeTitle(e)}
//   />
// ) : (
//   <h1 className="title">{newsProviderTitle || ''}</h1>
// )}
