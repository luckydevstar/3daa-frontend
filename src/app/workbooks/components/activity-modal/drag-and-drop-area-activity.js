import React, { Component } from 'react';
import { Field } from 'redux-form';
import Dragula from 'react-dragula';
import {
  addIndex,
  contains,
  filter,
  flatten,
  fromPairs,
  map,
  merge,
  mergeAll,
  not,
  path,
  pathOr,
  propOr,
  pipe,
  prop,
  replace,
  values
} from 'ramda';
import common from 'app/common';
import { random } from 'app/common/util/helpers';
import ActivityTout from './activity-tout';
import DraggableItem from './draggable-item';

const { components: { Form: { field } } } = common;

const mapIndexed = addIndex(map);
const mapRandomPosition = map(x =>
  merge(x, {
    rotate: random(-12, 12, false)
  })
);

const reduceToIndexObj = arr =>
  arr.reduce((acc, curr, i) => [...acc, { i, ...curr }], []);

class DragAndDropAreaActivity extends Component {
  constructor(props) {
    super(props);

    const { activity: { content } } = props;
    const { titles } = JSON.parse(content);

    const targets = pipe(map(pipe(prop('id'), x => [x, []])), fromPairs)(
      titles
    );

    this.state = pipe(
      path(['activity', 'content']),
      JSON.parse,
      prop('items'),
      mapRandomPosition,
      reduceToIndexObj,
      main => ({ main, targets, reinit: false })
    )(props);

    this.onUpdate = this.onUpdate.bind(this);
    this.wakeDragula = this.wakeDragula.bind(this);
    this.killDragula = this.killDragula.bind(this);
    this.countDragula = null;
    this.list = null;
    this.inputs = [];
  }

  componentDidMount() {
    this.wakeDragula();
  }

  componentDidUpdate() {
    const value = pathOr(null, ['formValues', 'input0'], this.props);
    if (value && !this.state.reinit) {
      const data = pipe(JSON.parse, mergeAll)(value);
      this.onUpdate(data);
    }
  }

  onUpdate(targets) {
    this.killDragula();

    this.setState({ targets, reinit: true }, this.wakeDragula);
  }

  wakeDragula() {
    const { readOnly } = this.props;

    // Dragula will not be awoken
    if (!readOnly) {
      const dragulaOpts = {};
      const containers = [this.list, ...this.inputs];

      this.countDragula = Dragula(containers, dragulaOpts).on('drop', () => {
        const { change } = this.props;

        const items = map(input => {
          const targetId = replace('target', '', input.id);
          const els = [...input.getElementsByClassName('draggable-item')];
          return {
            [targetId]: map(pipe(prop('id'), replace('item', ''), Number), els)
          };
        }, this.inputs);

        change('input0', JSON.stringify(items));
      });
    }
  }

  componentWillUnMount() {
    this.killDragula();
  }

  killDragula() {
    if (this.countDragula) this.countDragula.destroy();
  }

  render() {
    const { activity: { title, tout, tout_type, content } } = this.props;
    const { main, targets } = this.state;

    const { titles } = JSON.parse(content);

    return (
      <div className="workbook-activity-modal-body">
        <h4>Activity</h4>
        <p>
          {title}
        </p>
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
                    filter(x =>
                      pipe(values, flatten, contains(x), not)(targets)
                    ),
                    map(DraggableItem(main))
                  )(main)}
                </div>
              </div>
            </div>
          </div>
          <div className="column is-4">
            {mapIndexed(
              ({ id, value }, i) =>
                <div key={`target${id}`} className="droppable-target">
                  <div
                    id={`target${id}`}
                    ref={x => {
                      this.inputs[i] = x;
                    }}
                    className="inner-list"
                  >
                    {pipe(propOr([], id), map(DraggableItem(main)))(targets)}
                  </div>
                  <div className="inner">
                    <span className="title">
                      {value}
                    </span>
                  </div>
                </div>,
              titles
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default DragAndDropAreaActivity;
