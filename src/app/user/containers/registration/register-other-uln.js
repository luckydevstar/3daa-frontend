import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Creators as Actions } from 'app/user/actions';
import { path } from 'ramda';
import cx from 'classnames';
import config from 'brand/config';

function RegisterOtherUln({ validateUln, validatingUln, router }) {
  const [uln, setUln] = useState('');
  const [lastname, setLastname] = useState('');

  const submit = () => {
    const params = {
      uln,
      lastname
    };
    validateUln(params);
  };

  return (
    <div className="has-text-centered register-other-uln">
      <h1>Please enter your ULN</h1>
      <div>
        You should have been provided this number from your employer or training
        provider.
      </div>
      <div className="inputs-container">
        <input
          type="text"
          className="input"
          placeholder="ULN"
          value={uln}
          onChange={e => setUln(e.target.value)}
        />
        <input
          type="text"
          className="input register-other-uln__lastname"
          placeholder="Last Name"
          value={lastname}
          onChange={e => setLastname(e.target.value)}
        />
      </div>
      <button
        className={cx('button', 'is-primary', { 'is-loading': validatingUln })}
        onClick={submit}
        disabled={!uln || !lastname}
      >
        Next
      </button>
      <hr />
      <h2 className="opensans-regular">Don't have a ULN?</h2>
      <p>
        Contact your employer or training provider and ask them your unique
        learner ULN. They will be able to generate one for you. .
      </p>
      <p className="small-font">
        Your sign in credentails will allow you to get back to this screen in
        the future so don't worry about closing the browser window.
      </p>
    </div>
  );
}

const mapStateToProps = state => ({
  validatingUln: path(['registration', 'validatingUln'], state)
});

const mapDispatchToProps = dispatch => ({
  validateUln: params => dispatch(Actions.validateUlnAttempt(params))
});

export default connect(mapStateToProps, mapDispatchToProps)(RegisterOtherUln);
