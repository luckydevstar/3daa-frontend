import React from 'react';
import Collapsible from 'react-collapsible';
import CriteriaView from './criteria-view';
import common from 'app/common';

const ProgressBadge = common.components.ProgressBadge;

class OutcomesView extends React.Component {
  getOutcomePercent = outcome => {
    const criteriasWithActivities =
      outcome && outcome.assessment_criteria
        ? outcome.assessment_criteria.filter(
            criteria => criteria.activities && criteria.activities.length > 0
          )
        : [];

    return (
      Math.round(
        (criteriasWithActivities.length /
          (outcome.assessment_criteria
            ? outcome.assessment_criteria.length
            : 1)) *
          100
      ) || 0
    );
  };

  renderOutcomes() {
    const {
      selectedActivityId,
      outcomes,
      titleCallback,
      checkboxCallback,
      removeActivity,
      addActivity,
      getIsCriteriaChecked
    } = this.props;
    let result = <div className="errorMessage">There is nothing to show</div>;

    if (outcomes.length !== 0) {
      result = outcomes.map((outcome, i) => (
        <Collapsible
          key={outcome.outcome_id}
          ref={outcome.outcome_id}
          open={!i}
          trigger={`${i + 1} ${outcome.title}`}
        >
          <ProgressBadge
            percentage={this.getOutcomePercent(outcome)}
            dimensions={50}
            innerMargin={0}
            percentageFontSize={18}
          />
          <CriteriaView
            parentIndex={i}
            criteria={outcome.assessment_criteria}
            outcomeId={outcome.outcome_id}
            selectedActivityId={selectedActivityId}
            titleCallback={titleCallback}
            checkboxCallback={checkboxCallback}
            removeActivity={removeActivity}
            addActivity={addActivity}
            getIsCriteriaChecked={getIsCriteriaChecked}
          />
        </Collapsible>
      ));
    }
    return result;
  }

  render() {
    const { outcomes } = this.props;
    return (
      <div className="outcomes-view">
        {outcomes === undefined ? null : this.renderOutcomes()}
      </div>
    );
  }
}

export default OutcomesView;
