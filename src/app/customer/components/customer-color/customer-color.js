import React from 'react';
import PropTypes from 'prop-types';

import common from 'app/common';

const { noop } = common.util.helpers;
const { UIColorPicker } = common.components;

const CustomerColor = ({
  brand_colors_primary,
  brand_colors_secondary,
  brand_colors_accent,
  setBrandColorsPrimary,
  setBrandColorsSecondary,
  setBrandColorsAccent
}) => (
  <div className="customer-color">
    <div className="tab-bar">
      <div className="column">
        <span>Select Your Brand Colours</span>
      </div>
    </div>

    <div className="controller-container">
      <div className="columns bottom-border">
        <div className="column is-12 p-20">
          <label className="label m-b-20" htmlFor="colorPrimary">
            Primary Color
          </label>
          <UIColorPicker
            {...{
              color: brand_colors_primary,
              setPickVal: setBrandColorsPrimary
            }}
          />
        </div>
      </div>

      <div className="columns bottom-border">
        <div className="column is-6 p-20">
          <label className="label m-b-20" htmlFor="colorSecondary">
            Secondary Color
          </label>
          <UIColorPicker
            {...{
              color: brand_colors_secondary,
              setPickVal: setBrandColorsSecondary
            }}
          />
        </div>
        <div className="column is-6 p-20">
          <label className="label m-b-20" htmlFor="colorAccent">
            Accent Color
          </label>
          <UIColorPicker
            {...{
              color: brand_colors_accent,
              setPickVal: setBrandColorsAccent
            }}
          />
        </div>
      </div>
    </div>
  </div>
);

CustomerColor.propTypes = {
  brand_colors_primary: PropTypes.string,
  brand_colors_secondary: PropTypes.string,
  brand_colors_accent: PropTypes.string,
  setBrandColorsPrimary: PropTypes.func,
  setBrandColorsSecondary: PropTypes.func,
  setBrandColorsAccent: PropTypes.func
};

CustomerColor.defaultProps = {
  brand_colors_primary: '',
  brand_colors_secondary: '',
  brand_colors_accent: '',
  setBrandColorsPrimary: noop,
  setBrandColorsSecondary: noop,
  setBrandColorsAccent: noop
};

export default CustomerColor;
