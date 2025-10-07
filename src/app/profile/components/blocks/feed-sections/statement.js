import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';

import common from 'app/common';

const FORM_NAME = 'personal-statement-form';

const {
  Form: { textarea: FormTextArea }
} = common.components;

const StatementForm = ({
  onStatementSave,
  toggleEditStatement,
  handleSubmit
}) => {
  return (
    <form
      method="post"
      className="statement-form-container"
      onSubmit={handleSubmit(onStatementSave)}
    >
      <Field
        name="personal_statement"
        type="textarea"
        component={FormTextArea}
      />
      <div className="align-right">
        <button className="button" type="button" onClick={toggleEditStatement}>
          Cancel
        </button>
        <button className="button is-primary" type="submit">
          Save
        </button>
      </div>
    </form>
  );
};

const StatementView = ({
  hasEditPermissions,
  personal_statement,
  editingStatement,
  toggleEditStatement,
  onStatementSave
}) => {
  return (
    <div className="personal-statement">
      <div className="timeline__title-row">
        <h3 className="timeline__title section-title">Personal statement</h3>
        {hasEditPermissions && (
          <button
            onClick={toggleEditStatement}
            className="button timeline__add-btn"
          >
            <i className="fa fa-pencil" />
            <span className="is-sr">Edit statement</span>
          </button>
        )}
      </div>

      {editingStatement && (
        <ConnectedForm
          {...{
            initialValues: { personal_statement },
            onStatementSave,
            toggleEditStatement
          }}
        />
      )}

      {!editingStatement && (
        <p>
          {!personal_statement ? (
            <span>No personal statement added yet</span>
          ) : (
            <span
              dangerouslySetInnerHTML={{
                __html: personal_statement.replace(/\n\r?/g, '<br />')
              }}
            />
          )}
        </p>
      )}
    </div>
  );
};

StatementView.defaultProps = {
  personal_statement: ''
};

StatementView.propTypes = {
  hasEditPermissions: PropTypes.bool.isRequired,
  personal_statement: PropTypes.string,
  editingStatement: PropTypes.bool.isRequired,
  toggleEditStatement: PropTypes.func.isRequired,
  onStatementSave: PropTypes.func.isRequired
};

const ConnectedForm = reduxForm({ form: FORM_NAME })(StatementForm);

const StatementFormConnected = connect(() => ({}))(StatementView);

export default StatementFormConnected;
