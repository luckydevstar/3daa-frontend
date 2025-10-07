import React from 'react';
import { Field, reduxForm, FieldArray } from 'redux-form';
import common from 'app/common';

const FormField = common.components.Form.field;

const renderInvites = ({ fields }) => (
  <div className="body">
    {fields.map((data, i) => (
      <div key={`inviteForm${data}`}>
        <div>
          <Field
            name={`${data}.name`}
            type="text"
            component={FormField}
            placeholder="Name"
          />
          <Field
            name={`${data}.email`}
            type="text"
            component={FormField}
            placeholder="Email"
          />
        </div>
        {fields.length > 1 ? (
          <button
            type="button"
            className="button is-outlined remove"
            onClick={() => fields.remove(i)}
          >
            Remove
          </button>
        ) : null}
      </div>
    ))}
    <hr />
  </div>
);

const formOpts = {
  form: 'communityModalInvite1',
  initialValues: { invites: [{}] },
  validate: () => {
    const errors = {};
    return errors;
  }
};

const CommunityModalInvite1 = ({
  sendInvites,
  attemptingInvite,
  handleSubmit,
  pristine,
  submitting
}) => (
  <div>
    <form onSubmit={handleSubmit(values => sendInvites(values))}>
      <h3 className="m-b-25">Invite User</h3>
      <FieldArray {...{ name: 'invites', component: renderInvites }} />
      <div className="has-text-right">
        <button
          type="submit"
          disabled={attemptingInvite || (pristine || submitting)}
          className={`button is-primary btn-send ${attemptingInvite &&
            'is-loading'}`}
        >
          Send
        </button>
      </div>
    </form>
  </div>
);

export default reduxForm(formOpts)(CommunityModalInvite1);
