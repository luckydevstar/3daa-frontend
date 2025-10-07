import React from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import Isvg from 'react-inlinesvg';

import common from 'app/common';
import IconRemove from 'images/icon_remove.svg';
import { CustomerScaler } from '../../components';

const { noop } = common.util.helpers;

const CustomerLogoImage = ({
  setLogoType,
  onDrop,
  uploadedLogo,
  removeUploadedLogo,
  brand_logo_scale,
  setBrandLogoScale
}) => (
  <div className="customer-logo">
    <div className="tab-bar">
      <div className="column" onClick={() => setLogoType('text')}>
        <span>Text Logo</span>
      </div>
      <div className="column is-active" onClick={() => setLogoType('image')}>
        <span>Image</span>
      </div>
    </div>
    <div className="controller-container">
      <div className="columns bottom-border">
        <div className="column is-12 p-b-20">
          <label className="label" htmlFor="logoDrop">
            Upload your image
          </label>
          <div className="logo-drop-zone">
            <Dropzone className="drop-zone" onDrop={files => onDrop(files)}>
              {uploadedLogo && uploadedLogo.preview ? (
                <div>
                  <div
                    onClick={e => {
                      e.stopPropagation();
                      removeUploadedLogo();
                    }}
                  >
                    <Isvg src={IconRemove} />
                  </div>
                  <img src={uploadedLogo.preview} alt="" />
                </div>
              ) : (
                <div>
                  <p className="m-t-20">Drop files here</p>
                  <p className="p-10">or</p>
                  <button className="button is-primary is-outlined">
                    Select Files
                  </button>
                </div>
              )}
            </Dropzone>
          </div>
        </div>
      </div>

      <div className="columns bottom-border m-t-30">
        <div className="column is-12 p-b-30">
          <label className="label p-b-20" htmlFor="logoHeight">
            Image Scale
          </label>
          <CustomerScaler
            {...{
              scaleVal: brand_logo_scale,
              setScaleVal: setBrandLogoScale,
              unit: '%'
            }}
          />
        </div>
      </div>
    </div>
  </div>
);

CustomerLogoImage.propTypes = {
  setLogoType: PropTypes.func,
  onDrop: PropTypes.func
};

CustomerLogoImage.defaultProps = {
  setLogoType: noop,
  onDrop: noop
};

export default CustomerLogoImage;
