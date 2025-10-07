import React from 'react';
// import { connect } from 'react-redux';
// import { path, equals } from 'ramda';
// import { browserHistory } from 'react-router';
// import Portal from 'react-portal';
import common from 'app/common';
// import { Roles } from 'app/core/config/constants';
// import Workbooks from '../components/workbooks';
// import { Creators as WorkbooksCreators } from 'app/workbooks/actions';
// import messagingSection from 'app/messaging';
// import { Creators as ProfileCreators } from 'app/profile/actions';

// import LearnersListModal from '../components/learers-list-modal';

// const MessagesActions = messagingSection.Actions;
// const { util: { helpers: { UserAccess } } } = common;
const Footer = common.components.Footer;
// const { SuperAdmin, SiteAdmin, CentreLearner } = Roles;

class WorkbooksRoute extends React.Component {
  // constructor(props) {
  //   super(props);
  //
  //   this.onModalClose = this.onModalClose.bind(this);
  //   this.onAssessClick = this.onAssessClick.bind(this);
  // }

  // componentDidMount() {
  //   this.checkLearnerID();
  // }

  // componentWillReceiveProps(nextProps) {
  //   const { learnersModalOpen } = this.props;
  //   // Control opening/closing the modal from other components
  //   if (!equals(learnersModalOpen, nextProps.learnersModalOpen)) {
  //     if (nextProps.learnersModalOpen) {
  //       this.learnersListModal.open();
  //     } else {
  //       this.learnersListModal.close();
  //     }
  //   }
  //   // Control the loading of additional user information
  //   this.checkLearnerID(nextProps);
  // }

  // Make sure to update the store
  // to match the modal state when it's closed
  // onModalClose() {
  //   this.props.toggleLearnersModal(false);
  // }

  // onAssessClick(memberID) {
  //   this.props.toggleLearnersModal(false);
  //   browserHistory.push(`/workbooks/assess-workbooks/${memberID}`);
  // }

  // checkLearnerID(nextProps) {
  //   const props = nextProps || this.props;
  //   const { router: { params: { learnerID } }, profile, gettingMember } = props;
  //   const paramID = learnerID && parseInt(learnerID);
  //   const loadedID = profile && profile.member_id;
  //   // Get member if: not currently getting a member,
  //   // there is a valid learnerID in the route and that
  //   // learnerID doesn't equal to an already loaded member id.
  //   if (!gettingMember && paramID && !equals(paramID, loadedID)) {
  //     this.props.getMemberAttempt(learnerID);
  //   }
  // }

  render() {
    const {
      children
      // params,
      // learners,
      // profile,
      // startChat,
      // gettingMember,
      // router: { params: { learnerID } }
    } = this.props;
    // const { onModalClose, onAssessClick } = this;
    // let headerProps;
    const Content = children;

    // workbook preview modal
    // if (children && params && params.unitId) {
    //   Content = <Portal isOpened><div>{children}</div></Portal>;
    // }

    // Define header for assessing learner
    // if (profile && learnerID && !gettingMember) {
    //   headerProps = {
    //     title: `${profile.first_name}'s Bookstand`,
    //     backButtonLink: '/workbooks/assess-workbooks',
    //     expandableButtonProps: {
    //       mainButtonText: 'Assessing Learner',
    //       expandableButtons: [
    //         [
    //           'Assess another Learner',
    //           () => this.props.toggleLearnersModal(true)
    //         ],
    //         [
    //           'View Profile',
    //           () =>
    //             browserHistory.push(`/profile/${profile && profile.member_id}`)
    //         ],
    //         ['Send Message', () => startChat(profile)]
    //       ]
    //     }
    //   };
    // }

    return (
      <div className="workbooks-route-container">

        {/* Header */}
        {/* <UserAccess allowRoles={[SuperAdmin, SiteAdmin, CentreLearner]}>
          <Workbooks.Header {...headerProps} />
        </UserAccess> */}
        {/* Content */}
        {Content}

        <Footer />

        {/* Select a learner modal */}
        {/* <LearnersListModal
          ref={e => {
            this.learnersListModal = e;
          }}
          onClose={onModalClose}
          onAssessClick={onAssessClick}
          learners={learners}
        /> */}

      </div>
    );
  }
}

// const mapStateToProps = state => {
//   return {
//     user: path(['profile', 'user'])(state),
//     learners: path(['community', 'users'])(state),
//     profile: path(['profileBio', 'profile'])(state),
//     gettingMember: path(['profileBio', 'gettingMember'])(state),
//     activeLearnerId: path(['workbooks', 'activeLearnerId'])(state),
//     learnersModalOpen: path(['workbooks', 'learnersModalOpen'])(state)
//   };
// };
//
// const mapDispatchToProps = dispatch => ({
//   getMemberAttempt: id => {
//     dispatch(ProfileCreators.getMemberAttempt(id));
//   },
//   toggleLearnersModal: flag => {
//     dispatch(WorkbooksCreators.toggleLearnersModal(flag));
//   },
//   startChat: member => {
//     dispatch(MessagesActions.startChat(member));
//   }
// });

// export default connect(mapStateToProps, mapDispatchToProps)(WorkbooksRoute);
export default WorkbooksRoute;
