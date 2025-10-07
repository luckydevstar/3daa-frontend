import React, { Component } from 'react';

class TACO extends Component {
  componentWillEnter(callback) {
    console.log('componentWillEnter');
    callback();
  }
  componentWillLeave(callback) {
    console.log('componentWillLeave');
    callback();
  }
  componentWillAppear(cb) {
    console.log('componentWillAppear');
    cb();
  }
  componentDidAppear() {
    console.log('componentDidAppear');
  }

  render() {
    return (
      <div>
        <section className="content-section tasks-navigation navigation-section">
          <div className="container">
            <div className="navigation">
              <ul className="tabs left">
                <li className="is-active">
                  <a>
                    <span>Active Tasks</span>
                  </a>
                </li>
                <li>
                  <a>
                    <span>Planned Tasks</span>
                  </a>
                </li>
                <li>
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
                  <span className="icon nav-tab" onClick={this.toggleTaskView}>
                    <div className="icon-close" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className="overflow-scroll">
          <div className="section task-panel-title">
            <h1 className="title">Active Tasks</h1>
            <h4 className="subtitle">
              Active objectives have been shared with one or more
            </h4>
          </div>

          <div className="columns is-desktop task-card">
            <div className="column is-one-quarter assignment">
              <progress
                className="progress is-primary is-small"
                value="15"
                max="100"
              >
                15%
              </progress>
              <div className="card">
                <h3>Example Assignment header & title of</h3>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed
                  do eiusmod tempor incididunt ut labore et....
                </p>
                <ul>
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
                    <h2>5</h2>
                    <p>Days</p>
                  </div>
                  <div className="column">
                    <p>Course Title</p>
                    <p>Unit No:</p>
                    <a className="button is-rounded">Edit Objective</a>
                  </div>
                </div>
              </div>
            </div>
            <div className="column is-one-quarter assignment">
              <progress
                className="progress is-primary is-small"
                value="15"
                max="100"
              >
                15%
              </progress>
              <div className="card">
                <h3>Example Assignment header & title of</h3>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed
                  do eiusmod tempor incididunt ut labore et...
                </p>
                <ul>
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
                    <h2>5</h2>
                    <p>Days</p>
                  </div>
                  <div className="column">
                    <p>Course Title</p>
                    <p>Unit No:</p>
                    <a className="button is-rounded">Edit Objective</a>
                  </div>
                </div>
              </div>
            </div>
            <div className="column is-vcentered">
              <div className="add-task-btn has-text-centered">
                <span className="icon card-icon">
                  <div className="icon-add" />
                </span>
                <p>Add New</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default TACO;
