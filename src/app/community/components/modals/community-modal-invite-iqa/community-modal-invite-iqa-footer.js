import React from 'react';
import cx from 'classnames';

const CommunityModalInviteIqaFooter = ({
  removeBackButton,
  handleBack,
  handleNext,
  disableNext,
  loading
}) => (
  <div className="modal-invite-iqa__footer">
    <div>
      {!removeBackButton && (
        <div className="modal-invite-iqa__footer__back" onClick={handleBack}>
          <i className="fa fa-chevron-left" />
          <div>Back</div>
        </div>
      )}
    </div>
    <button
      type="sumbit"
      className={cx('button', 'is-primary', {
        'is-loading': loading
      })}
      onClick={handleNext}
      disabled={disableNext}
    >
      Next
    </button>
  </div>
);

export default CommunityModalInviteIqaFooter;
