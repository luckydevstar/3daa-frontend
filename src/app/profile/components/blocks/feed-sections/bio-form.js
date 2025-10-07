import React, { Component } from 'react';
import { pipe, pickAll, defaultTo, path, not } from 'ramda';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import classNames from 'classnames';
import common from 'app/common';
import util from 'app/user/util/';

const { FormUtil } = util;

const {
  util: {
    helpers: { createCloudinaryUrl }
  }
} = common;

const {
  Form: {
    field: FormField,
    textarea: FormTextArea,
    dropzone: FormDropzone,
    dateform: FormDate,
    checkbox: FormCheckbox
  }
} = common.components;

const FORM_NAME = 'bioForm';

class BioFormFields extends Component {
  constructor(props) {
    super(props);
    this.changeCurrent = this.changeCurrent.bind(this);

    this.state = {
      current: this.props.initialValues.current
    };
  }

  changeCurrent() {
    this.setState({
      current: !this.state.current
    });
  }

  render() {
    const {
      bio,
      editingMemberBio,
      postingMemberBio,
      cloudinary_file_id,
      invalid,
      onCancel,
      onSave,
      handleSubmit
    } = this.props;
    const previewImage = path(['cloudinary_file_id'], bio)
      ? createCloudinaryUrl(bio.cloudinary_file_id, 'image', {
          radius: 'max',
          crop: 'thumb',
          gravity: 'face',
          width: 150,
          height: 150
        })
      : null;

    const style = previewImage && { backgroundImage: `url(${previewImage})` };
    return (
      <form
        method="post"
        className="bio-form__form m-t-40"
        onSubmit={handleSubmit(onSave)}
      >
        <label
          htmlFor="cloudinary_file_id"
          className="bio-form__logo-label label m-b-10 align-left has-text-centered"
        >
          Add a company logo
        </label>

        {typeof cloudinary_file_id !== 'object' && (
          <figure className="bio-form__preview-img" style={style} />
        )}

        <Field
          id="cloudinary_file_id"
          name="cloudinary_file_id"
          component={FormDropzone}
          className="bio-form__dropzone"
          cloudinaryMediaType="image"
          handleDrop={e => console.log('DROP! ', e)}
        />

        <label htmlFor="title" className="label m-b-10 m-t-30 align-left">
          Business name:
        </label>
        <Field
          id="title"
          name="title"
          type="text"
          placeholder="e.g. SEG"
          component={FormField}
        />

        <label htmlFor="subtitle" className="label m-b-10 align-left">
          Position:
        </label>
        <Field
          id="subtitle"
          name="subtitle"
          type="text"
          placeholder="e.g. Work Associate"
          component={FormField}
        />

        <label htmlFor="location" className="label m-b-10 align-left">
          Location:
        </label>
        <Field
          id="location"
          name="location"
          type="text"
          placeholder="e.g. London"
          component={FormField}
        />

        <label htmlFor="from_date" className="label m-b-10 align-left">
          Start date:
        </label>
        <Field
          id="from_date"
          name="from_date"
          minDate="1970-01-01"
          maxDate="2099-12-31"
          component={FormDate}
        />

        <Field
          id="current"
          name="current"
          label="Current?"
          type="checkbox"
          onChange={this.changeCurrent}
          component={FormCheckbox}
        />
        {not(this.state.current) ? (
          <div className="control">
            <label htmlFor="to_date" className="label m-b-10 align-left">
              To date:
            </label>
            <Field
              id="to_date"
              name="to_date"
              minDate="1970-01-01"
              maxDate="2099-12-31"
              component={FormDate}
            />
          </div>
        ) : null}

        <label htmlFor="description" className="label m-b-10 align-left">
          Description:
        </label>
        <Field
          id="description"
          name="description"
          type="textarea"
          component={FormTextArea}
        />

        <footer className="has-text-right m-t-30">
          <button
            className="bio-form__cancel-btn button is-link is-large m-r-10"
            type="button"
            onClick={() => onCancel()}
          >
            Cancel
          </button>

          <button
            className={classNames(
              'bio-form__submit-btn',
              'button',
              'is-primary',
              'is-large',
              {
                'is-loading': editingMemberBio || postingMemberBio
              }
            )}
            type="submit"
          >
            Save
          </button>
        </footer>
      </form>
    );
  }
}

const BioFormView = ({
  bio,
  editingMemberBio,
  postingMemberBio,
  cloudinary_file_id,
  invalid,
  onCancel,
  onSave,
  action,
  type
}) => {
  const current = !!(action !== 'add' && bio.to_date === null);
  const initBio = pipe(
    defaultTo({}),
    pickAll([
      'title',
      'subtitle',
      'description',
      'from_date',
      'to_date',
      'cloudinary_file_id',
      'location'
    ])
  )(bio);
  const initialValues = {
    ...initBio,
    current
  };

  return (
    <section className="bio-form">
      <h2 className="bio-form__title m-t-30">
        {action === 'add' ? 'Add new' : 'Edit'} {type}
      </h2>
      <p className="bio-form__subtitle">Please complete the betails below</p>

      <ConnectedForm
        {...{
          bio,
          editingMemberBio,
          postingMemberBio,
          initialValues,
          cloudinary_file_id,
          invalid,
          onCancel,
          onSave: form => onSave({ ...form, type })
        }}
      />
    </section>
  );
};

const validate = values => {
  const errors = {};
  FormUtil.validate(values, errors, 'title').required();
  FormUtil.validate(values, errors, 'from_date').validDate();
  return errors;
};

const selector = formValueSelector(FORM_NAME);

const ConnectedForm = reduxForm({ form: FORM_NAME, validate })(BioFormFields);

const SelectingBioFormConnected = connect(state => ({
  cloudinary_file_id: selector(state, 'cloudinary_file_id')
}))(BioFormView);

export default SelectingBioFormConnected;
