import React from 'react';
import common from 'app/common';
import GroupDetails from './components/group-details';
import GroupTutors from './components/tutors';
import GroupLearners from './components/learners';
import GroupSeats from './components/seats';
import Overview from './components/overview';
import util from 'app/user/util';
import { Field, reduxForm } from 'redux-form';
import { isEmpty, slice, map, length } from 'ramda';

const {
  components: { ContentSlider }
} = common;

export const FORM_NAME = 'editGroupDetails';

const { FormUtil } = util;
const GroupModalForm = props => {
  const {
    title,
    group_id,
    qualification_id,
    qualification_title,
    handleSubmit,
    navButton,
    activeIndex,
    uiSearching,
    getSearchResults,
    imagePreview,
    setImagePreview,
    searchResults,
    searchTerm,
    cloudinary_file_id,
    prev,
    sectionData,
    uiShowSelected,
    setShowSelected,
    header,
    uiGettingQualifications,
    qualifications,
    onQualificationChange,
    isTutor
  } = props;
  const memberStepParams = {
    uiSearching,
    searchTerm,
    searchResults,
    getSearchResults,
    setShowSelected,
    uiShowSelected
  };
  return (
    <form onSubmit={handleSubmit(() => {})}>
      <div className="modal-header p-25 has-text-centered">
        <h2 className="m-b-10">{title || 'Edit group'}</h2>
        <h4 className="fs-16 subtitle">{header.description}</h4>
      </div>
      <GroupDetails
        {...{
          header,
          group_id,
          qualification_id,
          qualification_title,
          cloudinary_file_id,
          imagePreview,
          setImagePreview,
          uiGettingQualifications,
          qualifications,
          onQualificationChange
        }}
      />
      <ContentSlider {...{ activeIndex, manageHeight: false }}>
        <div className="step-1" />
        <div>
          {!isTutor && (
            <div className="step-2">
              <GroupTutors {...memberStepParams} />
            </div>
          )}
          {isTutor && (
            <div className="step-2">
              <GroupLearners {...memberStepParams} />
            </div>
          )}
        </div>

        <div>
          {!isTutor && (
            <div className="step-3">
              <GroupLearners {...memberStepParams} />
            </div>
          )}
          {isTutor && (
            <div className="step-3">
              <Overview {...{ isTutor }} />
            </div>
          )}
        </div>
        {/* <div className="step-4">
          <GroupSeats {...memberStepParams} />
        </div> */}
        <div className="step-4">
          <Overview {...{ isTutor }} />
        </div>
      </ContentSlider>
      <div className="modal-footer p-30">
        <div className="steps">
          {sectionData.map((__, i) => (
            <div
              key={i}
              className={`step ${i <= activeIndex ? 'active' : ''}`}
            />
          ))}
        </div>
        <Field
          name="navMessage"
          component={field => (
            <span
              className="p-10 is-text-success"
              style={{ display: 'inline-block' }}
            >
              {field.meta.error}
            </span>
          )}
        />
        <button
          disabled={activeIndex < 2}
          onClick={prev}
          className="button m-r-10"
        >
          Back
        </button>
        <button {...navButton.props} onClick={navButton.props.onClick}>
          {navButton.label}
        </button>
      </div>
    </form>
  );
};

const validate = (values, props) => {
  const errors = {};
  const { activeIndex, isTutor } = props;
  // index of validation === index of section
  const sectionValidation = [
    // 0 - Group overview
    () => {
      const image = values.cloudinary_file_id;
      FormUtil.validate(values, errors, 'title').required();
      // qualification
      // if (!props.qualification_id) {
      //   if (isEmpty(props.qualifications)) {
      //     errors.qualification_id = `No qualifications in ${props.sectorTitle} sector.`;
      //   } else {
      //     FormUtil.validate(values, errors, 'qualification_id').required();
      //   }
      // }
      // image
      if (image && typeof image !== 'string' && image.length) {
        const fileType = image[0].type;
        if (fileType.indexOf('image') === -1) {
          errors.cloudinary_file_id = 'Not a valid image.';
        }
      }
    },
    // 1 - tutors
    () => {
      if (!isTutor && length(values.tutors) < 1) {
        errors.navMessage = 'You need to select at least one tutor to proceed.';
      }
    },
    // 2 - Lerners, no validation here
    () => true
    // 3 - Seats, validation for learners and seats here
    // () => {
    //   if (isEmpty(values.learners) && isEmpty(values.seats)) {
    //     errors.navMessage =
    //       'You need to select at least one learner or seat to proceed.';
    //   }
    // }
  ];

  // Execute all validation up current index
  map(func => func(), slice(0, activeIndex + 1)(sectionValidation));

  return errors;
};

export default reduxForm({
  form: FORM_NAME,
  validate,
  shouldValidate: () => true
})(GroupModalForm);
