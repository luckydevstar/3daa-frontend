import React from 'react';
import CommunityCardItem from './community-card-item';
import { isSelected } from '../helpers';

const CommunityCardView = ({
  users,
  role,
  activeSection,
  canAccessWorkbooks,
  seenByGlobalAdmin,
  seenByTutor,
  seenByMemberId,
  canSeeOthersProgress,
  openChat,
  openGroupChat,
  openDeleteGroupModal,
  openLoginAsMemberModal,
  openGroupModal,
  onRemoveButtonClick,
  onRemoveFromGroupButtonClick,
  onSuspendUser,
  changeActiveSection,
  onAssignEQA,
  showCheckbox,
  onChange,
  selectedItems,
  setCentreID,
  setTutorID,
  attemptingCreateGroupChat
}) => (
  <section className="community-card-view">
    <div className="container">
      <div className="columns">
        {users.map((itemData, i) => (
          <CommunityCardItem
            {...{
              key: i,
              role,
              itemData,
              activeSection,
              canAccessWorkbooks,
              seenByGlobalAdmin,
              seenByTutor,
              seenByMemberId,
              canSeeOthersProgress,
              openChat,
              openDeleteGroupModal,
              openLoginAsMemberModal,
              openGroupModal,
              onRemoveButtonClick,
              onRemoveFromGroupButtonClick,
              onSuspendUser,
              changeActiveSection,
              onAssignEQA,
              showCheckbox,
              selected: isSelected(itemData, selectedItems),
              setCentreID,
              setTutorID,
              openGroupChat,
              attemptingCreateGroupChat
            }}
            onChange={e => onChange(e, itemData)}
          />
        ))}
      </div>
    </div>
  </section>
);

export default CommunityCardView;
