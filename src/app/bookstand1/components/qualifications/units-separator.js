import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Workbooks from '../workbooks';
import Collapsible from 'react-collapsible';
import common from 'app/common';
import { contains, pipe, filter } from 'ramda';

const {
  util: {
    helpers: { extractUserRole }
  }
} = common;

class UnitsSeparator extends Component {
  constructor() {
    super();
    this.isMandatory = this.isMandatory.bind(this);
    this.isSelected = this.isSelected.bind(this);
  }

  isMandatory(workbook) {
    return workbook.is_mandatory === 1;
  }

  isSelected(workbook) {
    if (this.props.showSelectedWorkbooks) {
      return contains(workbook.workbook_id, this.props.selectedWorkbooks);
    }
    return workbook;
  }

  renderWorkbooks(workbooks) {
    const {
      selectedWorkbooks,
      handleWorkbookSelect,
      onBookItemClick,
      viewType,
      user
    } = this.props;
    const WorkbooksComponent =
      viewType === 'card' ? Workbooks.CardView : Workbooks.ListView;
    return (
      <WorkbooksComponent
        contentManagerMode
        workbooks={workbooks}
        role={extractUserRole(user)}
        {...{ selectedWorkbooks, handleWorkbookSelect, onBookItemClick }}
      />
    );
  }

  render() {
    const { selectedWorkbooks, showSelectedWorkbooks, workbooks } = this.props;
    const selectedWorkbooksFilter = wb => this.isSelected(wb);
    const mandatoryWorbkooksFilter = wb => this.isMandatory(wb);
    const optionalWorbkooksFilter = wb => !this.isMandatory(wb);
    const mandatoryWorkbooks = pipe(
      filter(mandatoryWorbkooksFilter),
      filter(selectedWorkbooksFilter)
    )(workbooks);
    const optionalWorkbooks = pipe(
      filter(optionalWorbkooksFilter),
      filter(selectedWorkbooksFilter)
    )(workbooks);

    return (
      <div className="workbooks-explorer-container">
        <Collapsible
          trigger={`Mandatory units (${(mandatoryWorkbooks &&
            mandatoryWorkbooks.length) ||
            0})`}
          open
        >
          {this.renderWorkbooks(mandatoryWorkbooks)}
        </Collapsible>
        <Collapsible
          trigger={`Optional units (${(optionalWorkbooks &&
            optionalWorkbooks.length) ||
            0})`}
          open
        >
          {this.renderWorkbooks(optionalWorkbooks)}
        </Collapsible>
      </div>
    );
  }
}

UnitsSeparator.propTypes = {
  workbooks: PropTypes.array,
  showSelectedWorkbooks: PropTypes.bool
};

UnitsSeparator.defaultProps = {
  workbooks: [],
  showSelectedWorkbooks: false
};

export default UnitsSeparator;
