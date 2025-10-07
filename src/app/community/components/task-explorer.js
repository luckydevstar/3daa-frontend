import React, { Component } from 'react';
import moment from 'moment';
import { map } from 'ramda';

import common from 'app/common';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import anime from 'animejs/lib/anime.js';
import TaskCategoryComponent from './task-category';
import TaskAddComponent from './task-add-component';

import CommunityProgressBadge from './community-progress-badge';

const {
  components: { UILoading }
} = common;

class TaskListAnimatedComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      taskCategory: 'active'
    };
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
  }
  handleCategoryChange(category) {
    this.setState({ taskCategory: category });
  }
  componentWillEnter(callback) {
    callback();
  }

  componentWillAppear(cb) {
    anime({
      targets: this.refs.taskComponent,
      translateY: 10,
      opacity: 0,
      duration: 0
    });
    cb();
  }
  componentDidAppear() {
    anime({
      targets: this.refs.taskComponent,
      translateY: 0,
      opacity: 1,
      delay: 500,
      duration: 500,
      easing: 'cubicBezier(.5, .05, .1, .3)'
    });
  }

  componentWillLeave(callback) {
    anime({
      targets: this.refs.taskComponent,
      translateY: 10,
      opacity: 0,
      duration: 500,
      easing: 'cubicBezier(.5, .05, .1, .3)',
      complete: function(anim) {
        callback();
      }
    });
  }
  render() {
    const { taskCategory } = this.state;
    const {
      toggleTaskView,
      startDate,
      dueDate,
      parseTasksToArray
    } = this.props;
    return (
      <div ref="taskComponent">
        <section className="content-section tasks-navigation navigation-section">
          <div className="container">
            <div className="navigation">
              <ul className="tabs left">
                <li
                  className={taskCategory === 'active' && 'is-active'}
                  onClick={() => this.handleCategoryChange('active')}
                >
                  <a>
                    <span>Active Tasks</span>
                  </a>
                </li>
                <li
                  className={taskCategory === 'planned' && 'is-active'}
                  onClick={() => this.handleCategoryChange('planned')}
                >
                  <a>
                    <span>Planned Tasks</span>
                  </a>
                </li>
                <li
                  className={taskCategory === 'archived' && 'is-active'}
                  onClick={() => this.handleCategoryChange('archived')}
                >
                  <a>
                    <span>Archived Tasks</span>
                  </a>
                </li>
              </ul>
              <ul className="tabs right" />
              <div className="columns task-panel-actions">
                <div className="column has-text-centered">
                  <span className="icon nav-tab">
                    <div className="icon-search" />
                  </span>
                </div>
                <div className="column has-text-centered">
                  <span className="icon nav-tab" onClick={toggleTaskView}>
                    <div className="icon-close" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
        <TaskCategoryComponent
          taskCategory={taskCategory}
          startDate={startDate}
          dueDate={dueDate}
          parseTasksToArray={parseTasksToArray}
          {...this.props}
        />
      </div>
    );
  }
}

class TaskExplorer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAddTaskView: false,
      isEdit: false,
      taskId: null
    };
    this.openAddTaskView = this.openAddTaskView.bind(this);
    this.editTask = this.editTask.bind(this);
    this.parseTasksToArray = this.parseTasksToArray.bind(this);
  }

  openAddTaskView() {
    const { updateTaskState } = this.props;
    updateTaskState('', '', 0, [], [], new Date(), new Date());
    this.setState({ showAddTaskView: !this.state.showAddTaskView });
  }
  editTask(taskId) {
    const { updateTaskState } = this.props;
    const tasks = this.parseTasksToArray();
    const taskToEdit = tasks.find(t => t.task_id === taskId);
    const taskActivities = map(
      activity => activity.activity_id,
      taskToEdit.activity
    );
    updateTaskState(
      taskToEdit.title,
      taskToEdit.description,
      taskToEdit.active,
      taskToEdit.media,
      taskActivities,
      new Date(taskToEdit.start_date),
      new Date(taskToEdit.due_date)
    );
    this.setState({
      showAddTaskView: !this.state.showAddTaskView,
      isEdit: true,
      taskId
    });
  }
  parseTasksToArray() {
    const { tasks } = this.props;
    let arr = [];
    for (let i = 0; tasks[i]; i++) {
      arr.push(tasks[i]);
    }
    return arr;
  }
  render() {
    const { showAddTaskView, isEdit, taskId } = this.state;
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
      tasks,
      activities,
      authorTaskCreateAttempt,
      changeInputValue,
      taskTitle,
      taskDescription,
      user,
      attemptionAuthorTasks,
      taskActive,
      changeTaskActive,
      authorFileUploadAttempt,
      files,
      attemptingAuthorFileUpload,
      taskContent,
      addTaskContent,
      removeTaskContent,
      updateDates,
      startDate,
      dueDate,
      openMediaAddModal,
      authorTaskUpdateAttempt,
      updateTaskState,
      addTaskActivity,
      taskActivities
    } = this.props;
    // console.log(attemptionAuthorTasks);
    if (attemptionAuthorTasks) return <UILoading marginTop="200px" />;
    return (
      <td className="expand-td">
        {!showAddTaskView ? (
          <TransitionGroup>
            <TaskListAnimatedComponent
              openAddTaskView={this.openAddTaskView}
              parseTasksToArray={this.parseTasksToArray}
              editTask={this.editTask}
              toggleTaskView={toggleTaskView}
              tasks={tasks}
              userData={userData}
              startDate={startDate}
              dueDate={dueDate}
            />
          </TransitionGroup>
        ) : (
          <TaskAddComponent
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
              authorTaskCreateAttempt,
              taskTitle,
              taskDescription,
              changeInputValue,
              user,
              taskActive,
              changeTaskActive,
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
              isEdit,
              taskId,
              authorTaskUpdateAttempt,
              updateTaskState,
              addTaskActivity,
              taskActivities
            }}
            openAddTaskView={this.openAddTaskView}
            parseTasksToArray={this.parseTasksToArray}
            toggleTaskView={toggleTaskView}
          />
        )}
        {/* {showAddTaskView && } */}
        {/* <div className="TaskVideo">
                <section className="content-section tasks-navigation navigation-section">
                  <div className="container">
                    <div className="navigation">

                      <ul className="tabs left">
                        <li className="is-active"><a><span>Active Tasks</span></a></li>
                        <li><a><span>Planned Tasks</span></a></li>
                        <li><a><span>Archived Tasks</span></a></li>
                      </ul>
                      <ul className="tabs right"></ul>
                      <div className="columns task-panel-actions">
                        <div className="column has-text-centered">
                          <span className="icon nav-tab">
                            <div className="icon-search" />
                          </span>
                        </div>
                        <div className="column has-text-centered">
                          <span className="icon nav-tab" onClick={this.toggleTaskView}>
                            <div className="icon-close" />
                          </span>
                        </div>

                      </div>


                    </div>
                  </div>
                </section>
                <div className="overflow-scroll">
                  <div className="container">
                    <div className="section">
                      <div className="columns is-multiline is-mobile">
                        <div className="column is-one-fifth">
                          <div className="card upload-media-box">
                            <span className="nav-tab">
                              <div className="icon-upload-img" />
                            </span>
                            <p className="is-primary">Add Media</p>
                            <a className="button is-primary is-outlined is-small">Upload Media</a>
                          </div>
                        </div>
                        <div className="column is-one-fifth">
                          <div className="card media-box">
                            <div className="media-box-img">
                              <span className="mb-img"><img src="images/img-1.jpg" alt="IMG" /></span>
                              <div className="mb-overlay">
                                <span className="mb-circle"></span>
                                <span className="mb-time">2 min</span>
                              </div>
                            </div>
                            <div className="media-box-detail">
                              <h4>The Video Title</h4>
                              <p>See how to correctly prepare for and lay</p>
                            </div>
                          </div>
                        </div>
                        <div className="column is-one-fifth">
                          <div className="card media-box">
                            <div className="media-box-img">
                              <span className="mb-img"><img src="images/img-1.jpg" alt="IMG" /></span>
                              <div className="mb-overlay">
                                <span className="mb-circle"></span>
                                <span className="mb-time">2 min</span>
                              </div>
                            </div>
                            <div className="media-box-detail">
                              <h4>The Video Title</h4>
                              <p>See how to correctly prepare for and lay</p>
                            </div>
                          </div>
                        </div>
                        <div className="column is-one-fifth">
                          <div className="card media-box">
                            <div className="media-box-img">
                              <span className="mb-img"><img src="images/img-1.jpg" alt="IMG" /></span>
                              <div className="mb-overlay">
                                <span className="mb-circle"></span>
                                <span className="mb-time">2 min</span>
                              </div>
                            </div>
                            <div className="media-box-detail">
                              <h4>The Video Title</h4>
                              <p>See how to correctly prepare for and lay</p>
                            </div>
                          </div>
                        </div>
                        <div className="column is-one-fifth">
                          <div className="card media-box">
                            <div className="media-box-img">
                              <span className="mb-img"><img src="images/img-1.jpg" alt="IMG" /></span>
                              <div className="mb-overlay">
                                <span className="mb-circle"></span>
                                <span className="mb-time">2 min</span>
                              </div>
                            </div>
                            <div className="media-box-detail">
                              <h4>The Video Title</h4>
                              <p>See how to correctly prepare for and lay</p>
                            </div>
                          </div>
                        </div>
                        <div className="column is-one-fifth">
                          <div className="card media-box">
                            <div className="media-box-img">
                              <span className="mb-img"><img src="images/img-1.jpg" alt="IMG" /></span>
                              <div className="mb-overlay">
                                <span className="mb-circle"></span>
                                <span className="mb-time">2 min</span>
                              </div>
                            </div>
                            <div className="media-box-detail">
                              <h4>The Video Title</h4>
                              <p>See how to correctly prepare for and lay</p>
                            </div>
                          </div>
                        </div>
                        <div className="column is-one-fifth">
                          <div className="card media-box">
                            <div className="media-box-img">
                              <span className="mb-img"><img src="images/img-1.jpg" alt="IMG" /></span>
                              <div className="mb-overlay">
                                <span className="mb-circle"></span>
                                <span className="mb-time">2 min</span>
                              </div>
                            </div>
                            <div className="media-box-detail">
                              <h4>The Video Title</h4>
                              <p>See how to correctly prepare for and lay</p>
                            </div>
                          </div>
                        </div>
                        <div className="column is-one-fifth">
                          <div className="card media-box">
                            <div className="media-box-img">
                              <span className="mb-img"><img src="images/img-1.jpg" alt="IMG" /></span>
                              <div className="mb-overlay">
                                <span className="mb-circle"></span>
                                <span className="mb-time">2 min</span>
                              </div>
                            </div>
                            <div className="media-box-detail">
                              <h4>The Video Title</h4>
                              <p>See how to correctly prepare for and lay</p>
                            </div>
                          </div>
                        </div>
                        <div className="column is-one-fifth">
                          <div className="card media-box">
                            <div className="media-box-img">
                              <span className="mb-img"><img src="images/img-1.jpg" alt="IMG" /></span>
                              <div className="mb-overlay">
                                <span className="mb-circle"></span>
                                <span className="mb-time">2 min</span>
                              </div>
                            </div>
                            <div className="media-box-detail">
                              <h4>The Video Title</h4>
                              <p>See how to correctly prepare for and lay</p>
                            </div>
                          </div>
                        </div>
                        <div className="column is-one-fifth">
                          <div className="card media-box">
                            <div className="media-box-img">
                              <span className="mb-img"><img src="images/img-1.jpg" alt="IMG" /></span>
                              <div className="mb-overlay">
                                <span className="mb-circle"></span>
                                <span className="mb-time">2 min</span>
                              </div>
                            </div>
                            <div className="media-box-detail">
                              <h4>The Video Title</h4>
                              <p>See how to correctly prepare for and lay</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="step-bar">
                <div>
                  <div className="columns">
                    <div className="column is-three-fifths">
                      <ul>
                        <li className="active">
                          <p>Step 1</p>
                          <p>Add Title & Description</p>
                        </li>
                        <li>
                          <p>Step 2</p>
                          <p>Add Content</p>
                        </li>
                        <li>
                          <p>Step 1</p>
                          <p>Review & Share</p>
                        </li>
                      </ul>
                    </div>
                    <div className="column has-text-right">
                      <a className="button is-primary is-inverted is-outlined next-btn">Next</a>
                    </div>
                  </div>
                </div>
              </div>
              </div>
             */}
      </td>
    );
  }
}

export default TaskExplorer;
