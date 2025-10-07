import React from 'react';
import { Text } from 'app/intl';

const JobApplyDone = ({ closeApplyDoneModal }) => (
  <div className="job-apply-done">
    <h1 className="title">Done!</h1>
    <p className="subtitle">
      Your application has been sent and someone from The lvy Grill will be in
      touch shortly
    </p>
    <p className="desc">
      While you're waiting to hear back, why don't you brush up on your
      interview skills. Take a look at the video, it can give you some great
      tips for when you meet. <b>Good luck Louise.</b>
    </p>
    <div className="videos">
      <div className="video" />
    </div>
    <div className="buttons">
      <button
        className="button is-primary is-outlined is-large close-apply"
        onClick={closeApplyDoneModal}
      >
        <Text iKey="close" />
      </button>
    </div>
  </div>
);

export default JobApplyDone;
