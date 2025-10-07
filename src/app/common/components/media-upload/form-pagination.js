import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const buttonClasses = [
  'media-upload__pagination-btn',
  'button',
  'is-link',
  'animate',
  'fade-in'
];

const FormPagination = ({
  isUploading,
  hideNextButton,
  currentStep,
  previousLabel,
  nextLabel,
  onPreviousStep,
  onNextStep
}) => (
  <div className="media-upload__pagination is-flex space-between">
    <button
      type="button"
      onClick={onPreviousStep}
      disabled={isUploading}
      className={classNames(
        ...buttonClasses,
        'media-upload__pagination--previous',
        {
          init: currentStep !== 1
        }
      )}
    >
      <i
        className="media-upload__pagination-btn-icon fa fa-angle-left"
        aria-hidden="true"
      />{' '}
      {previousLabel}
    </button>

    <button
      type="button"
      onClick={onNextStep}
      disabled={isUploading || hideNextButton}
      className={classNames(
        ...buttonClasses,
        'media-upload__pagination--next',
        {
          init: currentStep !== 2
        }
      )}
    >
      {nextLabel}{' '}
      <i
        className="media-upload__pagination-btn-icon fa fa-angle-right"
        aria-hidden="true"
      />
    </button>
  </div>
);

FormPagination.defaultProps = {
  previousLabel: 'Back',
  nextLabel: 'Next',
  hideNextButton: true
};

FormPagination.propTypes = {
  currentStep: PropTypes.number.isRequired,
  hideNextButton: PropTypes.bool,
  previousLabel: PropTypes.string,
  nextLabel: PropTypes.string,
  onPreviousStep: PropTypes.func.isRequired,
  onNextStep: PropTypes.func.isRequired
};

export default FormPagination;
