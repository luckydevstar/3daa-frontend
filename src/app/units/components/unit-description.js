// CORE
import React from 'react';
import { connect } from 'react-redux';

// ADDONS
import { Field, reduxForm, initialize, change } from 'redux-form';
import { Link } from 'react-router';
import Isvg from 'react-inlinesvg';

import IconLock from 'images/icon_lock_1.svg';
import { Label, Text } from 'app/intl';

// COMPONENTS
import TextEditor from '../util/text-editor';
import common from 'app/common';

// CONST

const {
  Form: { field: FormField, checkbox: FormCheckbox }
} = common.components;
const ConvertDraftObjectToHtml = common.components.ConvertDraftObjectToHtml;

const FORM_NAME = 'editUnitDescription';

class UnitDescription extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editMode: false,
      hideClass: 'hidden',
      toggleText: 'Show'
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const { setInitialValues, unit } = this.props;
    setInitialValues({
      reference: unit.reference,
      title: unit.title,
      level: unit.level,
      credit_value: unit.credit_value,
      guided_learning_hours: unit.guided_learning_hours,
      overview: unit.overview,
      status: unit.status
    });
  }

  toggleEditMode() {
    const newMode = !this.state.editMode;
    const buttonClass = newMode ? '' : 'hidden';
    this.setState({
      editMode: newMode,
      hideClass: buttonClass,
      toggleText: 'Show'
    });
  }

  // Unit details togggle controller
  handleClick() {
    const buttonClass = this.state.hideClass === 'hidden' ? '' : 'hidden';
    const text = this.state.toggleText === 'Show' ? 'Hide' : 'Show';
    this.setState({
      hideClass: buttonClass,
      toggleText: text
    });
  }

  handleSubmit(values) {
    this.props.saveChanges(values);
    // Close panel
    this.toggleEditMode();
  }

  render() {
    const { unit, handleSubmit } = this.props;
    const { toggleText, hideClass, editMode } = this.state;
    return (
      <section className="content-section hero">
        <div className="hero-body">
          <form
            className="container"
            onSubmit={handleSubmit(this.handleSubmit)}
          >
            {editMode ? (
              <div className="edit-form">
                <Label iKey="ref_number" htmlFor="reference" />
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

                <Label
                  iKey="guided_learning_hours"
                  htmlFor="guided_learning_hours"
                />
                <Field
                  name="guided_learning_hours"
                  type="text"
                  component={FormField}
                  className="control"
                />
                <Field
                  id="status"
                  name="status"
                  label="Lock?"
                  type="checkbox"
                  component={FormCheckbox}
                />
              </div>
            ) : (
              <div className="media columns">
                <div className="media-left column is-marginless">
                  <Link to="/units" className="back-button" />
                </div>
                <div className="media-right column is-marginless">
                  <h1 className="title">
                    {unit.reference} - {unit.title}
                  </h1>
                  <h2 className="subtitle m-t-20 m-b-0">
                    QCF <Text iKey="level" /> {unit.level} |{' '}
                    <Text iKey="credit_value" /> {unit.credit_value} |{' '}
                    <Text iKey="guided_learning_hours" />{' '}
                    {unit.guided_learning_hours}
                  </h2>
                  <a
                    onClick={() => {
                      this.handleClick();
                    }}
                    id="expand-button"
                  >
                    {toggleText} <Text iKey="full_unit_details" />
                  </a>
                </div>
                {!editMode && (
                  <div className="media-btns column">
                    {unit.status === 0 ? (
                      <a
                        className="button is-info"
                        onClick={() => {
                          this.toggleEditMode();
                        }}
                      >
                        <Text iKey="edit" />
                      </a>
                    ) : (
                      <div className="btn-unlock">
                        <Isvg src={IconLock} /> Unlock Unit
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className={`expandable-text content ${hideClass}`}>
              <h5>
                <Text iKey="overview" />
              </h5>
              {editMode ? (
                <TextEditor
                  initialData={unit.overview}
                  affectThisField="overview"
                  changeFieldValue={this.props.changeFieldValue}
                />
              ) : (
                <ConvertDraftObjectToHtml
                  className="overview"
                  object={unit.overview}
                />
              )}
            </div>

            {editMode && (
              <div className="control is-horizontal edit-btns">
                <button
                  className="button is-danger"
                  onClick={() => {
                    this.toggleEditMode();
                  }}
                >
                  <Text iKey="cancel" />
                </button>
                <button className="button is-success" type="submit">
                  <Text iKey="save" />
                </button>
              </div>
            )}
          </form>
        </div>
      </section>
    );
  }
}

const validate = () => {
  const errors = {};
  return errors;
};

const UnitDescriptionForm = reduxForm({
  form: FORM_NAME,
  validate
})(UnitDescription);

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  // Action to inject data from Ritch text editor to Redux form, passed to TextEditor as a prop
  setInitialValues: data => {
    dispatch(initialize(FORM_NAME, data));
  },
  changeFieldValue(field, value) {
    dispatch(change(FORM_NAME, field, value));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UnitDescriptionForm);
