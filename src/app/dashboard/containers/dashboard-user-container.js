import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { find, join, map, prop, propEq, path, head } from 'ramda';

import common from 'app/common';
import { Text } from 'app/intl';
import { Creators as QualificationActions } from 'app/qualifications/actions';
import {
  DashboardLatestNews,
  DashboardLearningHours,
  DashboardQualificationProgress,
  DashboardRecommendedVideo,
  DashboardWorkbookCard,
  DashboardYourProgress,
  DashboardBusinessNewsView
} from '../components';

import config from 'brand/config';
import mockData from '../config/mock';

const {
  components: { CloudinaryMedia, UILoading, ContentModal }
} = common;

class DashboardUserContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isChartView: false,
      cwIndex: 0
    };

    this.toggleChartView = this.toggleChartView.bind(this);
    this.changeCurrentWorkbook = this.changeCurrentWorkbook.bind(this);
    this.openNewsViewModal = this.openNewsViewModal.bind(this);
    this.closeNewsViewModal = this.closeNewsViewModal.bind(this);
  }

  componentDidMount() {
    const { getMemberQualifications, user } = this.props;

    getMemberQualifications(user.member_id);
  }

  toggleChartView() {
    const { isChartView } = this.state;
    this.setState({
      isChartView: !isChartView
    });
  }

  changeCurrentWorkbook(i) {
    this.setState({
      cwIndex: i
    });
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
    const { isChartView, cwIndex } = this.state;
    const {
      loadingQualifications,
      qualifications,
      user,
      news,
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

    const recommended_video =
      current_workbook.recommended_media &&
      current_workbook.recommended_media[0];

    const overview = current_workbook.overview
      ? JSON.parse(current_workbook.overview)
      : {};
    const overview_txt = overview.blocks
      ? join(' ', map(prop('text'), overview.blocks))
      : '';

    let mockNews = {
      thumbnail: '',
      title: '',
      description: '',
      pubDate: ''
    };

    const newsData = news && news.length > 0 ? head(news) : mockNews;

    const desktopBanner = path(['banner_desktop'], current_qualification);

    const desktopBannerType = path(
      ['banner_desktop_type'],
      current_qualification
    );

    return (
      <div className="dashboard">
        <section className="dashboard-header">
          <div className="header-content">
            {desktopBanner && desktopBannerType === 'image' && (
              <img
                className="dashboard-header__banner__media"
                src={desktopBanner}
                alt=""
              />
            )}
            {desktopBanner && desktopBannerType === 'video' && (
              <video
                autoPlay
                muted
                loop
                playsInline
                className="dashboard-header__banner__media"
              >
                <source src={desktopBanner} />
              </video>
            )}
          </div>
          <div className="sub-navbar" />
          {current_qualification && current_workbook && (
            <DashboardQualificationProgress
              {...{
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
            <div className="columns m-t-0">
              <div className="column is-2-widescreen is-2-desktop is-4-tablet is-12-mobile dashboad-screen-side-left">
                <div className="content-title">
                  <Text iKey="current_workbook" />
                </div>
                {loadingQualifications ? (
                  <UILoading />
                ) : (
                  <DashboardWorkbookCard
                    cover={current_workbook.cover}
                    title={current_workbook.title}
                    credit={current_workbook.credit}
                    overview={overview_txt}
                    workbook_id={current_workbook.workbook_id}
                    unit_id={current_workbook.unit_id}
                    progress={current_workbook.progress_percentage}
                    glh={current_workbook.guided_learning_hours}
                  />
                )}
              </div>
              <div className="column is-8-widescreen is-8-desktop is-4-tablet is-12-mobile dashboad-screen-center">
                <div className="content-title">
                  <Text iKey="your_progress" />
                </div>
                {loadingQualifications ? (
                  <UILoading />
                ) : (
                  <DashboardYourProgress
                    workbooks={workbooks}
                    selected={cwIndex}
                    onItemSelect={this.changeCurrentWorkbook}
                  />
                )}
              </div>
              <div className="column is-2-widescreen is-2-desktop is-4-tablet is-12-mobile dashboad-screen-side">
                <div className="content-title">
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
            </div>
            {/* // workbook, your progress and latest news */}
            {/* // video and chart */}
            {config.title === 'WLA' && (
              <div className="columns">
                <div
                  className={classNames('column transition', {
                    'is-8-widescreen is-8-desktop is-6-tablet is-12-mobile': !isChartView,
                    'width-0': isChartView
                  })}
                >
                  <div className="content-title">
                    <Text iKey="recommended_videos_for_you" />
                  </div>
                  <DashboardRecommendedVideo info={recommended_video} />
                </div>
                <div
                  className={classNames('column transition', {
                    'is-4-widescreen is-4-desktop is-6-tablet is-12-mobile': !isChartView,
                    'width-100': isChartView
                  })}
                >
                  <div className="content-title">
                    <Text iKey="your_learning_hours" />
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
                  <DashboardLearningHours {...{ isChartView }} />
                </div>
              </div>
            )}
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

const mapStateToProps = ({ profile, qualifications }) => ({
  user: profile.user,
  qualifications: qualifications.memberQualifications,
  loadingQualifications: qualifications.attemptingGetQualifications
});

const mapDispatchToProps = dispatch => ({
  getMemberQualifications: member_id =>
    dispatch(QualificationActions.getMemberQualificationsAttempt(member_id))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardUserContainer);
