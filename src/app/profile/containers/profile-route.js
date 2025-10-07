import React from 'react';
import { connect } from 'react-redux';
import { prop, defaultTo } from 'ramda';
import * as lodash from 'lodash';

import common from 'app/common';
import { Creators } from '../actions';

import { Header, CvPreviewModal } from '../components';
import { ProfileBody } from '../containers';
import navTabs from '../config/navs';

const {
  components: { Footer, UINavigation, ContentModal }
} = common;

class ProfileRoute extends React.Component {
  constructor(props) {
    super(props);

    this.openCvPreviewModal = this.openCvPreviewModal.bind(this);
  }

  componentDidMount() {
    const { isLoggedInUser, memberId } = this.props;
    this.props.attemptGetMember();
    this.props.attemptGetMemberBio();
    this.props.attemptGetMemberReference();
    this.props.getMemberMedia();
    this.props.attemptGetMemberPhotos();
    this.props.attemptGetMemberVideos();
    this.props.attemptGetMemberBadge();
    this.props.attemptGetMemberCv();

    if (isLoggedInUser) {
      this.props.attemptGetMemberCommunity();
    } else {
      this.props.attemptGetMemberMutualConnections(memberId);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { memberId } = nextProps;

    if (this.props.memberId !== memberId) {
      this.props.attemptGetMember(memberId);
      this.props.attemptGetMemberBio(memberId);
      this.props.attemptGetMemberReference(memberId);
      this.props.getMemberMedia(memberId);
      this.props.attemptGetMemberPhotos(memberId);
      this.props.attemptGetMemberVideos(memberId);
      this.props.attemptGetMemberBadge(memberId);
      this.props.attemptGetMemberCv(memberId);

      if (isLoggedInUser) {
        this.props.attemptGetMemberCommunity();
      } else {
        this.props.attemptGetMemberMutualConnections(memberId);
      }
    }
  }

  openCvPreviewModal() {
    this.cvPreviewModal.open();
  }

  render() {
    const {
      profile,
      coverPhotos,
      location,
      gettingPhotos,
      memberId,
      isLoggedInUser,
      activeTab
    } = this.props;

    const tabs = navTabs.map(tab => ({
      ...tab,
      url: `/profile/${memberId}${tab.url}`
    }));

    const prevPath = lodash.get(location, 'state.prevPath');

    return (
      <div className="profile-container">
        <Header
          profile={profile}
          prevPath={prevPath}
          gettingPhotos={gettingPhotos}
          coverPhotos={coverPhotos}
          openCvPreviewModal={this.openCvPreviewModal}
        />

        <section className="content-section navigation-section">
          <div className="container">
            <div className="columns">
              <div className="column is-one-quarter" />
              <div className="column">
                <UINavigation
                  active={activeTab || 'profile'}
                  tabs={tabs}
                  showSearch={false}
                />
              </div>
            </div>
          </div>
        </section>

        <ProfileBody {...{ memberId, isLoggedInUser, activeTab }} />

        {this.props.children}
        <Footer />

        <ContentModal
          ref={e => {
            this.cvPreviewModal = e;
          }}
          className="cv-preview-modal"
        >
          <CvPreviewModal />
        </ContentModal>
      </div>
    );
  }
}

const mapStateToProps = ({ profileBio: profile, profile: { user } }) => ({
  user,
  profile
});

function mergeProps(state, dispatchProps, ownProps) {
  const { dispatch } = dispatchProps;
  const { user } = state;

  const memberId = defaultTo(user.member_id)(prop('memberId', ownProps));
  const isLoggedInUser = user.member_id === memberId;

  return {
    ...ownProps,
    memberId,
    isLoggedInUser,
    user: state.user,
    profile: state.profile.profile,
    coverPhotos: state.profile.coverPhotos,
    location: state.profile.location,
    gettingPhotos: state.profile.gettingPhotos,
    gettingMember: state.profile.gettingMember,
    attemptGetMember: (id = memberId) =>
      dispatch(Creators.getMemberAttempt(id)),
    attemptGetMemberBio: (id = memberId) =>
      dispatch(Creators.getMemberBioAttempt(id)),
    attemptGetMemberReference: (id = memberId) =>
      dispatch(Creators.getMemberReferenceAttempt(id)),
    attemptGetMemberCommunity: (id = memberId) =>
      dispatch(Creators.getMemberCommunityAttempt(id)),
    attemptGetMemberMutualConnections: (id = memberId) =>
      dispatch(Creators.getMemberMutualConnectionsAttempt(id)),
    attemptGetMemberPhotos: (id = memberId) =>
      dispatch(Creators.getMemberPhotosAttempt(id)),
    attemptGetMemberVideos: (id = memberId) =>
      dispatch(Creators.getMemberVideosAttempt(id)),
    getMemberMedia: (id = memberId) =>
      dispatch(Creators.getMemberMediaAttempt(id)),
    attemptGetMemberBadge: (id = memberId) =>
      dispatch(Creators.getMemberBadgeAttempt(id)),
    attemptGetMemberCv: (id = memberId) =>
      dispatch(Creators.getMemberCvAttempt(id))
  };
}

export default connect(mapStateToProps, null, mergeProps)(ProfileRoute);
