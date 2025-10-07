import React from 'react';

const QualificationLevel = ({ current_qualification }) => {
  const { sector, level } = current_qualification;
  return (
    <div className="qualification-level is-inline-block semibold">
      <span className="qualification-level__sector">{sector}</span>
      <span className="qualification-level__separator">&nbsp;|&nbsp;</span>
      <span className="qualification-level__level">Level {level}</span>
    </div>
  );
};

export default QualificationLevel;
