import React from 'react';
import common from 'app/common';
import { Statement, Timeline, BioForm } from './feed-sections';

const { components: { ContentModalNew } } = common;

const Feed = ({
  bio,
  hasEditPermissions,
  profile,
  addingBio,
  editingStatement,
  editingBio,
  editingBio: { member_bio_id },
  editingMemberBio,
  postingMemberBio,
  toggleNewBio,
  toggleEditBio,
  toggleEditStatement,
  onBioAdd,
  onBioEdit,
  onBioDelete,
  onStatementSave
}) => {
  return (
    <div className="profile-section">
      <h3 className="profile-title">My CV</h3>

      {profile &&
        <Statement
          {...{
            hasEditPermissions,
            editingStatement,
            toggleEditStatement,
            personal_statement:
              profile.personal_statement &&
                profile.personal_statement.toString(),
            onStatementSave: data => {
              toggleEditStatement();
              return onStatementSave({
                member_id: profile.member_id,
                form: data
              });
            }
          }}
        />}

      <Timeline
        {...{
          hasEditPermissions,
          bio,
          toggleNewBio,
          toggleEditBio,
          onBioDelete
        }}
      />

      <ContentModalNew isOpened={!!addingBio} onClose={toggleNewBio}>
        <BioForm
          {...{
            action: 'add',
            type: addingBio.type,
            postingMemberBio,
            onCancel: toggleNewBio,
            onSave: form => onBioAdd({ member_id: profile.member_id, form })
          }}
        />
      </ContentModalNew>

      <ContentModalNew isOpened={!!editingBio} onClose={toggleEditBio}>
        <BioForm
          {...{
            action: 'edit',
            type: editingBio.type,
            bio: editingBio,
            editingMemberBio,
            onCancel: toggleEditBio,
            onSave: form =>
              onBioEdit({ member_id: profile.member_id, member_bio_id, form })
          }}
        />
      </ContentModalNew>
    </div>
  );
};

export default Feed;
