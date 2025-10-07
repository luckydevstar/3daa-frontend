import React from 'react';

const RenderCriteria = props => {
  const { criteria, parentIndex } = props;
  return (
    <div className="criteria-box">
      {criteria ? (
        criteria.map((criterium, key) => (
          <div key={key} className="criteria">{`${parentIndex}.${key + 1} ${
            criterium.title
          }`}</div>
        ))
      ) : (
        <div>There is no criteria</div>
      )}
    </div>
  );
};

export default RenderCriteria;
