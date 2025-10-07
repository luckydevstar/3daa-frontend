import React from 'react';
import { isEmpty } from 'ramda';
import common from 'app/common';
import { Field } from 'redux-form';

const {
  components: {
    ShowPreview,
    Form: { field, file, select }
  }
} = common;

const GroupDetails = ({
  group_id,
  qualification_id,
  qualification_title,
  cloudinary_file_id: cloudinary_image_id,
  imagePreview,
  setImagePreview,
  onQualificationChange,
  uiGettingQualifications,
  qualifications
}) => (
  <div className="group-details-container">
    <label className="label" htmlFor="title">
      {' '}
      Title
      <span className="is-text-danger"> *</span>
    </label>
    <Field name="title" component={field} placeholder="Provide a group title" />
    {/* <label className="label" htmlFor="qualification">
      Qualification
      <span className="is-text-danger"> *</span>
    </label> */}
    {/* <Field
      name="qualification_id"
      className="control grow"
      component={select}
      loading={uiGettingQualifications}
      onChange={onQualificationChange}
      disabled={group_id || !!qualification_id || isEmpty(qualifications)}
    >
      <option value="">Please select a qualification</option>
      {group_id
        ? <option value={qualification_id} selected>
            {qualification_title}
          </option>
        : (qualifications || []).map(qual => (
            <optgroup
              label={qual.title}
              key={`abstract_${qual.qualification_id}`}
            >
              <option key={qual.qualification_id} value={qual.qualification_id}>
                {qualification_id
                  ? `${qual.title} (General pathway)`
                  : 'General pathway'}
              </option>
              {qual.pathways.map(__ => (
                <option key={__.qualification_id} value={__.qualification_id}>
                  {qualification_id
                    ? `${__.title} (${__.pathway})`
                    : __.pathway}
                </option>
              ))}
            </optgroup>
          ))}
    </Field> */}
    <div className="columns add-image p-t-20">
      <div className="column is-narrow">
        <ShowPreview {...{ imagePreview, cloudinary_image_id }} />
      </div>
      <div className="column align-children-middle">
        <div className="trigger-file-upload">
          <span>Choose a file to upload</span>
          <Field
            id="group-image-upload"
            name="cloudinary_file_id"
            component={file}
            type="file"
            onChange={({ target: { files } }) => {
              files[0]
                ? setImagePreview(window.URL.createObjectURL(files[0]))
                : setImagePreview('');
            }}
          />
        </div>
      </div>
    </div>
  </div>
);

export default GroupDetails;
