// CORE
import React from 'react';
import { connect } from 'react-redux';
import { Creators as Actions } from '../actions';

import common from 'app/common';

// COMPONENTS
import UnitList from '../components/unit-list';

const Footer = common.components.Footer;

class UnitsRoute extends React.Component {
  constructor(props) {
    super(props);
    // Bind methods
    this.filterUnits = this.filterUnits.bind(this);
    this.addUnitAttempt = this.addUnitAttempt.bind(this);
    this.deleteUnitAttempt = this.deleteUnitAttempt.bind(this);

    this.state = {
      /**
       * [params description]
       * @type {Object}
       * Params list:
       * <int>limit
       * <int>offset
       * <string>sort
       * <asc/desc>order
       * <string>search
       */
      paramsForGetRequest: {
        limit: 20,
        offset: 0,
        sort: 'unit_id',
        order: 'desc'
      },
      currentPage: 1
    };
  }

  UNSAFE_componentWillMount() {
    // Attempting to get units list from Database
    this.props.attemptGetUnits(this.state.paramsForGetRequest);
  }

  /**
   * COMPONENT METHODS
   */

  /**
   * <int> activePage
   * current page number
   * function called, on page change, from Pagination component
   * TODO We can speed up pagination by loading 2x{limit} units and keep extra {limit} in state
   * then on page change simply show units cached in state and load {limit} more in the background
   * it will need some time to rebuild units loading logic so it'd be nice to implement it in v2
   */
  onPageChange(activePage) {
    const { limit } = this.state.paramsForGetRequest;
    const newOffset = limit * activePage - limit;
    const stateCopy = this.state.paramsForGetRequest;
    stateCopy.offset = newOffset;
    this.setState(
      {
        paramsForGetRequest: stateCopy,
        currentPage: activePage
      },
      () => {
        this.props.attemptGetUnits(this.state.paramsForGetRequest);
      }
    );
  }

  // Send POST request to add units
  addUnitAttempt(values) {
    // Format data for AJAX request
    const postData = { unit: values };
    postData.unit.outcomes = [];
    this.props.attemptPostUnits(postData);
  }

  // Send DELETE request to delete unit
  deleteUnitAttempt(id) {
    // Send delete request
    this.props.attemptDeleteUnits(id, this.state.paramsForGetRequest);
  }

  // filter units
  filterUnits(value) {
    const copyState = this.state.paramsForGetRequest;
    copyState.offset = 0;
    copyState.search = value;
    this.setState(
      {
        paramsForGetRequest: copyState,
        currentPage: 1
      },
      () => {
        this.props.attemptGetUnits(this.state.paramsForGetRequest);
      }
    );
  }

  render() {
    // Switch views for diffrent routes
    return (
      <div className="units-container">
        <UnitList
          filterUnits={this.filterUnits}
          addUnitAttempt={this.addUnitAttempt}
          unit={this.props.units}
          unitsLength={this.props.unitsLength ? this.props.unitsLength : 1}
          currentPage={this.state.currentPage}
          deleteUnit={this.deleteUnitAttempt}
          attemptingGet={this.props.attemptingGet}
          onPageChange={activePage => this.onPageChange(activePage)}
        />
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = ({ units }) => {
  return {
    units: units.units,
    unitsLength: parseInt(units.total),
    error: units.errorCode,
    attemptingGet: units.attemptingToGetUnits
  };
};

const mapDispatchToProps = dispatch => ({
  attemptGetUnits: params => {
    dispatch(Actions.getUnitsAttempt(params));
  },
  attemptPostUnits: unit => {
    dispatch(Actions.postUnitsAttempt(unit));
  },
  attemptDeleteUnits: (id, params) => {
    dispatch(Actions.deleteUnitsAttempt(id, params));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UnitsRoute);
