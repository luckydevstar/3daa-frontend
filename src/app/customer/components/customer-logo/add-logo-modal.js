import React from 'react';
import PropTypes from 'prop-types';
import Isvg from 'react-inlinesvg';
import { head } from 'ramda';

import common from 'app/common';
import IconImage from 'images/icon-image.svg';

const { noop } = common.util.helpers;

const AddLogoModal = ({ sendLogoToPlatform, uploadedFile }) => (
  <div className="add-logo">
    <h2 className="p-t-20">Select image</h2>
    <div className="p-t-50 p-b-50">
      <Isvg src={IconImage} />
      {uploadedFile.length > 0 && (
        <p className="p-l-10">{head(uploadedFile).name}</p>
      )}
    </div>
    <p className="p-b-20">Please confirm that you wish to add to the system</p>
    <button className="button is-primary" onClick={() => sendLogoToPlatform()}>
      Add to Platform
    </button>
  </div>
);

AddLogoModal.propTypes = {
  uploadedFile: PropTypes.array,
  sendLogoToPlatform: PropTypes.func
};

AddLogoModal.defaultProps = {
  uploadedFile: [],
  sendLogoToPlatform: noop
};

export default AddLogoModal;
