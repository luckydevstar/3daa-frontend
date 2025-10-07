import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { equals } from 'ramda';
import QualificationDetails from '../workbooks/workbooks-qualification-details';
import common from 'app/common';

const {
  components: { ContentModalNew }
} = common;

class PathwaysModal extends Component {
  constructor() {
    super();
    this.state = {
      pathwayName: ''
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!equals(nextProps.currentPathway, this.state.pathwayName)) {
      this.setState({ pathwayName: nextProps.currentPathway });
    }
  }

  open() {
    this.setState({ pathwayName: this.props.currentPathway || '' }, () =>
      this.modal.open()
    );
  }
  close() {
    this.modal.close();
  }

  render() {
    const {
      qualificationName,
      mandatory,
      optional,
      modalType,
      assignedGroups,
      callback
    } = this.props;
    const title =
      modalType === 'create' ? 'Create New Pathway' : 'Edit Pathway';
    const subtitle =
      modalType === 'create'
        ? 'Please provide a new pathway name for this qualification'
        : 'Change the pathway name for this qualification';
    const saveButton = modalType === 'create' ? 'Create Pathway' : 'Save';

    return (
      <ContentModalNew
        ref={e => {
          this.modal = e;
        }}
        className="pathways-modal"
      >
        <h1>{title}</h1>
        <h3>{subtitle}</h3>
        <QualificationDetails {...{ mandatory, optional, qualificationName }} />
        {assignedGroups && (
          <div className="groups">{`${assignedGroups} Assigned Groups`}</div>
        )}
        <div className="field">
          <label htmlFor="pathway" className="label">
            Pathway name
          </label>
          <p className="control">
            <input
              className="input"
              name="pathway"
              type="text"
              value={this.state.pathwayName}
              onChange={e => this.setState({ pathwayName: e.target.value })}
            />
          </p>
        </div>
        <div className="controls">
          <div
            onClick={() => this.close()}
            className="button is-primary is-outlined"
          >
            Cancel
          </div>
          <div
            onClick={() => callback(this.state.pathwayName)}
            className="button is-primary"
          >
            {saveButton}
          </div>
        </div>
      </ContentModalNew>
    );
  }
}

PathwaysModal.defaultProps = {
  modalType: 'create',
  assignedGroups: null,
  mandatory: null,
  optional: null,
  qualificationName: 'There is no qualification data.',
  currentPathway: ''
};

PathwaysModal.propTypes = {
  modalType: PropTypes.oneOf(['create', 'edit']),
  assignedGroups: PropTypes.number,
  mandatory: PropTypes.number,
  optional: PropTypes.number,
  qualificationName: PropTypes.string,
  currentPathway: PropTypes.string,
  callback: PropTypes.func.isRequired
};

export default PathwaysModal;
