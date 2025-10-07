import React, { Component } from 'react';
import PropTypes from 'prop-types';
import common from 'app/common';
import Isvg from 'react-inlinesvg';

import IconPDF from 'images/icon_pdf_white.svg';
import IconUnLock from 'images/icon-unlock.svg';
import IconLock1 from 'images/icon-lock1.svg';
import IconForm from 'images/icon-form.svg';
import IconPlus from 'images/icon-plus.svg';
import IconWorkbooks from 'images/icon_workbooks.svg';
import IconTrash from 'images/icon-trash.svg';

const {
  util: {
    helpers: { createCloudinaryUrl }
  }
} = common;

class QualificationPanel extends Component {
  render() {
    const { item, onEdit, onLock } = this.props;
    const specificationUrl =
      item.specification && createCloudinaryUrl(item.specification, 'pdf');
    return (
      <div className="item-panel">
        <div className="columns is-marginless">
          <div className="column is-11 is-paddingless">
            <a className="item-title" onClick={() => onEdit()}>
              {item.title}
            </a>
          </div>
          <div className="column is-1 has-text-right is-paddingless">
            {/*
              <a onClick={() => onLock()}>
                {item.status == 0 && <Isvg src={IconUnLock} />}
                {item.status == 1 && <Isvg src={IconLock1} />}
              </a>
              */}
          </div>
        </div>

        <div className="has-text-right">
          Credits: {item.available_credits || 0}/{item.minimum_credit || 0}
        </div>

        <div className="columns is-marginless">
          <div className="column is-paddingless no-grow p-t-5">
            <Isvg className="small" src={IconPDF} />
          </div>

          <div className="column is-paddingless m-l-10">
            <div className="columns is-marginless">
              <div className="column is-7 is-paddingless">
                <span className="item-secondary-title">Specification</span>
              </div>
              <div className="column is-5 is-paddingless has-text-right">
                <span>
                  Guided Learning Hours:{' '}
                  {item.available_guided_learning_hours || 0}/
                  {item.guided_learning_hours || 0}
                </span>
              </div>
            </div>
            <div className="columns is-marginless">
              <div className="column is-8 is-paddingless">
                <span className="has-text-black">
                  LARA Unit Ref: {item.reference}
                </span>
                {item.specification && (
                  <a
                    className="view-summary p-l-5"
                    href={specificationUrl}
                    target="_blank"
                  >
                    View
                  </a>
                )}
              </div>
              <div className="column is-paddingless">
                <div className="right-icons">
                  {item.cover ? <Isvg src={IconWorkbooks} /> : null}
                  {item.digital_badge ? <Isvg src={IconPlus} /> : null}
                  {item.in_test ? <Isvg src={IconForm} /> : null}
                  {item.in_store ? <Isvg src={IconTrash} /> : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

QualificationPanel.propTypes = {
  item: PropTypes.object.isRequired,
  onEdit: PropTypes.func,
  onLock: PropTypes.func
};

QualificationPanel.defaultProps = {
  item: null,
  onEdit: () => {},
  onLock: () => {}
};

export default QualificationPanel;
