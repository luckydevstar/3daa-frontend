import React from 'react';
import PropTypes from 'prop-types';
import LearnerRow from './learner-row';

const LearnersList = ({ learners, onAssessClick }) => {
  return (
    <table className="users-table">
      <thead className="users-table-header">
        <tr>
          <th />
          <th>Profile Name</th>
          <th>Sector</th>
          <th>Progress</th>
          <th>Qualification</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody className="users-table-body">
        {learners &&
          learners.map(learner =>
            <LearnerRow
              key={learner.member_id}
              learner={learner}
              {...{ onAssessClick }}
            />
          )}
      </tbody>
    </table>
  );
};

LearnersList.propTypes = {
  learners: PropTypes.array
};

LearnersList.defaultProps = {
  learners: null
};

export default LearnersList;
