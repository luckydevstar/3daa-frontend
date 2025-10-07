import React from 'react';
import PropTypes from 'prop-types';
import { Roles } from 'app/core/config/constants';
import { equals } from 'ramda';
import { Text } from 'app/intl';

const { CentreLearner } = Roles;

const WorkbooksEmptyBookstand = ({
  role,
  loading,
  searchPhrase,
  centreEmail
}) => {
  let title = <Text iKey="no_workbooks_yet" />;
  if (loading) {
    title = <Text iKey="loading_workbooks" />;
  } else if (searchPhrase) {
    title = <Text iKey="no_workbooks_found_for" vals={[searchPhrase]} />;
  }

  return (
    <div className="workbooks-empty-bookstand columns is-multiline">
      <div className="column is-6-desktop is-12-tablet">
        <h2 className="is-1">{title}</h2>
        {!loading &&
          !searchPhrase &&
          equals(CentreLearner, role) && (
            <p>
              A Training Centre is yet to assign workbooks to this user. Please
              check back soon.
            </p>
          )}
      </div>
      <div className="column is-6-desktop is-hidden-touch">
        <div className="blank-workbook blank-workbook-small">
          <div className="workbook-icon" />
          <div className="line-wrapper">
            <div className="line" />
            <div className="line line-short" />
          </div>
        </div>
        <div className="blank-workbook blank-workbook-medium">
          <div className="workbook-icon" />
          <div className="line-wrapper">
            <div className="line" />
            <div className="line line-short" />
          </div>
        </div>
        <div className="blank-workbook blank-workbook-big">
          <div className="workbook-icon" />
          <div className="line-wrapper">
            <div className="line" />
            <div className="line line-short" />
          </div>
          {!loading &&
            !searchPhrase &&
            equals(CentreLearner, role) && (
              <a
                className="button is-primary-color"
                href={`mailto:${centreEmail}`}
              >
                Contact Centre
              </a>
            )}
        </div>
      </div>
    </div>
  );
};

WorkbooksEmptyBookstand.propTypes = {
  role: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  searchPhrase: PropTypes.string,
  centreEmail: PropTypes.string
};

WorkbooksEmptyBookstand.defaultProps = {
  loading: false,
  searchPhrase: '',
  centreEmail: null
};

export default WorkbooksEmptyBookstand;
