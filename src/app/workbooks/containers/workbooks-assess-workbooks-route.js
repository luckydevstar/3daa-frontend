import React from 'react';
import { connect } from 'react-redux';
import { path } from 'ramda';
import common from 'app/common';
import { browserHistory } from 'react-router';
import Workbooks from '../components/workbooks';
import { Creators as CommunityCreators } from 'app/community/actions';
import { Creators as WorkbooksCreators } from '../actions';
import { Roles } from 'app/core/config/constants';
import messagingSection from 'app/messaging';

import { Text } from 'app/intl';

const MessagesActions = messagingSection.Actions;
const { components: { EmptyView, UILoading } } = common;
const { Nav } = Workbooks;
const { CentreLearner } = Roles;

class WorkbooksAssessWorkbooksRoute extends React.Component {
  componentDidMount() {
    this.props.communityUsersAttempt();
  }
  componentWillUnmount() {
    // Close modal if it's open
    this.props.toggleLearnersModal(false);
  }

  render() {
    const { children, profile, startChat } = this.props;
    let headerProps;
    let Content;
    let emptyViewProps;

    if (children) {
      if (profile) {
        headerProps = {
          title: `${profile.first_name}'s Bookstand`,
          backButtonLink: '/workbooks/assess-workbooks',
          expandableButtonProps: {
            mainButtonText: 'assessing_learner',
            expandableButtons: [
              [
                <Text iKey="assess_another_learner" />,
                () => this.props.toggleLearnersModal(true)
              ],
              [
                <Text iKey="view_profile" />,
                () =>
                  browserHistory.push(
                    `/profile/${profile && profile.member_id}`
                  )
              ],
              [<Text iKey="send_message" />, () => startChat(profile)]
            ]
          }
        };
      }
      Content = children;
    } else {
      const { attemptingUsersGet, learners, toggleLearnersModal } = this.props;

      // Define EmptyView Props
      if (learners) {
        emptyViewProps = {
          type: 'selectLearner',
          onButtonClick: () => toggleLearnersModal(true)
        };
      } else {
        emptyViewProps = {
          type: 'noLearners'
        };
      }

      Content = (
        <div>
          <Nav tabs={{ 0: 'Assess Learners' }} activeTab={0} />
          <div className="workbooks-assess-workbooks min-content-height-inner align-children-center">
            {attemptingUsersGet
              ? <UILoading />
              : <div>
                  <EmptyView {...emptyViewProps} />
                </div>}
          </div>
        </div>
      );
    }

    return (
      <div>
        <Workbooks.Header {...headerProps} />
        {Content}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    learners: path(['community', 'users'])(state),
    attemptingUsersGet: path(['community', 'attemptingUsersGet'])(state),
    profile: path(['profileBio', 'profile'])(state)
  };
};

const mapDispatchToProps = dispatch => ({
  toggleLearnersModal: flag => {
    dispatch(WorkbooksCreators.toggleLearnersModal(flag));
  },
  communityUsersAttempt: () => {
    dispatch(
      CommunityCreators.communityUsersAttempt('centre', {
        'centre_roles[]': CentreLearner,
        limit: 999999
      })
    );
  },
  startChat: member => {
    dispatch(MessagesActions.startChatAttempt([member], true));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(
  WorkbooksAssessWorkbooksRoute
);
