import React from 'react';
import classNames from 'classnames';
import { range, map } from 'ramda';
import { Text } from 'app/intl';

const StepPoint = ({ step, label, currentStep, totalSteps, showLabel }) => {
  const cx = classNames('step', {
    filled: step < currentStep,
    current: step === currentStep,
    empty: step > currentStep
  });

  const style = {
    left: `${(100 * (step - 1)) / (totalSteps - 1)}%`
  };

  return (
    <div className={cx} style={style}>
      <div className="point">
        <div className="inner" />
      </div>
      {showLabel && <Text iKey={label} />}
    </div>
  );
};

const UISteps = ({ step, labels, count, padding, width, showLabel }) => {
  const stepArr = range(1, count + 1);
  const style = {};
  if (padding) {
    style.paddingLeft = padding;
    style.paddingRight = padding;
  }
  if (width) style.width = width;

  return (
    <div className="ui-component-steps" style={style}>
      <div className="component-inner">
        <div className="line" />
        {map(
          i => (
            <StepPoint
              key={`step-point-${i}`}
              step={i}
              label={labels[i - 1]}
              currentStep={step}
              totalSteps={count}
              showLabel={showLabel}
            />
          ),
          stepArr
        )}
      </div>
    </div>
  );
};

export default UISteps;
