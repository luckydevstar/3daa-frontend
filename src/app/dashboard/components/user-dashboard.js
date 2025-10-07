import React from 'react';
import { isEmpty, isNil, either } from 'ramda';
import Portal from 'react-portal';
import common from 'app/common';
import { Link, browserHistory } from 'react-router';
import classNames from 'classnames';
import { Roles } from 'app/core/config/constants';

import { Text } from 'app/intl';

const {
  util: {
    helpers: { UserAccess }
  },
  components: {
    course: { CourseCardFront },
    ProgressBadge,
    CloudinaryMedia
  }
} = common;
const { SuperAdmin, SiteAdmin, CentreLearner } = Roles;

class UserDashboard extends React.Component {
  // TODO THIS IS TEMPORARY... @andris
  // componentDidUpdate() {
  //   this.openModalOnCompletedRegistration();
  // }
  //
  // openModalOnCompletedRegistration() {
  //   if (
  //     this.props.routingState &&
  //     this.props.routingState.registrationSuccess
  //   ) {
  //     this.assignment.openPortal();
  //     setTimeout(() => {
  //       this.courseContainer.className = 'assigned-course-container reveal';
  //     }, 100);
  //   }
  // }

  render() {
    const {
      user: { courseAssigned, current_qualification, first_name },
      currentSectorTitle,
      removeCourseAssignedFlag
    } = this.props;
    const { progress_percentage, title } = current_qualification;

    return (
      <div className="dashboard">
        <section className="content-section hero">
          <div className="hero-body">
            <div className="container has-text-centered">
              <h1 className="title">
                <Text iKey="hi" /> {first_name || ''}
              </h1>
              <UserAccess allowRoles={[SuperAdmin, SiteAdmin]}>
                <h2 className="subtitle">
                  <Text iKey="you_are_browsing" /> {currentSectorTitle}{' '}
                  <Text iKey="sector" />
                </h2>
              </UserAccess>
              <UserAccess allowRoles={[CentreLearner]}>
                <h2 className="subtitle">
                  <Text iKey="you_are_studying" /> {currentSectorTitle}{' '}
                  <Text iKey="sector" />
                </h2>
              </UserAccess>
            </div>
          </div>
        </section>
        <div className="dashboard-progress-container">
          <UserAccess allowRoles={[CentreLearner]}>
            <div className="dashboard-progress">
              <div className="progress-badge">
                <ProgressBadge
                  dimensions={250}
                  strokeWidth={10}
                  percentage={Math.round(progress_percentage) || 0}
                  percentageFontSize={86}
                  label="COMPLETE"
                  labelFontSize={14}
                />
              </div>
              <span className="qualification-title">{title}</span>
              <div>
                <Link
                  className={classNames('button', 'is-primary')}
                  to={'/bookstand'}
                >
                  Go to Workbooks
                </Link>
              </div>
            </div>
          </UserAccess>
        </div>
        {/* <div className="dashboard-video">
          <CloudinaryMedia
            mediaType="video"
            fileId="Cloud_Loop_qhov0h"
            transformations={{ crop: 'fill', quality: 100 }}
            attributes={{ autoPlay: true, loop: true }}
          />
        </div> */}
        {/* Registration popup */}
        {!either(isEmpty, isNil)(current_qualification) && (
          <Portal
            ref={e => {
              this.assignment = e;
            }}
            isOpened={courseAssigned}
            closeOnEsc
          >
            <div
              ref={e => {
                this.courseContainer = e;
              }}
              className="assigned-course-container reveal"
            >
              <div className="inner">
                <h1>Congratulations! You have been assigned a course.</h1>
                <CourseCardFront
                  progressPercentage={current_qualification.progress_percentage}
                  title={current_qualification.title}
                  level={current_qualification.level}
                  fileId={current_qualification.video}
                  mediaType={'video'}
                />
                <button
                  className="button is-success"
                  onClick={() => {
                    this.assignment.closePortal();
                    removeCourseAssignedFlag();
                    browserHistory.push('/bookstand');
                  }}
                >
                  Accept and Continue
                </button>
              </div>
            </div>
          </Portal>
        )}
      </div>
    );
  }
}

export default UserDashboard;
