/* eslint jsx-a11y/label-has-for: 0 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class CriteriaView extends Component {
  constructor(props) {
    super(props);
    this.onCheckboxClick = this.onCheckboxClick.bind(this);
    this.onActivityTitleClick = this.onActivityTitleClick.bind(this);
  }

  onCheckboxClick(e) {
    if (this.props.checkboxCallback) {
      this.props.checkboxCallback(e.target.value);
    }
  }

  onActivityTitleClick(activityId) {
    if (this.props.titleCallback && typeof activityId !== 'undefined') {
      this.props.titleCallback(activityId);
    }
  }

  render() {
    return (
      <div className="criteria-view">
        {this.props.criteria ? (
          this.props.criteria.map((criteria, key) => {
            const criteriaClasses = classNames('criteria', {
              disabled: criteria.inactive
            });
            const activityTitleClasses = classNames('criteria-activity', {
              'is-text-success': criteria.activityTitle,
              clickable: criteria.activityTitle,
              'is-text-info': !criteria.activityTitle
            });
            let activityTitle;
            if (criteria.activityTitle) {
              activityTitle = `${criteria.activityCode} - ${
                criteria.activityTitle
              }`;
            } else {
              activityTitle = 'Activity not yet attached.';
            }
            return (
              <div
                key={criteria.assessment_criteria_id}
                className={criteriaClasses}
              >
                {criteria.checkboxHidden ? null : (
                  <div className="criteria-checkbox">
                    <label className="custom checkbox">
                      <input
                        value={criteria.assessment_criteria_id}
                        disabled={criteria.inactive}
                        checked={criteria.checked || false}
                        type="checkbox"
                        onChange={this.onCheckboxClick}
                      />
                      <span className="ui" />
                    </label>
                  </div>
                )}
                <div className="criteria-number">{`${this.props.parentIndex +
                  1}.${key + 1}`}</div>
                <div className="criteria-description">
                  <div className="criteria-title">{criteria.title}</div>
                  <div
                    onClick={() =>
                      this.onActivityTitleClick(criteria.activityId)
                    }
                    className={activityTitleClasses}
                  >
                    {activityTitle}
                  </div>
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
