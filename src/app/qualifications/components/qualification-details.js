import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { uniq, without, map, addIndex, prop, propEq, find, path } from 'ramda';
import { Field, reduxForm, change, initialize } from 'redux-form';

import classNames from 'classnames';
import userUtil from 'app/user/util/';
import unitsUtil from 'app/units/util/';
import common from 'app/common';

import Isvg from 'react-inlinesvg';
import IconPdfWhite from 'images/icon_pdf_white.svg';
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

class QualificationDetails extends Component {
  constructor() {
    super();
    this.state = {
      specificationFile: null,
      sectorList: []
    };
  }

  handleSpecificationFile(files) {
    if (files.length == 0) return;
    const file = files[0];
    if (!file.type || !file.type.match('application/pdf')) {
      alert('You did not upload an PDF.');
      return;
    }
    if (file) {
      this.setState({ specificationFile: file });
      this.props.changeFieldValue('specification', files);
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

  createPhotoPreview(qualification) {
    let result = null;
    const photo = (qualification && qualification.digital_badge) || null;
    const uploadedMedia = photo && photo['cloudinary_file_id'];

    if (uploadedMedia) {
      result = (
        <CloudinaryMedia
          fileId={uploadedMedia}
          mediaType="image"
          transformations={{
            width: 150,
            height: 150,
            crop: 'fit',
            gravity: 'center'
          }}
        />
      );
    } else if (photo && photo[0] && photo[0].preview) {
      result = <img src={photo[0].preview} alt="" style={{ width: '150px' }} />;
    } else {
      result = (
        <div
          className="columns"
          style={{
            maxWidth: 150,
            paddingTop: 50,
            margin: 'auto'
          }}
        >
          <div className="column">
            <Isvg className="small" src={IconImagePreview} />
          </div>
        </div>
      );
    }
    return result;
  }

  render() {
    const {
      detailFor,
      isSummary,
      editable,
      qualification,
      unit,
      qualificationTypes,
      sectors,
      levels,
      hours,
      tqts,
      changeFieldValue,
      unitsNum,

      defaultSectorKey,
      defaultTypeKey,
      defaultLevelKey,
      defaultHourKey,
      reference,
      specification,
      isMandatory,

      handleEdit,
      handleDelete,
      handleAddToStore,
      handleEditUnits,
      handleUploadSpecification,
      prisitine,
      submitting,
      setDesktopBanner,
      setMobileBanner
    } = this.props;

    const { specificationFile, getFileName } = this.state;
    const sectorList = sectors
      ? sectors.map(sector => {
          return { key: sector.sector_id, name: sector.title };
        })
      : [];

    const temp = find(propEq('key', defaultSectorKey))(sectorList);
    const sectorName = temp ? temp.name : '';

    let typeList = [];
    let typeName = '';

    if (qualificationTypes && qualificationTypes.types) {
      typeList = qualificationTypes.types.map(type => {
        return { key: type.qualification_type_id, name: type.title };
      });

      const temp = find(propEq('key', defaultTypeKey))(typeList);
      typeName = temp ? temp.name : '';
    }

    const course_code = path(['course_code'], qualification) || '';

    return (
      <div className="">
        <div className="columns bottom-border">
          {detailFor == 1 &&
            qualification &&
            qualification.qualification_id &&
            !editable && (
              <div className="column p-l-0">
                <div className="m-b-10">
                  <a
                    className="button is-rounded is-primary"
                    style={{ minWidth: '175px' }}
                    onClick={() => handleEdit()}
                  >
                    Edit Qualification
                  </a>
                </div>
                <div className="m-b-10">
                  <a
                    className="button is-rounded is-outlined"
                    style={{ minWidth: '175px' }}
                    onClick={() => handleDelete()}
                  >
                    Delete Qualification
                  </a>
                </div>
                <div className="m-b-10">
                  <a
                    className="button is-rounded is-outlined"
                    style={{ minWidth: '175px' }}
                    onClick={() => handleAddToStore()}
                  >
                    Add to Store
                  </a>
                </div>
              </div>
            )}

          <div className="column is-8">
            {detailFor == 2 && editable && (
              <div className="has-text-centered m-b-10">
                <label className="custom radio">
                  Mandatory &nbsp;
                  <Field
                    type="radio"
                    name="is_mandatory"
                    value="1"
                    checked={isMandatory == 1}
                    component="input"
                  />
                  <span className="ui" />
                </label>
                <label className="custom radio">
                  Optional &nbsp;
                  <Field
                    type="radio"
                    name="is_mandatory"
                    value="0"
                    checked={!isMandatory || isMandatory == 0}
                    component="input"
                  />
                  <span className="ui" />
                </label>
              </div>
            )}
            {isSummary && (
              <div className="columns">
                <div
                  className={classNames(
                    'column',
                    'is-6',
                    'has-text-right',
                    'qualifications',
                    'label-contatiner',
                    {
                      'p-t-20': editable
                    }
                  )}
                >
                  <label htmlFor="reference">
                    {(detailFor == 1 || detailFor == 3) &&
                      'SEG reference number:'}
                    {detailFor == 2 && 'Unit reference number:'}
                  </label>
                </div>
                <div className="column is-6">
                  {editable ? (
                    <Field
                      placeholder="Ref number"
                      name="course_code"
                      type="text"
                      component={FormField}
                      className="qualifications control"
                    />
                  ) : (
                    <span>{course_code}</span>
                  )}
                </div>
              </div>
            )}
            <div className="columns">
              <div
                className={classNames(
                  'column',
                  'is-6',
                  'has-text-right',
                  'qualifications',
                  'label-contatiner',
                  {
                    'p-t-20': editable
                  }
                )}
              >
                <label htmlFor="reference">
                  {(detailFor == 1 || detailFor == 3) &&
                    'LARA reference number:'}
                  {detailFor == 2 && 'Unit reference number:'}
                </label>
              </div>
              <div className="column is-6">
                {editable ? (
                  <Field
                    placeholder="Ref number"
                    name="reference"
                    type="text"
                    component={FormField}
                    className="qualifications control"
                  />
                ) : (
                  <span>
                    {detailFor == 2
                      ? unit && unit.reference
                      : qualification && qualification.reference}
                  </span>
                )}
              </div>
            </div>

            {[1, 3].indexOf(detailFor) >= 0 && (
              <div className="columns">
                <div
                  className={classNames(
                    'column',
                    'is-6',
                    'has-text-right',
                    'qualifications',
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
                        onChange={e => changeFieldValue('sector_id', e)}
                      />
                    ) : (
                      qualification && <span>{sectorName}</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {[1, 3].indexOf(detailFor) >= 0 && (
              <div className="columns">
                <div
                  className={classNames(
                    'column',
                    'is-6',
                    'has-text-right',
                    'qualifications',
                    'label-contatiner',
                    {
                      'p-t-20': editable
                    }
                  )}
                >
                  <label htmlFor="qualification_type_id">
                    Qualification Type
                  </label>
                </div>
                <div className="column is-6">
                  {editable ? (
                    <UISelectDropdown
                      dropdownList={typeList}
                      defaultTxt="Select one..."
                      defaultKey={defaultTypeKey}
                      onChange={e =>
                        changeFieldValue('qualification_type_id', e)
                      }
                    />
                  ) : (
                    qualification && <span>{typeName}</span>
                  )}
                </div>
              </div>
            )}

            <div className="columns">
              <div
                className={classNames(
                  'column',
                  'is-6',
                  'has-text-right',
                  'qualifications',
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
                    // defaultTxt="Select one..."
                    defaultKey={defaultLevelKey}
                    onChange={e => changeFieldValue('level', e)}
                  />
                ) : (
                  <span>
                    {detailFor == 2
                      ? unit && unit.level
                      : qualification && qualification.level - 1}
                  </span>
                )}
              </div>
            </div>

            {detailFor == 2 && (
              <div className="columns">
                <div
                  className={classNames(
                    'column',
                    'is-6',
                    'has-text-right',
                    'qualifications',
                    'label-contatiner',
                    {
                      'p-t-20': editable
                    }
                  )}
                >
                  <label htmlFor="sector">Credit Value:</label>
                </div>
                <div className="column is-6">
                  <div>
                    {editable && (
                      <Field
                        placeholder="Add"
                        name="credit_value"
                        type="text"
                        component={FormField}
                        className="qualifications control"
                      />
                    )}

                    {!editable && unit && <span>{unit.credit_value}</span>}
                  </div>
                </div>
              </div>
            )}

            <div className="columns">
              <div
                className={classNames(
                  'column',
                  'is-6',
                  'has-text-right',
                  'qualifications',
                  'label-contatiner',
                  {
                    'p-t-20': editable
                  }
                )}
              >
                <label htmlFor="guided_learning_hours">
                  {detailFor == 2 ? 'GLH:' : 'Total GLH:'}
                </label>
              </div>
              <div className="column is-6">
                {editable ? (
                  <Field
                    name="guided_learning_hours"
                    type="number"
                    component={FormField}
                    placeholder="Add"
                    className="qualifications control"
                  />
                ) : (
                  // <UISelectDropdown
                  //   dropdownList={hours}
                  //   defaultTxt="Select one..."
                  //   defaultKey={defaultHourKey}
                  //   onChange={e => changeFieldValue('guided_learning_hours', e)}
                  // />
                  <span>
                    {detailFor == 2
                      ? unit && unit.guided_learning_hours
                      : qualification && qualification.guided_learning_hours}
                  </span>
                )}
              </div>
            </div>

            {(detailFor == 1 || detailFor == 3) && (
              <div className="columns">
                <div
                  className={classNames(
                    'column',
                    'is-6',
                    'has-text-right',
                    'qualifications',
                    'label-contatiner',
                    {
                      'p-t-20': editable
                    }
                  )}
                >
                  <label htmlFor="minimum_credit">Minimum Credits:</label>
                </div>
                <div className="column is-6">
                  {editable ? (
                    <Field
                      name="minimum_credit"
                      type="number"
                      component={FormField}
                      placeholder="Add"
                      className="qualifications control"
                    />
                  ) : (
                    qualification && <p>{qualification.minimum_credit}</p>
                  )}
                </div>
              </div>
            )}

            {[1, 3].indexOf(detailFor) >= 0 && (
              <div className="columns">
                <div
                  className={classNames(
                    'column',
                    'is-6',
                    'has-text-right',
                    'qualifications',
                    'label-contatiner',
                    {
                      'p-t-20': editable
                    }
                  )}
                >
                  <label htmlFor="tqt">TQT:</label>
                </div>
                <div className="column is-6">
                  {editable ? (
                    <Field
                      name="tqt"
                      type="number"
                      component={FormField}
                      placeholder="Add"
                      className="qualifications control"
                    />
                  ) : (
                    qualification && <p>{qualification.tqt}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {detailFor == 3 && (
            <div className="column is-4">
              {this.createPhotoPreview(qualification)}
            </div>
          )}
        </div>

        {detailFor == 3 && (
          <div className="columns bottom-border is-centered">
            <div className="column p-l-0">
              <Isvg className="small float-left p-r-10" src={IconPdfWhite} />
              <div className="p-t-20">Units: {unitsNum}</div>
            </div>
            <div className="column has-text-right p-r-0">
              <a
                className="button is-rounded m-l-20"
                onClick={() => handleEditUnits()}
              >
                Edit Units & Outcomes
              </a>
            </div>
          </div>
        )}
        <div className="columns bottom-border is-centered">
          <div className="column p-l-0">
            <Isvg className="small float-left p-r-10" src={IconPdfWhite} />
            {reference && typeof specification === 'string' && specification ? (
              <div>
                <div>LARA Ref: {reference}</div>
                <div>
                  <a
                    className="view-summary"
                    href={createCloudinaryUrl(specification, 'pdf')}
                  >
                    View
                  </a>
                </div>
              </div>
            ) : (
              <div className="p-t-20">
                {specificationFile
                  ? this.getFileName(specificationFile)
                  : detailFor == 2
                  ? 'PDF Unit Specification'
                  : 'PDF Qualification Specification'}
              </div>
            )}
          </div>

          {editable && (
            <div className="column has-text-right p-r-0">
              <div className="fileUploader">
                <label
                  className="fileUploader__body fileUploader--labelOnly qualifications button upload-specification-button is-primary is-outlined is-rounded m-l-20"
                  htmlFor="specification"
                >
                  Upload {detailFor == 2 ? 'Unit' : 'Qualification'}{' '}
                  Specification
                  <input
                    type="file"
                    name="specification"
                    accept=".pdf"
                    onChange={({ target: { files } }) =>
                      this.handleSpecificationFile(files)
                    }
                  />
                </label>
              </div>
            </div>
          )}
        </div>

        <div className="columns is-multiline has-color-black p-t-10">
          <div className="column is-12 p-l-0">
            <label className="font-family-semibold" htmlFor="overview">
              {detailFor == 2 ? 'Unit Summary' : 'Qualification aim'}
            </label>
          </div>
          <div className="column is-12 p-0">
            {editable ? (
              <TextEditor
                initialData={qualification && qualification.overview}
                affectThisField="overview"
                {...{ changeFieldValue }}
              />
            ) : (
              <div className="qualification-aim">
                <ConvertDraftObjectToHtml
                  object={
                    detailFor == 2 && unit
                      ? unit && unit.overview
                      : qualification && qualification.overview
                  }
                  errorMesage="No summary"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

QualificationDetails.defaultProps = {
  detailFor: 1, // 1: qualification_summary, 2: unit, 3: store
  editable: true,
  qualificationTypes: [],
  sectors: [],
  levels: [
    { key: 1, name: 'Level Zero' },
    { key: 2, name: 'Level One' },
    { key: 3, name: 'Level Two' },
    { key: 4, name: 'Level Three' },
    { key: 5, name: 'Level Four' },
    { key: 6, name: 'Level Five' }
  ],
  hours: Array.from({ length: 30 }, (v, k) => {
    return { key: k + 1, name: k + 1 };
  }),
  units: [],
  qualification: null,
  qualification_type_id: 1,
  unit: null,
  unitsNum: 0,
  reference: '',
  specification: '',
  isMandatory: 0,

  defaultSectorKey: '',
  defaultTypeKey: '',
  defaultLevelKey: 1,
  defaultHourKey: '',

  changeFieldValue: () => {},
  handleEdit: () => {},
  handleDelete: () => {},
  handleAddToStore: () => {},
  handleEditUnits: () => {},
  handleUploadSpecification: () => {}
};

// QualificationDetails.propTypes = {
//   reference: PropTypes.object,
//   sectorv: PropTypes.object,
//   level: PropTypes.object,
//   hours: PropTypes.object,
//   tqt: PropTypes.object,
//   overview: PropTypes.object,
//   qualificationTypes: PropTypes.array,
//   changeFieldValue: PropTypes.func
// };

export default QualificationDetails;

// onChange={({ target: { files } }) =>
//                       this.handleSpecificationFile(files)
//                     }
