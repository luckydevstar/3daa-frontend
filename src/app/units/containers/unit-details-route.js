// CORE
import React from 'react';
import { connect } from 'react-redux';
import { Creators as Actions } from '../actions';

import common from 'app/common';

// ADDONS
import { reset } from 'redux-form';
import Immutable from 'seamless-immutable';

// COMPONENTS
import UnitDescription from '../components/unit-description';
import UnitOutcomes from '../components/unit-outcomes';

const { Footer, UILoading, UINavigation } = common.components;

class UnitDetailsRoute extends React.Component {
  constructor(props) {
    super(props);

    // Binding functions
    this.removeElement = this.removeElement.bind(this);
    this.addUnitOutcome = this.addUnitOutcome.bind(this);
    this.addUnitCriteria = this.addUnitCriteria.bind(this);
    this.addUnitGuidance = this.addUnitGuidance.bind(this);
    this.editOutcomesTitle = this.editOutcomesTitle.bind(this);
    this.getIdFromFieldName = this.getIdFromFieldName.bind(this);
    this.saveUnitDescriptionChanges = this.saveUnitDescriptionChanges.bind(
      this
    );

    // Setting default state
    this.state = {
      unit: null
    };
  }

  componentDidMount() {
    this.props.attemptGetUnit(this.props.params.id);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.units && nextProps.units.length) {
      const unitsMutable = Immutable(nextProps.units[0]).asMutable({
        deep: true
      });
      this.setState({ unit: unitsMutable });
    }
  }

  componentDidUpdate() {
    // Reset forms on update
    this.props.resetForm('addUnitCriteria');
    this.props.resetForm('addUnitOutcome');
    this.props.resetForm('addUnitGuidance');
  }

  /**
   * COMPONENT METHODS
   */

  // Shelling ID out of field name ID/ Format "name,id?"
  // if there is multiple id separated by "-", will return an array
  // 0 is outcome Index and 1 is Criteria Index
  getIdFromFieldName(name) {
    const result = name.substring(
      name.lastIndexOf(',') + 1,
      name.lastIndexOf('?')
    );
    if (result.indexOf('-') !== -1) {
      return result.split('-');
    }
    return result;
  }

  addUnitCriteria(value) {
    // Make working coppy of state object
    const obj = Object.assign({}, this.state.unit);
    // create index helper variable
    let index = null;
    // Iterate through Object
    for (const key of Object.keys(value)) {
      // Shell index out of the name
      index = this.getIdFromFieldName(key);
      // If there is no assessment_criteria field, create empty array
      if (!obj.outcomes[index].assessment_criteria) {
        obj.outcomes[index].assessment_criteria = [];
      }
      // Push new assessment_criteria Object to an array
      // TODO require
      const criteriaIndex = obj.outcomes[index].assessment_criteria.length;
      obj.outcomes[index].assessment_criteria.push({
        title: value[key],
        guidance: [],
        number: criteriaIndex + 1,
        require_activity: 0,
        require_observation: 0,
        require_discussion: 0
      });
    }
    // Update state
    this.setState({
      unit: obj
    });
  }

  addUnitOutcome(value) {
    // Make working coppy of state object
    const obj = Object.assign({}, this.state.unit);
    // If there is no outcomes field, create empty array
    if (!obj.outcomes) {
      obj.outcomes = [];
    }
    // push new outcome to array
    obj.outcomes.push(value);
    // assign number
    obj.outcomes[obj.outcomes.length - 1].number = obj.outcomes.length;
    // update state
    this.setState({
      unit: obj
    });
  }

  addUnitGuidance(value) {
    // Make working coppy of state object
    const obj = Object.assign({}, this.state.unit);
    // Create index helper variable
    let index = null;
    // Iterate through Object
    for (const key of Object.keys(value)) {
      index = this.getIdFromFieldName(key);
      // Push new guidance
      obj.outcomes[parseInt(index[0]) - 1].assessment_criteria[
        parseInt(index[1]) - 1
      ].guidance.push(value[key]);
    }
    // update state
    this.setState({ unit: obj });
  }

  removeElement(array) {
    // array format [<int>outcomesIndex, <int>assessment_criteriaIndex, <int>guidanceIndex]
    // Make working coppy of state object
    const obj = Object.assign({}, this.state.unit);
    try {
      switch (array.length) {
        case 0:
          throw new Error('Array can not be empty.');
        case 1:
          obj.outcomes.splice(array[0], 1);
          break;
        case 2:
          obj.outcomes[array[0]].assessment_criteria.splice(array[1], 1);
          break;
        case 3:
          obj.outcomes[array[0]].assessment_criteria[array[1]].guidance.splice(
            array[2],
            1
          );
          break;
        default:
          throw new Error('Array is out of scope.');
      }
      // set new state
      this.setState({ unit: obj });
    } catch (e) {
      console.log(`${e} Element wasn't removed`);
    }
  }

  // Send PUT request to add edit unit
  putUnitAttempt(values = null) {
    const { attemptPutUnits } = this.props;
    if (values) {
      attemptPutUnits({ unit: values });
    } else {
      attemptPutUnits({ unit: this.state.unit });
    }
  }

  saveUnitDescriptionChanges(values) {
    // Add essential data from PUT request
    // Don't change if you don't know what are you doing
    values.unit_id = this.state.unit.unit_id;
    values.outcomes = this.state.unit.outcomes;
    // PUTIN database
    this.putUnitAttempt(values);
    this.setState({
      unit: values
    });
  }

  editOutcomesTitle(newTitle, location) {
    const unitCopy = Object.assign({}, this.state.unit);
    switch (location.length) {
      case 1:
        unitCopy.outcomes[location[0] - 1].title = newTitle;
        this.setState({ unit: unitCopy });
        break;
      case 2:
        unitCopy.outcomes[location[0] - 1].assessment_criteria[
          location[1] - 1
        ].title = newTitle;
        this.setState({ unit: unitCopy });
        break;
      case 3:
        unitCopy.outcomes[location[0] - 1].assessment_criteria[
          location[1] - 1
        ].guidance[location[2]] = newTitle;
        this.setState({ unit: unitCopy });
        break;
      default:
        break;
    }
  }

  render() {
    const { unit } = this.state;
    return (
      <div className="units-container">
        <div className="unit">
          {!unit ? (
            <UILoading marginTop="80px" />
          ) : (
            <div>
              <UnitDescription
                unit={unit}
                saveChanges={this.saveUnitDescriptionChanges}
              />
              <section className="content-section navigation-section">
                <div className="container">
                  <UINavigation
                    tabs={[]}
                    searchPlaceholder="Search all units"
                  />
                </div>
              </section>
              <UnitOutcomes
                outcomes={unit.outcomes}
                unitStatus={unit.status}
                addUnitOutcome={this.addUnitOutcome}
                addUnitCriteria={this.addUnitCriteria}
                addUnitGuidance={this.addUnitGuidance}
                removeElement={this.removeElement}
                putUnitAttempt={() => this.putUnitAttempt()}
                editOutcomesTitle={this.editOutcomesTitle}
              />
            </div>
          )}
        </div>
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = state => {
  if (state.units && state.units.unit) {
    return {
      units: state.units.unit,
      error: state.units.errorCode,
      attemptingGet: state.units.attemptingToGetUnit
    };
  }
  return {};
};

const mapDispatchToProps = dispatch => ({
  resetForm: formName => {
    dispatch(reset(formName));
  },
  attemptPutUnits: unit => {
    dispatch(Actions.putUnitsAttempt(unit));
  },
  attemptGetUnit: id => {
    dispatch(Actions.getUnitAttempt(id));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UnitDetailsRoute);
