import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { path, reject, isNil } from 'ramda';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { Creators as QualificationActions } from 'app/qualifications/actions';
import * as lodash from 'lodash';
import common from 'app/common';
import { Text } from 'app/intl';
import { convertToFormData } from 'app/common/util/helpers';

const { ContentModalConfirm } = common.components;
const createCloudinaryUrl = common.util.helpers.createCloudinaryUrl;

const createPhotoPreview = photo => {
  return (
    <div
      style={{
        backgroundImage: `url(${createCloudinaryUrl(
          typeof photo === 'string' ? photo : '',
          'image',
          {
            width: 180,
            height: 250,
            crop: 'fill',
            gravity: 'center',
            margin: 'auto'
          }
        )})`,
        boxShadow: '0 5px 10px 0 rgba(10, 10, 10, 0.1)',
        backgroundSize: 'cover',
        height: '250px',
        width: '180px',
        margin: 'auto'
      }}
    >
      {lodash.get(photo, 'preview') ? <img src={photo.preview} alt="" /> : null}
    </div>
  );
};

class QualificationUnitWorkbook extends Component {
  constructor() {
    super();
    this.onPreview = this.onPreview.bind(this);
    this.onDuplicate = this.onDuplicate.bind(this);
    this.onEditWorkbook = this.onEditWorkbook.bind(this);
    this.onNewWorkbook = this.onNewWorkbook.bind(this);
    this.onDeleteWorkbook = this.onDeleteWorkbook.bind(this);
    this.openModalDeleteConfirm = this.openModalDeleteConfirm.bind(this);
  }
  onPreview() {
    const { sector, qualification_id, unit_id, workbook_id } = this.props;
    browserHistory.push(
      `/qualifications/${sector.title}/${qualification_id}/${unit_id}/workbook/${workbook_id}/editor/preview`
    );
    // browserHistory.push(
    //   `/workbooks-builder/${
    //     sector.title
    //   }/${qualification_id}/${unit_id}/${workbook_id}/editor/preview`
    // );
  }

  onDuplicate() {
    const { workbookData } = this.props;
    const workbook = {
      unit_id: workbookData.unit_id,
      header: workbookData.header,
      cover: workbookData.cover,
      title: workbookData.title,
      overview: workbookData.overview,
      sector_id: workbookData.sector_id,
      is_public: workbookData.is_public
    };
    const clearedWorkbook = reject(isNil, workbook);

    const formData = convertToFormData(clearedWorkbook);
    this.props.createWorkbookAttempt(
      formData,
      clearedWorkbook,
      workbookData.unit_id,
      workbookData.sector_id
    );
  }

  onEditWorkbook() {
    const { sector, qualification_id, unit_id, workbook_id } = this.props;
    browserHistory.push(
      `/qualifications/${sector.title}/${qualification_id}/${unit_id}/workbook/${workbook_id}`
    );
  }

  onNewWorkbook(sector, qualification_id, unit_id) {
    browserHistory.push(
      `/qualifications/${sector.title}/${qualification_id}/${unit_id}/workbook`
    );
  }

  onDeleteWorkbook() {
    const { deleteWorkbookFromUnit, unit_id, workbook_id } = this.props;
    deleteWorkbookFromUnit(unit_id, workbook_id);
  }

  openModalDeleteConfirm() {
    setTimeout(() => {
      this.confirmModal.open();
    });
  }

  render() {
    const {
      sector,
      qualification_id,
      unit_id,
      workbookData,
      attemptingDeleteWorkbookFromUnit,
      creatingWorkbook
    } = this.props;

    const deleteWorkbookClasses = classNames(
      'button',
      'is-danger',
      'is-rounded',
      'is-fullwidth',
      'edit-workbook-button',
      {
        'is-loading': attemptingDeleteWorkbookFromUnit
      }
    );
    const createWorkbookClasses = classNames(
      'button',
      'is-info',
      'is-rounded',
      'is-outlined',
      'is-fullwidth',
      'edit-workbook-button',
      { 'is-loading': creatingWorkbook }
    );

    return (
      <div className="columns">
        <div className="column">
          {createPhotoPreview(lodash.get(workbookData, 'cover'))}
        </div>

        {!workbookData && (
          <div className="column">
            <p className="m-b-10">
              <b>
                <Text iKey="msg_no_workbook_yet" />
              </b>
            </p>

            <p className="m-b-15">
              <Text iKey="msg_this_will_create_new_workbook" />
            </p>

            <div className="m-b-10 has-text-centered">
              <a
                onClick={() =>
                  this.onNewWorkbook(sector, qualification_id, unit_id)
                }
                className="button is-info edit-workbook-button is-rounded"
              >
                <Text iKey="create_workbook" />
              </a>
            </div>
          </div>
        )}
        {workbookData && (
          <div className="column">
            <p className="m-b-10">
              <b>Would you like to edit this workbook?</b>
            </p>
            <p className="m-b-15">
              This unit is completed but you can preview it's content or create
              a new version for your learners
            </p>
            <div className="columns">
              <div className="column">
                <a
                  onClick={this.onPreview}
                  className="button is-info edit-workbook-button is-rounded is-outlined is-fullwidth"
                >
                  Preview
                </a>
                {/* <a
                  onClick={this.openModalDeleteConfirm}
                  className={deleteWorkbookClasses}
                >
                  Delete
                </a>
              </div>
              <div className="column">
                <a onClick={this.onDuplicate} className={createWorkbookClasses}>
                  Duplicate
                </a> */}
                <a
                  onClick={this.onEditWorkbook}
                  className="button is-info edit-workbook-button is-rounded is-fullwidth"
                >
                  Edit
                </a>
              </div>
            </div>
          </div>
        )}
        <ContentModalConfirm
          callback={this.onDeleteWorkbook}
          ref={e => {
            this.confirmModal = e;
          }}
        >
          <h3>Are you sure you want to delete the workbook?</h3>
        </ContentModalConfirm>
      </div>
    );
  }
}

QualificationUnitWorkbook.propTypes = {
  sector: PropTypes.object,
  qualification_id: PropTypes.number,
  unit_id: PropTypes.number
};

QualificationUnitWorkbook.defaultProps = {
  sector: null,
  qualification_id: null,
  unit_id: null
};

const mapStateToProps = state => ({
  attemptingDeleteWorkbookFromUnit: path(
    ['qualificationUnits', 'attemptingDeleteWorkbookFromUnit'],
    state
  ),
  creatingWorkbook: path(['qualifications', 'creatingWorkbook'], state)
});

const mapDispatchToProps = dispatch => ({
  deleteWorkbookFromUnit: (unit_id, workbook_id) =>
    dispatch(
      QualificationActions.deleteWorkbookFromUnitAttempt(unit_id, workbook_id)
    ),
  createWorkbookAttempt: (formData, workbook, unit_id, sector_id) =>
    dispatch(
      QualificationActions.createWorkbookAttempt(
        formData,
        workbook,
        unit_id,
        sector_id
      )
    )
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QualificationUnitWorkbook);
