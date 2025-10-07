import React from 'react';
import common from 'app/common';
import { Roles } from 'app/core/config/constants';
import { Link, browserHistory } from 'react-router';
import { Text } from 'app/intl';
import config from 'brand/config';

const {
  components: { ExpandableButton },
  util: {
    helpers: { UserAccess }
  }
} = common;
const {
  SuperAdmin,
  SiteAdmin,
  CentreAdmin,
  CentreTutor,
  Member,
  CentreLearner
} = Roles;

class CommunityHeader extends React.Component {
  constructor(props) {
    super(props);

    this.goBack = this.goBack.bind(this);
  }

  goBack() {
    // browserHistory.replace('/assessment/assessment-progress');
    browserHistory.goBack();
  }

  render() {
    const {
      openInviteModal,
      openInviteIqaModal,
      openFriendModal,
      openGroupModal,
      openDeleteGroupModal,
      openCreateGroupModal,
      activeSection,
      group,
      canEditCurrentGroup,
      openGroupChat
    } = this.props;
    return (
      <section className="content-section hero smaller gray">
        {/* General header */}

        <div className="hero-body">
          {!group && (
            <div className="container community-header">
              <button
                className="back button is-primary is-outlined column m-r-30 flex-none"
                onClick={this.goBack}
              >
                <i className="fa fa-angle-left" />
              </button>
              <h1 className="title">
                <Text iKey="community" />
              </h1>
              <div className="hero-nav">
                {/* {activeSection === 'learners' &&
                  <button
                    onClick={openFriendModal}
                    className="button is-primary is-outlined"
                  >
                    <Text iKey="add_friend" />
                  </button>} */}
                <UserAccess allowRoles={[SuperAdmin, SiteAdmin, CentreAdmin]}>
                  {activeSection === 'iqas' && (
                    <button
                      onClick={openInviteIqaModal}
                      className="button is-primary is-outlined mr-2"
                    >
                      <Text iKey="invite_iqa" />
                    </button>
                  )}
                </UserAccess>
                <UserAccess allowRoles={[SuperAdmin]}>
                  {activeSection === 'eqas' && (
                    <button
                      onClick={openInviteIqaModal}
                      className="button is-primary is-outlined mr-2"
                    >
                      Invite EQA
                    </button>
                  )}
                </UserAccess>
                <UserAccess allowRoles={[SiteAdmin, SuperAdmin]}>
                  {activeSection === 'site-admins' && (
                    <button
                      onClick={openInviteModal}
                      className="button is-primary is-outlined"
                    >
                      <Text iKey="invite_site_admin" />
                    </button>
                  )}
                </UserAccess>
                <UserAccess allowRoles={[SuperAdmin]}>
                  {activeSection === 'super-admins' && (
                    <button
                      onClick={openInviteModal}
                      className="button is-primary is-outlined"
                    >
                      <Text iKey="invite_super_admin" />
                    </button>
                  )}
                </UserAccess>
                <UserAccess allowRoles={[SiteAdmin, SuperAdmin, CentreAdmin]}>
                  {activeSection === 'centre-admins' && (
                    <button
                      onClick={openInviteModal}
                      className="button is-primary is-outlined"
                    >
                      Create Centre
                    </button>
                  )}
                </UserAccess>
                <UserAccess
                  allowRoles={[SiteAdmin, SuperAdmin, CentreAdmin, CentreTutor]}
                >
                  {activeSection === 'centre-tutors' && (
                    <button
                      onClick={openInviteModal}
                      className="button is-primary is-outlined"
                    >
                      Invite Tutor
                    </button>
                  )}
                </UserAccess>
                {/* <UserAccess
                  // allowRoles={[SiteAdmin, SuperAdmin, CentreAdmin, CentreTutor]}
                  allowRoles={[CentreAdmin]}
                >
                  {activeSection === 'learners' && (
                    <button
                      onClick={openInviteModal}
                      className="button is-primary is-outlined"
                    >
                      <Text iKey="Invite Learner" />
                    </button>
                  )}
                </UserAccess> */}
                <UserAccess allowRoles={[CentreAdmin, CentreTutor]}>
                  {activeSection === 'groups' && (
                    <button
                      onClick={() => {
                        openGroupModal(group, 'Create group');
                      }}
                      className="button is-primary is-outlined"
                    >
                      Create Group
                    </button>
                  )}
                </UserAccess>
              </div>
            </div>
          )}

          {/* Inside group header */}

          {group && (
            <div className="container">
              <div className="media">
                <div className="media-left">
                  <Link className="back-button" to="/community/groups" />
                </div>
                <div className="media-right">
                  <h1 className="title">{group.title}</h1>
                  <h2 className="subtitle">
                    {group.member_count}{' '}
                    {`member${group.member_count === 1 ? '' : 's'}`}
                    {group.learner_count
                      ? `, ${group.learner_count} seat${
                          group.learner_count === 1 ? '' : 's'
                        }`
                      : null}
                  </h2>
                  {canEditCurrentGroup && (
                    <div className="hero-nav">
                      <ExpandableButton
                        expandableButtons={[
                          [
                            <Text iKey="remove_group" />,
                            () => openDeleteGroupModal(group.group_id)
                          ],
                          [
                            <Text iKey="edit_group" />,
                            () => {
                              openGroupModal(group, 'Create group');
                            }
                          ],
                          [
                            <Text iKey="group_message" />,
                            () => openGroupChat(group)
                          ]
                        ]}
                        mainButtonText={'manage_group'}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    );
  }
}

// const CommunityHeader = ({
//   openInviteModal,
//   openFriendModal,
//   openGroupModal,
//   openDeleteGroupModal,
//   activeSection,
//   group,
//   canEditCurrentGroup
// }) => {

// };

export default CommunityHeader;
