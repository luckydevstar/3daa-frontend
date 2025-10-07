import React, { Component } from 'react';
import { Field, reduxForm, FieldArray } from 'redux-form';
import { Label, Text } from 'app/intl';
import classNames from 'classnames';
import common from 'app/common';

const FormField = common.components.Form.field;

const renderFields = ({ fields }) => (
  <div>
    <div>
      <label htmlFor="name">User Name</label>
      <Field
        name="name"
        type="text"
        component={FormField}
        placeholder="Enter User Name"
      />
      <label htmlFor="password">Password</label>
      <Field
        name="password"
        type="password"
        component={FormField}
        placeholder="Enter Password"
      />
    </div>
  </div>
);

const formOpts = {
  form: 'ModalUserConfirm',
  initialValues: { data: [{}] },
  validate: () => {
    const errors = {};
    return errors;
  }
};

class ModalUserConfirm extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      closeModal,
      editMode, // 1: add, 2: delete, 3: edit
      title,
      sendData,
      sendingData,
      handleSubmit,
      pristine,
      submitting
    } = this.props;

    return (
      <div className="modal-content-inner modal-body">
        {/* onSubmit={handleSubmit(values => sendData(values))} */}
        <form>
          <div className="p-10 has-text-centered">
            <h3 className="title is-4">
              <Text
                iKey={
                  editMode == 1
                    ? 'qualification_modal_user_confirm_add_title'
                    : editMode == 2
                      ? 'qualification_modal_user_confirm_delete_title'
                      : 'qualification_modal_user_confirm_unlock_title'
                }
              />
            </h3>
          </div>
          {editMode > 1 && (
            <div className="has-text-centered">
              <h5 className="subtitle">
                <Text
                  iKey={
                    editMode == 2
                      ? 'qualification_modal_user_confirm_delete_subtitle'
                      : 'qualification_modal_user_confirm_unlock_subtitle'
                  }
                />
                &nbsp; {title}
              </h5>
            </div>
          )}
          <div className="has-text-centered">
            <h5 className="subtitle m-b-25">
              <Text iKey="qualification_modal_user_confirm_subtitle" />
            </h5>
          </div>
          <FieldArray {...{ name: 'fields', component: renderFields }} />
          <div className="qualification-footer">
            <div
              onClick={() => closeModal()}
              className="button is-info m-r-20 is-rounded is-outlined"
            >
              Cancel
            </div>
            <button
              type="submit"
              // disabled={!valid}
              disabled={sendingData || (pristine || submitting)}
              className={classNames(
                'button p-l-40 p-r-40',
                'is-success',
                'is-rounded'
              )}
              onClick={() => handleSubmit(null)}
            >
              {editMode == 2 ? 'Delete' : 'Unlock'}
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default reduxForm(formOpts)(ModalUserConfirm);
