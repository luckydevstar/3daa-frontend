// CORE
import React from 'react';

// ADDONS
import Collapsible from 'react-collapsible';

// COMPONENTS
import common from 'app/common';
import CreateCriteria from './unit-create-criteria';
import AddUnitCriteria from './unit-add-criteria';

// COSNT
const InlineEditor = common.components.InlineEditor;

// Create a single outcome node
class CreateOutcome extends React.Component {
  handleTitleChange(newTitle) {
    this.props.editOutcomesTitle(newTitle, [this.props.i]);
  }

  renderCriteria() {
    const criteriaRow = this.props.assessment_criteria.map((object, key) => (
      <CreateCriteria
        removeElement={this.props.removeElement}
        addUnitGuidance={this.props.addUnitGuidance}
        title={object.title}
        outcomeIndex={this.props.i}
        guidance={object.guidance}
        i={key + 1}
        key={key}
        editOutcomesTitle={this.props.editOutcomesTitle}
      />
    ));
    return criteriaRow;
  }

  render() {
    const {
      title,
      removeElement,
      i,
      addUnitCriteria,
      assessment_criteria
    } = this.props;
    return (
      <Collapsible classParentString="units-outcome Collapsible">
        <div className="units-outcome-title">
          <InlineEditor
            body={title}
            prefix={`${i} `}
            callback={e => this.handleTitleChange(e)}
          />
          {/* {title} */}
        </div>
        <button
          className="button is-danger is-pulled-right editor-remove-outcome-button"
          onClick={() => {
            removeElement([i - 1]);
          }}
        >
          Remove outcome
        </button>
        <div>
          {assessment_criteria
            ? this.renderCriteria()
            : 'No criteria added yet'}
          <AddUnitCriteria
            outcomeIndex={i - 1}
            addUnitCriteria={addUnitCriteria}
          />
        </div>
      </Collapsible>
    );
  }
}

export default CreateOutcome;
