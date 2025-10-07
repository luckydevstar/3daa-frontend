// CORE
import React from 'react';
import common from 'app/common';

const InlineEditor = common.components.InlineEditor;

class CreateGuidance extends React.Component {
  handleTitleChange(newTitle) {
    this.props.editOutcomesTitle(newTitle, [
      this.props.outcomeIndex,
      this.props.criteriaIndex,
      this.props.i
    ]);
  }

  render() {
    const { title, outcomeIndex, criteriaIndex, i, removeElement } = this.props;
    return (
      <div className="unit-guidance-row">
        <InlineEditor body={title} callback={e => this.handleTitleChange(e)} />
        <button
          className="button is-danger is-pulled-right editor-remove-guidance-button"
          onClick={() => {
            removeElement([outcomeIndex - 1, criteriaIndex - 1, i]);
          }}
        >
          x
        </button>
      </div>
    );
  }
}

export default CreateGuidance;
