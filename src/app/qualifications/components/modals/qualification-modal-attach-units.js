import React, { Component } from 'react';
import PropTypes from 'prop-types';
import userUtil from 'app/user/util/';
import unitsUtil from 'app/units/util/';
import common from 'app/common';
import {
  uniq,
  without,
  map,
  addIndex,
  pick,
  compose,
  prop,
  filter,
  path,
  any,
  pipe,
  toLower,
  toString
} from 'ramda';
import { connect } from 'react-redux';
import { Field, reduxForm, change, initialize } from 'redux-form';
import Collapsible from 'react-collapsible';
import classNames from 'classnames';
import { Label, Text } from 'app/intl';
import { Creators as unitsActions } from 'app/units/actions';
import { Creators as QualificationActions } from 'app/qualifications/actions';

const { ConvertDraftObjectToHtml, UILoading, UINavigation } = common.components;

const errorMesage = "Data doesn't exist";

class AttachUnitsModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 0,
      selectedUnits: [],
      query: '',
      submitted: false
    };
    this.unitFilterChanged = this.unitFilterChanged.bind(this);
  }

  UNSAFE_componentWillMount() {
    this.props.getLearningUnitsAttempt();
    if (this.props.qualification && this.props.qualification.units) {
      this.addSelectedUnits(
        this.props.qualification.units.map(unit => unit.unit_id)
      );
      this.unitFilterChanged('');
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!this.state.submitted) return;
    if (nextProps.attemptingPostQualification) this.onClose();
  }

  shouldComponentUpdate(nextProps) {
    if (
      nextProps.attemptingPostQualification &&
      this.props.attemptingPostQualification
    ) {
      return false;
    }
    return true;
  }

  componentWillUnmount() {}

  onSubmit() {
    const {
      qualification,
      learningUnits,
      updateQualificationAttempt
    } = this.props;
    const { selectedUnits } = this.state;
    if (!qualification || !qualification.qualification.qualification_id) return;

    let value = { ...qualification.qualification };

    if (!value.digital_badge) {
      value.digital_badge = null;
    } else if (value.digital_badge.cloudinary_file_id) {
      value.digital_badge = value.digital_badge.cloudinary_file_id;
    }

    const f = unit => selectedUnits.indexOf(unit.unit_id) >= 0;
    const g = unit => pick(['unit_id', 'is_mandatory'])(unit);

    value.units = compose(map(g), filter(f))(learningUnits.units);

    updateQualificationAttempt(
      value,
      qualification.qualification.qualification_id
    );
  }

  /**
   * @param {number[]} units
   * units id
   */
  addSelectedUnits(units) {
    const selectedUnits = uniq([...this.state.selectedUnits, ...units]);
    this.setState({ selectedUnits });
  }

  removeSelectedUnits(units) {
    const selectedUnits = without([...units], this.state.selectedUnits);
    this.setState({ selectedUnits });
  }

  isUnitSelected(unit_id) {
    return this.state.selectedUnits.includes(unit_id);
  }

  handleUnitClick(unit_id) {
    if (this.isUnitSelected(unit_id)) {
      this.removeSelectedUnits([unit_id]);
    } else {
      this.addSelectedUnits([unit_id]);
    }
  }

  handlePageChange(nextPage) {
    this.setState({ currentPage: nextPage });
  }

  handleQueryChange(value) {
    this.setState({ query: value });
  }

  unitFilterChanged(query) {
    if (query && this.props.learningUnits) {
      const filteredResults = this.props.learningUnits.units.filter(item => {
        if (!item.title) return false;
        const phrase = query.trim().toLowerCase();
        return (
          item.title.toLowerCase().indexOf(phrase) >= 0 ||
          (item.reference &&
            ('' + item.reference).toLowerCase().indexOf(phrase) >= 0)
        );
      });
      return filteredResults;
    } else {
      return this.props.learningUnits
        ? this.props.learningUnits.units || []
        : [];
    }
  }

  render() {
    const {
      learningUnits,
      onClose,
      attemptingGetLearningUnits,
      attemptingPostQualification,
      searchTerm
    } = this.props;
    const { currentPage, selectedUnits, query } = this.state;

    const filteredResults = this.unitFilterChanged(query);

    return (
      <div className="qualification-content">
        <div className="qualification-header">
          <h2 className="title is-2">
            {/* <Text iKey="qualification_creator" /> */}
            Unit Attach
          </h2>
        </div>
        <div className="qualification-navbar">
          <UINavigation
            tabs={[]}
            onSearch={value => this.handleQueryChange(value)}
            searchValue={searchTerm}
            searchPlaceholder="Search for a Unit"
          />
        </div>
        <div className="qualification-creator">
          <div className="units-list">
            {attemptingGetLearningUnits || attemptingPostQualification ? (
              <UILoading />
            ) : (
              filteredResults &&
              filteredResults.map((unit, index) => (
                <div className="units-list-panel" key={index}>
                  <div className="checkbox-side">
                    <label
                      htmlFor="name"
                      className="custom checkbox"
                      onClick={() => this.handleUnitClick(unit.unit_id)}
                    >
                      <input
                        className="checkbox"
                        type="checkbox"
                        checked={this.isUnitSelected(unit.unit_id)}
                        onChange={() => null}
                        name={`unit_${unit.unit_id}`}
                      />
                      <div className="units-list-panel__checkbox">
                        {selectedUnits.includes(unit.unit_id) && (
                          <img src="/assets/images/icon_check.svg" alt="" />
                        )}
                      </div>
                    </label>
                  </div>
                  <Collapsible
                    trigger={`${unit.reference} - ${unit.title}`}
                    classParentString="Collapsible"
                  >
                    <ul className="m-b-20">
                      <li>
                        {`Unit Reference Number:  ${unit.reference}` ||
                          errorMesage}
                      </li>
                      <li>{`Level: ${unit.level}` || errorMesage}</li>
                      <li>
                        {`Credit Value: ${unit.credit_value}` || errorMesage}
                      </li>
                      <li>
                        {`Guided Learning Hours: ${unit.guided_learning_hours}` ||
                          errorMesage}
                      </li>
                    </ul>
                    {unit.overview && (
                      <div>
                        <h4 className="is-4">Unit Summary</h4>
                        <ConvertDraftObjectToHtml object={unit.overview} />
                      </div>
                    )}
                  </Collapsible>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="qualification-footer">
          <button
            onClick={() => onClose()}
            className="button is-rounded is-outlined m-r-20"
          >
            Cancel
          </button>
          <button
            className="button is-rounded is-primary"
            disabled={selectedUnits.length == 0}
            onClick={e => this.onSubmit(e)}
          >
            Submit
          </button>
        </div>
      </div>
    );
  }
}

AttachUnitsModal.defaultProps = {
  onClose: () => {},
  getLearningUnitsAttempt: () => {},
  attemptingGetLearningUnits: false,
  qualification: null,
  learningUnits: null,
  searchTerm: ''
};

AttachUnitsModal.propTypes = {
  onClose: PropTypes.func,
  getLearningUnitsAttempt: PropTypes.func,
  attemptingGetLearningUnits: PropTypes.bool,
  qualification: PropTypes.object,
  learningUnits: PropTypes.object,
  searchTerm: PropTypes.string
};

const mapStateToProps = state => ({
  qualification: path(['qualifications', 'currentQualification'])(state),
  learningUnits: path(['qualifications', 'learningUnits'])(state),
  attemptingGetLearningUnits: path([
    'qualifications',
    'attemptingGetLearningUnits'
  ])(state),
  attemptingPostQualification: path([
    'qualifications',
    'attemptingPostQualification'
  ])(state),
  errorCode: path(['qualifications', 'errorCode'])(state)
});

const mapDispatchToProps = dispatch => ({
  getLearningUnitsAttempt: params => {
    dispatch(QualificationActions.getLearningUnitsAttempt(params));
  },

  updateQualificationAttempt: (payload, qualification_id) =>
    dispatch(
      QualificationActions.updateQualificationAttempt(payload, qualification_id)
    )
});

export default connect(mapStateToProps, mapDispatchToProps)(AttachUnitsModal);
