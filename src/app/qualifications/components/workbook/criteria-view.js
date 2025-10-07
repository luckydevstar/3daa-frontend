/* eslint jsx-a11y/label-has-for: 0 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import common from 'app/common';

const scrollTo = common.util.helpers.scrollTo;

class CriteriaView extends Component {
  constructor(props) {
    super(props);
    this.onCheckboxClick = this.onCheckboxClick.bind(this);
    this.onActivityTitleClick = this.onActivityTitleClick.bind(this);

    this.state = {
      criteriaInitial: null
    };
  }

  componentDidMount() {
    const { criteria } = this.props;
    this.setState({
      criteriaInitial: criteria
    });
  }

  onCheckboxClick(activityId) {
    const { checkboxCallback } = this.props;
    if (checkboxCallback) {
      checkboxCallback(activityId);
    }
  }

  onActivityTitleClick(activityId) {
    if (this.props.titleCallback && typeof activityId !== 'undefined') {
      this.props.titleCallback(activityId);
    }
  }

  isActivityOld = (criteria, activity) => {
    const { criteriaInitial } = this.state;
    if (!criteriaInitial) return false;

    const initialCriteria = criteriaInitial.find(
      crit => criteria.assessment_criteria_id === crit.assessment_criteria_id
    );

    let isExact = true;

    for (let i = 0; i < criteria.activities.length; i++) {
      const isExist = initialCriteria.activities.find(
        activ => activ.activity_id === criteria.activities[i].activity_id
      );
      if (!isExist) {
        isExact = false;
      }
    }
    if (isExact) return false;

    const initialActivity = initialCriteria.activities.find(
      activ => activ.activity_id === activity.activity_id
    );

    return !!initialActivity;
  };

  scrollToActivity = activityId => {
    const blockEl = document.querySelector(`.activity-block-${activityId}`);
    if (blockEl) {
      scrollTo(
        document.querySelector('.rich-editor'),
        blockEl.offsetTop + 75,
        500
      );
    }
  };

  render() {
    const {
      addActivity,
      outcomeId,
      getIsCriteriaChecked,
      criteria
    } = this.props;

    return (
      <div className="criteria-view">
        {criteria ? (
          criteria.map((criteria, key) => {
            const criteriaClasses = classNames('criteria', {
              disabled: criteria.inactive
            });
            let activityTitle;
            if (criteria.activityTitle) {
              activityTitle = `${criteria.activityCode} - ${criteria.activityTitle}`;
            } else {
              activityTitle = 'Activity not yet attached.';
            }
            return (
              <div
                key={criteria.assessment_criteria_id}
                className={criteriaClasses}
              >
                <div
                  className="criteria-checkbox"
                  onClick={() => {
                    addActivity(criteria.assessment_criteria_id, outcomeId);
                  }}
                >
                  {getIsCriteriaChecked(criteria.assessment_criteria_id) && (
                    <img src="/assets/images/icon_check.svg" alt="check" />
                  )}
                </div>
                <div className="criteria-number">
                  {`${this.props.parentIndex + 1}.${key + 1}`}
                </div>
                <div className="criteria-description">
                  <div className="criteria-title">{criteria.title}</div>
                  {criteria.activities.length === 0 && (
                    <div className="criteria-activity__not-attached">
                      Activity not yet attached.
                    </div>
                  )}
                  {criteria.activities.map((activity, index) => {
                    const activityTitleClasses = classNames(
                      'criteria-activity',
                      {
                        'is-text-success': criteria.activityTitle,
                        clickable: criteria.activityTitle,
                        'is-text-info': !criteria.activityTitle,
                        'criteria-activity__old': this.isActivityOld(
                          criteria,
                          activity
                        )
                      }
                    );
                    return (
                      <div
                        key={index}
                        onClick={() =>
                          this.onActivityTitleClick(criteria.activityId)
                        }
                        className={activityTitleClasses}
                      >
                        <span
                          className="criteria-activity__text"
                          onClick={() => {
                            this.scrollToActivity(activity.activity_id);
                          }}
                        >
                          {activity.title}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        ) : (
          <div>There is no criteria</div>
        )}
      </div>
    );
  }
}

CriteriaView.propTypes = {
  checkboxCallback: PropTypes.func.isRequired,
  titleCallback: PropTypes.func.isRequired
};

export default CriteriaView;
