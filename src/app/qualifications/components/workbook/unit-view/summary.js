import React from 'react';
import { Link } from 'react-router';
import Dropzone from 'react-dropzone';
import classNames from 'classnames';
import common from 'app/common';

const ConvertDraftObjectToHtml = common.components.ConvertDraftObjectToHtml;

const Summary = props => {
  const {
    imageThumbnail,
    imageError,
    handleImageUpload,
    workbook,
    reference,
    level,
    handleReferenceChange,
    workbook_reference,
    guided_learning_hours,
    overview
  } = props;
  return (
    <div className="page-basic" style={{ minHeight: 0 }}>
      <div className="columns" style={{ width: '100%' }}>
        {/* UnitΩ cover */}
        <div className="sidebar-left column is-3-tablet is-2-desktop">
          <Dropzone onDrop={handleImageUpload} className="cover-image-upload">
            <div
              className="book"
              style={{
                backgroundImage: imageThumbnail
                  ? `url(${imageThumbnail})`
                  : 'none'
              }}
            >
              <div className="add-cover-image">
                <i className="icon" />
                {imageThumbnail ? (
                  <span>Change Cover Image</span>
                ) : (
                  <span>Add Cover Image</span>
                )}
              </div>
              {imageError ? (
                <span className="field-error">{imageError}</span>
              ) : null}
            </div>
          </Dropzone>
          <Link
            className={classNames(
              'button',
              'open-workbook-button',
              'is-primary',
              { 'is-hidden': !workbook.workbook_id }
            )}
            to={`${location.pathname}/editor`}
          >
            Edit Workbook
          </Link>
        </div>
        <div className="column">
          <div className="columns right-side">
            {/* Unit details */}
            <div className="unit-details column is-one-third">
              <form action="">
                <div className="control is-horizontal">
                  <div className="control-label">
                    <label htmlFor="unit-reference-number" className="label">
                      Unit reference number:
                    </label>
                  </div>
                  <div className="control">{reference}</div>
                </div>
                <div className="control is-horizontal">
                  <div className="control-label">
                    <label htmlFor="level" disabled className="label">
                      Level:
                    </label>
                  </div>
                  <div className="control">{level}</div>
                </div>
                <div className="control is-horizontal">
                  <div className="control-label">
                    <label htmlFor="guided-learning-" className="label">
                      Guided learning hours:
                    </label>
                  </div>
                  <div className="control">{guided_learning_hours}</div>
                </div>
                <div className="control is-horizontal">
                  <div className="control-label">
                    <label htmlFor="workbook-number" className="label">
                      Workbook number:
                    </label>
                  </div>
                  <div className="control">
                    <input
                      onChange={handleReferenceChange}
                      type="text"
                      value={workbook_reference || ''}
                      className="input"
                    />
                  </div>
                </div>
              </form>
            </div>
            {/* Unit summary */}
            <div className="unit-summary column">
              <b>Unit Summary</b>
              <ConvertDraftObjectToHtml
                object={overview}
                className="box"
                errorMesage="No summary"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;
