import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import {
  addIndex,
  map,
  pipe,
  prop,
  omit,
  path,
  toPairs,
  fromPairs,
  isEmpty,
  when,
  always
} from 'ramda';
import { Roles } from 'app/core/config/constants';
import common from 'app/common';
import cx from 'classnames';
import ActivityTout from './activity-tout';
import { required } from 'app/common/util/form-utils';

const {
  util: {
    helpers: { extractUserRole, shuffle }
  }
} = common;
const mapIndexed = addIndex(map);
const { CentreLearner } = Roles;
const shuffledOptions = pipe(omit('question'), toPairs, shuffle, fromPairs);

class MultipleChoiceActivity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prompts: pipe(
        JSON.parse,
        prop('prompts'),
        when(always(isEmpty(props.solution)), map(shuffledOptions))
      )(props.activity.content)
    };
  }

  render() {
    const { activity, user, solution, formValues } = this.props;
    const { prompts } = this.state;
    const { description, tout, tout_type } = activity;

    const isLearner = extractUserRole(user) === CentreLearner;
    return (
      <div className="workbook-activity-modal-body">
        <div className="columns">
          <div className="column is-half">
            <div className="workbook-activity-modal-tout">
              <ActivityTout {...{ tout, toutType: tout_type }} />
            </div>
          </div>
          <div className="column is-half">
            <h4>Activity</h4>
            <div className="activity-question">{description}</div>
            <h5>Select your answer below.</h5>
            <div className="multiple-choice-activity">
              {mapIndexed((prompt, i) => {
                const { question } = prompt;

                const answers = omit(['question'], prompt);
                const keys = Object.keys(answers);
                return (
                  <div key={i} className="entry">
                    {question}
                    <div className="answers">
                      {keys.map((type, x) => {
                        return (
                          <div
                            key={x}
                            className={cx('media', 'answer', {
                              correct:
                                (isLearner &&
                                  solution.submitted &&
                                  type === 'answer') ||
                                (!isLearner && type === 'answer'),
                              incorrect:
                                (isLearner &&
                                  solution.submitted &&
                                  type !== 'answer') ||
                                (!isLearner &&
                                  path([`input${i}`])(formValues) &&
                                  formValues[`input${i}`] !== 'answer' &&
                                  formValues[`input${i}`] === type)
                            })}
                          >
                            <div className="media-left label">{x + 1}</div>
                            <div className="media-content">{answers[type]}</div>
                            <label className="custom-answer-radio">
                              <span className="inner">
                                <Field
                                  name={`input${i}`}
                                  value={type}
                                  component="input"
                                  type="radio"
                                  disabled={
                                    solution.submitted || solution.approved
                                  }
                                  validate={[required]}
                                />
                                <span className="custom-check" />
                                <span className="bg" />
                              </span>
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })(prompts)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

MultipleChoiceActivity.propTypes = {
  activity: PropTypes.object.isRequired
};

export default MultipleChoiceActivity;
