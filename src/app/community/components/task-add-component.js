import React, { Component } from 'react';
import classNames from 'classnames';
import Calendar from 'react-calendar/dist/entry.nostyle';
import moment from 'moment';

import TransitionGroup from 'react-transition-group/TransitionGroup';
import anime from 'animejs/lib/anime.js';
import {
  take,
  cond,
  always,
  T,
  equals,
  length,
  last,
  contains,
  or,
  filter
} from 'ramda';
import common from 'app/common';

import iconPDF from 'images/task_file_icons/pdf.png';
import iconXLS from 'images/task_file_icons/xls.png';
import iconDOC from 'images/task_file_icons/doc.png';
import iconUpload from 'images/task_file_icons/doc-upload.png';

import CommunityProgressBadge from './community-progress-badge';
import { Text } from 'app/intl';
const {
  components: { UILoading }
} = common;
import videosNewRoute from '../../video/containers/videos-new-route';

const {
  util: {
    helpers: { isLearner, isEmptySeat, isGroup, getCommunityProfilePhotoId }
  }
} = common;

class AddTaskHeaderComponent extends Component {
  beforeEnterAnimation() {
    anime({
      targets: this.refs.taskHeader,
      translateY: -10,
      opacity: 0,
      duration: 0
    });
  }
  enterAnimation() {
    anime({
      targets: this.refs.taskHeader,
      translateY: 0,
      opacity: 1,
      duration: 500,
      easing: 'easeInCubic'
    });
  }
  exitAnimation(callback) {
    anime({
      targets: this.refs.taskHeader,
      translateY: -10,
      opacity: 0,
      duration: 500,
      easing: 'easeInCubic',
      complete: callback
    });
  }
  componentWillEnter(callback) {
    this.beforeEnterAnimation();
    callback();
  }
  componentDidEnter() {
    this.enterAnimation();
  }
  componentWillLeave(callback) {
    this.exitAnimation(callback);
  }
  componentDidLeave() {
    // this.exitAnimation();
  }
  componentWillAppear(callback) {
    this.beforeEnterAnimation();
    callback();
  }

  componentDidAppear() {
    this.enterAnimation();
  }

  render() {
    const { addTaskStep } = this.props;
    const taskHeaderContent = cond([
      [equals(1), always('Create New Task')],
      [equals(2), always('Create New Task')],
      [equals(3), always('Review Task')],
      [equals(4), always('Assign Task')]
    ])(addTaskStep);

    return (
      <h1 className="title" ref="taskHeader">
        {taskHeaderContent}
      </h1>
    );
  }
}

class AddTaskAttachmentHeaderComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      attachmentCategory: 'videos'
    };
  }

  beforeEnterAnimation() {
    anime({
      targets: this.refs.taskHeader,
      translateY: -10,
      opacity: 0,
      duration: 0
    });
  }
  enterAnimation() {
    anime({
      targets: this.refs.taskHeader,
      translateY: 0,
      opacity: 1,
      duration: 500,
      easing: 'easeInCubic'
    });
  }
  exitAnimation(callback) {
    anime({
      targets: this.refs.taskHeader,
      translateY: -10,
      opacity: 0,
      duration: 500,
      easing: 'easeInCubic',
      complete: callback
    });
  }
  componentWillEnter(callback) {
    this.beforeEnterAnimation();
    callback();
  }
  componentDidEnter() {
    this.enterAnimation();
  }
  componentWillLeave(callback) {
    this.exitAnimation(callback);
  }
  componentDidLeave() {
    // this.exitAnimation();
  }
  componentWillAppear(callback) {
    this.beforeEnterAnimation();
    callback();
  }

  componentDidAppear() {
    this.enterAnimation();
  }

  changeAttachmentCategory(category) {
    const { changeAttachmentCategory: parentCategory } = this.props;
    this.setState({ attachmentCategory: category });
    parentCategory(category);
  }

  render() {
    const { attachmentCategory } = this.state;

    return (
      <div className="container">
        <div className="navigation">
          <ul className="tabs left">
            <li
              className={attachmentCategory === 'videos' && 'is-active'}
              onClick={() => {
                this.changeAttachmentCategory('videos');
              }}
            >
              <a>
                <span>Add Video</span>
                <span className="icon nav-tab">
                  <div className="icon-play" />
                </span>
              </a>
            </li>
            <li
              className={attachmentCategory === 'documents' && 'is-active'}
              onClick={() => this.changeAttachmentCategory('documents')}
            >
              <a>
                <span>Documents</span>
                <span className="icon nav-tab">
                  <div className="icon-doc" />
                </span>
              </a>
            </li>
            <li
              className={attachmentCategory === 'activities' && 'is-active'}
              onClick={() => this.changeAttachmentCategory('activities')}
            >
              <a>
                <span>Activities</span>
                <span className="icon nav-tab">
                  <div className="icon-exercise" />
                </span>
              </a>
            </li>
          </ul>
          <ul className="tabs right" />
          <div className="columns task-panel-actions">
            <div className="column has-text-centered" />
            <div className="column has-text-centered">
              <span className="icon nav-tab">
                <div className="icon-search" />
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class AddTaskAttachmentBodyComponent extends Component {
  constructor(props) {
    super(props);
    this.uploadFile = this.uploadFile.bind(this);
    this.uploadDoc = this.uploadDoc.bind(this);
    this.findDoc = this.findDoc.bind(this);
  }
  beforeEnterAnimation() {
    const { attachmentCategory } = this.props;
    if (attachmentCategory === 'videos') {
      const attachmentCards = document.getElementsByClassName(
        'video-attachment-card-row'
      );
      anime({
        targets: attachmentCards,
        translateX: 50,
        opacity: 0,
        duration: 0
      });
    } else if (attachmentCategory === 'documents') {
      const attachmentCards = [
        ...document.getElementsByClassName('document-col-1'),
        ...document.getElementsByClassName('document-col-2'),
        ...document.getElementsByClassName('document-col-3')
      ];
      anime({
        targets: attachmentCards,
        translateY: -5,
        opacity: 0,
        duration: 0
      });
    }
  }
  enterAnimation() {
    const { attachmentCategory } = this.props;
    if (attachmentCategory === 'videos') {
      const attachmentCards = document.getElementsByClassName(
        'video-attachment-card-row'
      );
      anime({
        targets: attachmentCards, //[...chunkedArray],
        translateX: 0,
        opacity: 1,
        duration: 500,
        delay: anime.stagger(200),
        easing: 'easeInCubic'
      });
    } else if (attachmentCategory === 'documents') {
      const t1 = anime.timeline();
      console.log('entry animation doc started');
      t1.add({
        targets: document.getElementsByClassName('document-col-1'),
        translateY: 0,
        opacity: 1,
        duration: 300,
        easing: 'easeInCubic'
      });
      t1.add({
        targets: document.getElementsByClassName('document-col-2'),
        translateY: 0,
        opacity: 1,
        duration: 300,
        easing: 'easeInCubic'
      });
      t1.add({
        targets: document.getElementsByClassName('document-col-3'),
        translateY: 0,
        opacity: 1,
        duration: 300,
        easing: 'easeInCubic'
      });
    }
  }
  exitAnimation(callback) {
    const { attachmentCategory } = this.props;
    if (attachmentCategory === 'videos') {
      const attachmentCards = document.getElementsByClassName(
        'video-attachment-card-row'
      );
      anime({
        targets: attachmentCards,
        translateX: -10,
        opacity: 0,
        duration: 500,
        easing: 'easeInCubic',
        complete: callback
      });
    } else if (attachmentCategory === 'documents') {
      const attachmentCards = [
        ...document.getElementsByClassName('document-col-1'),
        ...document.getElementsByClassName('document-col-2'),
        ...document.getElementsByClassName('document-col-3')
      ];
      anime({
        targets: attachmentCards,
        translateY: 5,
        opacity: 0,
        duration: 500,
        easing: 'easeInCubic',
        complete: callback
      });
    }
  }
  componentWillEnter(callback) {
    this.beforeEnterAnimation();
    callback();
  }
  componentDidEnter() {
    this.enterAnimation();
  }
  componentWillLeave(callback) {
    this.exitAnimation(callback);
  }
  componentDidLeave() {
    console.log('componentDidLeave');
    // this.exitAnimation();
  }
  componentWillAppear(callback) {
    this.beforeEnterAnimation();
    callback();
  }

  componentDidAppear() {
    this.enterAnimation();
  }
  uploadFile(e) {
    const { authorFileUploadAttempt, user } = this.props;
    const file = e.target.files[0];
    const fileData = new FormData();
    fileData.append('task_file', file);
    authorFileUploadAttempt(fileData, {
      member_id: user.member_id,
      source: 'task'
    });
  }
  uploadDoc(e) {
    const { authorFileUploadAttempt, user } = this.props;
    const file = e.target.files[0];
    const fileData = new FormData();
    fileData.append('task_file', file);
    authorFileUploadAttempt(fileData, {
      member_id: user.member_id,
      source: 'task'
    });
  }
  findDoc(doc) {
    const { taskContent } = this.props;
    return taskContent.find(d => d.media_id === doc.media_id);
  }
  isMediaActive(video, videos) {
    return !!videos.find(v => v.media_id === video.media_id);
  }
  renderAttachmentListBody(attachmentCategory) {
    const {
      videos,
      documents,
      attemptingAuthorFileUpload,
      addTaskContent,
      removeTaskContent,
      openMediaAddModal,
      taskContent,
      activities,
      addTaskActivity,
      taskActivities
    } = this.props;
    console.log(taskContent);
    if (attemptingAuthorFileUpload) return <UILoading marginTop="100px" />;
    return cond([
      [
        equals('videos'),
        always(
          <div className="section">
            <div className="columns is-multiline is-mobile video-attachment-card-row ">
              <div className="column is-one-fifth">
                <div className="card upload-media-box">
                  <span className="nav-tab">
                    <div className="icon-upload-img" />
                  </span>
                  <p className="is-primary">Add Media</p>
                  <a
                    className="button is-primary is-outlined is-small"
                    onClick={openMediaAddModal}
                  >
                    Upload Media
                  </a>
                </div>
              </div>
              {videos.map(video => (
                <div key={video.media_id} className="column is-one-fifth">
                  <div className="card media-box">
                    <div className="media-box-img">
                      <span className="mb-img">
                        <img src={video.thumbnail} alt="IMG" />
                      </span>
                      <div className="mb-overlay">
                        <span
                          className={classNames('mb-circle', {
                            selected: this.isMediaActive(video, taskContent)
                          })}
                          onClick={e => {
                            e.currentTarget.classList.add('selected');
                            addTaskContent(video);
                          }}
                        />
                        {video.duration && (
                          <span className="mb-time">{video.duration}</span>
                        )}
                      </div>
                    </div>
                    <div className="media-box-detail">
                      <h4>{video.title}</h4>
                      <p>{video.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      ],
      [
        equals('documents'),
        always(
          <div className="section document-section columns is-multiline document-col-0">
            <div className="column is-one-third">
              <div className="document-box document-box--upload">
                <label className="label-rdbtn" htmlFor="upload-doc">
                  <div className="document-main">
                    <div className="document-img">
                      <img src={iconUpload} width="34" alt="IMG" />
                    </div>
                    <div className="document-detail">
                      <h4>Upload a document</h4>
                      <p>
                        Upload a document, PDF, Word, Xcel and Other documents
                        here.
                      </p>
                    </div>
                  </div>
                  <input
                    type="file"
                    onChange={this.uploadDoc}
                    id="upload-doc"
                  />
                </label>
              </div>
            </div>
            {documents.map((document, i) => (
              <div
                key={document.media_id}
                className={`column is-one-third document-col-${i}`}
              >
                <div className="document-box">
                  <label className="label-rdbtn">
                    <div className="document-main">
                      <div className="document-img">
                        {/* <img
                          src={iconDOC}
                          width="34"
                          alt="IMG"
                        /> */}
                        <i className="fa fa-file" aria-hidden="true" />
                      </div>
                      <div className="document-detail">
                        <h4>{document.title}</h4>
                        <p>{document.description}</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      name="checkbox"
                      onChange={() => {
                        addTaskContent(document);
                      }}
                      checked={!!this.findDoc(document)}
                    />
                    <span className="checkmark" />
                  </label>
                </div>
              </div>
            ))}
          </div>
        )
      ],
      [
        equals('activities'),
        always(
          <div className="activities-section">
            <div className="columns is-multiline">
              {activities.map(activity => (
                <div className="activity" key={activity.activity_id}>
                  <div
                    className="activity__select__container"
                    onClick={() => {
                      addTaskActivity(activity.activity_id);
                    }}
                  >
                    <div
                      className={classNames('activity__select', {
                        selected:
                          taskActivities.indexOf(activity.activity_id) !== -1
                      })}
                    />
                  </div>
                  <i
                    className="fa fa-file-text-o activity__icon"
                    aria-hidden="true"
                  />
                  <div className="activity__info">
                    <div className="activity__title">{activity.title}</div>
                    <div className="activity__description">
                      {activity.description}
                    </div>
                  </div>
                  <hr />
                </div>
              ))}
            </div>
          </div>
        )
      ]
    ])(attachmentCategory);
  }
  render() {
    const { attachmentCategory } = this.props;
    const attachmentBody = this.renderAttachmentListBody(attachmentCategory);
    return (
      <div className="container" style={{ overflowX: 'hidden' }}>
        {attachmentBody}
      </div>
    );
  }
}

class AddTaskFooterComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      greenBtnActive: false
    };
    this.dismissAll = this.dismissAll.bind(this);
  }

  beforeEnterAnimation() {
    const { addTaskStep } = this.props;

    if (addTaskStep === 1) {
      anime({
        targets: this.refs.addTaskFooter,
        translateY: 74,
        opacity: 1,
        duration: 0
      });
    }
  }
  enterAnimation() {
    const { addTaskStep } = this.props;
    console.log('footer enter animation', addTaskStep);
    if (addTaskStep === 1) {
      anime({
        targets: this.refs.addTaskFooter,
        translateY: 0,
        opacity: 1,
        duration: 500,
        easing: 'easeInCubic'
      });
    }
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.addTaskStep === 4 && this.state.greenBtnActive === false) {
      this.setState({ greenBtnActive: true });
      anime({
        targets: this.refs.stepNextBtn,
        backgroundColor: '#85BB23',
        duration: 400
        // complete: function () {
        //   prevProps.openAddTaskView();
        // }
      });
    }
  }
  exitAnimation(callback) {
    callback();
  }
  componentWillEnter(callback) {
    this.beforeEnterAnimation();
    callback();
  }
  componentDidEnter() {
    this.enterAnimation();
  }
  componentWillLeave(callback) {
    this.exitAnimation(callback);
  }
  componentDidLeave() {
    // this.exitAnimation();
  }
  componentWillAppear(callback) {
    this.beforeEnterAnimation();
    callback();
  }

  componentDidAppear() {
    this.enterAnimation();
  }

  changeAttachmentCategory(category) {
    const { changeAttachmentCategory: parentCategory } = this.props;
    this.setState({ attachmentCategory: category });
    parentCategory(category);
  }

  dismissAll() {
    const {
      authorTaskCreateAttempt,
      taskTitle,
      taskDescription,
      user,
      taskActive,
      startDate,
      dueDate,
      taskContent,
      userData,
      isEdit,
      taskId,
      authorTaskUpdateAttempt,
      updateTaskState,
      taskActivities
    } = this.props;
    const params = {
      title: taskTitle,
      description: taskDescription,
      active: taskActive,
      start_date: moment(startDate).format('YYYY-MM-DD'),
      due_date: moment(dueDate).format('YYYY-MM-DD'),
      media: taskContent.map(item => item.media_id),
      member_id: [userData.member_id],
      activity: taskActivities
    };
    if (isEdit) {
      authorTaskUpdateAttempt(
        user.member_id,
        params,
        userData.member_id,
        taskId
      );
    } else {
      authorTaskCreateAttempt(user.member_id, params, userData.member_id);
    }
    updateTaskState('', '', 0, [], [], new Date(), new Date());
    anime({
      targets: this.refs.addTaskFooter,
      translateY: 74,
      opacity: 0,
      duration: 500,
      easing: 'easeInCubic',
      complete: () => {
        this.props.dismissAddTaskView();
      }
    });
  }

  render() {
    const { handleAddTaskStepChange, addTaskStep } = this.props;
    return (
      <div className="step-bar" ref="addTaskFooter">
        <div>
          <div className="columns">
            <div className="column is-three-fifths">
              <ul>
                <li className={addTaskStep === 1 && 'active'}>
                  <p>Step 1</p>
                  <p>Add Title & Description</p>
                </li>
                <li className={addTaskStep === 2 && 'active'}>
                  <p>Step 2</p>
                  <p>Add Content</p>
                </li>
                <li
                  className={
                    (addTaskStep === 3 || addTaskStep === 4) && 'active'
                  }
                >
                  <p>Step 3</p>
                  <p>Review & Share</p>
                </li>
              </ul>
            </div>
            <div className="column has-text-right">
              <a
                className="button is-primary is-inverted is-outlined next-btn"
                ref="stepNextBtn"
                onClick={
                  addTaskStep !== 4 ? handleAddTaskStepChange : this.dismissAll
                }
              >
                {addTaskStep !== 4 ? 'Next' : 'Complete'}
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class AddTaskAttachmentComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      attachmentCategory: 'videos',
      attachmentCategoryChangePending: false
    };
    this.changeAttachmentCategory = this.changeAttachmentCategory.bind(this);
  }

  changeAttachmentCategory(newAttachmentCategory) {
    if (newAttachmentCategory !== this.state.attachmentCategory) {
      this.setState({ attachmentCategoryChangePending: true });
      setTimeout(
        () =>
          this.setState({
            attachmentCategory: newAttachmentCategory,
            attachmentCategoryChangePending: false
          }),
        550
      );
    }
  }

  render() {
    const { attachmentCategory, attachmentCategoryChangePending } = this.state;
    const {
      authorFileUploadAttempt,
      videos,
      documents,
      attemptingAuthorFileUpload,
      user,
      taskContent,
      addTaskContent,
      removeTaskContent,
      openMediaAddModal,
      activities,
      addTaskActivity,
      taskActivities
    } = this.props;

    return (
      <div
        ref="taskBody"
        className={`taskVideo ${attachmentCategory === 'documents' &&
          'taskDocument'}`}
      >
        <section className="content-section tasks-navigation navigation-section">
          <AddTaskAttachmentHeaderComponent
            attachmentCategory={attachmentCategory}
            changeAttachmentCategory={this.changeAttachmentCategory}
          />
        </section>
        <div className="overflow-scroll">
          <TransitionGroup>
            {!attachmentCategoryChangePending && (
              <AddTaskAttachmentBodyComponent
                attachmentCategory={attachmentCategory}
                authorFileUploadAttempt={authorFileUploadAttempt}
                videos={videos}
                documents={documents}
                attemptingAuthorFileUpload={attemptingAuthorFileUpload}
                user={user}
                taskContent={taskContent}
                addTaskContent={addTaskContent}
                removeTaskContent={removeTaskContent}
                openMediaAddModal={openMediaAddModal}
                activities={activities}
                addTaskActivity={addTaskActivity}
                taskActivities={taskActivities}
              />
            )}
          </TransitionGroup>
        </div>
      </div>
    );
  }
}

class AddTaskBodyComponent extends Component {
  constructor(props) {
    super(props);
    this.renderAddTaskStepBody = this.renderAddTaskStepBody.bind(this);
  }
  beforeEnterAnimation() {
    const { addTaskStep } = this.props;
    if (addTaskStep === 1) {
      anime({
        targets: this.refs.taskBody,
        translateY: 20,
        opacity: 0,
        duration: 0
      });
    } else if (addTaskStep === 3) {
      const t1 = anime.timeline();
      t1.add({
        targets: this.refs.leftTaskColumn,
        translateY: 20,
        opacity: 0,
        duration: 0
      }).add({
        targets: this.refs.rightTaskColumn,
        translateX: 30,
        opacity: 0,
        duration: 0
      });
    } else if (addTaskStep === 4) {
      const t1 = anime.timeline();
      t1.add({
        targets: this.refs.taskBody,
        translateY: -10,
        opacity: 0,
        duration: 0
      }).add({
        targets: this.refs.assignTaskTo,
        translateY: -10,
        opacity: 0,
        duration: 0
      });
    }
  }
  enterAnimation() {
    const { addTaskStep } = this.props;
    if (addTaskStep === 1) {
      anime({
        targets: this.refs.taskBody,
        translateY: 0,
        opacity: 1,
        duration: 500,
        easing: 'easeInCubic'
      });
    } else if (addTaskStep === 3) {
      const t1 = anime.timeline();
      t1.add({
        targets: this.refs.leftTaskColumn,
        translateY: 0,
        opacity: 1,
        // delay: 200,
        duration: 1000,
        easing: 'easeInCubic'
      }).add(
        {
          targets: this.refs.rightTaskColumn,
          translateX: 0,
          opacity: 1,
          // delay: 200,
          duration: 1000,
          easing: 'easeInCubic'
        },
        0
      );
    } else if (addTaskStep === 4) {
      const t1 = anime.timeline();
      t1.add({
        targets: this.refs.taskBody,
        translateY: 0,
        opacity: 1,
        duration: 200,
        easing: 'easeInCubic'
      }).add({
        targets: this.refs.assignTaskTo,
        translateY: 0,
        opacity: 1,
        duration: 500,
        easing: 'easeInCubic'
      });
    }
  }
  exitAnimation(callback) {
    const { addTaskStep } = this.props;
    if (addTaskStep === 1) {
      const t1 = anime.timeline();
      t1.add({
        targets: this.refs.taskBody,
        translateY: -10,
        translateX: -10,
        scale: 0,
        opacity: 0,
        duration: 500,
        easing: 'easeInCubic',
        complete: callback
      });
    } else if (addTaskStep === 2) {
      const t1 = anime.timeline();
      t1.add({
        targets: this.refs.taskBody,
        translateX: 50,
        opacity: 0,
        duration: 500,
        easing: 'easeInCubic',
        complete: callback
      });
    } else if (addTaskStep === 3) {
      const t1 = anime.timeline();
      t1.add({
        targets: this.refs.taskBody,
        translateY: -50,
        opacity: 0,
        duration: 500,
        easing: 'easeInCubic',
        complete: callback
      });
    } else {
      callback();
    }
  }
  componentWillEnter(callback) {
    this.beforeEnterAnimation();
    callback();
  }
  componentDidEnter() {
    this.enterAnimation();
  }
  componentWillLeave(callback) {
    this.exitAnimation(callback);
  }
  componentDidLeave() {
    // this.exitAnimation();
  }
  componentWillAppear(callback) {
    this.beforeEnterAnimation();
    callback();
  }

  componentDidAppear() {
    this.enterAnimation();
  }

  renderAddTaskStepBody(
    addTaskStep,
    cloudinary_file_id,
    profilePhotoId,
    canSeeOthersProgress,
    progress_percentage,
    isLearnerItem,
    isEmptySeatItem,
    isGroupItem,
    title,
    gender,
    screen_name,
    member_id,
    hasSector,
    hasQualification,
    hasPreferences,
    hasLearners,
    number_of_learners,
    hasGroups,
    groups_count,
    sector
  ) {
    const {
      taskTitle,
      taskDescription,
      changeInputValue,
      changeTaskActive,
      taskActive,
      authorFileUploadAttempt,
      videos,
      documents,
      attemptingAuthorFileUpload,
      user,
      taskContent,
      addTaskContent,
      removeTaskContent,
      isTaskTitleValid,
      updateDates,
      startDate,
      dueDate,
      openMediaAddModal,
      activities,
      addTaskActivity,
      taskActivities
    } = this.props;
    return cond([
      [
        equals(1),
        always(
          <div className="section">
            {!isTaskTitleValid && (
              <div className="community-task-error">
                Please enter title and description
              </div>
            )}
            <div className="createNew-task">
              <div className="columns">
                <div className="column is-three-quarters">
                  <div className="field">
                    <div className="control add-title">
                      <input
                        className="input"
                        type="text"
                        placeholder="Add Title Here"
                        value={taskTitle}
                        onChange={e => {
                          changeInputValue('taskTitle', e);
                        }}
                      />
                      <label>Title</label>
                    </div>
                  </div>
                  <div className="field">
                    <div className="control add-description">
                      <input
                        className="input"
                        type="text"
                        placeholder="Add Description / Note Here"
                        value={taskDescription}
                        onChange={e => {
                          changeInputValue('taskDescription', e);
                        }}
                      />
                      <label>Description / Note</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      ],
      [
        equals(2),
        always(
          <AddTaskAttachmentComponent
            authorFileUploadAttempt={authorFileUploadAttempt}
            videos={videos}
            documents={documents}
            attemptingAuthorFileUpload={attemptingAuthorFileUpload}
            user={user}
            activities={activities}
            addTaskActivity={addTaskActivity}
            taskActivities={taskActivities}
            taskContent={taskContent}
            addTaskContent={addTaskContent}
            removeTaskContent={removeTaskContent}
            openMediaAddModal={openMediaAddModal}
          />
        )
      ],
      [
        equals(3),
        always(
          <div className="review-task-block">
            <div className="overflow-scroll">
              <div className="container">
                <div className="columns">
                  <div className="column" ref="leftTaskColumn">
                    <div className="review-task task-panel-title">
                      <h1 className="title">Lesson Preparation - Red Wines</h1>
                      <h4 className="subtitle">
                        On friday we are going to go through the different types
                        of red wine available.Before then I’d like you to
                        familiarise yourself with the content I have put
                        together here as it will prove as good preparation.
                      </h4>
                    </div>
                    <div className="gradientWhite">
                      <div className="task-content">
                        <label className="t-title">TASK CONTENT</label>
                        {taskContent.map(file => (
                          <div className="document-box" key={file.media_id}>
                            <label className="label-rdbtn">
                              <div className="document-main">
                                <div className="document-img">
                                  <img src={iconPDF} alt="IMG" />
                                </div>
                                <div className="document-detail">
                                  <h4>{file.title}</h4>
                                  <p>{file.description}</p>
                                </div>
                              </div>
                              <span className="icon nav-tab">
                                <div className="icon-check" />
                              </span>
                            </label>
                            <div className="action-btns">
                              <p>
                                <a
                                  onClick={() => {
                                    removeTaskContent(file);
                                  }}
                                >
                                  Remove
                                </a>
                                <a href="#">Preview</a>
                              </p>
                              <span
                                className="icon nav-tab"
                                onClick={() => {
                                  removeTaskContent(file);
                                }}
                              >
                                <div className="icon-close" />
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div
                    className="column community-task-calendar"
                    ref="rightTaskColumn"
                  >
                    <div
                      className="task-content select-date"
                      // onClick={this.props.handleAddTaskStepChange}
                    >
                      <label className="t-title">SELECT A DUE DATE</label>
                      <Calendar
                        onChange={updateDates}
                        value={[startDate, dueDate]}
                        calendarType="US"
                        tileClassName="community-task-calendar__btn"
                        locale="en-US"
                        prevLabel={
                          <i className="fa fa-arrow-left" aria-hidden="true" />
                        }
                        nextLabel={
                          <i className="fa fa-arrow-right" aria-hidden="true" />
                        }
                        selectRange
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      ],
      [
        // equals(or(4,5)),
        equals(4),
        always(
          <div className="overflow-scroll">
            <div className="container">
              <div className="section">
                <div className="columns">
                  <div className="column is-three-quarters">
                    <table>
                      <tbody>
                        <tr className="community-list-item community-list-item-inner">
                          <td>
                            <div className="columns">
                              <div className="column no-grow">
                                <CommunityProgressBadge
                                  {...{
                                    cloudinary_file_id,
                                    profilePhotoId,
                                    canSeeOthersProgress,
                                    progress_percentage,
                                    isLearner: isLearnerItem,
                                    gender
                                  }}
                                />
                                {!isEmptySeatItem && !isGroupItem && (
                                  <div className="image overlay">
                                    <div className="value">
                                      {canSeeOthersProgress
                                        ? progress_percentage &&
                                          `${Math.round(progress_percentage)}%`
                                        : 0}
                                    </div>
                                  </div>
                                )}
                              </div>
                              <div className="column name">
                                {!isEmptySeatItem &&
                                  ((isGroupItem && title) || (
                                    <div>
                                      <div className="semibold">
                                        {screen_name}
                                      </div>
                                      <div className="reg-id">
                                        <Text iKey="registration_id" />{' '}
                                        {member_id}
                                      </div>
                                    </div>
                                  ))}
                                {isEmptySeatItem && <Text iKey="empty_seat" />}
                              </div>
                            </div>
                          </td>
                          {!isEmptySeatItem && !isGroupItem && hasSector && (
                            <td colSpan="2">{sector || 'n/a'}</td>
                          )}
                          {!isEmptySeatItem &&
                            !isGroupItem &&
                            hasQualification && <td>{short_title || 'n/a'}</td>}
                          {!isEmptySeatItem &&
                            !isGroupItem &&
                            hasPreferences && <td>{'n/a'}</td>}
                          {!isEmptySeatItem && !isGroupItem && hasLearners && (
                            <td className="has-text-right">
                              {number_of_learners || 0}
                            </td>
                          )}
                          {!isEmptySeatItem && !isGroupItem && hasGroups && (
                            <td className="has-text-right">
                              {groups_count || 0}
                            </td>
                          )}
                          <td className="has-text-right">
                            <div className="remove-btn">
                              Remove
                              <span className="icon nav-tab">
                                <div className="icon-close" />
                              </span>
                            </div>
                          </td>
                        </tr>
                        <tr className="community-list-item community-list-item-inner">
                          <td>
                            <div className="task-lesson">
                              <span className="icon nav-tab">
                                <div className="icon-up-arrow" />
                              </span>
                              <div>
                                <h3>Lesson Preparation - {taskTitle}</h3>
                                <div className="regs-id">
                                  {taskContent.map((item, i) => (
                                    <div key={i}>{item.title}</div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td />
                          <td />
                          <td className="has-text-right">
                            <div>
                              <span className="gray">Due Date </span>{' '}
                              {moment(dueDate).format('D MMM YYYY')}
                            </div>
                          </td>
                        </tr>
                        <tr
                          className="community-list-item community-list-item-inner"
                          ref="assignTaskTo"
                        >
                          <td colSpan="2">
                            <div className="task-lesson padded">
                              <span className="icon nav-tab">
                                <div className="icon-plus" />
                              </span>
                              <div>
                                <h4>
                                  Assign Task to Another Individual or Group
                                </h4>
                              </div>
                            </div>
                          </td>
                          <td />
                          <td className="has-text-right" />
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="column">
                    <div className="about-task">
                      <div className="about-task-block about-task-status">
                        <div className="share-to align-center">
                          <span className="icon nav-tab">
                            <div className="icon-share-b" />
                          </span>
                          <span className="at-text share-to-text">
                            Sharing to: 0
                          </span>
                        </div>
                        <div className="amend-share align-center">
                          <span className="at-text amend-share-text">
                            Amend Sharing
                          </span>
                          <span className="icon nav-tab">
                            <div className="icon-edit" />
                          </span>
                        </div>
                      </div>
                      <div className="about-task-block about-task-share">
                        <span className="at-text status-text">Status</span>
                        <div className="task-toggle">
                          <span className="at-text not-act-text">
                            Not Active
                          </span>
                          <label className="switch">
                            <input type="checkbox" checked={taskActive === 1} />
                            <span
                              onClick={changeTaskActive}
                              className="slider round"
                            />
                          </label>
                        </div>
                      </div>
                      <div className="about-task-block about-task-del">
                        <span className="at-text del-task-text">
                          Delete Task
                        </span>
                        <div className="delete-task-opt">
                          <a href="#" className="align-center">
                            <span>Delete</span>
                            <span className="icon nav-tab">
                              <div className="icon-bin" />
                            </span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      ]
    ])(addTaskStep);
  }

  render() {
    const {
      userData,
      canSeeOthersProgress,
      activeSection,
      handleAddTaskStepChange,
      addTaskStep,
      taskTitle,
      taskDescription,
      changeInputValue
    } = this.props;

    const {
      cloudinary_file_id,
      member_id,
      screen_name,
      title,
      current_qualification,
      gender,
      groups_count,
      number_of_learners
    } = userData;
    const profilePhotoId = getCommunityProfilePhotoId(userData);
    const isLearnerItem = isLearner(userData);
    const isEmptySeatItem = isEmptySeat(userData);
    const isGroupItem = isGroup(userData);
    const hasSector = !contains(activeSection, [
      'centre-tutors',
      'super-admins',
      'site-admins',
      'eqas'
    ]);
    const hasQualification = !contains(activeSection, [
      'super-admins',
      'site-admins',
      'centre-tutors',
      'eqas',
      'centre-admins'
    ]);
    const hasPreferences = contains(activeSection, [
      'super-admins',
      'site-admins'
    ]);
    const hasLearners = contains(activeSection, ['centre-admins']);
    const hasGroups = false;

    let progress_percentage;
    let sector;
    if (current_qualification) {
      sector = current_qualification.sector;
      progress_percentage = current_qualification.progress_percentage;
    }

    const taskBodyContent = this.renderAddTaskStepBody(
      addTaskStep,
      cloudinary_file_id,
      profilePhotoId,
      canSeeOthersProgress,
      progress_percentage,
      isEmptySeatItem,
      isGroupItem,
      title,
      gender,
      screen_name,
      member_id,
      hasSector,
      hasQualification,
      hasPreferences,
      hasLearners,
      number_of_learners,
      hasGroups,
      groups_count,
      sector
    );
    return (
      <div className="container">
        <div ref="taskBody">{taskBodyContent}</div>
      </div>
    );
  }
}

class TaskAddComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addTaskStep: 1,
      addTaskFooterStep: 1,
      headerUpdatePending: false,
      footerUpdatePending: false,
      isTaskTitleValid: true
    };
    this.handleAddTaskStepChange = this.handleAddTaskStepChange.bind(this);
    this.dismissAddTaskView = this.dismissAddTaskView.bind(this);
    this.getVideos = this.getVideos.bind(this);
  }

  handleAddTaskStepChange() {
    const { taskTitle, taskDescription } = this.props;
    const { addTaskStep } = this.state;
    if (addTaskStep === 1 && (taskTitle === '' || taskDescription === '')) {
      this.setState({
        isTaskTitleValid: false
      });
      return;
    }
    this.setState({ headerUpdatePending: true, footerUpdatePending: true });

    // setTimeout(() => {

    // }, 0);
    setTimeout(() => {
      this.setState({
        addTaskStep: Math.min(this.state.addTaskStep + 1, 4),
        headerUpdatePending: false
      });
    }, 1050);
  }

  componentDidUpdate(nextProps, nextState) {
    if (this.state.footerUpdatePending === true) {
      this.setState({
        addTaskFooterStep: Math.min(this.state.addTaskFooterStep + 1, 4),
        footerUpdatePending: false
      });
    }
  }
  dismissAddTaskView() {
    anime({
      targets: this.refs.taskAddComponent,
      opacity: 0,
      duration: 500,
      complete: anim => {
        this.props.openAddTaskView();
      }
    });
  }

  convertToArray(obj) {
    let arr = [];
    for (let i = 0; obj[i]; i++) {
      arr.push(obj[i]);
    }
    return arr;
  }

  getVideos() {
    const { files } = this.props;
    console.log(files);
    const filesArr = this.convertToArray(files);
    return filter(file => file.type === 'video', filesArr);
  }

  getDocuments() {
    const { files } = this.props;

    const filesArr = this.convertToArray(files);
    return filter(file => file.type !== 'video', filesArr);
  }
  render() {
    const {
      addTaskStep,
      addTaskFooterStep,
      headerUpdatePending,
      footerUpdatePending,
      isTaskTitleValid
    } = this.state;
    const {
      userData,
      canAccessWorkbooks,
      seenByTutor,
      seenByMemberId,
      seenByGlobalAdmin,
      canSeeOthersProgress,
      openChat,
      activeSection,
      openDeleteGroupModal,
      role,
      toggleTaskView,
      taskTitle,
      taskDescription,
      changeInputValue,
      authorTaskCreateAttempt,
      user,
      changeTaskActive,
      taskActive,
      authorFileUploadAttempt,
      files,
      attemptingAuthorFileUpload,
      taskContent,
      addTaskContent,
      removeTaskContent,
      updateDates,
      startDate,
      dueDate,
      tasks,
      activities,
      openMediaAddModal,
      editTask,
      isEdit,
      taskId,
      authorTaskUpdateAttempt,
      updateTaskState,
      addTaskActivity,
      taskActivities
    } = this.props;
    return (
      <div ref="taskAddComponent">
        <section className="content-section tasks-navigation navigation-section">
          <div className="container">
            <div className="navigation task-nav">
              <div>
                <TransitionGroup>
                  {(!headerUpdatePending || addTaskStep !== 2) && (
                    <AddTaskHeaderComponent addTaskStep={addTaskStep} />
                  )}
                </TransitionGroup>
              </div>
              <div className="columns task-panel-actions">
                <div className="column has-text-centered" />
                <div className="column has-text-centered">
                  <span className="icon nav-tab" onClick={toggleTaskView}>
                    <div className="icon-close" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className="overflow-scroll">
          <TransitionGroup>
            {!headerUpdatePending && (
              <AddTaskBodyComponent
                addTaskStep={addTaskStep}
                videos={this.getVideos()}
                documents={this.getDocuments()}
                {...{
                  userData,
                  canAccessWorkbooks,
                  seenByTutor,
                  seenByMemberId,
                  seenByGlobalAdmin,
                  canSeeOthersProgress,
                  openChat,
                  activeSection,
                  openDeleteGroupModal,
                  role,
                  taskTitle,
                  taskDescription,
                  changeInputValue,
                  changeTaskActive,
                  taskActive,
                  authorFileUploadAttempt,
                  user,
                  attemptingAuthorFileUpload,
                  taskContent,
                  addTaskContent,
                  removeTaskContent,
                  isTaskTitleValid,
                  updateDates,
                  startDate,
                  dueDate,
                  openMediaAddModal,
                  activities,
                  addTaskActivity,
                  taskActivities
                }}
                handleAddTaskStepChange={this.handleAddTaskStepChange}
              />
            )}
          </TransitionGroup>
        </div>
        <TransitionGroup>
          {!footerUpdatePending && (
            <AddTaskFooterComponent
              handleAddTaskStepChange={this.handleAddTaskStepChange}
              addTaskStep={addTaskFooterStep}
              footerUpdatePending={footerUpdatePending}
              dismissAddTaskView={this.dismissAddTaskView}
              taskTitle={taskTitle}
              taskDescription={taskDescription}
              authorTaskCreateAttempt={authorTaskCreateAttempt}
              user={user}
              taskActive={taskActive}
              startDate={startDate}
              dueDate={dueDate}
              taskContent={taskContent}
              userData={userData}
              tasks={tasks}
              isEdit={isEdit}
              taskId={taskId}
              authorTaskUpdateAttempt={authorTaskUpdateAttempt}
              updateTaskState={updateTaskState}
              taskActivities={taskActivities}
            />
          )}
        </TransitionGroup>
      </div>
    );
  }
}

export default TaskAddComponent;
