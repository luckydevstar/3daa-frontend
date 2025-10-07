import React, { Component } from 'react';
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
  map,
  addIndex
} from 'ramda';

const firstChild = props => {
  const childrenArray = React.Children.toArray(props.children);
  return childrenArray[0] || null;
};
class TaskTitleAnimatedComponent extends Component {
  beforeEnterAnimation() {
    anime({
      targets: this.refs.taskCategoryTitle,
      translateY: -15,
      opacity: 0,
      duration: 0
    });
  }
  enterAnimation() {
    anime({
      targets: this.refs.taskCategoryTitle,
      translateY: 0,
      opacity: 1,
      duration: 400,
      easing: 'cubicBezier(.5, .05, .1, .3)'
    });
  }
  exitAnimation(callback) {
    anime({
      targets: this.refs.taskCategoryTitle,
      translateY: -15,
      opacity: 0,
      duration: 400,
      easing: 'cubicBezier(.5, .05, .1, .3)',
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
    const { taskCategory } = this.props;
    const taskTitleContent = cond([
      [
        equals('active'),
        always({
          title: 'Active Tasks',
          subtitle:
            'Active objectives have been shared with one or more of your students and are being actively tracked.'
        })
      ],
      [
        equals('planned'),
        always({
          title: 'Planned Tasks',
          subtitle: 'Planned tasks subtitle.'
        })
      ],
      [
        equals('archived'),
        always({
          title: 'Archived Tasks',
          subtitle: 'Archived tasks subtitle'
        })
      ]
    ])(taskCategory);
    return (
      <div ref="taskCategoryTitle">
        <h1 className="title">{taskTitleContent.title}</h1>
        <h4 className="subtitle">{taskTitleContent.subtitle}</h4>
      </div>
    );
  }
}

class TaskBodyAnimatedComponent extends Component {
  beforeEnterAnimation() {
    const cards = document.getElementsByClassName('card-item');
    const addCard = document.getElementsByClassName('add-card');
    this.props.changeAddBtnOffset(cards.length);
    let offsetMultiplier;
    if (this.props.addBtnOffset === '') {
      offsetMultiplier = 0;
    } else {
      offsetMultiplier = this.props.addBtnOffset - cards.length;
    }

    anime({
      targets: cards,
      translateY: 30,
      opacity: 0,
      duration: 0
    });

    anime({
      targets: addCard,
      translateX: offsetMultiplier * cards[0].offsetWidth,
      opacity: 0,
      duration: 0
    });
  }
  enterAnimation() {
    const cards = document.getElementsByClassName('card-item');
    const addCard = document.getElementsByClassName('add-card');

    const t1 = anime.timeline();

    t1.add({
      targets: cards,
      translateY: 0,
      opacity: 1,
      duration: 400,
      delay: anime.stagger(50),
      easing: 'cubicBezier(.5, .05, .1, .3)'
    });
    t1.add({
      targets: addCard,
      opacity: 1,
      duration: 400
    });
    t1.add({
      targets: addCard,
      translateX: 0,
      duration: 600,
      easing: 'easeInOutQuint'
    });
  }
  exitAnimation(callback) {
    const cards = document.getElementsByClassName('card-item');
    const addCard = document.getElementsByClassName('add-card');

    const t1 = anime.timeline();
    t1.add({
      targets: addCard,
      opacity: 0,
      duration: 400
    });
    t1.add({
      targets: cards,
      translateY: 30,
      opacity: 0,
      duration: 400,
      delay: anime.stagger(100, { direction: 'reverse' }),
      // loop: 6,
      easing: 'cubicBezier(.5, .05, .1, .3)',
      complete: function(anim) {
        callback();
      }
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
  renderTask(task) {
    const { editTask } = this.props;
    const taskProgress = 50;
    const taskCategory = 'active';
    return (
      <div
        key={task.task_id}
        className={`column is-one-quarter assignment card-item`}
        ref="taskCategoryBody"
      >
        <progress
          className="progress is-primary is-small"
          value={taskProgress}
          max="100"
        >
          {taskProgress}%
        </progress>
        <div className="card">
          <h3>{task.title}</h3>
          <p>{task.description}</p>
          <ul className={taskCategory !== 'active' && 'hidden'}>
            <li>
              <span className="icon card-icon">
                <div className="icon-film" />
                <span className="circle-number">3</span>
              </span>
            </li>
            <li>
              <span className="icon card-icon">
                <div className="icon-book" />
                <span className="circle-number">3</span>
              </span>
            </li>
            <li>
              <span className="icon card-icon">
                <div className="icon-share" />
                <span className="circle-number">3</span>
              </span>
            </li>
            <li>
              <span className="icon card-icon">
                <div className="icon-calendar" />
              </span>
            </li>
          </ul>
          <div className="columns is-desktop inner-detail">
            <div className="column is-two-fifths has-text-centered rightborder">
              <p className="is-uppercase">Due In</p>
              {taskCategory === 'archived' ? (
                <span className="card-icon">
                  <div className="icon-tick" />
                </span>
              ) : (
                <div>
                  <h2>
                    {moment(task.due_date).diff(
                      moment(task.start_date),
                      'days'
                    )}
                  </h2>
                  <p>Days</p>
                </div>
              )}
            </div>
            <div className="column">
              <p>Course Title</p>
              <p>Unit No:</p>
              {taskCategory !== 'archived' && (
                <a
                  className="button is-rounded"
                  onClick={() => {
                    editTask(task.task_id);
                  }}
                >
                  Edit Objective
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
  render() {
    const { taskCategory, openAddTaskView, parseTasksToArray } = this.props;
    // const taskCardArr = cond([
    //   [equals('active'), always([70, 10, 30])],
    //   [equals('planned'), always([20, 50])],
    //   [equals('archived'), always([100])]
    // ])(taskCategory);
    const tasks = parseTasksToArray();

    return (
      <div
        style={{ overflowY: 'auto' }}
        className="columns is-multiline is-desktop task-card"
      >
        {tasks.length >= 4 && (
          <div className="column is-vcentered add-card add-card-first">
            <div
              className="add-task-btn has-text-centered"
              onClick={openAddTaskView}
            >
              <span className="icon card-icon">
                <div className="icon-add" />
              </span>
              <p>Add New</p>
            </div>
          </div>
        )}
        {tasks.map(task => this.renderTask(task))}
        {tasks.length < 4 && (
          <div className="column is-vcentered add-card">
            <div
              className="add-task-btn has-text-centered"
              onClick={openAddTaskView}
            >
              <span className="icon card-icon">
                <div className="icon-add" />
              </span>
              <p>Add New</p>
            </div>
          </div>
        )}
        {/* <div className="columns is-multiline">
          {tasks.map((task, index) => this.renderTask(task))}
        </div> */}
      </div>
    );
  }
}

class TaskCategoryComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      taskCategory: props.taskCategory,
      categoryChange: false,
      addBtnOffset: ''
    };
    this.changeAddBtnOffset = this.changeAddBtnOffset.bind(this);
  }

  changeAddBtnOffset(val) {
    this.setState({ addBtnOffset: val });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { taskCategory } = this.props;

    if (
      nextProps.taskCategory !== taskCategory &&
      this.state.categoryChange !== true
    ) {
      this.setState({ categoryChange: true });
      setTimeout(
        () =>
          this.setState({
            taskCategory: nextProps.taskCategory,
            categoryChange: false
          }),
        1800
      );
    }
  }
  render() {
    const { taskCategory, categoryChange, addBtnOffset } = this.state;

    return (
      <div className="container">
        <div className="overflow-scroll">
          <div className="section task-panel-title">
            <TransitionGroup component={firstChild}>
              {!categoryChange && (
                <TaskTitleAnimatedComponent taskCategory={taskCategory} />
              )}
            </TransitionGroup>
          </div>
          <TransitionGroup component={firstChild}>
            {!categoryChange && (
              <TaskBodyAnimatedComponent
                taskCategory={taskCategory}
                changeAddBtnOffset={this.changeAddBtnOffset}
                addBtnOffset={addBtnOffset}
                {...this.props}
              />
            )}
          </TransitionGroup>
        </div>
      </div>
    );
  }
}

export default TaskCategoryComponent;
