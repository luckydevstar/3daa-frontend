import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { connect } from 'react-redux';
import { path } from 'ramda';
import { initialize } from 'redux-form';

import { Roles } from 'app/core/config/constants';
import common from 'app/common';

import CommunityModalInviteIqaForm from './community-modal-invite-iqa-form';
import CommunityModalInviteIqaCentre from './community-modal-invite-iqa-centre';
import CommunityModalInviteIqaSummary from './community-modal-invite-iqa-summary';
import CommunityModalInviteIqaResult from './community-modal-invite-iqa-result';

import { Creators as CommunityActions } from '../../../actions';

export const FORM_NAME = 'modalInviteIqa';

const {
  util: {
    helpers: { extractUserRole, extractUserCentre }
  }
} = common;

const CommunityModalInviteIqa = ({
  initializeForm,
  centresSearchLoading,
  centres,
  user,
  formValues,
  inviteCentreMember,
  getAdminCentres,
  inviteCentreMemberReset,
  activeSection
}) => {
  const [step, setStep] = useState(0);
  const [selectedCentre, setSelectedCentre] = useState();

  const removeBackButton = useMemo(() => step <= 0, [step]);
  const centre = useMemo(() => extractUserCentre(user), [user]);
  const userRole = useMemo(() => extractUserRole(user), [user]);
  const isCentreAdmin = useMemo(() => userRole === Roles.CentreAdmin, [
    userRole
  ]);

  const handleBack = useCallback(() => {
    setStep(step - 1);
  }, [step]);

  const handleNext = useCallback(() => {
    setStep(step + 1);
  }, [step]);

  const reset = useCallback(() => {
    setStep(0);
    initializeForm({
      firstName: '',
      lastName: '',
      email: ''
    });
    if (!isCentreAdmin) {
      setSelectedCentre(null);
    }
    inviteCentreMemberReset();
  }, [isCentreAdmin]);

  const invite = useCallback(() => {
    inviteCentreMember({
      centre_role:
        activeSection === 'iqas' ? 'CENTRE_IQA_ROLE' : 'CENTRE_EQA_ROLE',
      centre_id: selectedCentre ? [selectedCentre.centre_id] : [],
      email: formValues.email,
      first_name: formValues.firstName,
      last_name: formValues.lastName
    });
  }, [selectedCentre, formValues]);

  useEffect(() => {
    if (centre && userRole === Roles.CentreAdmin) {
      setSelectedCentre(centre);
    }
  }, [centre, userRole]);

  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  return (
    <div className="modal-invite-iqa">
      {step <= 2 && (
        <div className="title">
          Add an {activeSection === 'iqas' ? `IQA` : 'EQA'}
        </div>
      )}
      <div className="sub-title">
        {step === 0 &&
          `Please add the ${
            activeSection === 'iqas' ? 'IQA' : 'EQA'
          } name and email address`}
        {step === 1 &&
          `Please add a Centre to the ${
            activeSection === 'iqas' ? 'IQA' : 'EQA'
          }`}
        {step === 2 &&
          `Please check if this all is correct before adding the ${
            activeSection === 'iqas' ? 'IQA' : 'EQA'
          }`}
      </div>
      <div
        className="modal-invite-iqa_slides"
        style={{ transform: `translateX(-${step * 100}%)` }}
      >
        <div className="modal-invite-iqa__slide">
          <CommunityModalInviteIqaForm
            {...{
              handleBack,
              handleNext,
              removeBackButton,
              activeSection
            }}
          />
        </div>
        {!isCentreAdmin && (
          <div className="modal-invite-iqa__slide">
            <CommunityModalInviteIqaCentre
              {...{
                handleBack,
                handleNext,
                removeBackButton,
                centres,
                centresSearchLoading,
                selectedCentre,
                getAdminCentres,
                setSelectedCentre
              }}
            />
          </div>
        )}
        <div className="modal-invite-iqa__slide">
          <CommunityModalInviteIqaSummary
            {...{
              reset,
              handleBack,
              handleNext,
              removeBackButton,
              selectedCentre,
              setSelectedCentre,
              invite
            }}
          />
        </div>
        <div className="modal-invite-iqa__slide">
          <CommunityModalInviteIqaResult reset={reset} />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({ form, community, profile }) => ({
  formValues: path([FORM_NAME, 'values'], form),
  centres: path(['centresSearch'], community),
  user: path(['user'], profile),
  centresSearchLoading: path(['centresSearchLoading'], community),
  inviteCentreMemberLoading: path(['inviteCentreMemberLoading'], community),
  inviteCentreMemberSuccess: path(['inviteCentreMemberSuccess'], community)
});

const mapDispatchToProps = dispatch => ({
  initializeForm: data => {
    dispatch(initialize(FORM_NAME, data));
  },
  getAdminCentres: (params = {}) =>
    dispatch(CommunityActions.getAdminCentresAttempt(params)),
  inviteCentreMember: (params = {}) =>
    dispatch(CommunityActions.inviteCentreMemberAttempt(params)),
  inviteCentreMemberReset: () =>
    dispatch(CommunityActions.inviteCentreMemberFailure())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommunityModalInviteIqa);
