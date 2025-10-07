import React, { Component } from 'react';
import { Field } from 'redux-form';
import Dragula from 'react-dragula';
import {
  __,
  always,
  concat,
  cond,
  contains,
  filter,
  identity,
  join,
  length,
  map,
  merge,
  not,
  nth,
  path,
  pathOr,
  pipe,
  prop,
  replace,
  T,
  uncurryN,
  values
} from 'ramda';
import common from 'app/common';
import { arrayFrom, random } from 'app/common/util/helpers';
import ActivityTout from './activity-tout';
import DraggableItem from './draggable-item';

const { components: { Form: { field } } } = common;

const mapRandomPosition = map(x =>
  merge(x, {
    rotate: random(-12, 12, false)
  })
);

const reduceToIndexObj = arr =>
  arr.reduce((acc, curr, i) => [...acc, { i, ...curr }], []);

const displayValues = uncurryN(2, items =>
  cond([
    [
      prop('input0'),
      pipe(
        prop('input0'),
        JSON.parse,
        map(pipe(nth(__, items), prop('title'))),
        x => concat(x, arrayFrom(length(items) - length(x), always('...')))
      )
    ],
    [T, always(arrayFrom(length(items), always('...')))]
  ])
);

class DragAndDropOrderActivity extends Component {
  constructor(props) {
    super(props);

    this.state = pipe(
      path(['activity', 'content']),
      JSON.parse,
      prop('items'),
      mapRandomPosition,
      reduceToIndexObj,
      main => ({ main, target: [], reinit: false })
    )(props);

    this.onUpdate = this.onUpdate.bind(this);
    this.wakeDragula = this.wakeDragula.bind(this);
    this.killDragula = this.killDragula.bind(this);
    this.countDragula = null;
    this.list = null;
    this.input = null;
  }

  componentDidMount() {
    this.wakeDragula();
  }

  componentDidUpdate() {
    const value = pathOr(null, ['formValues', 'input0'], this.props);
    if (value && !this.state.reinit) {
      this.onUpdate(JSON.parse(value));
    }
  }

  onUpdate(target) {
    this.killDragula();

    this.setState({ target, reinit: true }, this.wakeDragula);
  }

  wakeDragula() {
    const { readOnly } = this.props;

    // Dragula will not be awoken
    if (!readOnly) {
      const dragulaOpts = {};
      const containers = [this.list, this.input];

      this.countDragula = Dragula(containers, dragulaOpts).on('drop', () => {
        const { change } = this.props;

        const els = [...this.input.getElementsByClassName('draggable-item')];
        const items = map(pipe(prop('id'), replace('item', ''), Number), els);

        change('input0', JSON.stringify(items));
      });
    }
  }

  componentWillUnmount() {
    this.killDragula();
  }

  killDragula() {
    if (this.countDragula) this.countDragula.destroy();
  }

  render() {
    const { activity: { title, tout, tout_type }, formValues } = this.props;
    const { main, target } = this.state;

    const text = displayValues(main, formValues || {});

    return (
      <div className="workbook-activity-modal-body">
        <h4>Activity</h4>
        <p>
          {title}
        </p>
        <h1 className="has-text-centered">
          {join(' ', text)}
        </h1>
        <hr />
        <div className="columns drag-and-drop-activity activity-tout">
          <div className="column is-4">
            <div className="workbook-activity-modal-tout">
              <ActivityTout {...{ tout, toutType: tout_type }} />
            </div>
            <Field name="input0" component={field} className="hide" />
          </div>
          <div className="column is-4">
            <div className="draggable-items">
              <div className="inner">
                <div
                  ref={x => {
                    this.list = x;
                  }}
                  className="inner-list"
                >
                  {pipe(
                    map(prop('i')),
                    filter(x => pipe(values, contains(x), not)(target)),
                    map(DraggableItem(main))
                  )(main)}
                </div>
              </div>
            </div>
          </div>
          <div className="column is-4">
            <div className="droppable-target">
              <div
                id="target0"
                ref={x => {
                  this.input = x;
                }}
                className="inner-list"
              >
                {pipe(filter(identity), map(DraggableItem(main)))(target)}
              </div>
              <div className="inner">
                <span className="title">1</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default DragAndDropOrderActivity;
