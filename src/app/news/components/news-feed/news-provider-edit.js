import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';
import PropTypes from 'prop-types';
import { uniq, without, map, addIndex, equals, path } from 'ramda';
import * as lodash from 'lodash';
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
import NewsFeedUserTypes from './news-feed-user-types';
import ModalUserConfirm from '../modals/modal-user-confirm';
import ModalWarning from '../modals/modal-warning';

import {
  age_to_range,
  range_to_age,
  AGE_RANGE
} from '../../utils/change-age-range';

// import IconMedia from 'images/icon_media.svg';
import IconPlus from 'images/icon_media_plus.svg';

const {
  components: { ContentModal, UILoading },
  util: {
    helpers: { UserAccess }
  }
} = common;

const { FormUtil } = userUtil;

const FORM_NAME = 'newsProviderEdit';

class NewsProviderEdit extends Component {
  constructor() {
    super();
    this.state = {
      editMode: 1, //1: add, 2: delete, 3: edit,
      attemptingDeleteNewsProvider: false
    };
    this.handleCopy = this.handleCopy.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.onSave = this.onSave.bind(this);
    this.isValid = this.isValid.bind(this);
  }

  UNSAFE_componentWillMount() {
    if (!this.props.sectors) {
      this.props.getSectors();
    }
    if (this.props.newsProvider) {
      this.props.initializeForm(this.props.newsProvider);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      nextProps.attemptingDeleteNewsProvider !=
      this.state.attemptingDeleteNewsProvider
    ) {
      if (!nextProps.attemptingDeleteNewsProvider) {
        this.onCancel();
      } else {
        this.setState({
          attemptingDeleteNewsProvider: nextProps.attemptingDeleteNewsProvider
        });
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

  handleSubmit() {
    this.modalUserConfirm.close();
    // if (this.state.editMode == 2) {
    //   this.props.onDeleteNewsProvider(
    //     this.props.newsProvider.provider_id
    //   );
    // }
  }

  handleCopy() {
    this.openModal();
    this.setState({ editMode: 1 });
  }

  handleDelete() {
    this.setState({ editMode: 2 });
    this.openModal();
  }

  isValid() {
    const { subpage } = this.state;
    const { newsProvider, newsProviderEditForm } = this.props;
    if (!newsProvider)
      return newsProviderEditForm && !newsProviderEditForm.syncErrors;
    else
      return (
        newsProviderEditForm &&
        !newsProviderEditForm.syncErrors &&
        !equals(newsProvider, newsProviderEditForm.values)
      );
  }

  onSave() {
    const { newsProviderEditForm } = this.props;
    let values = { ...newsProviderEditForm.values };
    let temp = range_to_age(values.age_range);

    if (temp.age_min) values.age_min = temp.age_min;
    if (temp.age_max) values.age_max = temp.age_max;

    delete values.age_range;

    if (values.cover)
      values.cover =
        typeof values.cover === 'string' ? values.cover : values.cover[0];

    if (!values.news_provider_id) {
      this.props.createNewsProviderAttempt(values);
    } else {
      const newValues = {
        rss_feed: values.rss_feed,
        abstract_sector_id: values.abstract_sector_id,
        title: values.title,
        company_name: values.company_name,
        description: values.description,
        level: values.level,
        slug: values.slug,
        rss_feed: values.rss_feed,
        cover: values.cover,
        header: values.header,
        mobile_header: values.mobile_header,
        status: values.status,
        inspired: values.inspired,
        age_min: values.age_min,
        age_max: values.age_max,
        user_roles: values.user_roles
      };

      this.props.updateNewsProviderAttempt(newValues, values.news_provider_id);
    }
  }

  onCancel() {
    const { persistedSector } = this.props;
    browserHistory.push(`/news/provider`);
  }

  onDelete() {
    this.modalDeleteConfirm.open();
  }

  onCloseDeleteModal(f) {
    const { deleteNewsProviderAttempt, newsProvider } = this.props;
    this.modalDeleteConfirm.close();
    if (f && newsProvider) {
      deleteNewsProviderAttempt(newsProvider.news_provider_id);
    }
  }

  render() {
    const {
      sectors,
      colour,
      newsProvider,
      newsProviderEditForm,
      inspired,
      userRoles,
      defaultSectorKey,
      defaultLevelKey,
      defaultAgeKey,
      changeFieldValue,
      attemptingPostNewsProvider,
      attemptingDeleteNewsProvider
    } = this.props;

    const { isValid } = this;

    return (
      <div className="content-section">
        <form onSubmit={e => e.preventDefault()}>
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
              title={'You are about to delete the news provider'}
              content={'Are you sure you want to delete it?'}
              button_text={'OK'}
              is_cancel={true}
              closeModal={() => this.onCloseDeleteModal(false)}
              handleSubmit={() => this.onCloseDeleteModal(true)}
            />
          </ContentModal>

          <div className="columns p-t-20 p-b-20 justify-content around background-gray">
            <div className="column is-6">
              <Details
                handleDelete={this.handleDelete}
                formData={newsProviderEditForm}
                {...{
                  changeFieldValue,
                  sectors,
                  newsProvider,
                  inspired,
                  defaultSectorKey,
                  defaultLevelKey,
                  defaultAgeKey
                }}
              />
            </div>
            <div className="column is-4">
              <div className="m-b-10">
                <DetailsMedia
                  formName={FORM_NAME}
                  fieldName="cover"
                  mediaType="image"
                  desc1="Upload a Cover of the News Feed."
                  desc2="Maybe a Logo of the Company or an image of the news."
                  buttonText="Add Cover"
                  existingButtonText="Change Cover"
                  mediaIcon={IconPlus}
                  changeFieldValue={changeFieldValue}
                />
              </div>
              <div className="m-t-30">
                <NewsFeedUserTypes
                  userRoles={userRoles}
                  changeFieldValue={e => changeFieldValue('user_roles', e)}
                />
              </div>
            </div>
          </div>

          <div
            className="container p-t-10 has-text-right"
            style={{ background: 'white' }}
          >
            <button
              className="button is-rounded"
              onClick={e => this.onCancel()}
            >
              Cancel
            </button>
            <button
              className={classNames('button is-rounded m-l-20', 'is-danger', {
                'is-loading': attemptingDeleteNewsProvider
              })}
              disabled={
                !newsProvider ||
                attemptingPostNewsProvider ||
                attemptingDeleteNewsProvider
              }
              onClick={e => this.onDelete()}
            >
              Delete
            </button>
            <button
              type="submit"
              className={classNames('button is-rounded m-l-20', 'is-success', {
                'is-loading': attemptingPostNewsProvider
              })}
              disabled={
                !isValid() ||
                attemptingPostNewsProvider ||
                attemptingDeleteNewsProvider
              }
              style={{ minWidth: '150px' }}
              onClick={this.props.handleSubmit(e => this.onSave())}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    );
  }
}

NewsProviderEdit.defaultProps = {
  editable: true,
  newsProvider: null,
  sectors: [],
  userRoles: [],
  getSectors: () => {},
  onDeleteNewsProvider: provider_id => {},

  values: null
};

NewsProviderEdit.propTypes = {
  newsProvider: PropTypes.object,
  sectors: PropTypes.array,

  getSectors: PropTypes.func,
  onDeleteNewsProvider: PropTypes.func
};

const validate = (values, props) => {
  const errors = {};
  FormUtil.validate(values, errors, 'title').required();
  FormUtil.validate(values, errors, 'abstract_sector_id').required();
  FormUtil.validate(values, errors, 'level')
    .numbersOnly()
    .required();
  FormUtil.validate(values, errors, 'age_range').required();
  FormUtil.validate(values, errors, 'company_name').required();
  FormUtil.validate(values, errors, 'description').required();
  return errors;
};

const NewsProviderEditForm = reduxForm({
  form: FORM_NAME,
  validate
})(NewsProviderEdit);

const mapStateToProps = state => ({
  persistedSector: path(['persisted', 'sector'])(state),
  sectors: path(['sectors', 'sectors', 'sectors'])(state),
  newsProvider: path(['news', 'currentNewsProvider'])(state),
  newsProviderEditForm: path(['form', 'newsProviderEdit'])(state),
  inspired: path(['form', 'newsProviderEdit', 'values', 'inspired'])(state),
  userRoles: path(['form', 'newsProviderEdit', 'values', 'user_roles'])(state),
  defaultSectorKey: path([
    'form',
    'newsProviderEdit',
    'values',
    'abstract_sector_id'
  ])(state),
  defaultLevelKey: path(['form', 'newsProviderEdit', 'values', 'level'])(state),
  defaultAgeKey: path(['form', 'newsProviderEdit', 'values', 'age_range'])(
    state
  ),

  attemptingPostNewsProvider: path(['news', 'attemptingPostNewsProvider'])(
    state
  ),
  attemptingDeleteNewsProvider: path(['news', 'attemptingDeleteNewsProvider'])(
    state
  )
});

const mapDispatchToProps = dispatch => ({
  changeFieldValue: (field_name, value) => {
    dispatch(change(FORM_NAME, field_name, value));
  },
  initializeForm: data => {
    dispatch(initialize(FORM_NAME, data));
  },
  createNewsProviderAttempt: params => {
    dispatch(NewsActions.createNewsProviderAttempt(params));
  },
  updateNewsProviderAttempt: (params, provider_id) => {
    dispatch(NewsActions.updateNewsProviderAttempt(params, provider_id));
  },
  deleteNewsProviderAttempt: provider_id => {
    dispatch(NewsActions.deleteNewsProviderAttempt(provider_id));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewsProviderEditForm);

// {/* disabled={!isValid() || isLoading()} */}

// {
//   'is-loading': isLoading()
// }
