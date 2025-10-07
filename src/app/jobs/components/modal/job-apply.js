import React from 'react';
import classNames from 'classnames';
import { Text } from 'app/intl';

const JobApply = ({ loading, applyClick }) => (
  <div className="job-apply">
    <h1 className="title">
      <Text iKey="apply_now" />
    </h1>
    <p className="subtitle">
      You are applying for: Bar & Waiting Staff Skills Wanted | The lvy Market
      Grill
    </p>
    <div className="columns detail">
      <div className="column is-4">
        <div className="picture" />
      </div>
      <div className="column is-8">
        <h3 className="summary-head">
          <Text iKey="job_summary" />:
        </h3>

        <div className="summary">
          <span className="tt">Job Title:</span>
          <span className="cc">
            Bar & Waiting Staff Skills Wanted | Customer Assistant
          </span>
        </div>

        <div className="summary">
          <span className="tt">Company:</span>
          <span className="cc">Job Dictionary</span>
        </div>

        <div className="summary">
          <span className="tt">Location:</span>
          <span className="cc">Edinburgh, Scotland</span>
        </div>

        <div className="summary">
          <span className="tt">Job Type:</span>
          <span className="cc">Full time/Permanent</span>
        </div>

        <div className="summary">
          <span className="tt">Salay:</span>
          <span className="cc">
            275.00 - 575.00£ per week <br /> OTE + Bonuses
          </span>
        </div>
      </div>
    </div>
    <div className="agree">
      <label className="custom checkbox">
        <input type="checkbox" />
        <span className="ui" />I have read and agree to these Terms and Use
      </label>
    </div>
    <div className="buttons">
      <button
        className={classNames('button is-primary is-large apply-btn', {
          'is-loading': loading
        })}
        onClick={applyClick}
      >
        <Text iKey="apply_now" />
      </button>
    </div>
  </div>
);

export default JobApply;
