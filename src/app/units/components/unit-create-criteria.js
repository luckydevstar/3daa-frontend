// CORE
import React from 'react';

// COMPONENTS
import common from 'app/common';
import CreateGuidance from './unit-create-guidance';
import Collapsible from 'react-collapsible';
import AddUnitGuidance from './unit-add-guidance';

// COSNT
const InlineEditor = common.components.InlineEditor;

class CreateCriteria extends React.Component {
  handleTitleChange(newTitle) {
    this.props.editOutcomesTitle(newTitle, [
      this.props.outcomeIndex,
      this.props.i
    ]);
  }

  renderGuidance() {
    const guidanceRow = this.props.guidance.map((object, key) => (
      <CreateGuidance
        removeElement={this.props.removeElement}
        title={object}
        outcomeIndex={this.props.outcomeIndex}
        criteriaIndex={this.props.i}
        i={key}
        key={key}
        editOutcomesTitle={this.props.editOutcomesTitle}
      />
    ));
    return guidanceRow;
  }

  render() {
    const {
      addUnitGuidance,
      i,
      outcomeIndex,
      guidance,
      title,
      removeElement
    } = this.props;
    return (
      <Collapsible classParentString="units-criteria Collapsible">
        <div className="units-criteria-title">
          <InlineEditor
            body={title}
            prefix={`${outcomeIndex}.${i}  `}
            callback={e => this.handleTitleChange(e)}
          />
        </div>
        <button
          className="button is-danger is-pulled-right editor-remove-criteria-button"
          onClick={() => {
            removeElement([outcomeIndex - 1, i - 1]);
          }}
        >
          x
        </button>
        <div>
          {guidance && guidance.length !== 0
            ? this.renderGuidance()
            : 'No Guidance yet'}
          <AddUnitGuidance
            outcomeIndex={outcomeIndex}
            criteriaIndex={i}
            addUnitGuidance={addUnitGuidance}
          />
        </div>
      </Collapsible>
    );
  }
}

export default CreateCriteria;
