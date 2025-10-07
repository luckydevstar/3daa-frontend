import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  uniq,
  without,
  map,
  addIndex,
  prop,
  propEq,
  find,
  filter
} from 'ramda';
import * as lodash from 'lodash';
import { Field, reduxForm, change, initialize } from 'redux-form';
import Dropzone from 'react-dropzone';
import classNames from 'classnames';
import userUtil from 'app/user/util/';
import unitsUtil from 'app/units/util/';
import common from 'app/common';

import {
  age_to_range,
  range_to_age,
  AGE_RANGE
} from '../utils/change-age-range';

import Isvg from 'react-inlinesvg';
// import IconPdfWhite from 'images/icon_pdf_white.svg';
import IconImagePreview from 'images/icon_image_preview.svg';

const {
  Form: { field, select, radio, textarea, file },
  CloudinaryMedia,
  ConvertDraftObjectToHtml,
  UISelectDropdown
} = common.components;

const FormField = field;
const FormSelect = select;
const TextareaField = textarea;
const FormFile = file;
const { TextEditor } = unitsUtil;

const createCloudinaryUrl = common.util.helpers.createCloudinaryUrl;

class Details extends Component {
  constructor() {
    super();
    this.state = {
      specificationFile: null,
      sectorList: [],
      mobileHeaderError: ''
    };
    this.onChangeInspired = this.onChangeInspired.bind(this);
    this.setMobileHeaderMedia = this.setMobileHeaderMedia.bind(this);
  }

  detectMediaType(file) {
    let result = null;

    if (file && file.type) {
      if (file.type.indexOf('image') > -1) {
        result = 'image';
      } else if (file.type.indexOf('video') > -1) {
        result = 'video';
      }
    }
    return result;
  }

  validateVideo(video, callback) {
    const error = [];
    const { max_video_file_size, video_formats } = this.props;

    if (
      video_formats &&
      video_formats.every(e => video.type.indexOf(e) === -1)
    ) {
      error.push(
        `We're accepting${video_formats.map(
          video_format => ` .${format}`
        )} only`
      );
      return callback(false, error);
    }

    if (video.size > max_video_file_size) {
      error.push(
        `Your video is bigger than: ${max_video_file_size / 1024 / 1024}MB`
      );
      return callback(false, error);
    }

    return callback(true);
  }

  validateImage(image, callback) {
    const img = new Image();
    const error = [];

    const image_resolution = {
      width: 375,
      height: 65
    };

    img.src = image.preview;
    img.type = image.type;

    // if (
    //   image_formats &&
    //   image_formats.every(e => image.type.indexOf(e) === -1)
    // ) {
    //   error.push(
    //     `We're accepting${image_formats.map(format => ` .${format}`)} only`
    //   );
    //   return callback(false, error);
    // }

    // if (image.size > max_image_file_size) {
    //   error.push(
    //     `Your image is bigger than: ${max_image_file_size / 1024 / 1024}MB`
    //   );
    // }

    img.onload = () => {
      if (img.type.indexOf('svg') > -1) {
        return callback(true, null);
      }
      if (
        img.width != image_resolution.width ||
        img.height != image_resolution.height
      ) {
        error.push(`The size of your image is wrong.`);
      }
      return callback(!error.length, error.length ? error : null);
    };
    return null;
  }

  setMobileHeaderMedia(file) {
    this.props.changeFieldValue('mobile_header', file);
  }

  handleSpecificationFile(files) {
    const file = files[0];
    if (!file.type || !file.type.match('application/pdf')) {
      alert('You did not upload an PDF.');
      return;
    }
    this.setState({ specificationFile: file });
  }

  handleMobileHeaderUpload(files) {
    const file = files[0];
    const mediaType = this.detectMediaType(file);
    const setHeader = (status, error) => {
      if (status) {
        this.setState({ mobileHeaderError: null }, () => {
          this.setMobileHeaderMedia(file);
        });
      } else {
        this.setState({ mobileHeaderError: error[0] });
      }
    };

    switch (mediaType) {
      case 'video':
        this.validateVideo(file, setHeader);
        break;
      case 'image':
        this.validateImage(file, setHeader);
        break;
      default:
        break;
    }
  }

  getFileName(file) {
    const filename = file.name
      .split('\\')
      .pop()
      .split('/')
      .pop();
    return filename.substring(0, filename.lastIndexOf('.'));
  }

  getAgeRanges(age_min, age_max) {
    let range = '';
    if (age_min) range = '' + age_min;

    if (age_max) return (range += ' - ' + age_max);
    else if (range) return (range += ' + ');
    return 'All Age Ranges';
  }

  onChangeInspired(e) {
    const { editable, changeFieldValue } = this.props;
    if (!editable) return;
    changeFieldValue('inspired', e.target.checked ? 1 : 0);
  }

  createPhotoPreview(photo) {
    let result = null;
    if (typeof photo === 'string') {
      result = <CloudinaryMedia fileId={photo} mediaType="image" />;
    } else if (photo && photo.preview) {
      result = <img src={photo.preview} alt="" />;
    }
    return result;
  }

  render() {
    const {
      detailFor,
      editable,
      formData,
      newsProvider,
      news,
      sectors,
      levels,
      ageRanges,
      inspired,
      defaultSectorKey,
      defaultLevelKey,
      defaultAgeKey,

      changeFieldValue,
      handleDelete,
      handleUploadSpecification,
      prisitine,
      submitting
    } = this.props;

    const { mobileHeaderError } = this.state;

    const sectorList = sectors
      ? sectors.map(sector => {
          return { key: sector.sector_id, name: sector.title };
        })
      : [];
    const temp = newsProvider
      ? find(propEq('key', newsProvider.abstract_sector_id))(sectorList)
      : {};
    const sectorName = temp ? temp.name : '';

    return (
      <div className="">
        {detailFor == 1 && (
          <div className="columns bottom-border">
            <div className="column is-7">
              <div className="columns">
                <div
                  className={classNames(
                    'column',
                    'is-6',
                    'has-text-right',
                    'label-contatiner',
                    {
                      'p-t-20': editable
                    }
                  )}
                >
                  <label htmlFor="sector">News Provider Title:</label>
                </div>
                <div className="column is-6">
                  {editable ? (
                    <Field
                      placeholder="Add News Provider Title"
                      name="title"
                      type="text"
                      component={FormField}
                      className="control"
                    />
                  ) : (
                    newsProvider && newsProvider.title
                  )}
                </div>
              </div>

              <div className="columns">
                <div
                  className={classNames(
                    'column',
                    'is-6',
                    'has-text-right',
                    'label-contatiner',
                    {
                      'p-t-20': editable
                    }
                  )}
                >
                  <label htmlFor="sector">
                    {editable ? 'Add the RSS Feed:' : 'RSS Feed:'}
                  </label>
                </div>
                <div className="column is-6">
                  {editable ? (
                    <Field
                      placeholder="RSS Feed"
                      name="rss_feed"
                      type="text"
                      component={FormField}
                      className="control"
                    />
                  ) : (
                    newsProvider && newsProvider.rss_feed
                  )}
                </div>
              </div>

              <div className="columns">
                <div
                  className={classNames(
                    'column',
                    'is-6',
                    'has-text-right',
                    'label-contatiner',
                    {
                      'p-t-20': editable
                    }
                  )}
                >
                  <label htmlFor="sector">Sector:</label>
                </div>
                <div className="column is-6">
                  <div>
                    {editable ? (
                      <UISelectDropdown
                        dropdownList={sectorList}
                        defaultTxt="Select one..."
                        defaultKey={defaultSectorKey}
                        onChange={e =>
                          changeFieldValue('abstract_sector_id', e)
                        }
                      />
                    ) : (
                      newsProvider && <span>{sectorName}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="columns">
                <div
                  className={classNames(
                    'column',
                    'is-6',
                    'has-text-right',
                    'label-contatiner',
                    {
                      'p-t-20': editable
                    }
                  )}
                >
                  <label htmlFor="level">Level:</label>
                </div>

                <div className="column is-6">
                  {editable ? (
                    <UISelectDropdown
                      dropdownList={levels}
                      defaultTxt="Select one..."
                      defaultKey={defaultLevelKey}
                      onChange={e => changeFieldValue('level', e)}
                    />
                  ) : (
                    <span>{newsProvider && newsProvider.level}</span>
                  )}
                </div>
              </div>

              <div className="columns">
                <div
                  className={classNames(
                    'column',
                    'is-6',
                    'has-text-right',
                    'label-contatiner',
                    {
                      'p-t-20': editable
                    }
                  )}
                >
                  <label htmlFor="guided_learning_hours">
                    Age Suitability:
                  </label>
                </div>
                <div className="column is-6">
                  {editable ? (
                    <UISelectDropdown
                      dropdownList={ageRanges}
                      defaultTxt="Select one..."
                      defaultKey={defaultAgeKey}
                      onChange={e => changeFieldValue('age_range', e)}
                    />
                  ) : (
                    <span>
                      {newsProvider &&
                        this.getAgeRanges(
                          newsProvider.age_min,
                          newsProvider.age_max
                        )}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {detailFor == 1 && (
              <div className="column is-5">
                <Dropzone
                  className="mobile-header-upload"
                  onDrop={files => this.handleMobileHeaderUpload(files)}
                >
                  <div>
                    {this.createPhotoPreview(
                      lodash.get(formData, 'values.mobile_header')
                    )}
                  </div>
                  <div className="is-flex" style={{ cursor: 'pointer' }}>
                    <div className="m-r-15">
                      <i
                        className="fa fa-mobile"
                        aria-hidden="true"
                        style={{ fontSize: '64px' }}
                      />
                    </div>

                    <div className="has-text-centered">
                      <div>
                        {lodash.get(newsProvider, 'mobile_header') ? (
                          <span>Change Mobile Header</span>
                        ) : (
                          <span>Upload Mobile Header</span>
                        )}
                      </div>
                      <div className="m-t-15">
                        <div>Image must be</div>
                        <div>375 x 65</div>
                      </div>
                    </div>
                  </div>
                  {mobileHeaderError ? (
                    <div
                      className="has-text-centered"
                      style={{ color: 'red', lineHeight: '1' }}
                    >
                      {mobileHeaderError}
                    </div>
                  ) : null}
                </Dropzone>
              </div>
            )}

            {/**
              <div className="column is-4">
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
              */}
          </div>
        )}
        {detailFor == 1 && (
          <div className="columns">
            <div className="column no-grow" style={{ whiteSpace: 'nowrap' }}>
              <div className="is-flex is-centered">
                <label htmlFor="overview">Name of Company:</label>
              </div>
            </div>
            <div className="column">
              {editable ? (
                <Field
                  placeholder="Type the name of the company or brand"
                  name="company_name"
                  type="text"
                  component={FormField}
                  className="control"
                />
              ) : (
                newsProvider && newsProvider.company_name
              )}
            </div>
          </div>
        )}

        <div style={{ minHeight: '100px' }}>
          <label htmlFor="description">
            {detailFor == 1 ? 'About the News Provider' : 'News Aim'}
          </label>
          {editable ? (
            <TextEditor
              initialData={
                detailFor == 1
                  ? newsProvider && newsProvider.description
                  : news && news.short_content
              }
              affectThisField={detailFor == 1 ? 'description' : 'short_content'}
              {...{ changeFieldValue }}
            />
          ) : (
            <ConvertDraftObjectToHtml
              object={
                detailFor == 1
                  ? newsProvider && newsProvider.description
                  : news && news.short_content
              }
              errorMesage="No summary"
            />
          )}
        </div>
      </div>
    );
  }
}

Details.defaultProps = {
  detailFor: 1, // 1: news provider, 2: news acticle
  editable: true,
  formData: {},
  newsProvider: {},
  news: {},

  sectors: [],
  levels: [
    { key: 1, name: 'Level One' },
    { key: 2, name: 'Level Two' },
    { key: 3, name: 'Level Three' },
    { key: 4, name: 'Level Four' },
    { key: 5, name: 'Level Five' },
    { key: 6, name: 'All' }
  ],
  ageRanges: AGE_RANGE,
  inspired: false,

  defaultSectorKey: '',
  defaultLevelKey: '',
  defaultAgeKey: '',

  changeFieldValue: () => {},
  handleEdit: () => {},
  handleDelete: () => {},
  handleAddToStore: () => {},
  handleEditUnits: () => {},
  handleUploadSpecification: () => {}
};

export default Details;
