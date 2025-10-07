import React from 'react';
import { connect } from 'react-redux';
import * as lodash from 'lodash';
import cx from 'classnames';
import { Creators as Actions } from 'app/user/actions';
import { Creators as QualificationsActions } from 'app/qualifications/actions';
import { Creators as CommunityCreators } from 'app/community/actions';
import { Creators as NewsActions } from 'app/news/actions';
import { Creators as UserActions } from 'app/user/actions';

import { extractUserCentre } from 'app/common/util/helpers';
import components from '../components';
import common from 'app/common';
import { Roles } from 'app/core/config/constants';
import { bindActionCreators } from 'redux';
import config from 'brand/config';
// import Feed from 'rss-to-json';
import Parser from 'rss-parser';

import DashboardTutorContainer from './dashboard-tutor-container';
import DashboardUserContainer from './dashboard-user-container';
import DashboardAdminContainer from './dashboard-reporting';
import DashboardBusinessContainer from './dashboard-business';
import DashboardFinance from './dashboard-finance';

const helpers = common.util.helpers;

const CentreDashboard = components.CentreDashboard;
const extractUserRole = helpers.extractUserRole;
const UserAccess = helpers.UserAccess;
const Footer = common.components.Footer;

const {
  CentreAdmin,
  CentreTutor,
  CentreLearner,
  SuperAdmin,
  SiteAdmin,
  Member,
  Finance,
  Author
} = Roles;

class DashboardContainer extends React.Component {
  constructor(props) {
    super(props);
    this.centre = extractUserCentre(props.user);
    this.state = {
      centreRoles: [CentreAdmin],
      tutorRoles: [CentreTutor],
      adminRoles: [SiteAdmin, SuperAdmin, Author],
      learnerRoles: [CentreLearner, Member],
      news: [],
      isLoading: true,
      registrationFlow: '1'
    };
  }

  UNSAFE_componentWillMount() {
    const {
      user,
      news,
      getCentreSeatsAttempt,
      getCentreProfileAttempt,
      getCentreQualificationsAttempt,
      communityUsersAttempt,
      communityUsersSuccess,
      getAllNewsAttempt,
      getAdminBalanceAttempt
    } = this.props;

    const { centreRoles } = this.state;

    const role = extractUserRole(user);

    // reset store
    communityUsersSuccess(null, 0);

    if (centreRoles.indexOf(role) > -1) {
      // NOTE - implement dynamic centre ID's after R1
      const { centre_id } = this.centre;

      if (role === CentreAdmin) getCentreSeatsAttempt(centre_id);
      if (role === CentreTutor)
        communityUsersAttempt('centre', {
          'centre_roles[]': CentreLearner,
          offset: 0,
          limit: 10,
          order: 'asc',
          sort: 'progress_percentage'
        });
      getCentreProfileAttempt(centre_id);
      getCentreQualificationsAttempt(centre_id);
    }

    if (
      [SuperAdmin, SiteAdmin, CentreAdmin, Finance, Author].indexOf(role) >= 0
    ) {
      getAdminBalanceAttempt();
    }

    if (!news) {
      getAllNewsAttempt();
    }

    const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';

    let parser = new Parser();
    let that = this;
    parser.parseURL(CORS_PROXY + config.rssNewsUrl, function(err, feed) {
      let news = [];
      let elem = document.createElement('div');

      if (feed && feed.items && feed.items.length > 0) {
        feed.items.forEach(item => {
          elem.innerHTML = item['content:encoded']
            ? item['content:encoded']
            : '';
          let images = elem.getElementsByTagName('img');

          news.push({
            thumbnail: images[0] && images[0].src ? images[0].src : '',
            title: item.title,
            description: item.contentSnippet,
            pubDate: item.pubDate
          });
        });

        that.setState({
          news: news,
          isLoading: false
        });
      } else {
        that.setState({
          isLoading: false
        });
      }
    });
    //get news
    // Feed.load(config.rssNewsUrl, (err, rss) => {
    //   console.log(err, rss);
    //   this.setState({
    //     news: rss.items
    //   });
    // });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      this.centre &&
      this.centre.centre_id &&
      nextProps.currentSectorId !== this.props.currentSectorId
    ) {
      this.props.getCentreQualificationsAttempt(this.centre.centre_id);
    }
  }

  componentDidMount() {
    this.setState({
      registrationFlow: config.registrationFlow
    });
  }

  render() {
    const {
      user,
      news,
      updateLocalUser,
      centreSeats,
      centreLearners,
      centreProfile,
      centreQualifications,
      currentSectorTitle,
      router,
      resendVerificationEmail,
      registration
    } = this.props;
    const {
      adminRoles,
      centreRoles,
      tutorRoles,
      learnerRoles,
      isLoading,
      registrationFlow
    } = this.state;

    const centreDashboardProps = {
      user,
      centreSeats,
      centreLearners,
      centreProfile,
      centreQualifications,
      currentSectorTitle
    };

    const userDashboardProps = {
      user,
      currentSectorTitle,
      removeCourseAssignedFlag: () => updateLocalUser({ courseAssigned: false })
    };

    return (
      <div style={{ position: 'relative' }}>
        {user && user.unverified_email && registrationFlow === '2' && (
          <div className="dashboard-email-verification-popup">
            <span>Please check your email and verify your account.</span>
            <button
              className={cx('button is-primary', {
                'is-loading': registration.emailResendAttempt
              })}
              onClick={() => {
                resendVerificationEmail(user.email);
              }}
            >
              Resend
            </button>
          </div>
        )}
        <UserAccess allowRoles={centreRoles}>
          {/* Centre dashboard */}
          <div className="dashboard-container">
            {/* <CentreDashboard {...centreDashboardProps} /> */}
            <DashboardBusinessContainer {...{ news, isLoading, router }} />
            <Footer />
          </div>
        </UserAccess>
        {/* User dashboard */}

        <UserAccess allowRoles={[Finance]}>
          {/* Centre dashboard */}
          <div className="dashboard-container">
            <DashboardFinance />
            <Footer />
          </div>
        </UserAccess>

        <UserAccess allowRoles={adminRoles}>
          {/* Centre dashboard */}
          <div className="dashboard-container">
            <DashboardAdminContainer />
            <Footer />
          </div>
        </UserAccess>

        <UserAccess allowRoles={tutorRoles}>
          <div className="dashboard-new-container">
            <DashboardTutorContainer {...{ news, isLoading }} />
          </div>
        </UserAccess>

        <UserAccess allowRoles={learnerRoles}>
          <div className="dashboard-new-container">
            <DashboardUserContainer {...{ news, isLoading }} />
          </div>
        </UserAccess>
      </div>
    );
  }
}

/**
 * Redux mappings
 */
const mapStateToProps = ({
  profile: { user },
  centre: { profile, seats: centreSeats },
  qualifications: { centreQualifications },
  community: { users: centreLearners },
  persisted: {
    sector: { sector_id, title }
  },
  news: { news },
  registration
}) => ({
  user,
  centreProfile: profile,
  centreQualifications,
  centreSeats,
  centreLearners,
  currentSectorId: sector_id,
  currentSectorTitle: title,
  news,
  registration
});

const {
  getCentreSeatsAttempt,
  getCentreProfileAttempt,
  updateLocalUser,
  getAdminBalanceAttempt
} = Actions;

const { resendVerificationEmailAttempt } = UserActions;

const { communityUsersAttempt, communityUsersSuccess } = CommunityCreators;

const { getCentreQualificationsAttempt } = QualificationsActions;

const { getAllNewsAttempt } = NewsActions;

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      updateLocalUser,
      getCentreSeatsAttempt,
      getCentreProfileAttempt,
      getAdminBalanceAttempt,
      getCentreQualificationsAttempt,
      communityUsersAttempt,
      communityUsersSuccess,
      getAllNewsAttempt,
      resendVerificationEmail: resendVerificationEmailAttempt
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(DashboardContainer);
