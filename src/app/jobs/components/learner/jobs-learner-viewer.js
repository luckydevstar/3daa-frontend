import React, { Component } from 'react';
import moment from 'moment';
import Isvg from 'react-inlinesvg';

import common from 'app/common';
import IconClose from 'images/icon_close.svg';
const { createCloudinaryUrl } = common.util.helpers;

class JobsLearnerViewer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isStickyBar: false
    };
    this.updateLayout = this.updateLayout.bind(this);
  }

  componentDidMount() {
    document
      .querySelector('.viewer-inner')
      .addEventListener('scroll', this.updateLayout);
    window.addEventListener('resize', this.updateLayout);
  }

  updateLayout() {
    if (!this.elNav) {
      return;
    }

    if (this.elContainer.scrollTop > this.elNav.offsetTop) {
      this.setState({
        isStickyBar: true
      });
    } else {
      this.setState({
        isStickyBar: false
      });
    }
  }

  render() {
    const {
      closeViewer,
      openApplyModal,
      interview,
      viewerHeight,
      viewerJob,
      getPassedDate,
      addComma,
      starClick,
      applied
    } = this.props;
    const { isStickyBar } = this.state;
    return (
      <div className="viewer">
        {/* // sticky bar */}
        {isStickyBar && !interview && (
          <div className="viewer_footer-bar fixed">
            <div className="columns">
              <div className="column is-5 time">
                <p>created 4 days ago</p>
                <p>69 views</p>
              </div>
              <div className="column is-3 link">
                <span className="icon">
                  <i className="fa fa-share-alt">&nbsp;</i>
                </span>
                <span
                  className="icon"
                  onClick={() => {
                    starClick(viewerJob.job_id);
                  }}
                >
                  <i className="fa fa-star-o">&nbsp;</i>
                </span>
              </div>
              {!applied && (
                <div className="column is-4 btn">
                  <button
                    className="button is-primary"
                    onClick={openApplyModal}
                  >
                    Apply Now
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {isStickyBar && interview && (
          <div className="fixed">
            <div className="viewer_interview-info">
              <p className="title">Interview Request</p>
              <p>
                <b>03 September 2017</b>
                <b className="p-l-50">14:30</b>
              </p>
              <p>The Ivy Market Grill</p>
              <p>Edinburgh EH1</p>
            </div>
            <div className="viewer_message-zone">
              <div className="columns">
                <div className="column is-3 photo" />
                <div className="column is-6 desc">
                  This job is advertised by Luella Meyer
                </div>
                <div className="column is-3 btn">
                  <button className="button is-primary is-outlined">
                    Message
                  </button>
                </div>
              </div>
            </div>
            <div className="viewer_footer-bar">
              <div className="columns">
                <div className="column is-5 time" />
                <div className="column is-7 btn">
                  <button
                    className="button is-primary is-outlined"
                    onClick={openApplyModal}
                  >
                    Decline
                  </button>
                  <button
                    className="button is-primary"
                    onClick={openApplyModal}
                  >
                    Accept
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* ===================== */}

        <div
          className="viewer-inner"
          style={{ height: viewerHeight }}
          ref={el => {
            this.elContainer = el;
          }}
        >
          <div className="viewer_close-bar">
            <span className="icon is-pulled-right" onClick={closeViewer}>
              <Isvg src={IconClose} />
            </span>
          </div>
          <div className="viewer_info">
            <p className="title">
              {viewerJob.title} <b className="i-new">New</b>
            </p>
            <p>{viewerJob.address}</p>
            {viewerJob.salary_min && viewerJob.salary_max && (
              <p>
                £{addComma(viewerJob.salary_min)} - £
                {addComma(viewerJob.salary_max)} a year
              </p>
            )}
          </div>
          {interview && (
            <div
              ref={el => {
                this.elNav = el;
              }}
            >
              <div className="viewer_interview-info">
                <p className="title">Interview Request</p>
                <p>
                  <b>03 September 2017</b>
                  <b className="p-l-50">14:30</b>
                </p>
                <p>The Ivy Market Grill</p>
                <p>Edinburgh EH1</p>
              </div>
              {viewerJob.employer && (
                <div className="viewer_message-zone">
                  <div className="columns">
                    <div className="column is-3 photo" />
                    <div className="column is-6 desc">
                      This job is advertised by {viewerJob.employer}
                    </div>
                    <div className="column is-3 btn">
                      <button className="button is-primary is-outlined">
                        Message
                      </button>
                    </div>
                  </div>
                </div>
              )}
              <div className="viewer_footer-bar">
                <div className="columns">
                  <div className="column is-5 time" />
                  <div className="column is-7 btn">
                    <button
                      className="button is-primary is-outlined"
                      onClick={openApplyModal}
                    >
                      Decline
                    </button>
                    <button
                      className="button is-primary"
                      onClick={openApplyModal}
                    >
                      Accept
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {!interview && (
            <div
              className="viewer_footer-bar jobs-sticky-bar"
              ref={el => {
                this.elNav = el;
              }}
            >
              <div className="columns">
                <div className="column is-5 time">
                  {viewerJob && viewerJob.created && (
                    <p>created {getPassedDate(viewerJob)}</p>
                  )}
                  {(viewerJob.viewed || viewerJob.viewed === 0) && (
                    <p>{viewerJob.viewed} views</p>
                  )}
                </div>
                <div className="column is-3">
                  <span className="icon cursor-pointer">
                    <i className="fa fa-share-alt">&nbsp;</i>
                  </span>
                  {!applied && (
                    <span
                      className="icon cursor-pointer"
                      onClick={() => {
                        starClick(viewerJob.job_id);
                      }}
                    >
                      {viewerJob && !viewerJob.saved && (
                        <i className="fa fa-star-o" />
                      )}
                      {viewerJob && viewerJob.saved && (
                        <i className="fa fa-star" aria-hidden="true" />
                      )}
                    </span>
                  )}
                </div>
                {!applied && (
                  <div className="column is-4 btn">
                    <button
                      className="button is-primary"
                      onClick={openApplyModal}
                    >
                      Apply Now
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
          {viewerJob.media && viewerJob.media.length > 0 && (
            <div className="viewer_media-zone">
              <div className="media-list">
                {viewerJob.media.map(m => (
                  <div
                    className="one"
                    style={{
                      backgroundImage: `url(${createCloudinaryUrl(
                        m.cloudinary_file_id
                      )})`,
                      backgroundSize: 'cover'
                    }}
                  />
                ))}
              </div>
              <div className="media-bottom">
                <span>
                  See all Media <i className="fa fa-angle-right">&nbsp;</i>
                </span>
              </div>
            </div>
          )}
          {viewerJob.employer && (
            <div className="viewer_message-zone">
              <div className="columns">
                <div className="column is-3 photo" />
                <div className="column is-6 desc">
                  This job is advertised by {viewerJob.employer}
                </div>
                <div className="column is-3 btn">
                  <button className="button is-primary is-outlined">
                    Message
                  </button>
                </div>
              </div>
            </div>
          )}
          {viewerJob.qualifications && viewerJob.qualifications[0] && (
            <div className="viewer_qualifications">
              <p>
                <b>Qualification required</b>
              </p>
              <p className="qualification">
                {viewerJob.qualifications[0].short_title ||
                  viewerJob.qualifications[0].title}
              </p>
            </div>
          )}
          {viewerJob.description && (
            <div className="viewer_detail">
              <p>
                <b>The interview includes:</b>
              </p>
              <p>{viewerJob.description}</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default JobsLearnerViewer;
