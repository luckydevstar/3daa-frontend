import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { omit } from 'ramda';
import * as lodash from 'lodash';
import { Field } from 'redux-form';

import common from 'app/common';
import util from 'app/user/util/';
import { Creators } from '../actions';

const { FormUtil } = util;

const {
  MediaUpload,
  Form: { field: FormField, select: FormSelect }
} = common.components;

const initialValues = {
  is_public: 1,
  cover: 0
};

const describeMediaValidation = values => {
  const errors = {};

  FormUtil.validate(values, errors, 'title').required();
  FormUtil.validate(values, errors, 'description').required();

  return errors;
};

class ProfileMediaAdd extends Component {
  uploadMedia(form) {
    if (!form) return;

    const { mediaType, postMemberPhoto, postMemberVideo } = this.props;
    const file = lodash.get(form, 'file');

    if (file) {
      form['file'] = typeof file === 'string' ? file : file[0];
    }

    if (mediaType === 'image') postMemberPhoto(form);
    else postMemberVideo(form);
  }

  render() {
    const {
      describeMediaStep,
      mediaType,
      onComplete,
      profile: {
        postingMemberPhoto,
        postingMemberVideo,
        recentlyUploaded,
        errorCode
      }
    } = this.props;

    return (
      <div className="profile-pictures-add">
        <MediaUpload
          {...{
            describeMediaStep,
            describeMediaValidation,
            initialValues,
            recentlyUploaded,
            errorCode,
            mediaType,
            isUploading: postingMemberPhoto || postingMemberVideo,
            onModalClose: onComplete,
            onUploadAttempt: form => this.uploadMedia(form)
          }}
        />
      </div>
    );
  }
}

const describeMediaStep = (
  <div>
    <label htmlFor="title" className="label m-b-10 align-left">
      Title
    </label>
    <Field
      id="title"
      name="title"
      type="text"
      placeholder="Example Title"
      component={FormField}
      label={'Image Title'}
    />

    <label htmlFor="description" className="label m-b-10 align-left">
      Description
    </label>
    <Field
      id="description"
      name="description"
      type="text"
      placeholder="Please provide a description"
      component={FormField}
      label={'Description'}
    />

    <div className="columns">
      <div className="column">
        <label htmlFor="category" className="label m-b-10 align-left">
          Category
        </label>
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
      <div className="column">
        <label htmlFor="cover" className="label m-b-10 align-left">
          <span className="media-upload__cover-label is-block m-b-10">
            Showreel
          </span>
          <div className="custom checkbox">
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
        </label>
      </div>
    </div>
  </div>
);

ProfileMediaAdd.defaultProps = {
  mediaType: 'image',
  describeMediaStep
};

ProfileMediaAdd.propTypes = {
  describeMediaStep: PropTypes.element,
  mediaType: PropTypes.oneOf(['image', 'video']).isRequired,
  onComplete: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  user: state.profile.user,
  profile: omit(['connectionProfile'], state.profileBio)
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  const { dispatch } = dispatchProps;
  const { member_id } = stateProps.user;

  return {
    ...ownProps,
    ...stateProps,
    postMemberPhoto: payload =>
      dispatch(Creators.postMemberPhotoAttempt({ member_id, payload })),
    postMemberVideo: payload =>
      dispatch(Creators.postMemberVideoAttempt({ member_id, payload }))
  };
}

export default connect(
  mapStateToProps,
  null,
  mergeProps
)(ProfileMediaAdd);
