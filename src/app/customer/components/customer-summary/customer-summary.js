import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import common from 'app/common';
import { LogoViewer } from '../../components';

const { noop } = common.util.helpers;
const { UIColorPicker } = common.components;

const customerSummary = ({
  customType,
  setCustomType,
  logoType,
  uploadedLogo,
  brand_logo_scale,
  brand_logo_title,
  brand_logo_font,
  brand_logo_font_size,
  brand_logo_color,
  brand_webfont_system_font,
  brand_colors_primary,
  brand_colors_secondary,
  brand_colors_accent,
  errorText
}) => (
  <div className="customer-color">
    <div className="tab-bar">
      <div
        className={cx('column', { 'is-active': customType === 'overview' })}
        onClick={() => setCustomType('overview')}
      >
        <span>Overview</span>
      </div>
      <div
        className={cx('column', { 'is-active': customType === 'liveview' })}
        onClick={() => setCustomType('liveview')}
      >
        <span>Live View</span>
      </div>
    </div>

    <div className="controller-container">
      <div className="columns bottom-border">
        <div className="column is-12 p-20">
          {errorText && (
            <div className="customer-summary_error-text">{errorText}</div>
          )}
          <label className="label secondary m-b-20" htmlFor="navigationLogo">
            Navigation Logo
          </label>
          <LogoViewer
            {...{
              isBorder: false,
              logoType,
              uploadedLogo,
              brand_logo_scale,
              brand_logo_title,
              brand_logo_font,
              brand_logo_font_size,
              brand_logo_color
            }}
          />
        </div>
      </div>

      <div className="columns">
        <div className="column is-12 p-t-20 p-l-20 p-r-20">
          <label className="label secondary" htmlFor="colors">
            Brand Colours
          </label>
        </div>
      </div>

      <div className="columns">
        <div className="column is-4 p-t-20 p-l-20">
          <label className="label" htmlFor="colorPrimary">
            Primary Color
          </label>
        </div>
        <div className="column is-4 p-t-20 p-l-20">
          <label className="label" htmlFor="colorSecondary">
            Secondary Color
          </label>
        </div>
        <div className="column is-4 p-t-20 p-l-20">
          <label className="label" htmlFor="colorAccent">
            Accent Color
          </label>
        </div>
      </div>

      <div className="columns bottom-border p-b-20">
        <div className="column is-4 p-t-20 p-l-20">
          <UIColorPicker
            {...{
              disabled: true,
              color: brand_colors_primary
            }}
          />
        </div>
        <div className="column is-4 p-t-20 p-l-20">
          <UIColorPicker
            {...{
              disabled: true,
              color: brand_colors_secondary
            }}
          />
        </div>
        <div className="column is-4 p-t-20 p-l-20">
          <UIColorPicker
            {...{
              disabled: true,
              color: brand_colors_accent
            }}
          />
        </div>
      </div>

      <div className="columns">
        <div className="column is-12 p-t-20 p-l-20 p-r-20">
          <label className="label secondary" htmlFor="fonts">
            Webfonts
          </label>
        </div>
      </div>

      <div className="columns bottom-border">
        <div className="column is-12 p-20">
          <label
            className="label m-b-20"
            htmlFor="font"
            style={{ fontFamily: brand_webfont_system_font }}
          >
            {brand_webfont_system_font}
          </label>
          <p style={{ fontFamily: brand_webfont_system_font }}>
            Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww
            Xx Yy Zz
          </p>
          <p
            className="m-t-10"
            style={{ fontFamily: brand_webfont_system_font }}
          >
            1 2 3 4 5 6 7 8 9 0 !@£$%^&*()
          </p>
        </div>
      </div>

      <div className="columns">
        <div className="column is-12 p-t-20 p-l-20 p-r-20">
          <label className="label secondary" htmlFor="typeography">
            System Set Typeography
          </label>
        </div>
      </div>

      <div className="columns">
        <div className="column is-4 p-t-20 p-l-20">
          <label className="label" htmlFor="typeography">
            H1 Heading
          </label>
        </div>
        <div className="column is-8 p-t-20 p-r-20">
          <label className="label" htmlFor="typeography">
            {brand_webfont_system_font}
          </label>
        </div>
      </div>

      <div className="columns">
        <div className="column is-4 p-t-20 p-l-20">
          <label className="label secondary" htmlFor="typeography">
            Font Size
          </label>
        </div>
        <div className="column is-8 p-t-20 p-r-20">
          <label className="label" htmlFor="typeography">
            {`${brand_logo_font_size}pt`}
          </label>
        </div>
      </div>

      <div className="columns">
        <div className="column is-4 p-t-20 p-l-20">
          <label className="label secondary" htmlFor="typeography">
            Line Height
          </label>
        </div>
        <div className="column is-8 p-t-20 p-r-20">
          <label className="label" htmlFor="typeography">
            72pt
          </label>
        </div>
      </div>

      <div className="columns">
        <div className="column is-4 p-t-20 p-l-20">
          <label className="label secondary" htmlFor="typeography">
            Letter Spacing
          </label>
        </div>
        <div className="column is-8 p-t-20 p-r-20">
          <label className="label" htmlFor="typeography">
            5pt
          </label>
        </div>
      </div>
    </div>
  </div>
);

customerSummary.propTypes = {
  customType: PropTypes.string,
  setCustomType: PropTypes.func,
  brand_colors_primary: PropTypes.string,
  brand_colors_secondary: PropTypes.string,
  brand_colors_accent: PropTypes.string
};

customerSummary.defaultProps = {
  customType: 'liveview',
  setCustomType: noop,
  brand_colors_primary: '',
  brand_colors_secondary: '',
  brand_colors_accent: ''
};

export default customerSummary;
