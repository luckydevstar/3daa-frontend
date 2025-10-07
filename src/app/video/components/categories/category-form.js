import React, { Component } from 'react';
import { Field, getFormValues } from 'redux-form';
import { connect } from 'react-redux';
import cx from 'classnames';
import common from 'app/common';
import util from 'app/user/util';
import Isvg from 'react-inlinesvg';
import IconRemove from 'images/icon_remove.svg';
import CategoryQualification from './category-qualification';

const { FormUtil } = util;
const {
  components: {
    ShowPreview,
    MediaCrop,
    Form: { field, file, textarea }
  }
} = common;
class CategoryForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bannerImage: null,
      categoryIcon: null,
      mobileBannerImage: null,
      fileToCrop: null
    };

    this.setBannerImage = this.setBannerImage.bind(this);
    this.setMobileBannerImage = this.setMobileBannerImage.bind(this);
    this.setCategoryIcon = this.setCategoryIcon.bind(this);
    this.removeQualification = this.removeQualification.bind(this);
  }

  UNSAFE_componentWillMount() {
    const {
      setVideoQualifications,
      initialValues: { qualifications },
      editMode
    } = this.props;
    if (qualifications && qualifications.length > 0 && editMode) {
      setVideoQualifications(qualifications);
    }
  }

  setBannerImage(image) {
    this.setState({
      bannerImage: image
    });
  }

  setMobileBannerImage(image) {
    this.setState({
      mobileBannerImage: image
    });
  }

  setCategoryIcon(icon) {
    this.setState({
      categoryIcon: icon
    });
  }

  removeQualification(qualification) {
    const { selectedQualifications, setVideoQualifications } = this.props;
    const qualifications = selectedQualifications.filter(
      qual => qual.qualification_id !== qualification.qualification_id
    );
    setVideoQualifications(qualifications);
  }

  setPreviewImage = (file, type) => {
    if (!file) return;
    this.setState({
      fileToCrop: {
        data: file,
        type
      }
    });
    switch (type) {
      case 'category': {
        this.setCategoryIcon(URL.createObjectURL(file));
        break;
      }
      case 'banner': {
        this.setBannerImage(URL.createObjectURL(file));
        break;
      }
      default: {
        this.setMobileBannerImage(URL.createObjectURL(file));
        break;
      }
    }
  };

  acceptCrop = file => {
    const { fileToCrop } = this.state;
    switch (fileToCrop.type) {
      case 'category': {
        this.setCategoryIcon(URL.createObjectURL(file));
        break;
      }
      case 'banner': {
        this.setBannerImage(URL.createObjectURL(file));
        break;
      }
      default: {
        this.setMobileBannerImage(URL.createObjectURL(file));
        break;
      }
    }
    this.closeCrop();
  };

  closeCrop = () => this.setState({ fileToCrop: null });

  render() {
    const {
      pristine,
      valid,
      initialValues: {
        cloudinary_image_id,
        icon,
        title,
        description,
        mobile_cloudinary_image_id,
        qualifications
      },
      handleSubmit,
      submitting,
      closeFn,
      uiEditingCategory,
      editingSubCategory,
      isPreview,
      editMode,
      viewMode,
      togglePreview,
      addingValues,
      selectedQualifications,
      allQualifications,
      setVideoQualifications
    } = this.props;

    const {
      bannerImage,
      categoryIcon,
      mobileBannerImage,
      fileToCrop
    } = this.state;

    return (
      <div>
        {viewMode === 'info' ? (
          <form onSubmit={handleSubmit} className="inner">
            {isPreview ? (
              <div className="inner-preview">
                <div className="columns banner-view">
                  <div className="column">
                    <ShowPreview
                      {...{ imagePreview: bannerImage, cloudinary_image_id }}
                    />
                    <div className="is-centered">Desktop Banner</div>
                  </div>
                  <div className="column">
                    <ShowPreview
                      {...{
                        imagePreview: mobileBannerImage,
                        cloudinary_image_id: mobile_cloudinary_image_id
                      }}
                    />
                    <div className="is-centered">Mobile Banner</div>
                  </div>
                </div>
                <div>
                  <h3>{addingValues && addingValues.title}</h3>
                  <p>{addingValues && addingValues.description}</p>
                </div>
                <div className="qualification-list">
                  <div className="columns">
                    <div className="column is-8 is-centered q-view">
                      {selectedQualifications &&
                        selectedQualifications.map(qualification => (
                          <div
                            className="qualification-card"
                            key={`video-qual-card-${qualification.qualification_id}`}
                          >
                            <div className="columns is-marginless">
                              <div className="column is-10 q-lara p-t-5">
                                {qualification.reference}
                              </div>
                            </div>
                            <div className="columns is-marginless">
                              <div className="column is-10 p-t-0 p-b-5">
                                <p className="q-title has-text-left">
                                  {qualification.title}
                                </p>
                                <p className="q-level has-text-left">{`Level ${qualification.level}`}</p>
                              </div>
                              <div
                                className="column is-2 p-t-0 q-remove p-b-5"
                                onClick={() =>
                                  this.removeQualification(qualification)
                                }
                              >
                                <Isvg src={IconRemove} />
                              </div>
                            </div>
                          </div>
                        ))}
                      {(!selectedQualifications ||
                        selectedQualifications.length <= 0) && (
                        <div className="is-centered">No Qualification</div>
                      )}
                    </div>
                    <div className="column is-4 is-centered icon-view">
                      <ShowPreview
                        {...{
                          imagePreview: categoryIcon,
                          cloudinary_image_id: icon
                        }}
                      />
                      <div className="is-centered">Category Icon</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="inner-form">
                <label className="label" htmlFor="title">
                  {editingSubCategory ? 'Sub Category Title' : 'Title'}
                  <span className="is-text-danger"> *</span>
                </label>
                <Field
                  name="title"
                  component={field}
                  placeholder="Provide a meaningful title"
                />
                <label className="label" htmlFor="description">
                  Description
                  <span className="is-text-danger"> *</span>
                </label>
                <Field
                  name="description"
                  placeholder="Provide a full description"
                  component={textarea}
                />
                <label className="label" htmlFor="image">
                  Category Icon
                </label>
                <div className="columns add-image">
                  <div className="column is-narrow">
                    <ShowPreview
                      {...{
                        imagePreview: categoryIcon,
                        cloudinary_image_id: icon
                      }}
                    />
                  </div>
                  <div className="column">
                    <Field
                      name="icon"
                      component={file}
                      type="file"
                      onChange={({ target: { files } }) => {
                        this.setPreviewImage(files[0], 'category');
                      }}
                    />
                  </div>
                </div>
                <label className="label" htmlFor="image">
                  Add a Desktop Banner
                </label>
                <div className="columns add-image">
                  <div className="column is-narrow">
                    <ShowPreview
                      {...{ imagePreview: bannerImage, cloudinary_image_id }}
                    />
                  </div>
                  <div className="column">
                    <Field
                      name="image"
                      component={file}
                      type="file"
                      onChange={({ target: { files } }) => {
                        this.setPreviewImage(files[0], 'banner');
                      }}
                    />
                  </div>
                </div>
                <label className="label" htmlFor="image">
                  Mobile Banner Image
                </label>
                <div className="columns add-image">
                  <div className="column is-narrow">
                    <ShowPreview
                      {...{
                        imagePreview: mobileBannerImage,
                        cloudinary_image_id: mobile_cloudinary_image_id
                      }}
                    />
                  </div>
                  <div className="column">
                    <Field
                      name="mobile_image"
                      component={file}
                      type="file"
                      onChange={({ target: { files } }) => {
                        this.setPreviewImage(files[0], '');
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
            {!isPreview ? (
              <div className="content-modal-confirm-control field is-pulled-right">
                <button
                  className="button is-primary is-outlined"
                  disabled={submitting}
                  onClick={closeFn}
                >
                  Cancel
                </button>
                <a
                  className={cx('button is-primary', {
                    'is-loading': uiEditingCategory
                  })}
                  disabled={!valid}
                  onClick={() => togglePreview(valid)}
                >
                  {editMode ? 'Next' : 'Add'}
                </a>
              </div>
            ) : (
              <div className="content-modal-confirm-control-second field">
                <a
                  className="button is-primary is-outlined"
                  disabled={submitting}
                  onClick={togglePreview}
                >
                  <i className="fa fa-angle-left p-r-5" /> Back
                </a>
                <button
                  className={cx('button is-primary', {
                    'is-loading': uiEditingCategory
                  })}
                  disabled={submitting}
                >
                  Upload
                </button>
              </div>
            )}
          </form>
        ) : (
          <CategoryQualification
            {...{
              qualifications,
              allQualifications,
              selectedQualifications,
              setVideoQualifications
            }}
          />
        )}
        {fileToCrop && (
          <MediaCrop
            {...{
              onClose: this.closeCrop,
              mediaSrc: URL.createObjectURL(fileToCrop.data),
              acceptCrop: this.acceptCrop
            }}
          />
        )}
      </div>
    );
  }
}

export const validate = values => {
  const errors = {};
  FormUtil.validate(values, errors, 'title').required();
  FormUtil.validate(values, errors, 'description').required();
  if (values.image) {
    FormUtil.validate(values, errors, 'image').image();
  }
  return errors;
};

const mapStateToProps = (state, props) => ({
  addingValues: getFormValues(props.FORM_NAME)(state)
});

export default connect(mapStateToProps, null)(CategoryForm);
