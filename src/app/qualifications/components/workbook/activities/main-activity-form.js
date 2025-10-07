/* eslint */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Field, reduxForm, initialize, change } from 'redux-form';
import classNames from 'classnames';
import common from 'app/common';
import config from 'brand/config';

import DDAA from './activity-type-forms/DDAA-subform';
import DDOA from './activity-type-forms/DDOA-subform';
import EUA from './activity-type-forms/EUA-subform';
import FTA from './activity-type-forms/FTA-subform';
import MCA from './activity-type-forms/MCA-subform';
import MTA from './activity-type-forms/MTA-subform';
import TCRA from './activity-type-forms/TCRA-subform';

const ContentModalConfirm = common.components.ContentModalConfirm;
const FormDropzone = common.components.Form.dropzone;
const FormSelect = common.components.Form.select;
const TextareaField = common.components.Form.textarea;
const FormField = common.components.Form.field;

const activityShortcodesToComponentMap = {
  DDAA,
  DDOA,
  EUA,
  FTA,
  MCA,
  MTA,
  TCRA
};

class MainActivityForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      file: props.activity.tout,
      selectedActivityType: props.activity.activity_type_id || '',
      originalActivityType: props.activity.activity_type_id || '',
      subformState: props.subformState || null,
      originalSubformState: props.subformState || null
    };

    this.onActivityTypeChange = this.onActivityTypeChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onCloseAttempt = this.onCloseAttempt.bind(this);
    this.onImport = this.onImport.bind(this);
  }

  UNSAFE_componentWillMount() {
    if (this.props.activity) {
      this.props.setInitialValues(this.props.activity);
    }
  }

  componentDidMount() {
    const { activityTypes } = this.props;
    const { selectedActivityType: activityType } = this.state;

    if (activityType && activityTypes)
      this.onImport(activityType, activityTypes);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { activityType, activityTypes } = nextProps;

    if (activityType && activityTypes)
      this.onImport(activityType, activityTypes);
  }

  onActivityTypeChange(e) {
    const type = parseInt(e.target.value) || '';
    const { activityTypes } = this.props;
    const { originalActivityType, originalSubformState } = this.state;
    let subformState;
    if (type === originalActivityType) {
      subformState = originalSubformState;
    } else {
      subformState = null;
    }
    this.setState({ selectedActivityType: type, subformState });
    this.onImport(type, activityTypes);
  }

  onDrop(file) {
    this.setState({ file: file[0] });
  }

  onRemoveFile() {
    this.setState({ file: '' });
    this.props.resetTout();
  }

  onCloseAttempt() {
    this.confirmModal.open();
  }

  onSubmit(values) {
    const { updateSubform, onSubmit } = this.props;
    updateSubform(this.subform.state.formState);
    onSubmit(values);
  }

  onImport(activityType, activityTypes) {
    if (activityTypes.length && activityType) {
      const selectedType = activityTypes.filter(activityTypeObj => {
        return activityTypeObj.activity_type_id === activityType;
      })[0];
      const shortCode = selectedType.short_title;
      this.setState({ subform: activityShortcodesToComponentMap[shortCode] });
    } else {
      this.setState({ subform: null });
    }
  }

  render() {
    const {
      activityTypes,
      handleSubmit,
      valid,
      activity,
      attemptingCreateActivity,
      attemptingUpdateActivity
    } = this.props;

    const { selectedActivityType, subformState } = this.state;

    const { onActivityTypeChange, onSubmit } = this;

    const Subform = this.state.subform;

    const options = activityTypes.map(activityType => {
      return (
        <option
          key={activityType.activity_type_id}
          value={activityType.activity_type_id}
        >
          {activityType.title}
        </option>
      );
    });
    return (
      <div className="activity-customise-form">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="margin-container">
            <div className="control columns">
              <div className="column">
                <label htmlFor="tout" className="label">
                  Activity image
                </label>
                <Field
                  name="tout"
                  mediaType="both"
                  cloudinaryMediaType={activity.tout_type}
                  uploadedMedia={this.state.file}
                  component={FormDropzone}
                  className=""
                  height="auto"
                  multiple={false}
                  handleDrop={file => change('tout', file)}
                />
                <div
                  className="button m-t-20"
                  onClick={() => this.onRemoveFile()}
                >
                  Remove image
                </div>
              </div>
              <div className="column">
                <label htmlFor="title" className="label">
                  Activity Title
                  <span className="is-text-danger">*</span>
                </label>
                <Field
                  name="title"
                  type="text"
                  component={FormField}
                  inputClassName="input"
                  placeholder="Give your Activity a title"
                />
                <label htmlFor="description" className="label">
                  Activity Advert Short Description
                  <span className="is-text-danger">*</span>
                </label>
                <Field
                  name="description"
                  component={TextareaField}
                  classForField="textarea"
                  placeholder="This is a short description that will show on the activity launcher"
                />
                <label htmlFor="activty_code" className="label">
                  {`${config.title} Activity Number`}
                  <span className="is-text-danger">*</span>
                </label>
                <Field
                  name="activity_code"
                  type="text"
                  component={FormField}
                  placeholder="Leave blank if unsure"
                />
              </div>
            </div>
            <label htmlFor="activity_type_id" className="label m-b-15">
              Activity Type
            </label>
            <Field
              innerClassName="bg-is-info"
              value={selectedActivityType}
              onChange={onActivityTypeChange}
              name="activity_type_id"
              component={FormSelect}
            >
              <option value="">Please select</option>
              {options}
            </Field>
          </div>
          <div className="subform-container">
            {Subform ? (
              <Subform
                ref={e => {
                  this.subform = e;
                }}
                formState={subformState}
                activityType={selectedActivityType}
              />
            ) : (
              'Need to define Activity Type first'
            )}
          </div>
          <hr />
          <div className="nav">
            <div className="field is-grouped nav-center">
              <div
                className="button is-active m-r-20"
                onClick={this.onCloseAttempt}
              >
                Cancel
              </div>
              <button
                type="submit"
                className={classNames('button', 'is-success', {
                  'is-loading':
                    attemptingCreateActivity || attemptingUpdateActivity
                })}
                disabled={!valid}
              >
                Save
              </button>
            </div>
          </div>
        </form>
        <ContentModalConfirm
          callback={this.props.closeModal}
          ref={e => {
            this.confirmModal = e;
          }}
        >
          <p>Are you sure you want to discard activity changes?</p>
        </ContentModalConfirm>
      </div>
    );
  }
}

const validate = values => {
  const errors = {};
  if (!values.title) {
    errors.title = 'Title is required';
  }
  if (!values.description) {
    errors.description = 'Short description is required';
  }
  if (!values.activity_type_id) {
    errors.activity_type_id = 'Activity type is required';
  }
  if (!values.activity_code) {
    errors.activity_code = 'Activity code is required';
  }
  if (
    values.activity_code &&
    typeof values.activity_code === 'string' &&
    values.activity_code.includes('/')
  ) {
    errors.activity_code = 'Invalid character: /';
  }
  return errors;
};

const { array } = PropTypes;

MainActivityForm.propTypes = {
  activityTypes: array.isRequired
};

MainActivityForm = reduxForm({ form: 'mainActivityForm', validate })(
  MainActivityForm
);

const mapStateToProps = () => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {
    setInitialValues: data => {
      dispatch(initialize('mainActivityForm', data));
    },
    resetTout: () => {
      dispatch(change('mainActivityForm', 'tout', ''));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MainActivityForm);
