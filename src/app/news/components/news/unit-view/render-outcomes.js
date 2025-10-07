import React from 'react';
import Collapsible from 'react-collapsible';
import RenderCriteria from './render-criteria';

const RenderOutcomes = props => {
  const { outcomes } = props;

  return (
    <div className="outcomes">
      {outcomes ? (
        outcomes.map((outcome, key) => (
          <Collapsible key={key} trigger={`${key + 1} ${outcome.title}`}>
            <RenderCriteria
              parentIndex={key + 1}
              criteria={outcome.assessment_criteria}
            />
          </Collapsible>
        ))
      ) : (
        <div>There is no outcomes</div>
      )}
    </div>
  );
};

export default RenderOutcomes;
