import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import Isvg from 'react-inlinesvg';
import config from 'brand/config';

import initialCourses from '../../../store/config/courses';

import DashboardProgressCircle from './dashboard-progress-circle';
import DashboardProgressLineLeft from './dashboard-progress-line-left';
import DashboardProgressLineRight from './dashboard-progress-line-right';
import DashboardDotLine from './dashboard-dot-line';
import { Text } from 'app/intl';

import IconAddNewQualification from 'images/icon-add-new-qualification.svg';
import IconCloseQualification from 'images/icon-close-qualification.svg';
import IconLock from 'images/icon-lock.svg';
import PNGQualificationFistAid from 'images/qualifications/qualification_first_aid.png';
import PNGQualificationFoodHygine from 'images/qualifications/qualification_food_hygine.png';
import PNGQualificationHeavyLift from 'images/qualifications/qualification_heavy_lift.png';

class DashboardQualificationProgress extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isQualificationView: true,
      windowWidth: 0
    };

    this.updateDimensions = this.updateDimensions.bind(this);
    this.toggleQualificationView = this.toggleQualificationView.bind(this);
  }

  UNSAFE_componentWillMount() {
    this.updateDimensions();
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  updateDimensions() {
    this.setState({
      windowWidth: window.innerWidth
    });
  }

  toggleQualificationView() {
    const { isQualificationView } = this.state;
    this.setState({
      isQualificationView: !isQualificationView
    });
  }

  render() {
    const {
      current_qualification: cq,
      current_workbook: cw,
      user
    } = this.props;

    const { windowWidth, isQualificationView } = this.state;
    const wraperTransform = isQualificationView
      ? `translate(0px)`
      : `translate(-${windowWidth}px)`;
    const userInfoPositionLeft =
      windowWidth > 1200 ? (windowWidth - 1200) / 2 : 0;
    const sideQualificationPosition =
      windowWidth > 1200 ? (windowWidth - 1200) / 2 + 50 : 50;
    const centreQualificationPosition = windowWidth / 2 - 209 / 2;

    const progress = Math.round(cq.progress_percentage) || 0;
    const unitProgress = Math.round(cw.progress_percentage) || 0;
    const submittedProgress = Math.round(cq.submitted_percentage) || 0;
    const learningHours = cq.guided_learning_hours;

    return (
      <div className="qualification-container">
        <div
          className="qualification-wrapper"
          style={{ width: windowWidth * 2, transform: wraperTransform }}
        >
          <div
            className="qualification-progress-view"
            style={{ width: windowWidth }}
          >
            <div className="user-info" style={{ left: userInfoPositionLeft }}>
              <h1 className="name">
                <Text iKey="hi" /> {user.screen_name}
              </h1>
              <h2 className="desc">{cq.title}</h2>
            </div>
            {config.isSideQualificationProgress && (
              <div
                className="left-qualification circle"
                style={{ left: sideQualificationPosition }}
              >
                <DashboardProgressCircle
                  diameter={160}
                  percentage={unitProgress}
                  strokeWidth={8}
                />
                <div className="infos">
                  <div>Unit 1</div>
                  <h2>
                    {unitProgress}
                    <span style={{ fontSize: '0.5em' }}>%</span>
                  </h2>
                  <div>Complete</div>
                </div>
              </div>
            )}
            <div
              className="centre-qualification circle"
              style={{ left: centreQualificationPosition }}
            >
              <DashboardProgressCircle percentage={progress} />
              <div className="infos">
                <h1>
                  {progress}
                  <span style={{ fontSize: '0.5em' }}>%</span>
                </h1>
                <div className="complete">COMPLETE</div>
                <div className="hours">{`${learningHours} HRS`}</div>
                <div className="remaining">Remaining</div>
              </div>
            </div>
            {config.isSideQualificationProgress && (
              <div
                className="right-qualification circle"
                style={{ right: sideQualificationPosition }}
              >
                <DashboardProgressCircle
                  diameter={160}
                  strokeWidth={8}
                  percentage={submittedProgress}
                />

                <div className="infos">
                  <div>Submitted</div>
                  <h2>
                    {submittedProgress}
                    <span style={{ fontSize: '0.5em' }}>%</span>
                  </h2>
                  <div>Complete</div>
                </div>
              </div>
            )}

            {/* <div
              className="add-qualification-button"
              onClick={() => this.toggleQualificationView()}
            >
              <p>
                <Text iKey="add_new_qualification" />
              </p>
              <p>
                <Isvg src={IconAddNewQualification} />
              </p>
            </div> */}
            {config.isSideQualificationProgress && (
              <div>
                <DashboardProgressLineLeft
                  width={
                    centreQualificationPosition - sideQualificationPosition - 75
                  }
                  height={40}
                  left={sideQualificationPosition + 75}
                  top={170}
                  radius={40}
                  percentage={progress}
                />
                <DashboardProgressLineRight
                  width={
                    centreQualificationPosition - sideQualificationPosition - 75
                  }
                  height={40}
                  left={windowWidth / 2 + 104.5}
                  top={170}
                  radius={40}
                  percentage={progress}
                />
                {config.title === 'WLA' && (
                  <DashboardDotLine
                    width={sideQualificationPosition + 85}
                    height={40}
                    left={windowWidth - sideQualificationPosition - 85}
                    top={170}
                    radius={40}
                  />
                )}
              </div>
            )}
          </div>
          {/* ////// */}

          <div
            className="qualification-add-view"
            style={{ width: windowWidth }}
          >
            <div className="user-info" style={{ left: userInfoPositionLeft }}>
              <h1 className="name">&nbsp;</h1>
              <h2 className="desc">
                These courses may compliment your qualification
              </h2>
            </div>

            {config.isSideQualificationProgress && (
              <DashboardProgressLineRight
                width={sideQualificationPosition + 85}
                height={40}
                left={0}
                top={170}
                radius={40}
                percentage={progress}
              />
            )}

            {config.isSideQualificationProgress && (
              <div
                className="left-qualification circle"
                style={{ left: sideQualificationPosition }}
              >
                <DashboardProgressCircle diameter={160} showProgress={false} />

                <div className="infos">
                  <div>SCPLH</div>
                  <div>
                    <Isvg src={IconLock} />
                  </div>
                  <div>Unlocked</div>
                </div>
              </div>
            )}

            {/* <div className="container">
              <div className="columns">
                <div className="column is-4" />
                <div className="column is-7">
                  <div className="columns m-t-20">
                    <div className="column qualifications">
                      <div className="q-title">
                        {initialCourses[config.title][0].title}
                      </div>
                      <div className="q-badge">
                        <img
                          alt=""
                          src={initialCourses[config.title][0].badge}
                        />
                      </div>
                      <Link
                        className="button is-primary"
                        to={`/store/course/1`}
                      >
                        <Text iKey="add_course" />
                      </Link>
                      <div className="q-price">
                        £{initialCourses[config.title][0].price}
                      </div>
                    </div>
                    <div className="column qualifications">
                      <div className="q-title">
                        {initialCourses[config.title][1].title}
                      </div>
                      <div className="q-badge">
                        <img
                          alt=""
                          src={initialCourses[config.title][1].badge}
                        />
                      </div>
                      <Link
                        className="button is-primary"
                        to={`/store/course/4`}
                      >
                        <Text iKey="add_course" />
                      </Link>
                      <div className="q-price">
                        £{initialCourses[config.title][1].price}
                      </div>
                    </div>
                    <div className="column qualifications">
                      <div className="q-title">
                        {initialCourses[config.title][2].title}
                      </div>
                      <div className="q-badge">
                        <img
                          alt=""
                          src={initialCourses[config.title][2].badge}
                        />
                      </div>
                      <Link
                        className="button is-primary"
                        to={`/store/course/3`}
                      >
                        <Text iKey="add_course" />
                      </Link>
                      <div className="q-price">
                        £{initialCourses[config.title][2].price}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="column is-1" />
              </div>
            </div> */}

            <div
              className="close-qualification-button"
              style={{ left: sideQualificationPosition + 60 }}
              onClick={() => this.toggleQualificationView()}
            >
              <p>
                <Text iKey="close" />
              </p>
              <p>
                <Isvg src={IconCloseQualification} />
              </p>
            </div>
          </div>
          {/* ////// */}
        </div>
      </div>
    );
  }
}

DashboardQualificationProgress.propTypes = {
  current_qualification: PropTypes.object,
  current_workbook: PropTypes.object,
  user: PropTypes.object
};

DashboardQualificationProgress.defaultProps = {
  current_qualification: {},
  current_workbook: {},
  user: {}
};

export default DashboardQualificationProgress;
