import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import common from 'app/common';

import FrontView from './community-card-item-front';
import BackView from './community-card-item-back';
import { Creators as WorkbookActions } from 'app/workbooks/actions';
import { Creators as AssessmentActions } from 'app/assessment/actions';

const { UIFlipper } = common.components;

class CommunityCardItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      touched: false,
      flipped: false
    };
  }
  render() {
    const {
      itemData,
      dispatch,
      activeSection,
      canAccessWorkbooks,
      seenByGlobalAdmin,
      seenByTutor,
      seenByMemberId,
      canSeeOthersProgress,
      openChat,
      openGroupChat,
      assignEQA,
      openDeleteGroupModal,
      openLoginAsMemberModal,
      openGroupModal,
      role,
      onRemoveButtonClick,
      onRemoveFromGroupButtonClick,
      onSuspendUser,
      changeActiveSection,
      onAssignEQA,
      showCheckbox,
      selected,
      onChange,
      setCentreID,
      setTutorID,
      setAssessmentMember,
      setAssessWorkbooksActiveLearnerId,
      attemptingCreateGroupChat
    } = this.props;

    const { touched, flipped } = this.state;

    return (
      <div
        className={classNames('column', 'community-card-item', {
          'community-card-item__eqa':
            activeSection === 'eqas' || activeSection === 'iqas'
        })}
      >
        <div
          className={classNames('hover-capture', { touched, flipped })}
          onClick={() => this.setState({ touched: !touched })}
        >
          <UIFlipper
            front={
              <FrontView
                {...{
                  itemData,
                  dispatch,
                  activeSection,
                  canAccessWorkbooks,
                  seenByGlobalAdmin,
                  seenByTutor,
                  seenByMemberId,
                  canSeeOthersProgress,
                  openChat,
                  openGroupChat,
                  assignEQA,
                  openDeleteGroupModal,
                  openLoginAsMemberModal,
                  openGroupModal,
                  role,
                  onRemoveButtonClick,
                  onRemoveFromGroupButtonClick,
                  onSuspendUser,
                  changeActiveSection,
                  onAssignEQA,
                  showCheckbox,
                  selected,
                  onChange,
                  setCentreID,
                  setTutorID,
                  setAssessmentMember,
                  setAssessWorkbooksActiveLearnerId,
                  attemptingCreateGroupChat
                }}
              />
            }
            back={
              <BackView
                {...{
                  itemData,
                  activeSection
                }}
              />
            }
          />
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  setAssessmentMember: member =>
    dispatch(AssessmentActions.setAssessmentMember(member)),
  setAssessWorkbooksActiveLearnerId: member_id =>
    dispatch(WorkbookActions.setAssessWorkbooksActiveLearnerId(member_id))
});

export default connect(null, mapDispatchToProps)(CommunityCardItem);
