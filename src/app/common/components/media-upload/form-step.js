import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const FormStep = props => {
  const { title, children, className, isCurrentStep } = props;

  const _className = classNames(className, {
    'is-hidden': !isCurrentStep
  });

  return (
    <div className={_className}>
      <h3 className="media-upload__step-title has-text-centered m-t-20 m-b-30">
        {title}
      </h3>
      {children}
    </div>
  );
};

FormStep.defaultProps = {
  className: 'media-upload__step'
};

FormStep.propTypes = {
  title: PropTypes.string.isRequired,
  className: PropTypes.string,
  isCurrentStep: PropTypes.bool.isRequired
};

export default FormStep;
