import React from 'react';

import RenderOutcomes from './render-outcomes';

const Outcomes = props => {
  return (
    <div className="page-basic">
      <RenderOutcomes outcomes={props.outcomes} />
    </div>
  );
};

export default Outcomes;
