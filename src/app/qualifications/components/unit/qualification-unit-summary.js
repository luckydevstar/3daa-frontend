import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { path } from 'ramda';
import { connect } from 'react-redux';
import classNames from 'classnames';
import userUtil from 'app/user/util/';
import unitsUtil from 'app/units/util/';
import common from 'app/common';
import units from 'app/units';
import { Text } from 'app/intl';

import { Creators as QualificationActions } from 'app/qualifications/actions';

import QualificationDetails from '../qualification-details';
import QualificationDetailsMedia from '../qualification-details-media';

import QualificationUnitWorkbook from './qualification-unit-workbook';

import IconMedia from 'images/icon_media.svg';
import IconPlus from 'images/icon_media_plus.svg';

const {
  Form: { field, select }
} = common.components;

const {
  components: { ContentModal, UILoading },
  util: {
    helpers: { UserAccess }
  }
} = common;

class QualificationUnitSummary extends Component {
  constructor() {
    super();
  }

  UNSAFE_componentWillMount() {}

  onPreview() {}

  onDuplicate() {}

  onEditBook() {}

  onNewWorkbook(unit_id) {
    // const slug = `${browserHistory.getCurrentLocation().pathname}/${unit_id}`;
    // browserHistory.push(slug);
  }

  handleSubmit() {}

  render() {
    const { unit, unitTypes, persistedSector, qualification } = this.props;

    return (
      <div className="qualifications min-content-height">
        <div className="columns p-20 justify-content around background-gray">
          <div className="column is-6">
            <QualificationDetails
              detailFor="2"
              editable={false}
              unit={unit}
              isSummary
            />
          </div>
          <div className="column is-4">
            {unit.workbooks && unit.workbooks.length > 0 ? (
              unit.workbooks.map((workbook, key) => (
                <QualificationUnitWorkbook
                  key={key}
                  workbookData={workbook}
                  workbook_id={parseInt(workbook.workbook_id)}
                  sector={persistedSector}
                  qualification_id={
                    qualification && parseInt(qualification.qualification_id)
                  }
                  unit_id={parseInt(unit.unit_id)}
                />
              ))
            ) : (
              <QualificationUnitWorkbook
                sector={persistedSector}
                qualification_id={
                  qualification &&
                  qualification.qualification_id &&
                  parseInt(qualification.qualification_id)
                }
                unit_id={parseInt(unit.unit_id)}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

QualificationUnitSummary.defaultProps = {
  unit: null,
  unitTypes: [],
  getUntTypes: () => {},
  attemptingGetLearningUnit: false
};

const mapStateToProps = state => ({
  persistedSector: path(['persisted', 'sector'])(state),
  qualification: path([
    'qualifications',
    'currentQualification',
    'qualification'
  ])(state),

  attemptingGetLearningUnit: state.qualifications.attemptingGetLearningUnit
});

const mapDispatchToProps = dispatch => ({
  changeFieldValue: (field_name, value) => {
    dispatch(change(FORM_NAME, field_name, value));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QualificationUnitSummary);
