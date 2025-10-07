import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { find, join, map, prop, propEq, head } from 'ramda';

import common from 'app/common';
import { Text } from 'app/intl';
import { Creators as QualificationActions } from 'app/qualifications/actions';
import { Creators as CommunityActions } from 'app/community/actions';
import {
  DashboardLatestNews,
  DashboardLearningHours,
  DashboardRecommendedVideo,
  DashboardBusinessNewsView,
  DashboardBusinessCardStore,
  DashboardCohortsProgress,
  DashboardStudentProgress,
  DashboardCohortsLearningHours,
  DashboardCohorts,
  DashboardPurchaseNewsLicenses
} from '../components';

import config from 'brand/config';
import mockData from '../config/mock';

const {
  components: { CloudinaryMedia, UILoading, ContentModal }
} = common;

class DashboardTutorContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isChartView: false,
      selectedGroupId: 0,
      cwIndex: 0,
      selectedGroupLearners: [],
      selectedGroupTitle: '',
      selectedLearnerName: ''
    };

    this.toggleChartView = this.toggleChartView.bind(this);
    this.changeCurrentGroup = this.changeCurrentGroup.bind(this);
    this.changeCurrentStudent = this.changeCurrentStudent.bind(this);
    this.openNewsViewModal = this.openNewsViewModal.bind(this);
    this.closeNewsViewModal = this.closeNewsViewModal.bind(this);
  }

  componentDidMount() {
    const {
      getMemberQualifications,
      user,
      getCentreGroup,
      getLearingHours
    } = this.props;
    getCentreGroup();
    getLearingHours({});
    getMemberQualifications(user.member_id);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { centreGroups, centreGroupDetails } = nextProps;
    if (
      centreGroups &&
      centreGroups.length > 0 &&
      centreGroupDetails &&
      centreGroupDetails.length > 0
    ) {
      this.changeCurrentGroup(0);
    }
  }

  toggleChartView() {
    const { isChartView } = this.state;
    this.setState({
      isChartView: !isChartView
    });
  }

  changeCurrentGroup(i) {
    const { centreGroups, centreGroupDetails, getLearingHours } = this.props;
    const selectedGroupId = centreGroups[i].group_id;
    const selectedGroupDetail = centreGroupDetails.filter(function(item) {
      return item.group_id === selectedGroupId;
    });

    if (selectedGroupDetail && selectedGroupDetail.length > 0) {
      this.setState({
        selectedGroupLearners: selectedGroupDetail[0].members,
        selectedGroupQTitle: selectedGroupDetail[0].qualification_title,
        selectedGroupTitle: selectedGroupDetail[0].title
      });
    }

    getLearingHours({ groupId: selectedGroupId });
    this.setState({
      cwIndex: i,
      selectedGroupId
    });
  }

  changeCurrentStudent(memberId) {
    const { getLearingHours } = this.props;
    getLearingHours({ memberId });

    if (this.state.selectedGroupLearners.length > 0) {
      const selectedLearner = this.state.selectedGroupLearners.filter(
        item => item.member_id === memberId
      );
      this.setState({ selectedLearnerName: selectedLearner[0].screen_name });
    }
  }

  openNewsViewModal(news) {
    setTimeout(() => {
      this.newsViewModal.open();
    }, 100);
  }

  closeNewsViewModal() {
    this.newsViewModal.close();
  }

  render() {
    const {
      isChartView,
      selectedGroupId,
      cwIndex,
      selectedGroupLearners,
      selectedGroupQTitle,
      selectedGroupTitle,
      selectedLearnerName
    } = this.state;
    const {
      loadingQualifications,
      qualifications,
      user,
      news,
      centreGroups,
      isLoading
    } = this.props;

    const cqid = user.current_qualification.qualification_id;
    const current_qualification = find(
      propEq('qualification_id', cqid),
      qualifications || []
    );

    const workbooks = current_qualification && current_qualification.workbooks;

    const current_workbook =
      workbooks && workbooks[cwIndex] ? workbooks[cwIndex] : {};

    const current_group =
      centreGroups && centreGroups[cwIndex] ? centreGroups[cwIndex] : {};

    const recommended_video =
      current_workbook.recommended_media &&
      current_workbook.recommended_media[0];

    const overview = current_workbook.overview
      ? JSON.parse(current_workbook.overview)
      : {};
    const overview_txt = overview.blocks
      ? join(' ', map(prop('text'), overview.blocks))
      : '';

    const purchaseItems = [
      {
        price: current_group.license_price ? current_group.license_price : 0,
        count: cwIndex
      }
    ];

    // let mockNews = mockData[config.title].news[0];
    let mockNews = null;

    if (config.rssNewsUrl !== '') {
      mockNews = {
        thumbnail: '',
        title: '',
        description: '',
        pubDate: ''
      };
    }

    const newsData = news && news.length > 0 ? head(news) : mockNews;

    const headerImg =
      user &&
      user.centres &&
      head(user.centres) &&
      head(user.centres).cloudinary_file_id
        ? head(user.centres).cloudinary_file_id
        : null;

    return (
      <div className="dashboard">
        <section className="dashboard-header">
          <div className="header-content">
            {headerImg && (
              <div className="dashboard-video">
                <img src={headerImg} alt="Centre Banner" />
              </div>
            )}
          </div>
          <div className="sub-navbar" />
          {current_group && current_qualification && current_workbook && user && (
            <DashboardCohortsProgress
              {...{
                current_group,
                current_qualification,
                current_workbook,
                user
              }}
            />
          )}
        </section>

        <section className="dashboard-contents content-section">
          <div className="container">
            {/* // workbook, your progress and latest news */}
            <div className="columns m-t-0 is-multiline">
              <div className="column is-2-widescreen is-2-desktop is-4-tablet is-12-mobile dashboad-screen-side-left">
                <div className="content-title">
                  <span className="b">
                    <Text iKey="active_cohorts" />
                  </span>

                  {/* <div
                    className={classNames('buttons', { close: isChartView })}
                    onClick={() => this.toggleChartView()}
                  >
                    {!isChartView ? (
                      <Text iKey="view_all" />
                    ) : (
                      <Text iKey="close" vals={[' >']} />
                    )}
                  </div> */}
                </div>
                {loadingQualifications ? (
                  <UILoading />
                ) : (
                  <DashboardCohorts
                    centreGroups={centreGroups}
                    workbooks={workbooks}
                    selected={cwIndex}
                    onItemSelect={this.changeCurrentGroup}
                  />
                )}
              </div>

              <div className="column is-8-widescreen is-8-desktop is-4-tablet is-12-mobile dashboad-screen-center">
                <div className="content-title">
                  <div>
                    <span className="b">
                      {selectedGroupTitle} &nbsp;|&nbsp;
                    </span>
                    <Text iKey="student_progress" />
                  </div>
                  <div>
                    <span>
                      {selectedGroupLearners ? selectedGroupLearners.length : 0}{' '}
                      Students
                    </span>{' '}
                    &nbsp;&nbsp;
                    <Text iKey="view_all" />
                  </div>
                </div>
                {loadingQualifications ? (
                  <UILoading />
                ) : (
                  <DashboardStudentProgress
                    qualificationTitle={selectedGroupQTitle}
                    learners={selectedGroupLearners}
                    selected={cwIndex}
                    onItemSelect={member_id =>
                      this.changeCurrentStudent(member_id)
                    }
                  />
                )}
              </div>

              <div className="column is-2-widescreen is-2-desktop is-4-tablet is-12-mobile dashboad-screen-side">
                <div className="content-title b">
                  <Text iKey="latest_news" />
                </div>
                {newsData && (
                  <DashboardLatestNews
                    {...{
                      openNewsViewModal: this.openNewsViewModal,
                      newsData,
                      isLoading
                    }}
                  />
                )}
              </div>
              {/* // workbook, your progress and latest news */}
              {/* // video and chart */}
              <div
                className={classNames('column transition', {
                  'is-3-widescreen is-3-desktop is-4-tablet is-12-mobile dashboad-sceen-store': !isChartView,
                  'width-0': isChartView
                })}
              >
                <div className="content-title b">
                  <Text iKey="purchase_new_licenses" />
                </div>
                {/* <DashboardPurchaseNewsLicenses
                  items={purchaseItems}
                  setItemCount={() => {}}
                  mockData={mockData[config.title]}
                /> */}
              </div>
              <div
                className={classNames('column transition', {
                  'is-9-widescreen is-9-desktop is-8-tablet is-12-mobile': !isChartView,
                  'width-100': isChartView
                })}
              >
                <div className="content-title">
                  <span className="b">
                    <Text iKey="current_learning_hours" />
                  </span>
                  <div
                    className={classNames('buttons', { close: isChartView })}
                    onClick={() => this.toggleChartView()}
                  >
                    {!isChartView ? (
                      <Text iKey="view" />
                    ) : (
                      <Text iKey="close" vals={[' >']} />
                    )}
                  </div>
                </div>
                <DashboardCohortsLearningHours
                  {...{
                    isChartView,
                    selectedGroupId,
                    selectedGroupTitle,
                    selectedLearnerName
                  }}
                />
              </div>
            </div>
            {/* // video and chart */}
          </div>
        </section>

        <ContentModal
          className="news-view-modal"
          ref={e => {
            this.newsViewModal = e;
          }}
        >
          <DashboardBusinessNewsView {...{ selectedNews: newsData }} />
        </ContentModal>
      </div>
    );
  }
}

const mapStateToProps = ({ profile, qualifications, community }) => ({
  user: profile.user,
  qualifications: qualifications.memberQualifications,
  centreGroups: community.centreGroups,
  centreGroupDetails: community.centreGroupDetails,
  loadingQualifications: qualifications.attemptingGetQualifications
});

const mapDispatchToProps = dispatch => ({
  getMemberQualifications: member_id =>
    dispatch(QualificationActions.getMemberQualificationsAttempt(member_id)),
  getCentreGroup: groupID =>
    dispatch(CommunityActions.getCentreGroupAttempt(groupID)),
  getLearingHours: params =>
    dispatch(QualificationActions.getLearingHoursAttempt(params))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardTutorContainer);
