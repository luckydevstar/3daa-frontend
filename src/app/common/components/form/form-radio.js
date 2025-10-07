import React from 'react';

const FormRadio = props => {
  const { type = 'radio', value, name, checked } = props;

  return (
    <div>
      <input type={type} name={name} value={value} checked={checked} />
    </div>
  );
};

export default FormRadio;
