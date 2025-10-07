import React from 'react';
import PropTypes from 'prop-types';
import Isvg from 'react-inlinesvg';

import common from 'app/common';
import Fonts from '../../config/fonts';
import IconCheckbox from 'images/icon-checkbox.svg';

const { noop } = common.util.helpers;

const FontElement = ({
  font,
  brand_webfont_system_font,
  setBrandWebfontSystemFont
}) => (
  <div
    className="font m-b-20"
    onClick={() => setBrandWebfontSystemFont(font.name)}
  >
    <div className="bar">
      <div className="f-title">{font.name}</div>
      {font.name === brand_webfont_system_font ? (
        <Isvg src={IconCheckbox} />
      ) : (
        <div className="f-checkbox" />
      )}
    </div>
    <div className="f-text" style={{ fontFamily: font.name }}>
      Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy
      Zz
    </div>
  </div>
);

const CustomerFontsSystem = ({
  brand_webfont_system_font,
  setCustomType,
  setBrandWebfontSystemFont
}) => (
  <div className="customer-fonts">
    <div className="tab-bar">
      <div className="column" onClick={() => setCustomType('upload')}>
        <span>Upload WebFonts</span>
      </div>
      <div className="column is-active" onClick={() => setCustomType('system')}>
        <span>System Fonts</span>
      </div>
    </div>

    <div className="controller-container">
      {Fonts.map(font => (
        <FontElement
          key={font.name}
          {...{ font, brand_webfont_system_font, setBrandWebfontSystemFont }}
        />
      ))}
    </div>
  </div>
);

CustomerFontsSystem.propTypes = {
  brand_webfont_system_font: PropTypes.string,
  setCustomType: PropTypes.func
};

CustomerFontsSystem.defaultProps = {
  brand_webfont_system_font: 'Open Sans',
  setCustomType: noop
};

export default CustomerFontsSystem;
