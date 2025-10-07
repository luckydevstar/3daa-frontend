/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "ReactDOM" }] */
// TODO SUBMIT ERROR HANDLING
// CORE
import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

// ADDONS
import { Field, reduxForm, change } from 'redux-form';
// import { Editor, EditorState, convertFromRaw } from 'draft-js';
// import { stateToHTML } from 'draft-js-export-html';
import { Label, Text } from 'app/intl';

// COMPONENTS
import util from 'app/user/util/';
import common from 'app/common';
import TextEditor from '../util/text-editor';

// CONST
const FormField = common.components.Form.field;
const { FormUtil } = util;
const FORM_NAME = 'addUnit';

class AddUnit extends React.Component {
  render() {
    return (
      <form
        className="unit-add section"
        onSubmit={this.props.handleSubmit(this.props.handleConfirm)}
      >
        <Label iKey="reference" htmlFor="reference" />
        <Field
          name="reference"
          type="text"
          component={FormField}
          className="control"
        />

        <Label iKey="title" htmlFor="title" />
        <Field
          name="title"
          type="text"
          component={FormField}
          className="control"
        />

        <label htmlFor="level">
          QCF <Text iKey="level" />
        </label>
        <Field
          name="level"
          type="text"
          component={FormField}
          className="control"
        />

        <Label iKey="credit_value" htmlFor="credit_value" />
        <Field
          name="credit_value"
          type="text"
          component={FormField}
          className="control"
        />

        <Label iKey="guided_learning_hours" htmlFor="guided_learning_hours" />
        <Field
          name="guided_learning_hours"
          type="text"
          component={FormField}
          className="control"
        />

        <Label iKey="overview" htmlFor="overview" />
        <TextEditor
          affectThisField="overview"
          changeFieldValue={this.props.changeFieldValue}
        />

        <button className="button" onClick={this.props.closePanel}>
          <Text iKey="close" />
        </button>
        <button
          className="button is-success is-pulled-right"
          type="submit"
          disabled={this.props.invalid || this.props.submitting}
        >
          <Text iKey="submit" />
        </button>
      </form>
    );
  }
}

// Valdiation rules
const validate = values => {
  const errors = {};
  FormUtil.validate(values, errors, 'reference').required();
  FormUtil.validate(values, errors, 'level').numbersOnly().required();
  FormUtil.validate(values, errors, 'credit_value').numbersOnly().required();
  FormUtil.validate(values, errors, 'title').required();
  // FormUtil.validate(values, errors, 'overview').required();
  FormUtil.validate(values, errors, 'guided_learning_hours')
    .numbersOnly()
    .required();

  return errors;
};

const AddUnitForm = reduxForm({
  form: FORM_NAME,
  validate
})(AddUnit);

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  // Action to inject data from Ritch text editor to Redux form, passed to TextEditor as a prop
  changeFieldValue(field, value) {
    dispatch(change(FORM_NAME, field, value));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(AddUnitForm);
