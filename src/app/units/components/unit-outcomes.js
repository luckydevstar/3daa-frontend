// CORE
import React from 'react';

// COMPONENTS
import CreateOutcome from './unit-create-outcome';
import AddUnitOutcome from './unit-add-outcome';

class UnitOutcomes extends React.Component {
  // Prepere data for Unit Outcomes
  renderOutcome() {
    const outcomeRow = this.props.outcomes.map((outcome, key) =>
      <CreateOutcome
        addUnitCriteria={this.props.addUnitCriteria}
        addUnitGuidance={this.props.addUnitGuidance}
        title={outcome.title}
        assessment_criteria={outcome.assessment_criteria}
        removeElement={this.props.removeElement}
        i={key + 1}
        key={key}
        editOutcomesTitle={this.props.editOutcomesTitle}
      />
    );
    // Return Outcome array JSx
    return outcomeRow;
  }

  render() {
    return (
      <section className="unit-outcomes-accordion">
        <div className="container">
          <AddUnitOutcome addUnitOutcome={this.props.addUnitOutcome} />
        </div>

        <div className="outcomes-container content-section">
          <div className="container">
            <h2>Learning Outcomes</h2>

            {this.props.outcomes
              ? this.renderOutcome()
              : 'There is no outcomes yet'}

            <button
              type="button"
              disabled={this.props.unitStatus === 1}
              className="button is-success m-t-20"
              onClick={this.props.putUnitAttempt}
            >
              Submit changes
            </button>
          </div>
        </div>
      </section>
    );
  }
}

export default UnitOutcomes;
