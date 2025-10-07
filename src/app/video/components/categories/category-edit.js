import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import { propEq, find, pipe, pickAll, defaultTo } from 'ramda';
import cx from 'classnames';
import CategoryForm, { validate } from './category-form';

import { Text } from 'app/intl';

const FORM_NAME = 'edit-category';

const findCategory = id =>
  pipe(
    find(propEq('video_category_id', id)),
    defaultTo({}),
    pickAll([
      'title',
      'description',
      'cloudinary_image_id',
      'video_category_id',
      'video_category_parent_id',
      'icon',
      'mobile_cloudinary_image_id',
      'qualifications'
    ])
  );

const ConnectedForm = reduxForm({ form: FORM_NAME, validate })(CategoryForm);

class EditCategoryView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isPreview: false,
      viewMode: 'info'
    };

    this.togglePreview = this.togglePreview.bind(this);
    this.changeViewMode = this.changeViewMode.bind(this);
  }

  togglePreview(state = false) {
    if (state) {
      this.setState({
        isPreview: !this.state.isPreview
      });
    }
  }

  changeViewMode(mode) {
    this.setState({
      viewMode: mode
    });
  }

  render() {
    const {
      uiEditingCategory,
      categories,
      id,
      closeFn,
      updateCategory,
      editingSubCategory,
      qualifications,
      selectedQualifications,
      setVideoQualifications
    } = this.props;

    if (!id || !categories) return null;

    const initialValues = findCategory(id)(categories);
    const { isPreview, viewMode } = this.state;
    return (
      <div className={cx('modal-form', FORM_NAME)}>
        {isPreview ? (
          <div className="info">
            <h3>Summary of Attachments</h3>
            <h5>
              Please make sure this is correct before uploading to the platform.
            </h5>
          </div>
        ) : (
          <div className="info">
            <div className="tabs is-toggle is-fullwidth">
              <ul>
                <li className={cx({ 'is-active': viewMode === 'info' })}>
                  <a onClick={() => this.changeViewMode('info')}>
                    {editingSubCategory ? (
                      <Text iKey="Edit Sub Category" />
                    ) : (
                      <Text iKey="Edit Category" />
                    )}
                  </a>
                </li>
                <li
                  className={cx({ 'is-active': viewMode === 'qualification' })}
                >
                  <a onClick={() => this.changeViewMode('qualification')}>
                    <span>Select Qualification(s)</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        )}
        <ConnectedForm
          {...{
            onSubmit: updateCategory,
            initialValues,
            uiEditingCategory,
            closeFn,
            editingSubCategory,
            isPreview,
            editMode: true,
            viewMode,
            FORM_NAME,
            togglePreview: this.togglePreview,
            selectedQualifications,
            setVideoQualifications,
            allQualifications: qualifications
          }}
        />
      </div>
    );
  }
}

export default EditCategoryView;
