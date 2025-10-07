import React from 'react';

const FormCheckbox = props => {
  const { input, name, label, className, meta: { touched, error } } = props;

  return (
    <p className={`${className} control`}>
      <label htmlFor={name} className="custom checkbox m-b-5">
        <input
          id={name}
          name={name}
          type="checkbox"
          checked={input.checked || input.value === true}
          onChange={input.onChange}
        />
        <span className="ui" /> {label}
      </label>
      {touched &&
        error &&
        <span>
          {error}
        </span>}
    </p>
  );
};

FormCheckbox.defaultProps = {
  className: 'control'
};

export default FormCheckbox;
