import React from 'react';
import { connect } from 'react-redux';
import { Creators } from 'app/qualifications/actions';
import ActivityModalLibrary from '../activities/activity-modal-library';
import common from 'app/common';
import { path, find, propEq, pipe, propOr, defaultTo } from 'ramda';
import qualificationComponents from 'app/qualifications/components';
import classNames from 'classnames';

const ContentModalNew = common.components.ContentModalNew;
const MainActivityForm = qualificationComponents.MainActivityForm;
const {
  components: { AmazonMedia }
} = common;

class ActivityBlock extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activityTypes: [],
      tempId: Date.now(),
      image: '',
      loadedActivity: null,
      isBeingCreated: 0,
      selectedActivityId: null
    };

    this.subformState = null;
    this.updateSubform = this.updateSubform.bind(this);
    this.setActivity = this.setActivity.bind(this);
  }

  UNSAFE_componentWillMount() {
    this.loadActivityFromEntityData();
  }

  componentDidMount() {
    const {
      blockProps: {
        entityData: { toggleActivityState, addActivityToMap, activity_id }
      }
    } = this.props;

    if (activity_id) {
      toggleActivityState(activity_id, false);
    } else {
      addActivityToMap({ tempId: this.state.tempId, disabled: true });
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      blockProps: {
        entityData: { updateActivityMap }
      }
    } = this.props;
    // Check ID.
    // On new
    if (
      nextProps.loadedActivity &&
      !this.state.loadedActivity &&
      this.state.isBeingCreated
    ) {
      const newData = {
        disabled: false,
        mapped_criteria: [],
        ...nextProps.loadedActivity
      };

      this.updateActivityInState(nextProps.loadedActivity, () => {
        updateActivityMap(this.state.tempId, newData);
        this.updateEntityData(newData);
        this.props.clearLoadedActivity();
        this.onActivityModalClose();
      });

      this.setState({ isBeingCreated: 0 });
    }
    // On Update
    if (
      nextProps.loadedActivity &&
      this.props.blockProps.entityData.activity_id ===
        nextProps.loadedActivity.activity_id
    ) {
      this.updateActivityInState(nextProps.loadedActivity, () => {
        updateActivityMap(
          nextProps.loadedActivity.activity_id,
          nextProps.loadedActivity
        );
        this.updateEntityData(nextProps.loadedActivity);
        this.props.clearLoadedActivity();
        this.onActivityModalClose();
      });
    }
  }

  componentWillUnmount() {
    const { tempId } = this.state;

    const {
      blockProps: {
        entityData: { removeActivityFromMap, toggleActivityState, activity_id }
      }
    } = this.props;

    if (activity_id) {
      toggleActivityState(activity_id, true);
    } else if (!activity_id && tempId) {
      removeActivityFromMap(tempId);
    }
  }

  // CUSTOM METHODS

  onActivityModalOpen() {
    this.activityModal.open();
  }

  onActivityModalClose() {
    this.activityModal.close();
  }
  setActivity(activity) {
    const {
      blockProps: {
        entityData: { updateActivityMap, activity_id }
      }
    } = this.props;

    activity = { ...activity };
    // IF selecting the same ID -> just close the modal
    if (activity.activity_id !== activity_id) {
      // If activity block already has ID asigned
      if (activity_id) {
        this.updateActivityInState(activity, () => {
          activity.mapped_criteria = [];
          updateActivityMap(activity_id, activity);
          this.updateEntityData(activity);
          this.onActivityModalClose();
        });
      } else {
        this.updateActivityInState(activity, () => {
          activity.mapped_criteria = [];
          activity.disabled = false;
          updateActivityMap(this.state.tempId, activity);
          this.updateEntityData(activity);
          this.onActivityModalClose();
        });
      }
    } else {
      this.onActivityModalClose();
    }
  }

  saveActivity(values) {
    const {
      blockProps: {
        entityData: { updateActivityMap, activity_id }
      }
    } = this.props;

    let activityData = {
      activity_type_id: values.activity_type_id,
      activity_code: values.activity_code,
      title: values.title,
      description: values.description,
      content: JSON.stringify(this.subformState)
    };

    let tout;
    if (typeof values.tout === 'string') {
      tout = values.tout || '';
    } else if (typeof values.tout === 'object') {
      tout = values.tout[0];
    }

    if (tout || tout === '')
      activityData = Object.assign({}, activityData, { tout });

    const formData = common.util.helpers.convertToFormData(activityData);

    if (values.activity_id) {
      activityData.activity_id = values.activity_id;
      this.props.updateActivity(activityData, formData, activity_id);
    } else {
      // Set isBeingCreated to 1 to mark this block as the one that is being populated;
      this.setState({ isBeingCreated: 1 }, () => {
        this.props.createActivity(activityData, formData);
      });
    }

    updateActivityMap(activity_id, activityData);
  }

  loadActivityFromEntityData() {
    // TODO add error handling
    const { entityData } = this.props.blockProps;

    if (entityData.activity_id) {
      this.updateActivityInState(entityData);
    }
  }

  updateActivityInState(newActivityData, callback) {
    const content = JSON.parse(newActivityData.content);
    this.subformState = content;
    this.setState(
      {
        loadedActivity: {
          activity_id: newActivityData.activity_id,
          activity_type_id: newActivityData.activity_type_id,
          title: newActivityData.title,
          subtitle: newActivityData.subtitle,
          activity_code: newActivityData.activity_code,
          content,
          description: newActivityData.description,
          tout: newActivityData.tout,
          tout_type: newActivityData.tout_type
        }
      },
      () => {
        if (callback) callback();
      }
    );
  }

  updateEntityData(data) {
    const newEntityData = {};

    Object.keys(data).forEach(key => {
      newEntityData[key] = data[key];
    });

    this.props.editorUpdateEntity(this.props.block.getKey(), newEntityData);
  }

  updateSubform(subformState) {
    this.subformState = subformState;
  }

  remove() {
    this.props.blockProps.onRemove(this.props.block.getKey());
  }

  getActivityToutType(activity_id) {
    return pipe(
      find(propEq('activity_id', activity_id)),
      defaultTo({}),
      propOr(null, 'tout_type')
    )(this.props.activities);
  }

  renderActivityTout(loadedActivity) {
    let result = <i className="fa fa-trophy" />;
    const { tout, tout_type } = loadedActivity;

    if (tout_type === 'image' || 'video') {
      result = <AmazonMedia mediaType={tout_type} fileId={tout} />;
    }

    return result;
  }

  getOutcomes = () => {
    const { outcomes, blockProps } = this.props;
    if (typeof outcomes !== 'undefined' || typeof blockProps !== 'undefined') {
      return 'nothing mapped yet';
    }

    const activity = blockProps.activityMap.find(
      activ => activ.activity_id === blockProps.entityData.activity_id
    );
    let outcomeIndexes = [];

    outcomes.forEach((outcome, index1) => {
      outcome.assessment_criteria.forEach((criteria, index2) => {
        if (
          activity &&
          activity.mapped_criteria &&
          activity.mapped_criteria.includes(criteria.assessment_criteria_id)
        ) {
          outcomeIndexes.push(`${index1 + 1}.${index2 + 1}`);
        }
      });
    });
    if (outcomeIndexes.length > 0) {
      return outcomeIndexes.join(', ');
    }

    return 'nothing mapped yet';

    // blockProps.entityData.activity_id
  };

  render() {
    const {
      availableTypes,
      attemptingGetActivity,
      blockProps,
      attemptingCreateActivity,
      attemptingUpdateActivity,
      activityIdSelected
    } = this.props;

    const { subformState } = this;

    const buttonClasses = classNames('button is-primary', {
      'is-loading': attemptingGetActivity
    });

    const { loadedActivity, selectedActivityId } = this.state;

    const id = blockProps.entityData && blockProps.entityData.activity_id;

    const blockClasses = classNames(
      'editor-block-container',
      'editor-block-container-activity',
      id ? `activity-block-${id}` : ''
    );

    // Get tout type from wb object
    blockProps.entityData.tout_type = this.getActivityToutType(id);

    return (
      <div className={blockClasses}>
        <ContentModalNew
          height="auto"
          tabs
          type="block"
          ref={e => {
            this.activityModal = e;
          }}
          title="Customise activity"
          size="large"
          className="activity-modal"
        >
          <MainActivityForm
            title="Customise activity"
            closeModal={() => this.onActivityModalClose()}
            activity={blockProps.entityData}
            subformState={subformState}
            activityTypes={availableTypes}
            onSubmit={values => this.saveActivity(values)}
            updateSubform={this.updateSubform}
            attemptingCreateActivity={attemptingCreateActivity}
            attemptingUpdateActivity={attemptingUpdateActivity}
          />
          <ActivityModalLibrary
            title="Activity library"
            passedActivity={blockProps.entityData}
            setActivity={activity => this.setActivity(activity)}
            closeModal={() => this.onActivityModalClose()}
            attemptingCreateActivity={attemptingCreateActivity}
            attemptingUpdateActivity={attemptingUpdateActivity}
          />
        </ContentModalNew>
        <div className="editor-block-header" style={{ minHeight: 50 }}>
          <div
            className={classNames('button', 'is-primary', 'bg-light-grey', {
              'is-outlined': !(
                activityIdSelected ===
                this.props.blockProps.entityData.activity_id
              )
            })}
            onClick={() => {
              this.props.mapToLearningOutcome(
                this.props.blockProps.entityData.activity_id
              );
              this.setState({
                selectedActivityId: this.props.blockProps.entityData.activity_id
              });
            }}
          >
            Map to learning outcome
          </div>
          <div className="editor-block-header__outcomes">
            Outcome(s): {this.getOutcomes()}
          </div>
        </div>
        <div className="editor-block-body">
          {loadedActivity && loadedActivity.activity_id ? (
            <div className="text">
              <h2 className="is-2">
                <span>{loadedActivity && loadedActivity.title}</span>
              </h2>
              <h4 className="is-4">
                <span>{loadedActivity && loadedActivity.subtitle}</span>
              </h4>
              <div className="description">
                <span>{loadedActivity && loadedActivity.description}</span>
              </div>
            </div>
          ) : null}
          <div
            className={
              loadedActivity && loadedActivity.tout ? 'image' : 'image default'
            }
          >
            {loadedActivity && loadedActivity.tout ? (
              this.renderActivityTout(loadedActivity)
            ) : (
              <i className="fa fa-trophy" />
            )}
          </div>
        </div>
        <div className="editor-block-footer">
          <div
            className={buttonClasses}
            onClick={() => this.onActivityModalOpen()}
          >
            Customise This Activity
          </div>
          <div
            onClick={e => this.remove(e)}
            className="remove-block is-pulled-right"
          >
            Delete Block
            <i className="fa fa-trash-o" />
          </div>
        </div>
      </div>
    );
  }
}

ActivityBlock.defaultProps = {
  blockProps: {
    entityData: {
      title: '',
      subtitle: '',
      description: '',
      activity_type_id: ''
    }
  }
};

const mapStateToProps = state => {
  return {
    attemptingGetActivity: path(['qualifications', 'attemptingGetActivity'])(
      state
    ),
    attemptingCreateActivity: path([
      'qualifications',
      'attemptingCreateActivity'
    ])(state),
    attemptingUpdateActivity: path([
      'qualifications',
      'attemptingUpdateActivity'
    ])(state),
    loadedActivity: path(['qualifications', 'loadedActivity'])(state),
    availableTypes: path(['qualifications', 'activityTypes'])(state),

    activityIdSelected: state.qualifications.selectedActivityId,
    activities: path(['workbooks', 'workbook', 'activities'])(state),
    outcomes: state.units.unit[0] && state.units.unit[0].outcomes
  };
};

const mapDispatchToProps = dispatch => ({
  editorUpdateEntity: (entityKey, data) =>
    dispatch(Creators.editorUpdateEntity(entityKey, data)),
  clearLoadedActivity: () => dispatch(Creators.clearLoadedActivity()),
  createActivity: (activityData, formData) =>
    dispatch(Creators.createActivityAttempt(activityData, formData)),
  updateActivity: (activityData, formData, activityId) =>
    dispatch(
      Creators.updateActivityAttempt(activityData, formData, activityId)
    ),
  mapToLearningOutcome: activity_id =>
    dispatch(Creators.mapToLearningOutcome(activity_id))
});

export default connect(mapStateToProps, mapDispatchToProps)(ActivityBlock);
