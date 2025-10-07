import React from 'react';
import PropTypes from 'prop-types';
import { SketchPicker } from 'react-color';

const ColorPickerModal = ({ closePortal, color, left, top, onChange }) =>
  <div className="color-picker-modal" onClick={closePortal}>
    <div
      className="cp-content"
      onClick={e => e.stopPropagation()}
      style={{ left, top }}
    >
      <SketchPicker
        {...{
          color,
          onChange
        }}
      />
    </div>
  </div>;

ColorPickerModal.propTypes = {
  color: PropTypes.string,
  left: PropTypes.number,
  top: PropTypes.number,
  onChange: PropTypes.func
};

ColorPickerModal.defaultProps = {
  color: 'black',
  left: 0,
  top: 0,
  onChange: () => {}
};

export default ColorPickerModal;
