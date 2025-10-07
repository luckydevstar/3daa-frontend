import React, { useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import { path } from 'ramda';

import CommunityModalInviteIqaFooter from './community-modal-invite-iqa-footer';
import { FORM_NAME } from './index';

const CommunityModalInviteIqaSummary = ({
  reset,
  handleBack,
  handleNext,
  inviteCentreMemberLoading,
  inviteCentreMemberSuccess,
  removeBackButton,
  formValues,
  selectedCentre,
  setSelectedCentre,
  invite
}) => {
  const removeSelectedCentre = useCallback(() => {
    setSelectedCentre(null);
    handleBack();
  }, [selectedCentre]);

  useEffect(() => {
    if (inviteCentreMemberSuccess) {
      handleNext();
    }
  }, [inviteCentreMemberSuccess]);

  return (
    <div className="modal-invite-iqa__summary">
      <div className="modal-invite-iqa__summary__content">
        <div>
          <div>IQA Selected</div>
          {formValues && (
            <div className="modal-invite-iqa__centre__user mt-2">
              <span>
                {formValues.firstName} {formValues.lastName}
              </span>
              <span
                className="modal-invite-iqa__centre__user__remove"
                onClick={reset}
              >
                <i className="fa fa-close" />
              </span>
            </div>
          )}
        </div>
        {selectedCentre && (
          <div className="modal-invite-iqa__centre__selected">
            <div>Centre Selected</div>
            <div className="modal-invite-iqa__centre__selected__tag">
              <div className="modal-invite-iqa__centre__user">
                <span>
                  {selectedCentre.screen_name || selectedCentre.centre_name}
                </span>
                <span
                  className="modal-invite-iqa__centre__user__remove"
                  onClick={removeSelectedCentre}
                >
                  <i className="fa fa-close" />
                </span>
              </div>
              <div className="modal-invite-iqa__centre__selected__avatar">
                <img src={selectedCentre.logo} alt="centre logo" width="200" />
              </div>
            </div>
          </div>
        )}
      </div>
      <CommunityModalInviteIqaFooter
        handleBack={handleBack}
        handleNext={invite}
        removeBackButton={removeBackButton}
        loading={inviteCentreMemberLoading}
      />
    </div>
  );
};

const mapStateToProps = ({ form, community }) => ({
  formValues: path([FORM_NAME, 'values'], form),
  inviteCentreMemberLoading: path(['inviteCentreMemberLoading'], community),
  inviteCentreMemberSuccess: path(['inviteCentreMemberSuccess'], community)
});

export default connect(mapStateToProps)(CommunityModalInviteIqaSummary);
