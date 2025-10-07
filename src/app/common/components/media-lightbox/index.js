import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment-timezone';
import classNames from 'classnames';
import { pipe, pickAll, defaultTo } from 'ramda';
import * as lodash from 'lodash';
import util from 'app/user/util/';

import { Creators as AssessmentActions } from 'app/assessment/actions';
import ContentModalNew from '../content-modal-new/content-modal';

import ImagePreview from './image-preview';
import VideoPreview from './video-preview';

import { Field, reduxForm, formValueSelector } from 'redux-form';
import FormSelect from '../form/form-select';
import FormField from '../form/form-field';
import FormTextarea from '../form/form-textarea';
import FormCheckbox from '../form/form-checkbox';

const { FormUtil } = util;
const FORM_NAME = 'media-lightbox';

const formatDate = date => moment(date).format('Do MMMM YYYY');

class MediaLightboxForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editMode: false
    };
  }

  isEditView() {
    const { isLoggedInUser } = this.props;
    return this.state.editMode && isLoggedInUser;
  }

  render() {
    const {
      media,
      isLoggedInUser,
      editingMedia,
      handleSubmit,
      reset,
      invalid,
      onDeleteMemberMedia,
      formValues: { title, description, is_public, cover }
    } = this.props;

    return (
      <form onSubmit={handleSubmit}>
        {!this.isEditView() && (
          <h2 className="media-lightbox__media-title">{title}</h2>
        )}
        <Field
          name="title"
          type="text"
          placeholder="Media title"
          component={FormField}
          className={classNames({
            'is-hidden': !this.isEditView()
          })}
        />
        <ul className="media-lightbox__meta">
          <li className="media-lightbox__uploaded-date">
            <span className="media-lightbox__meta-title">Uploaded:</span>
            <span className="media-lightbox__meta-value">
              {formatDate(media.created)}
            </span>
          </li>
          <li className="media-lightbox__meta-description">
            {!this.isEditView() && <span>{description}</span>}
            <Field
              name="description"
              type="text"
              placeholder="Media description"
              component={FormTextarea}
              className={classNames({
                'is-hidden': !this.isEditView()
              })}
            />
          </li>

          {isLoggedInUser && media.type !== 'video' && (
            <li className="media-lightbox__meta-cover">
              <div className="columns m-b-10 align-left">
                <div className="media-lightbox__form-label is-block column is-4 semibold">
                  Showreel:
                </div>
                {this.isEditView() && (
                  <div className="column is-8 custom checkbox m-r-0">
                    <Field
                      id="cover"
                      name="cover"
                      className="checkbox"
                      type="checkbox"
                      component="input"
                      normalize={value => (value === true ? 1 : 0)}
                    />
                    <span className="ui" />
                  </div>
                )}

                {!this.isEditView() && (
                  <div className="column is-8">
                    {cover === 1 ? 'Enabled' : 'Disabled'}
                  </div>
                )}
              </div>
            </li>
          )}

          {isLoggedInUser && (
            <li className="media-lightbox__meta-category m-b-20">
              <div className="columns m-b-10 align-left">
                <div className="column is-4 semibold">Category:</div>
                {this.isEditView() ? (
                  <div className="column is-12">
                    <Field
                      id="is_public"
                      name="is_public"
                      className="control grow"
                      component={FormSelect}
                    >
                      <option value="1">Public</option>
                      <option value="0">Private</option>
                    </Field>
                  </div>
                ) : (
                  <div className="column is-8">
                    {is_public === 1 ? 'Public' : 'Private'}
                  </div>
                )}
              </div>
            </li>
          )}

          {isLoggedInUser && (
            <li className="media-lightbox__meta-cover">
              <div className="m-b-10 align-left">
                {this.isEditView() && (
                  <div className="custom checkbox is-centered">
                    <Field
                      id="portfolio"
                      name="portfolio"
                      component={FormCheckbox}
                    />
                    <div className="label">Add to Portfolio Gallery</div>
                  </div>
                )}
              </div>
            </li>
          )}
        </ul>

        <footer className="media-lightbox__edit-controls">
          {isLoggedInUser && (
            <div
              className={classNames('is-centered', {
                'is-hidden': this.isEditView()
              })}
            >
              <button
                className="media-lightbox__edit-btn button is-primary m-r-20"
                type="button"
                onClick={() => this.setState({ editMode: true })}
              >
                <i className="fa fa-pencil" />
                &nbsp;<span>Edit</span>
              </button>

              <button
                className="media-lightbox__delete-btn button is-danger is-outlined"
                type="button"
                onClick={() => onDeleteMemberMedia(media)}
              >
                <i className="fa fa-trash-o" />
                &nbsp;<span>Delete</span>
              </button>
            </div>
          )}

          <div
            className={classNames('is-flex', {
              'is-hidden': !this.isEditView()
            })}
          >
            <button
              type="button"
              className="button is-link media-lightbox__cancel-btn"
              onClick={() => {
                reset(FORM_NAME);
                return this.setState({ editMode: false });
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={invalid || editingMedia}
              onClick={() =>
                !invalid && !editingMedia && this.setState({ editMode: false })
              }
              className={classNames(
                ['button', 'is-primary', 'media-lightbox__save-btn'],
                {
                  'is-loading': editingMedia
                }
              )}
            >
              Save
            </button>
          </div>
        </footer>
      </form>
    );
  }
}

const validate = values => {
  const errors = {};

  FormUtil.validate(values, errors, 'title').required();
  FormUtil.validate(values, errors, 'description').required();

  return errors;
};

const selector = formValueSelector(FORM_NAME);

const ConnectedForm = reduxForm({ form: FORM_NAME, validate })(
  MediaLightboxForm
);

class SelectingMediaLightbox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.onAddEvidence = this.onAddEvidence.bind(this);
  }

  onAddEvidence() {
    const {
      media,
      attemptingPostAssessmentEvidence,
      postAssessmentEvidenceAttempt
    } = this.props;
  }

  render() {
    const {
      media,
      formValues,
      onClose,
      isLoggedInUser,
      editingMedia,
      invalid,
      enableAddEvidence,
      reset,
      onEditMemberMedia,
      onDeleteMemberMedia
    } = this.props;

    const initialValues = pipe(
      defaultTo({}),
      pickAll(['title', 'description', 'is_public', 'cover'])
    )(media);

    return media ? (
      <ContentModalNew
        {...{
          isOpened: !!media,
          onClose,
          size: 'largest',
          className: 'is-edgeless'
        }}
      >
        <div className="media-lightbox">
          <div className="columns">
            <div className="media-lightbox__media-column column is-three-quarters">
              <div className="media-lightbox__media-body">
                <div className="media-lightbox__spinner" />
                {media.type === 'photo' ? (
                  <ImagePreview {...{ media }} />
                ) : (
                  <VideoPreview {...{ media }} />
                )}
              </div>
            </div>
            <div className="media-lightbox__details-column column">
              <div className="media-lightbox__details-body">
                <ConnectedForm
                  {...{
                    media,
                    isLoggedInUser,
                    initialValues,
                    editingMedia,
                    invalid,
                    reset,
                    formValues,
                    onDeleteMemberMedia,
                    onSubmit: params => onEditMemberMedia({ params, ...media })
                  }}
                />
              </div>

              {enableAddEvidence && (
                <div className="add-evidence-option">
                  <div>
                    <label className="custom checkbox">
                      <input
                        type="radio"
                        value="1"
                        checked={true}
                        onChange={() => {}}
                      />
                      <span className="ui" />
                    </label>
                  </div>
                  <div
                    className="semibold p-l-10"
                    style={{
                      color: '#4A90E2',
                      fontSize: '18px',
                      cursor: 'pointer'
                    }}
                    onClick={() => this.onAddEvidence()}
                  >
                    Add this Evidence
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </ContentModalNew>
    ) : null;
  }
}

const mapStateToProps = state => ({
  formValues: selector(state, 'title', 'description', 'is_public', 'cover'),
  attemptingPostAssessmentEvidence: lodash.get(state, [
    'assessment',
    'attemptingPostAssessmentEvidence'
  ])
});

const mapDispatchToProps = dispatch => ({
  postAssessmentEvidenceAttempt: (member_id, qualification_id, payload) =>
    dispatch(
      AssessmentActions.postAssessmentEvidenceAttempt(
        member_id,
        qualification_id,
        payload
      )
    )
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SelectingMediaLightbox);
