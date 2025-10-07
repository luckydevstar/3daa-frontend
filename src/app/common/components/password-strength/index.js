import React from 'react';
import * as lodash from 'lodash';
import { passwordStrengthChecker } from '../../util/form-utils';

const PasswordStrength = ({ password }) => {
  let progressText = `${passwordStrengthChecker(password)}`;
  const progressClass = `pw-${progressText}`;
  const progressWidth = Math.min(
    100,
    Math.floor((lodash.size(password) / 32) * 100)
  );
  if (progressText == 'strong' && progressWidth > 90)
    progressText = 'very strong';

  return (
    <div className="pw-strength-progress m-b-15">
      <div className="pw-strength-progress-label">Password Strength:</div>
      <div className="progress">
        <div
          className={`progress-bar ${progressClass}`}
          style={{ width: `${progressWidth}%` }}
        >
          <span className="password-verdict">{progressText}</span>
        </div>
      </div>
    </div>
  );
};

export default PasswordStrength;
