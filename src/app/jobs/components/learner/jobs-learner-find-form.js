import React from 'react';
import { Field } from 'redux-form';
import cx from 'classnames';
import common from 'app/common';

const {
  components: {
    Form: { field, FormDropdown }
  }
} = common;

const JobsLearnerFindForm = ({
  pristine,
  handleSubmit,
  submitting,
  uiLoadingJobs,
  toggleMoreView,
  isMoreView,
  user
}) => (
  <form onSubmit={handleSubmit}>
    <div className="columns">
      <div className="column is-5">
        <label className="label" htmlFor="what">
          What
        </label>
        <Field
          name="what"
          component={field}
          placeholder="Job title, keywords or company"
        />
      </div>
      <div className="column is-5">
        <label className="label" htmlFor="where">
          Where
        </label>
        <Field name="where" placeholder="City or postcode" component={field} />
      </div>
      <div className="column is-2">
        <button
          className={cx('button is-primary m-t-25', {
            'is-loading': uiLoadingJobs
          })}
          disabled={pristine || submitting}
        >
          Find Jobs
        </button>
      </div>
    </div>
    {isMoreView && (
      <div className="columns">
        <div className="column is-5">
          <label className="label" htmlFor="secter">
            Secter
          </label>
          {user && user.sectors && (
            <Field
              name="sector"
              list={user.sectors.map(sector => ({
                key: sector.sector_id.toString(),
                name: sector.title
              }))}
              component={FormDropdown}
            />
          )}
        </div>
        <div className="column is-5">
          <label className="label" htmlFor="contractType">
            Contract Type
          </label>
          <Field
            name="contractType"
            defaultTxt="Any Type"
            list={[{ key: '3', name: 'Apprenticeship' }]}
            component={FormDropdown}
          />
        </div>
      </div>
    )}
    <div className="options">
      {isMoreView ? (
        <span className="btn-toggle" onClick={toggleMoreView}>
          Fewer Options <i className="fa fa-angle-up" />
        </span>
      ) : (
        <span className="btn-toggle" onClick={toggleMoreView}>
          More Options <i className="fa fa-angle-down" />
        </span>
      )}
    </div>
  </form>
);

export const validate = () => {
  const errors = {};
  return errors;
};

export default JobsLearnerFindForm;
