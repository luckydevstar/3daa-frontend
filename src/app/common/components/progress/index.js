import React from 'react';

const Progress = ({ percent }) => (
  <div className="radial-progress" data-progress={percent}>
    <div className="circle">
      <div className="mask full">
        <div className="fill" />
      </div>
      <div className="mask half">
        <div className="fill" />
        <div className="fill fix" />
      </div>
    </div>
    <div className="inset">
      <div className="percentage">
        <div className="numbers">
          <span>{Math.round(percent)}%</span>
        </div>
      </div>
    </div>
  </div>
);

export default Progress;
