import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { path } from 'ramda';

import CommunityModalInviteIqaFooter from './community-modal-invite-iqa-footer';
import { FORM_NAME } from './index';
import common from 'app/common';

const {
  components: { UISearch, UILoading }
} = common;

const CommunityModalInviteIqaCentre = ({
  handleBack,
  handleNext,
  removeBackButton,
  formValues,
  selectedCentre,
  centres,
  centresSearchLoading,
  getAdminCentres,
  setSelectedCentre
}) => {
  const [showCentresDropdown, setShowCentresDropdown] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    getAdminCentres({ search: searchValue });
  }, [searchValue]);

  return (
    <div className="modal-invite-iqa__centre">
      <div className="modal-invite-iqa__centre__content">
        <div>IQA Selected</div>
        {formValues && (
          <div className="modal-invite-iqa__centre__user mt-2">
            <span>
              {formValues.firstName} {formValues.lastName}
            </span>
            <span className="modal-invite-iqa__centre__user__remove">
              <i className="fa fa-close" />
            </span>
          </div>
        )}
        <hr />
        <div className="modal-invite-iqa__centre__input">
          <label htmlFor="invite-iqa-centre">Add to Centre</label>
          <div className="modal-invite-iqa__centre__input__wrapper">
            <UISearch
              onSearch={setSearchValue}
              placeholder="Type to search"
              onFocus={() => setShowCentresDropdown(true)}
              onBlur={() => {
                setTimeout(() => {
                  setShowCentresDropdown(false);
                }, 500);
              }}
            />
            {centresSearchLoading && <UILoading />}
            {showCentresDropdown && (
              <div className="modal-invite-iqa__centre__input__dropdown">
                {centres.map(centre => (
                  <div
                    key={centre.centre_id}
                    className="modal-invite-iqa__centre__input__dropdown__item"
                    onClick={() => setSelectedCentre(centre)}
                  >
                    {centre.screen_name}
                  </div>
                ))}
              </div>
            )}
          </div>
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
                  onClick={() => setSelectedCentre(null)}
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
        handleNext={handleNext}
        removeBackButton={removeBackButton}
        disableNext={!selectedCentre}
      />
    </div>
  );
};

const mapStateToProps = ({ form }) => ({
  formValues: path([FORM_NAME, 'values'], form)
});

export default connect(mapStateToProps)(CommunityModalInviteIqaCentre);
