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
  formValueSelector,
  getFormValues
} from 'redux-form';

import { uniq, without, map, addIndex, equals, path } from 'ramda';

import classNames from 'classnames';

import userUtil from 'app/user/util/';
import unitsUtil from 'app/units/util/';
import common from 'app/common';

import { Creators as NewsActions } from 'app/news/actions';

import Isvg from 'react-inlinesvg';
// import IconWorkbooks from 'images/icon_workbooks_fat_grey_1.svg';
// import IconImagePreview from 'images/icon_image_preview.svg';

import ModalAddResult from '../components/modals/modal-add-result';
import NewsEdit from '../components/news/news-edit';

import NewsArticleEditorContainer from './news-article-editor-container';

const createCloudinaryUrl = common.util.helpers.createCloudinaryUrl;
const {
  Form: { field, select, radio, textarea, file },
  CloudinaryMedia,
  ConvertDraftObjectToHtml,
  Footer,
  UILoading,
  ContentModal,
  UINavigation
} = common.components;

const { FormUtil } = userUtil;
const FORM_NAME = 'newsEdit';

class NewsEditContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      subpage: 0,
      visibleSubmitButton: true,
      availableLevels: [],
      filteredResults: null,
      add_result_modal_success: true,
      add_result_modal_title: 'News Article Added',
      add_result_modal_content: 'News Article has been successfully added.',
      add_result_modal_submit_text: 'Add News Article',

      news: null,
      headerError: null
    };

    this.goBack = this.goBack.bind(this);
    this.setActive = this.setActive.bind(this);
  }

  UNSAFE_componentWillMount() {
    const {
      params,
      newsProviders,
      news,
      getNewsProvidersAttempt,
      getNewsAttempt
    } = this.props;

    if (!newsProviders) {
      getNewsProvidersAttempt('offset=0&limit=100');
    }
    if (params.news_id != 'add') {
      getNewsAttempt(params.news_id);
    }
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.attemptingPostNews && this.props.attemptingPostNews) {
      return false;
    }
    return true;
  }

  componentWillUnmount() {
    // this.props.unitFilterChanged('');
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { news, subpage } = this.state;

    const params = nextProps.params;
    const path = browserHistory.getCurrentLocation().pathname;
    if (
      nextProps.news !== news &&
      (!nextProps.news ||
        (nextProps.news && !news) ||
        (nextProps.news && nextProps.news.provider_id != news.provider_id))
    ) {
      this.props.initializeForm(nextProps.news);
      if (nextProps.news) {
        this.props.setActiveNewsProvider(nextProps.news.news_provider_id);
      }
      this.setState({ news: nextProps.news });
    }
  }

  goBack() {
    browserHistory.push(`/news/article`);
  }

  setActive(key) {
    const { news } = this.props;
    let subpage = +key.substr(7);

    let route = `/news/article`;

    if (news) route += `/${news.news_id}`;
    else route += '/add';

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

  render() {
    const {
      subpage,
      add_result_modal_success,
      add_result_modal_title,
      add_result_modal_content,
      add_result_modal_submit_text
    } = this.state;

    const { goBack } = this;

    const {
      viewNewsArticle,

      attemptingGetSectors,
      attemptingGetNewsProviders,
      attemptingGetNews
    } = this.props;

    const tabs = this.getTabs();

    return (
      <div className="news">
        <form onSubmit={e => e.preventDefault()}>
          {!viewNewsArticle ? (
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
                <div className="hero-body">
                  <div className="container">
                    <div className="media">
                      <div className="media-left">
                        <a className="back-button" onClick={() => goBack()} />
                      </div>
                      <div className="media-content">
                        <h1 className="title">News Article Builder</h1>
                        <h2 className="subtitle">
                          Build your own news Articles
                        </h2>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="content-section navigation-section">
                <div className="container">
                  <UINavigation
                    tabs={tabs}
                    active={`wb-nav-${subpage}`}
                    change={e => {
                      this.setActive(e);
                    }}
                  />
                </div>
              </section>

              {attemptingGetNews ||
              attemptingGetNewsProviders ||
              attemptingGetSectors ? (
                <UILoading isLoadingOverlay />
              ) : (
                <section
                  className="content-section p-t-30"
                  style={{ background: 'white' }}
                >
                  <div className="container item-edit-container">
                    <div>
                      {subpage == 0 && (
                        <NewsEdit onBuildArticle={this.onBuildArticle} />
                      )}
                    </div>
                    <div />
                  </div>
                </section>
              )}
            </div>
          ) : (
            <NewsArticleEditorContainer />
          )}
          {!viewNewsArticle && <Footer />}
        </form>
      </div>
    );
  }
}

const validate = (values, props) => {
  const errors = {};
  FormUtil.validate(values, errors, 'news_provider_id').required();
  FormUtil.validate(values, errors, 'title').required();
  FormUtil.validate(values, errors, 'content').required();
  return errors;
};

const NewsEditForm = reduxForm({
  form: FORM_NAME,
  validate
})(NewsEditContainer);

const mapStateToProps = state => {
  return {
    newsProviders: path(['news', 'newsProviders'])(state),
    news: path(['news', 'currentNews'])(state),

    newsEditForm: path(['form', 'newsEdit'])(state),
    newsTitle: path(['form', 'newsEdit', 'values', 'title'])(state),

    attemptingGetSectors: path(['sectors', 'attemptingGetSectors'])(state),
    attemptingGetNewsProviders: path(['news', 'attemptingGetNewsProviders'])(
      state
    ),
    attemptingGetNews: path(['news', 'attemptingGetNews'])(state),
    attemptingPostNews: path(['news', 'attemptingPostNews'])(state),

    viewNewsArticle: path(['news', 'viewNewsArticle'])(state),

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
  getNewsProvidersAttempt: params =>
    dispatch(NewsActions.getNewsProvidersAttempt(params)),

  getNewsAttempt: id => dispatch(NewsActions.getNewsAttempt(id)),
  createNewsAttempt: payload =>
    dispatch(NewsActions.createNewsAttempt(payload)),
  updateNewsAttempt: (payload, id) =>
    dispatch(NewsActions.updateNewsAttempt(payload, id)),

  setActiveNews: id => dispatch(NewsActions.setActiveNews(id)),
  setActiveNewsProvider: news_provider_id =>
    dispatch(NewsActions.setActiveNewsProvider(news_provider_id)),

  initializeForm: data => {
    dispatch(initialize(FORM_NAME, data));
  },
  changeFieldValue: (form_name, field_name, value) =>
    dispatch(change(form_name, field_name, value))
});

export default connect(mapStateToProps, mapDispatchToProps)(NewsEditForm);
