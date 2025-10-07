import React from 'react';
import PropTypes from 'prop-types';

import common from 'app/common';
import Fonts from '../../config/fonts';
import { CustomerScaler } from '../../components';

const { noop } = common.util.helpers;
const { UIColorPicker } = common.components;

const CustomerLogoText = ({
  setLogoType,
  brand_logo_title,
  brand_logo_font,
  brand_logo_font_size,
  brand_logo_color,
  setBrandLogoTitle,
  setBrandLogoFont,
  setBrandLogoFontSize,
  setBrandLogoColor
}) => (
  <div className="customer-logo">
    <div className="tab-bar">
      <div className="column is-active" onClick={() => setLogoType('text')}>
        <span>Text Logo</span>
      </div>
      <div className="column" onClick={() => setLogoType('image')}>
        <span>Image</span>
      </div>
    </div>

    <div className="controller-container">
      <div className="columns">
        <div className="column is-12 p-b-20">
          <label className="label" htmlFor="logoText">
            Type your Logo
          </label>
          <input
            onChange={e => setBrandLogoTitle(e.target.value)}
            type="text"
            className="input m-t-20 m-b-20"
            value={brand_logo_title}
          />
        </div>
      </div>

      <div className="columns">
        <div className="column is-12 p-b-20">
          <label className="label" htmlFor="logoFont">
            Font Family
          </label>
          <select
            value={brand_logo_font || 'Open Sans'}
            className="select m-t-20 m-b-20"
            onChange={e => setBrandLogoFont(e.target.value)}
          >
            {Fonts.map(font => (
              <option key={font.name} value={font.name}>
                {font.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="columns m-t-30">
        <div className="column is-6">
          <label className="label p-b-30" htmlFor="logoFontSize">
            Font Size
          </label>
          <CustomerScaler
            {...{
              scaleVal: brand_logo_font_size,
              setScaleVal: setBrandLogoFontSize,
              unit: 'pt'
            }}
          />
        </div>
        <div className="column is-6">
          <label className="label p-b-10" htmlFor="logoFontColor">
            Font Colour
          </label>
          <UIColorPicker
            {...{
              color: brand_logo_color,
              setPickVal: setBrandLogoColor
            }}
          />
        </div>
      </div>
    </div>
  </div>
);

CustomerLogoText.propTypes = {
  setLogoType: PropTypes.func,
  brand_logo_title: PropTypes.string,
  brand_logo_font: PropTypes.string,
  brand_logo_font_size: PropTypes.number,
  brand_logo_color: PropTypes.string,
  setBrandLogoTitle: PropTypes.func,
  setBrandLogoFont: PropTypes.func,
  setBrandLogoFontSize: PropTypes.func,
  setBrandLogoColor: PropTypes.func
};

CustomerLogoText.defaultProps = {
  setLogoType: noop,
  brand_logo_title: 'Example',
  brand_logo_font: 'Open Sans',
  brand_logo_font_size: 45,
  brand_logo_color: '#000000',
  setBrandLogoTitle: noop,
  setBrandLogoFont: noop,
  setBrandLogoFontSize: noop,
  setBrandLogoColor: noop
};

export default CustomerLogoText;
