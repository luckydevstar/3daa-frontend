import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import cx from 'classnames';
import CategoryForm, { validate } from './category-form';
import { Text } from 'app/intl';

const FORM_NAME = 'add-category';

const ConnectedForm = reduxForm({ form: FORM_NAME, validate })(CategoryForm);

class CreateCategoryView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isPreview: false,
      viewMode: 'info'
    };

    this.togglePreview = this.togglePreview.bind(this);
    this.changeViewMode = this.changeViewMode.bind(this);
  }

  UNSAFE_componentWillMount() {
    this.props.setVideoQualifications([]);
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
      closeFn,
      createCategory,
      uiEditingCategory,
      editingSubCategory,
      qualifications,
      selectedQualifications,
      setVideoQualifications
    } = this.props;

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
                      <Text iKey="Add Sub Category" />
                    ) : (
                      <Text iKey="add_category" />
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
            onSubmit: createCategory,
            closeFn,
            uiEditingCategory,
            initialValues: {
              cloudinary_image_id: null,
              icon: null,
              mobile_cloudinary_image_id: null,
              qualifications: []
            },
            editingSubCategory,
            isPreview,
            editMode: false,
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

export default CreateCategoryView;
