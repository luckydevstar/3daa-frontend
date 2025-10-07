import React from 'react';
import PropTypes from 'prop-types';

import common from 'app/common';
import { LogoViewer } from '../../components';

const { UIColorPicker } = common.components;

const CustomerOverViewer = ({
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
  brand_colors_accent
}) => (
  <div className="over-viewer-container">
    <div className="viewer-header">
      <span>Overview</span>
    </div>
    <div className="viewer-container">
      <div className="columns bottom-border">
        <div className="column is-6 p-20 right-border">
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
        <div className="column is-6 p-20">
          <label className="label secondary m-l-20" htmlFor="brandColours">
            Brand Colours
          </label>
          <div className="columns m-l-20">
            <div className="column is-4 m-b-0">
              <label className="label" htmlFor="colorPrimary">
                Primary Color
              </label>
            </div>
            <div className="column is-4 m-b-0">
              <label className="label" htmlFor="colorSecondary">
                Secondary Color
              </label>
            </div>
            <div className="column is-4 m-b-0">
              <label className="label" htmlFor="colorAccent">
                Accent Color
              </label>
            </div>
          </div>
          <div className="columns m-l-20">
            <div className="column is-4">
              <UIColorPicker
                {...{
                  disabled: true,
                  color: brand_colors_primary
                }}
              />
            </div>
            <div className="column is-4">
              <UIColorPicker
                {...{
                  disabled: true,
                  color: brand_colors_secondary
                }}
              />
            </div>
            <div className="column is-4">
              <UIColorPicker
                {...{
                  disabled: true,
                  color: brand_colors_accent
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="columns">
        <div className="column is-6 p-20 right-border">
          <label className="label secondary p-b-20" htmlFor="fonts">
            Webfonts
          </label>
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
        <div className="column is-6 p-20">
          <label className="label secondary p-l-20" htmlFor="typeography">
            System Set Typeography
          </label>
          <div className="columns">
            <div className="column is-4 p-l-20 m-b-0">
              <label className="label" htmlFor="typeography">
                H1 Heading
              </label>
            </div>
            <div className="column is-8 p-r-20 m-b-0">
              <label className="label" htmlFor="typeography">
                {brand_webfont_system_font}
              </label>
            </div>
          </div>

          <div className="columns">
            <div className="column is-4 p-l-20 m-b-0">
              <label className="label secondary" htmlFor="typeography">
                Font Size
              </label>
            </div>
            <div className="column is-8 p-r-20 m-b-0">
              <label className="label" htmlFor="typeography">
                70pt
              </label>
            </div>
          </div>

          <div className="columns">
            <div className="column is-4 p-l-20 m-b-0">
              <label className="label secondary" htmlFor="typeography">
                Line Height
              </label>
            </div>
            <div className="column is-8 p-r-20 m-b-0">
              <label className="label" htmlFor="typeography">
                72pt
              </label>
            </div>
          </div>

          <div className="columns">
            <div className="column is-4 p-l-20 m-b-0">
              <label className="label secondary" htmlFor="typeography">
                Letter Spacing
              </label>
            </div>
            <div className="column is-8 p-r-20 m-b-0">
              <label className="label" htmlFor="typeography">
                5pt
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

CustomerOverViewer.propTypes = {
  brand_colors_primary: PropTypes.string,
  brand_colors_secondary: PropTypes.string,
  brand_colors_accent: PropTypes.string
};

CustomerOverViewer.defaultProps = {
  brand_colors_primary: '',
  brand_colors_secondary: '',
  brand_colors_accent: ''
};

export default CustomerOverViewer;
