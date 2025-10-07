import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ProfileAvatar from '../profile-avatar';
import Isvg from 'react-inlinesvg';
import IconTraining from 'images/icon_training.svg';
import IconTraining1 from 'images/icon_training1.svg';
import IconWorkbook from 'images/icon_workbooks_fat_grey.svg';
import IconPDF from 'images/icon_pdf_white.svg';

class SelectedItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      name,
      fileId,
      showAvatar,
      showPdfIcon,
      showTtrainingIcon,
      onClose
    } = this.props;

    return (
      <div className="selected-item" style={{ alignItems: 'center' }}>
        <div className="name">
          <span className="m-r-5">{name}</span>
          <i
            className="fa fa-close"
            style={{ cursor: 'pointer' }}
            onClick={() => onClose()}
          />
        </div>
        {showAvatar ||
          showPdfIcon ||
          (showTtrainingIcon && (
            <div className="m-l-15">
              {showAvatar && fileId && (
                <ProfileAvatar avatarSize={70} title={name} fileId={fileId} />
              )}
              {showPdfIcon && <Isvg src={IconPDF} />}
              {showTtrainingIcon && <Isvg src={IconTraining} />}
            </div>
          ))}
      </div>
    );
  }
}

SelectedItem.propTypes = {
  name: PropTypes.string,
  fileId: PropTypes.string,
  pdfIconView: PropTypes.bool,
  trainingIconView: PropTypes.bool,
  ocClose: PropTypes.func
};

SelectedItem.defaultProps = {
  name: '',
  fileId: '',
  pdfIconView: false,
  trainingIconView: false,
  ocClose: () => {}
};

export default SelectedItem;
