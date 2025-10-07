import React from 'react';
import PropTypes from 'prop-types';
import common from 'app/common';

const { noop } = common.util.helpers;

class CustomerFontsUpload extends React.Component {
  uploadFontClick() {
    document.querySelector('#upload-font').click();
  }
  render() {
    const { setCustomType, uploadFile } = this.props;
    return (
      <div className="customer-fonts">
        <div className="tab-bar">
          <div
            className="column is-active"
            onClick={() => setCustomType('upload')}
          >
            <span>Upload WebFonts</span>
          </div>
          <div className="column" onClick={() => setCustomType('system')}>
            <span>System Fonts</span>
          </div>
        </div>

        <div className="controller-container">
          <div className="columns">
            <div className="column is-12 p-b-20">
              <label className="label m-b-50" htmlFor="logoText">
                Upload new webfont
              </label>
              <label htmlFor="upload-font">
                <button
                  onClick={this.uploadFontClick}
                  className="button is-primary is-fullwidth"
                >
                  Upload
                </button>
                <input
                  type="file"
                  id="upload-font"
                  onChange={e => {
                    uploadFile('brand_webfont_media', e.target.files[0]);
                  }}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

CustomerFontsUpload.propTypes = {
  setCustomType: PropTypes.func
};

CustomerFontsUpload.defaultProps = {
  setCustomType: noop
};

export default CustomerFontsUpload;
