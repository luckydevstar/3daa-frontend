import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, initialize } from 'redux-form';
import common from 'app/common';
import user from 'app/user';

const FormField = common.components.Form.field;
const FormUtil = user.util.FormUtil;

class LinkForm extends React.Component {
  componentDidMount() {
    this.props.setInitialValues(this.props.initialValues);
  }
  render() {
    return (
      <div>
        <form>
          <label htmlFor="text">Link text</label>
          <Field
            name="text"
            type="text"
            placeholder="Leave blank if you want to display plain link"
            component={FormField}
            inputClassName="input"
          />
          <label htmlFor="url">Link URL</label>
          <Field
            name="url"
            type="text"
            placeholder="Paste your url here"
            component={FormField}
            inputClassName="input"
          />
        </form>
        <div
          className="button is-success"
          onClick={this.props.handleSubmit}
          type="submit"
        >
          Submit
        </div>
      </div>
    );
  }
}

const validate = values => {
  const errors = {};

  FormUtil.validate(values, errors, 'url')
    .url()
    .required();

  return errors;
};

LinkForm = reduxForm({
  form: 'LinkForm',
  validate
})(LinkForm);

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  setInitialValues: data => {
    dispatch(initialize('LinkForm', data));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LinkForm);
