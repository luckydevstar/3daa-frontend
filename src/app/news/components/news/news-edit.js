import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';
import PropTypes from 'prop-types';
import { uniq, without, map, addIndex, equals, path } from 'ramda';
import { connect } from 'react-redux';
import {
  Field,
  reduxForm,
  change,
  initialize,
  formValueSelector,
  getFormValues
} from 'redux-form';
import classNames from 'classnames';
import userUtil from 'app/user/util/';
import unitsUtil from 'app/units/util/';
import common from 'app/common';
import { Creators as NewsActions } from 'app/news/actions';

import Details from '../details';
import DetailsMedia from '../details-media';
import NewsFeedUserTypes from '../news-feed/news-feed-user-types';
import ModalUserConfirm from '../modals/modal-user-confirm';
import ModalWarning from '../modals/modal-warning';

import Isvg from 'react-inlinesvg';

// import IconMedia from 'images/icon_media.svg';
import IconPlus from 'images/icon_media_plus.svg';
import IconImagePreview from 'images/icon_image_preview.svg';

const {
  components: {
    ContentModal,
    UILoading,
    Form: { field, select, radio, textarea, file },
    UISelectDropdown,
    CloudinaryMedia
  },
  util: {
    helpers: { UserAccess }
  }
} = common;

const FormField = field;

const { FormUtil } = userUtil;

const FORM_NAME = 'newsEdit';

class NewsEdit extends Component {
  constructor() {
    super();
    this.state = {
      editMode: 1, //1: add, 2: delete, 3: edit,
      newsProviderList: [],
      attemptingDeleteNews: false
    };

    this.onChangeInspired = this.onChangeInspired.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.onSave = this.onSave.bind(this);
    this.isValid = this.isValid.bind(this);
    this.isChanged = this.isChanged.bind(this);
    this.onChangeNewsProvider = this.onChangeNewsProvider.bind(this);
    this.onCloseDeleteModal = this.onCloseDeleteModal.bind(this);
  }

  UNSAFE_componentWillMount() {
    if (!this.props.sectors) {
      this.props.getSectors();
    }

    if (this.props.newsProviders) {
      this.setState({
        newsProviderList: this.props.newsProviders.map(p => {
          return { key: p.news_provider_id, name: p.title };
        })
      });
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.attemptingDeleteNews != this.state.attemptingDeleteNews) {
      if (!nextProps.attemptingDeleteNews) {
        this.onCancel();
      } else {
        this.setState({ attemptingDeleteNews: nextProps.attemptingDeleteNews });
      }
    }
  }

  openModal() {
    this.modalUserConfirm.open();
  }

  closeModal() {
    this.modalUserConfirm.close();
    this.setState({ editMode: 1 });
  }

  onSetColour(e) {
    this.props.changeFieldValue('colour', e);
  }

  onChangeInspired(e) {
    const { changeFieldValue } = this.props;
    changeFieldValue('inspired', e.target.checked ? 1 : 0);
  }

  handleSubmit() {
    this.modalUserConfirm.close();
    // if (this.state.editMode == 2) {
    //   this.props.onDeleteNewsProvider(
    //     this.props.newsProvider.provider_id
    //   );
    // }
  }

  handleDelete() {
    this.setState({ editMode: 2 });
    this.openModal();
  }

  onChangeNewsProvider(e) {
    this.props.changeFieldValue('news_provider_id', e);
    this.props.setActiveNewsProvider(e);
  }

  isValid() {
    const { subpage } = this.state;
    const { newsEditForm } = this.props;

    if (
      !newsEditForm ||
      !newsEditForm.values ||
      !newsEditForm.values.title ||
      !newsEditForm.values.news_provider_id
    )
      return false;
    return true;
  }

  isChanged() {
    const { news, newsEditForm } = this.props;

    const values = path(['values'])(newsEditForm);

    if (!values || !values.title || !values.news_provider_id) return false;
    return !equals(news, values);
  }

  onCancel() {
    const { persistedSector } = this.props;
    browserHistory.push(`/news/article`);
  }

  onDelete() {
    this.modalDeleteConfirm.open();
  }

  onSave() {
    const {
      news,
      newsEditForm,
      createNewsAttempt,
      updateNewsAttempt
    } = this.props;

    let values = { ...newsEditForm.values };
    if (values.cover)
      values.cover =
        typeof values.cover === 'string' ? values.cover : values.cover[0];

    values = {
      slug: values.slug,
      news_id: values.news_id,
      news_provider_id: values.news_provider_id,
      title: values.title,
      short_content: values.short_content,
      status: values.status,
      featured: values.featured,
      inspired: values.inspired,
      tags: values.tags,
      cover: values.cover,
      content: values.content
    };

    if (news && news.news_id == values.news_id) {
      updateNewsAttempt(values, values.news_id);
    } else {
      createNewsAttempt(values);
    }
  }

  onCloseDeleteModal(f) {
    const { deleteNewsAttempt, news } = this.props;
    this.modalDeleteConfirm.close();
    if (f && news) {
      deleteNewsAttempt(news.news_id);
    }
  }

  createPhotoPreview(photo) {
    let result = null;
    if (typeof photo === 'string' && photo) {
      result = (
        <CloudinaryMedia
          fileId={photo}
          mediaType="image"
          transformations={{
            width: 200,
            height: 200,
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
          className="columns is-marginless"
          style={{
            maxWidth: 150,
            margin: 'auto'
          }}
        >
          <div className="column is-paddingless">
            <Isvg className="small" src={IconImagePreview} />
          </div>
        </div>
      );
    }
    return result;
  }

  render() {
    const {
      editable,
      sectors,
      colour,
      newsProvider,
      newsProviderId,
      inspired,
      changeFieldValue,
      news,
      toggleViewNewsArticle,
      attemptingPostNews,
      attemptingDeleteNews
    } = this.props;

    const { newsProviderList } = this.state;

    const { isValid } = this;

    return (
      <div className="content-section">
        <ContentModal
          ref={e => {
            this.modalUserConfirm = e;
          }}
        >
          <ModalUserConfirm
            addOrDelete="2"
            title={newsProvider ? newsProvider.title : ''}
            closeModal={() => this.closeModal()}
            handleSubmit={e => this.handleSubmit(e)}
          />
        </ContentModal>

        <ContentModal
          ref={e => {
            this.modalDeleteConfirm = e;
          }}
        >
          <ModalWarning
            title={'You are about to delete the news'}
            content={'Are you sure you want to delete it?'}
            button_text={'OK'}
            is_cancel={true}
            closeModal={() => this.onCloseDeleteModal(false)}
            handleSubmit={() => this.onCloseDeleteModal(true)}
          />
        </ContentModal>

        <div className="columns p-t-20 p-b-20 justify-content around background-gray bottom-border">
          <div className="column is-6">
            <div className="columns">
              <div
                className={classNames(
                  'column',
                  'is-4',
                  'has-text-right',
                  'label-contatiner',
                  {
                    'p-t-20': editable
                  }
                )}
              >
                <label htmlFor="title">News Title:</label>
              </div>

              <div className="column is-8">
                {editable ? (
                  <Field
                    placeholder="Type the name of the news"
                    name="title"
                    type="text"
                    component={FormField}
                    className="control"
                  />
                ) : (
                  news.title
                )}
              </div>
            </div>

            <div className="columns">
              <div
                className={classNames(
                  'column',
                  'is-4',
                  'has-text-right',
                  'label-contatiner',
                  {
                    'p-t-20': editable
                  }
                )}
              >
                <label>Choose a Provider:</label>
              </div>

              <div className="column is-8">
                {editable ? (
                  <UISelectDropdown
                    dropdownList={newsProviderList}
                    defaultTxt="Select one..."
                    defaultKey={newsProviderId}
                    onChange={e => this.onChangeNewsProvider(e)}
                  />
                ) : (
                  <span>{newsProvider ? newsProvider.title : ''}</span>
                )}
              </div>
            </div>

            <div>
              <div
                className={classNames('has-text-centered', {
                  'm-t-10': editable
                })}
              >
                <label className="custom radio">
                  <input
                    type="checkbox"
                    name="inspired"
                    value="1"
                    checked={inspired}
                    onChange={e => this.onChangeInspired(e)}
                  />
                  <span className="ui" />
                  Inspired
                </label>
              </div>
            </div>

            <Details
              detailFor="2"
              {...{
                news,
                changeFieldValue
              }}
            />
          </div>
          <div className="column is-4">
            <DetailsMedia
              formName={FORM_NAME}
              desc1="Upload a Cover of the News."
              desc2="Maybe an image of the news."
              fieldName="cover"
              buttonText="Add a Banner Image"
              existingButtonText="Change a Banner Image"
              mediaType="image"
              mediaIcon={IconPlus}
            />
          </div>
        </div>

        <div className="columns p-t-20 p-b-20 justify-content around background-gray">
          <div className="column is-5">
            <Details
              editable={false}
              inspired={newsProvider ? newsProvider.inspired == 1 : false}
              defaultSectorKey={
                newsProvider ? newsProvider.abstract_provider_id : ''
              }
              defaultLevelKey={newsProvider ? newsProvider.level : ''}
              defaultAgeKey={newsProvider ? newsProvider.age_range : ''}
              {...{
                sectors,
                newsProvider
              }}
            />
          </div>
          <div className="column is-2">
            {this.createPhotoPreview(newsProvider ? newsProvider.cover : '')}
          </div>
          <div className="column is-3">
            <NewsFeedUserTypes
              editable={false}
              userRoles={newsProvider ? newsProvider.user_roles : []}
            />
          </div>
        </div>

        <div
          className="columns p-t-10 background-white"
          style={{ boxShadow: 'inset 1px 4px 9px -6px' }}
        >
          <div className="column has-text-right">
            <button
              className="button is-rounded"
              onClick={e => this.onCancel()}
            >
              Cancel
            </button>
            <button
              className={classNames('button is-rounded m-l-20', 'is-danger', {
                'is-loading': attemptingDeleteNews
              })}
              disabled={!news || attemptingPostNews || attemptingDeleteNews}
              onClick={e => this.onDelete()}
            >
              Delete
            </button>

            {news && (
              <button
                className={classNames('button is-rounded m-l-20', 'is-primary')}
                disabled={!this.isChanged()}
                style={{ minWidth: '120px' }}
                onClick={e => this.onSave()}
              >
                Save
              </button>
            )}

            <button
              className={classNames('button is-rounded m-l-20', 'is-success')}
              disabled={!isValid()}
              style={{ minWidth: '150px' }}
              onClick={e => toggleViewNewsArticle(true)}
            >
              {news ? 'Edit Article' : 'Build Article'}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

NewsEdit.defaultProps = {
  editable: true,
  sectors: [],
  newsProvider: null,
  news: null,
  newsProviderId: null,
  getSectors: () => {},
  onBuildArticle: () => {},

  values: null
};

NewsEdit.propTypes = {
  newsProvider: PropTypes.object,
  sectors: PropTypes.array,

  getSectors: PropTypes.func
};

const mapStateToProps = state => ({
  persistedSector: path(['persisted', 'sector'])(state),
  sectors: path(['sectors', 'sectors', 'sectors'])(state),
  newsProviders: path(['news', 'newsProviders'])(state),
  newsProvider: path(['news', 'currentNewsProvider'])(state),
  news: path(['news', 'currentNews'])(state),

  newsEditForm: path(['form', 'newsEdit'])(state),
  newsProviderId: path(['form', 'newsEdit', 'values', 'news_provider_id'])(
    state
  ),
  inspired: path(['form', 'newsEdit', 'values', 'inspired'])(state),

  attemptingPostNews: path(['news', 'attemptingPostNews'])(state),
  attemptingDeleteNews: path(['news', 'attemptingDeleteNews'])(state)
});

const mapDispatchToProps = dispatch => ({
  changeFieldValue: (field_name, value) => {
    dispatch(change(FORM_NAME, field_name, value));
  },

  setActiveNewsProvider: news_provider_id =>
    dispatch(NewsActions.setActiveNewsProvider(news_provider_id)),

  toggleViewNewsArticle: payload =>
    dispatch(NewsActions.toggleViewNewsArticle(payload)),

  createNewsAttempt: payload =>
    dispatch(NewsActions.createNewsAttempt(payload)),
  updateNewsAttempt: (payload, id) =>
    dispatch(NewsActions.updateNewsAttempt(payload, id)),
  deleteNewsAttempt: news_id => dispatch(NewsActions.deleteNewsAttempt(news_id))
});

export default connect(mapStateToProps, mapDispatchToProps)(NewsEdit);
