import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import cx from 'classnames';
import Immutable from 'seamless-immutable';
import { propEq, findIndex, find } from 'ramda';
import { Creators } from 'app/qualifications/actions';
import common from 'app/common';
import units from 'app/units';

const { ProgressBadge, UILoading } = common.components;
const scrollTo = common.util.helpers.scrollTo;
const UnitsActions = units.Actions;

import OutcomesView from './outcomes-view';
import OutcomesSearch from './outcomes-search';

class OutcomesTray extends Component {
  constructor(props) {
    super(props);

    this.state = {
      outcomes: [],
      activities: [],
      activityOptions: [],
      searchTerm: ''
    };

    this.mapActivitiesToOutcomes = this.mapActivitiesToOutcomes.bind(this);
    this.onActivityChange = this.onActivityChange.bind(this);
    this.onSearchTermChange = this.onSearchTermChange.bind(this);
    this.setSelectedActivity = this.setSelectedActivity.bind(this);
    this.onCriteriaCheckboxClick = this.onCriteriaCheckboxClick.bind(this);
    this.onCriteriaActivityTitleClick = this.onCriteriaActivityTitleClick.bind(
      this
    );
  }

  componentDidMount() {
    const { getUnitDetails, unitID } = this.props;
    getUnitDetails(unitID);
  }

  /**
   * Component will receive props is the main point of entry for all data
   * assingment within the outcomes tray.
   */
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { outcomes, activityMap: nextActivityMap } = nextProps;

    const { clearMappedActivityFromStore } = this.props;
    const { selectedActivityId, selectedActivityIndex } = this.state;

    if (!outcomes || !nextActivityMap) {
      return;
    }

    // Filter activities map and return only active activities
    const activities = nextActivityMap.filter(activity => !activity.disabled);

    // Set outcomes once received from API
    if (outcomes.length) {
      this.setState({
        outcomes
      });
    }

    // If outcomes and activities both exist, build datasets for the activity and
    // activity types drodpdowns. Otherwise, clear the activities array.
    if (outcomes.length && activities.length) {
      this.setState(
        {
          activities
        },
        () => {
          if (
            selectedActivityId &&
            !find(propEq('activity_id', selectedActivityId))(activities)
          ) {
            this.setSelectedActivity(
              activities[selectedActivityIndex].activity_id
            );
          }
        }
      );
      if (!selectedActivityId) {
        this.setState({
          selectedActivityIndex: 0,
          selectedActivityId: activities[0].activity_id
        });
      }
    } else {
      this.setState({
        activities: []
      });
    }

    if (
      nextProps.selectedActivityId &&
      selectedActivityId !== nextProps.selectedActivityId
    ) {
      this.setSelectedActivity(nextProps.selectedActivityId);
      clearMappedActivityFromStore();
    }
  }

  /**
   * Handle changing activity in the dropdown.
   * @param  {Object} e: onChange event.
   */
  onActivityChange(e) {
    this.setSelectedActivity(parseInt(e.target.value));
  }

  /**
   * Handle update of the search field.
   * @param  {Object} e: Field on change event.
   */
  onSearchTermChange(e) {
    this.setState({
      searchTerm: e.target.value.toString()
    });
  }

  /**
   *
   * When a criteria checkbox is clicked, we need to build an array containing
   * the new set of mapped criteria ID's for the current activity and push
   * it up to the parent component (Editor.js) so that it can be merged with
   * the activity map.
   * @param  {String} criteriaId: The ID of the criteria where checkbox clicked.
   */
  onCriteriaCheckboxClick(criteriaId) {
    criteriaId = parseInt(criteriaId);
    const { selectedActivityId, activities } = this.state;
    const activity = find(propEq('activity_id', selectedActivityId))(
      activities
    );
    if (!activity) {
      throw new Error(
        'There has been an error finding a selected activity on checkbox click.'
      );
    }
    const mappedCriteria = [...activity.mapped_criteria];
    const index = mappedCriteria.indexOf(criteriaId);
    if (index !== -1) {
      mappedCriteria.splice(index, 1);
    } else {
      mappedCriteria.push(criteriaId);
    }
    this.props.updateActivityMap(activity.activity_id, {
      mapped_criteria: Immutable(mappedCriteria)
    });
  }

  removeActivity = (criteriaId, activityId) => {
    criteriaId = parseInt(criteriaId);
    const { activities } = this.state;
    const activity = find(propEq('activity_id', activityId))(activities);
    if (!activity) {
      throw new Error(
        'There has been an error finding a selected activity on remove click.'
      );
    }
    const mappedCriteria = [...activity.mapped_criteria];
    const index = mappedCriteria.indexOf(criteriaId);
    mappedCriteria.splice(index, 1);
    this.props.updateActivityMap(activity.activity_id, {
      mapped_criteria: Immutable(mappedCriteria)
    });
  };

  addActivity = criteriaId => {
    const { updateActivityMap, activityMap } = this.props;
    const { selectedActivityId } = this.state;
    if (!selectedActivityId) return;
    const activityToUpdate = activityMap.find(
      activity => activity.activity_id === selectedActivityId
    );

    if (activityToUpdate.mapped_criteria.includes(criteriaId)) {
      updateActivityMap(selectedActivityId, {
        mapped_criteria: Immutable(
          activityToUpdate.mapped_criteria.filter(
            criteria => criteriaId !== criteria
          )
        )
      });
    } else {
      updateActivityMap(selectedActivityId, {
        mapped_criteria: Immutable([
          ...activityToUpdate.mapped_criteria,
          criteriaId
        ])
      });
    }
  };

  /**
   * When a the activity title linked to a criteria is clicked, it needs
   * to automatically set the currently active outcome tray activity.
   * @param  {String} activityId: The ID of the Activity of the title clicked.
   */
  onCriteriaActivityTitleClick(activityId) {
    this.setSelectedActivity(activityId);
  }
  /**
   * Sets the selected activity for the outcomes tray.
   * @param  {String} activityId: ID of the Activity.
   */
  setSelectedActivity(activityId) {
    const { mapToLearningOutcome, selectedActivityId } = this.props;
    const { activities } = this.state;
    const activity = find(propEq('activity_id', activityId))(activities);
    const index = findIndex(propEq('activity_id', activityId))(activities);
    const id = activity && activity.activity_id;
    const blockEl = document.querySelector(`.activity-block-${id}`);
    if (!id) return;
    scrollTo(
      document.querySelector('.rich-editor'),
      blockEl.offsetTop + 75,
      500
    );
    this.setState({
      selectedActivityId: id,
      selectedActivityIndex: index
    });
    mapToLearningOutcome(activityId);
  }

  /**
   * Map activities and their associated criteria to the outcomes. Filter by
   * search if necessary.
   * @param  {Array} activities: an array of enabled Activities.
   * @param  {Array} outcomes: An array of the unit Outcomes.
   * @return {Array} unitOutcomes:
   * An outcomes array with the current activities and their bound criteria
   * fully mapped onto it and ready for display.
   */
  mapActivitiesToOutcomes(activities, outcomes) {
    if (!outcomes) {
      console.warn('Outcomes not ready yet. Returning empty array.');
      return [];
    }

    const { searchTerm } = this.state;

    let unitOutcomes = Immutable(outcomes).asMutable({ deep: true });
    const criteriaToActivity = {};
    const activityLookup = {};
    let totalActiveCriteria = 0;
    let totalCriteriaCount = 0;

    /*
     * Cycle through the activities and generate several convenient
     * lookup objects so that it is possible to easily find out
     *
     * 1. What activity a criteria currently belongs to (criteriaToActivity):
     *    {criteriaId: activity id}
     *
     * 2. What title belongs to an activity (activityToTitle):
     *    {activityId: activity title}
     *
     */
    // if (activities.length > 0) {
    //   activities.forEach(activity => {
    //     if (!activityLookup[activity.activity_id]) {
    //       activityLookup[activity.activity_id] = {
    //         title: activity.title,
    //         code: activity.activity_code
    //       };
    //     } else {
    //       throw new Error(
    //         'Lookup object already has title for this activity ID.'
    //       );
    //     }
    //     activity.mapped_criteria.forEach(id => {
    //       criteriaToActivity[id] = parseInt(activity.activity_id);
    //     });
    //   });
    // }

    /**
     * Cycle through the outcomes and assign for all outcomes:
     * 1. Total and current number of criteria that have activities assigned
     *
     * For each individual outcome:
     * 2. Total and current number of its criteria
     *
     * And each outcome criteria (if has activity attached):
     * 3. A checked true/false property
     * 4. An attached activity title
     * 5. An attached activity ID
     * 6. A disabled true/false property if the attached activity is the one
     *    currently being edited
     */
    if (unitOutcomes.length > 0) {
      unitOutcomes.forEach((obj1, i1) => {
        if (obj1.assessment_criteria) {
          totalCriteriaCount += obj1.assessment_criteria.length; // 1
          const outcome = unitOutcomes[i1];
          outcome.activeCriteria = 0; // 2
          outcome.criteriaCount = obj1.assessment_criteria.length; // 2
          obj1.assessment_criteria.forEach((obj2, i2) => {
            const criteria = outcome.assessment_criteria[i2];
            const criteriaActivities = activities.filter(
              activity =>
                activity &&
                activity.mapped_criteria &&
                activity.mapped_criteria.includes(
                  criteria.assessment_criteria_id
                )
            );
            const cId = obj2.assessment_criteria_id;
            const aId = criteriaToActivity[cId];
            Object.assign(criteria, {
              activities: criteriaActivities
            });
            if (!activities.length) {
              Object.assign(criteria, {
                checkboxHidden: true
              });
            }
            if (aId) {
              const aTitle = activityLookup[aId].title;
              const aCode = activityLookup[aId].code;
              totalActiveCriteria++; // 1
              outcome.activeCriteria++; // 2
              Object.assign(criteria, {
                checked: true, // 3
                activityCode: aCode,
                activityTitle: aTitle, // 4
                activityId: aId, // 5
                inactive: aId !== this.state.selectedActivityId, // 6
                activities: criteriaActivities
              });
            }
          });
        }
      });
    }

    // //Run through search filter if necessary
    if (searchTerm.length > 0) {
      unitOutcomes = this.filterOutcomesBySearchTerm(unitOutcomes);
    }

    // NOTE - Assigning a property to an array. Don't hate.
    unitOutcomes.totalActiveCriteria = totalActiveCriteria;
    unitOutcomes.totalCriteriaCount = totalCriteriaCount;

    return unitOutcomes;
  }

  /**
   * Search and filter by a phrase in an outcome.
   * @param  {Object} outcomes: The current outcomes object.
   * @return {Object} outcomes: The new outcomes object filtered by search term.
   */
  filterOutcomesBySearchTerm(outcomes) {
    const phrase = this.state.searchTerm.toLowerCase();
    return outcomes.filter(outcome => {
      if (outcome.title.toLowerCase().indexOf(phrase) > -1) {
        return outcome;
      }
      outcome.assessment_criteria = outcome.assessment_criteria.filter(
        criteria => {
          if (criteria.title.toLowerCase().indexOf(phrase) > -1) {
            return criteria;
          }
          return null;
        }
      );
      if (outcome.assessment_criteria.length) {
        return outcome;
      }

      return null;
    });
  }

  getIsCriteriaChecked = criteriaId => {
    const { activities, selectedActivityId } = this.state;
    const activity = activities.find(
      activity => activity.activity_id === selectedActivityId
    );
    return (
      activity &&
      activity.mapped_criteria &&
      activity.mapped_criteria.includes(criteriaId)
    );
  };

  getOutcomePercent = outcome => {
    const criteriasWithActivities =
      outcome && outcome.assessment_criteria
        ? outcome.assessment_criteria.filter(
            criteria => criteria.activities && criteria.activities.length > 0
          )
        : [];

    return (
      Math.round(
        (criteriasWithActivities.length /
          (outcome.assessment_criteria
            ? outcome.assessment_criteria.length
            : 1)) *
          100
      ) || 0
    );
  };

  getTotalProgress = () => {
    const { activities, outcomes } = this.state;
    const outcomesMap = this.mapActivitiesToOutcomes(activities, outcomes);
    let completedOutcomes = 0;
    for (let i = 0; i < outcomesMap.length; i++) {
      const outcomePercent = this.getOutcomePercent(outcomesMap[i]);
      completedOutcomes += outcomePercent / 100;
    }
    return Math.round((completedOutcomes / outcomesMap.length) * 100) || 0;
  };

  render() {
    const { open, gettingUnit } = this.props;

    const { selectedActivityId, activities, outcomes } = this.state;

    const outcomesMap = this.mapActivitiesToOutcomes(activities, outcomes);
    const trayClassnames = cx({
      'workbooks-outcomes-tray': true,
      open
    });
    return (
      <div className={trayClassnames}>
        {gettingUnit ? (
          <UILoading customClass="m-t-40" />
        ) : (
          <div>
            <div className="columns outcomes-header">
              <div className="column total">
                <ProgressBadge
                  dimensions={96}
                  strokeWidth={9}
                  labelFontColor={'#FFFFFF'}
                  percentage={this.getTotalProgress()}
                  percentageFontSize={22}
                  completeLabel={'COMPLETE'}
                  labelFontSize={10}
                />
              </div>
              <div className="column">
                <h4 className="m-b-20">
                  Learning Outcomes To Be Covered: {outcomes.length}
                </h4>
                {activities && activities.length > 0 ? (
                  <div>
                    <span className="select">
                      <select
                        name="activity"
                        value={selectedActivityId}
                        onChange={e => this.onActivityChange(e)}
                      >
                        {activities.map((activity, i) => (
                          <option key={i} value={activity.activity_id}>
                            {activity.activity_code &&
                              `${activity.activity_code} - `}
                            {activity.title}
                          </option>
                        ))}
                      </select>
                    </span>
                  </div>
                ) : (
                  <div className="is-text-info p-l-10">
                    There are no activities to be mapped.
                  </div>
                )}
              </div>
            </div>
            <OutcomesSearch callback={this.onSearchTermChange} />
            <OutcomesView
              outcomes={outcomesMap}
              selectedActivityId={selectedActivityId}
              // outcomesToOpen={this.state.outcomesToOpen}
              titleCallback={this.onCriteriaActivityTitleClick}
              checkboxCallback={this.onCriteriaCheckboxClick}
              removeActivity={this.removeActivity}
              addActivity={this.addActivity}
              getIsCriteriaChecked={this.getIsCriteriaChecked}
            />
          </div>
        )}
      </div>
    );
  }
}

OutcomesTray.propTypes = {
  open: PropTypes.bool.isRequired,
  unitID: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  open: state.qualifications.showOutcomesTray,
  outcomes: state.units.unit[0] && state.units.unit[0].outcomes,
  gettingUnit: state.units.attemptingToGetUnit,
  selectedActivityId: state.qualifications.selectedActivityId
});

const mapDispatchToProps = dispatch => ({
  setSelectedActivity: activity =>
    dispatch(Creators.setSelectedActivity(activity)),
  editorUpdateEntity: (blockKey, data) =>
    dispatch(Creators.editorUpdateEntity(blockKey, data)),
  getUnitDetails: id => dispatch(UnitsActions.getUnitAttempt(id)),
  mapToLearningOutcome: activity_id =>
    dispatch(Creators.mapToLearningOutcome(activity_id)),
  clearMappedActivityFromStore: () => dispatch(Creators.clearMappedActivity())
});

export default connect(mapStateToProps, mapDispatchToProps)(OutcomesTray);
