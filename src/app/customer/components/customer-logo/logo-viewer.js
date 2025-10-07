import React from 'react';
import PropTypes from 'prop-types';
import { head } from 'ramda';
import cx from 'classnames';

const LogoViewer = ({
  isBorder,
  logoType,
  uploadedLogo,
  brand_logo_scale,
  brand_logo_title,
  brand_logo_font,
  brand_logo_font_size,
  brand_logo_color
}) => (
  <div className={cx('logo-viewer', { 'bottom-border': isBorder })}>
    <div className="banner">
      {logoType === 'image' && uploadedLogo && uploadedLogo.preview && (
        <img
          src={uploadedLogo.preview}
          alt=""
          style={{ height: `${brand_logo_scale}%` }}
        />
      )}
      {logoType === 'text' && (
        <p
          style={{
            fontFamily: `${brand_logo_font}`,
            fontSize: `${brand_logo_font_size}pt`,
            color: `${brand_logo_color}`
          }}
        >
          {brand_logo_title}
        </p>
      )}
    </div>
  </div>
);

LogoViewer.propTypes = {
  uploadedLogo: PropTypes.object,
  brand_logo_scale: PropTypes.number,
  isBorder: PropTypes.bool
};

LogoViewer.defaultProps = {
  uploadedLogo: {},
  brand_logo_scale: 100,
  isBorder: true
};

export default LogoViewer;
