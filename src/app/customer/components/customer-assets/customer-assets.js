import React from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import Isvg from 'react-inlinesvg';

import common from 'app/common';
import IconRemove from 'images/icon_remove.svg';

const { noop } = common.util.helpers;

class CustomerAssets extends React.Component {
  constructor(props) {
    super(props);
    this.uploadZipFile = this.uploadZipFile.bind(this);
  }
  addFileClick() {
    document.querySelector('#upload-brand-assets').click();
  }
  uploadZipFile(e) {
    const { uploadFile } = this.props;
    const file = e.target.files[0];
    if (file.type.indexOf('zip') !== -1) {
      uploadFile('brand_assets_additional_upload', file);
    }
  }
  render() {
    const { brand_assets_header_background, uploadFile } = this.props;
    return (
      <div className="customer-assets">
        <div className="tab-bar">
          <div className="column">
            <span>Add your Brand Assets</span>
          </div>
        </div>

        <div className="controller-container">
          <div className="columns bottom-border">
            <div className="column is-12 p-b-30">
              <label className="label m-b-20" htmlFor="defaultBackground">
                Upload your Default Header Background
              </label>
              <div className="logo-drop-zone">
                <Dropzone
                  className="drop-zone"
                  onDrop={files =>
                    uploadFile('brand_assets_header_background', files[0])
                  }
                >
                  {brand_assets_header_background &&
                  brand_assets_header_background.preview ? (
                    <div>
                      <div
                        onClick={e => {
                          e.stopPropagation();
                          uploadFile('brand_assets_header_background', null);
                        }}
                      >
                        <Isvg src={IconRemove} />
                      </div>
                      <img
                        src={brand_assets_header_background.preview}
                        alt=""
                      />
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

          <div className="columns m-t-50">
            <div className="column is-12 p-b-20">
              <label className="label m-b-50" htmlFor="addFile">
                Upload Additional Brand assets in zip.file
              </label>
              <div className="btns">
                <button
                  className="button is-default is-6"
                  onClick={this.addFileClick}
                >
                  Add File
                </button>
                <input
                  type="file"
                  style={{ display: 'none' }}
                  onChange={this.uploadZipFile}
                  id="upload-brand-assets"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

CustomerAssets.propTypes = {
  brand_assets_header_background: PropTypes.object,
  uploadFile: PropTypes.func
};

CustomerAssets.defaultProps = {
  brand_assets_header_background: null,
  uploadFile: noop
};

export default CustomerAssets;
