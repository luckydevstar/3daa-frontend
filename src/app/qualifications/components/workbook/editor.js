import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import { connect } from 'react-redux';
import cx from 'classnames';
import { find, findIndex, propEq, path } from 'ramda';
import Immutable from 'seamless-immutable';
import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  convertFromRaw
} from 'draft-js';
import { Creators as QualificationActions } from 'app/qualifications/actions';
import { Creators as WorkBookCreators } from 'app/workbooks/actions';
import OutcomesTray from './outcomes-tray';
import BottomBar from './bottom-bar';
import insertBlock from './editor-blocks/modifiers/insert-block';
import removeBlock from './editor-blocks/modifiers/remove-block';
import ActivityBlock from './editor-blocks/activity-block';
import ImageBlock from './editor-blocks/image-block';
import VideoBlock from './editor-blocks/video-block';
import LinkBlock from './editor-blocks/link/link';
import EditorUi from './editor-ui';

class WorkbookEditor extends Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.handleEditorUiClick = this.handleEditorUiClick.bind(this);
    this.mapResponseToEditor = this.mapResponseToEditor.bind(this);
    this.updateActivityMap = this.updateActivityMap.bind(this);
    this.toggleActivityState = this.toggleActivityState.bind(this);
    this.addActivityToMap = this.addActivityToMap.bind(this);
    this.removeActivityFromMap = this.removeActivityFromMap.bind(this);
    this.editorBlockRenderer = this.editorBlockRenderer.bind(this);
    this.processEntityUpdateQueue = this.processEntityUpdateQueue.bind(this);
    this.setEntityData = this.setEntityData.bind(this);

    this.editorRemoveBlock = this.editorRemoveBlock.bind(this);
    this.blockStyler = this.blockStyler.bind(this);
    this.editorToggleBlockType = this.editorToggleBlockType.bind(this);
    this.editorToggleInlineStyle = this.editorToggleInlineStyle.bind(this);
    this.editorAddLink = this.editorAddLink.bind(this);
    this.editorAddActivity = this.editorAddActivity.bind(this);
    this.editorAddImage = this.editorAddImage.bind(this);
    this.editorAddVideo = this.editorAddVideo.bind(this);
    this.handleKeyCommand = this.handleKeyCommand.bind(this);
    this.forceEditorRender = this.forceEditorRender.bind(this);
    this.saveWorkbook = this.saveWorkbook.bind(this);
    this.deleteWorkbook = this.deleteWorkbook.bind(this);
    this.onEditorChange = this.onEditorChange.bind(this);
    this.getCompiledWorkbook = this.getCompiledWorkbook.bind(this);

    this.state = {
      editorState: EditorState.createEmpty(),
      activityMap: [],

      /**
       * Define additional, custom inline styles.
       * @type {Object}
       */
      customStyles: {
        // Text highlight
        highlight: {
          backgroundColor: '#F9E900',
          padding: '2px',
          fontWeight: 'bold'
        }
      },

      activityApi: {
        updateActivityMap: (activity_id, data) => {
          this.updateActivityMap(activity_id, data);
        },
        toggleActivityState: (activity_id, bool) => {
          this.toggleActivityState(activity_id, bool);
        },
        addActivityToMap: obj => {
          this.addActivityToMap(obj);
        },
        removeActivityFromMap: id => {
          this.removeActivityFromMap(id);
        }
      }
    };
  }

  UNSAFE_componentWillMount() {
    const { unitId, workbookId, getWorkbook } = this.props;

    if (workbookId) {
      getWorkbook(unitId, workbookId);
    }
  }

  componentDidMount() {
    const { updateWorkbookTitle } = this.props;
    updateWorkbookTitle('Loading workbook...');
  }

  /**
   * Component will receive props handles the following:
   * - Creating a workbook
   * - Processing the Draft JS block update queue
   */
  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      title,
      user,
      unitId,
      workbookId,
      currentModerator,
      settingCurrentModerator,
      entityUpdateQueue,
      content,
      activities
    } = nextProps;

    if (content && activities && !this.responseProcessed) {
      const response = {};

      const parsedContent = JSON.parse(content);

      if (typeof parsedContent !== 'object') {
        response.content = convertToRaw(
          EditorState.createEmpty().getCurrentContent()
        );
        response.activities = [];
      } else {
        response.content = parsedContent;
        response.activities = activities;
      }

      const processed = this.mapResponseToEditor(response);

      this.setState(
        {
          editorState: processed.state
        },
        this.onEditorChange
      );

      this.setState({
        activityMap: processed.activityMap
      });

      this.responseProcessed = true;
    }

    if (entityUpdateQueue.length > 0) {
      this.processEntityUpdateQueue(entityUpdateQueue);
    }

    if (title && !this.props.title) {
      this.props.updateWorkbookTitle(title);
    }

    if (currentModerator !== undefined) {
      // NOTE set current moderator if noone else editing
      if (currentModerator === null && !settingCurrentModerator) {
        this.props.setWorkbookCurrentModerator(
          unitId,
          workbookId,
          user.member_id
        );
      }
    }
  }

  componentWillUnmount() {
    this.props.clearCachedWorkbook();
    this.props.clearWorkbookTitle();
  }

  /**
   * DraftJS onChange handler. Updates component editor state.
   */

  onChange(editorState) {
    this.setState({ editorState }, this.onEditorChange);
  }

  /**
   * onEditorChange updates the store with a compiled,
   * preview friendly version of the workbook
   */
  onEditorChange() {
    // debounce for performance
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.props.onEditorChange(this.getCompiledWorkbook());
    }, 500);
  }

  /**
   * Compile the workbook for saving purposes
   * @param {bool} compileActivities If true activities are compiled to be served to API for saving
   * @param {*} newState Supply a different state to save
   */
  getCompiledWorkbook(compileActivities, newState) {
    const { activityMap } = this.state;
    const state = this.state.editorState || newState;

    // Get content
    const compiledContent = JSON.stringify(
      convertToRaw(state.getCurrentContent())
    );

    // Get activities
    const compiledActivities = !compileActivities
      ? activityMap
      : activityMap.reduce((acc, activity) => {
          if (!activity.disabled && activity.activity_id) {
            acc.push({
              activity_id: activity.activity_id,
              criteria_ids: activity.mapped_criteria
            });
          }
          return acc;
        }, []);

    return {
      content: compiledContent,
      activities: compiledActivities
    };
  }

  handleEditorUiClick(effect) {
    if (!effect || !effect.type || typeof effect.type !== 'string') {
      throw new Error('Incorrect editor UI effect type specified.');
    }

    const action = effect.action;
    // NOTE - Please only add functions here that are a direct effect of the UI
    switch (effect.type) {
      case 'ACTION_TOGGLE_BLOCK':
        this.editorToggleBlockType(action);
        break;
      case 'ACTION_INLINE_STYLE':
        this.editorToggleInlineStyle(action);
        break;
      case 'ACTION_ADD_LINK':
        this.editorAddLink(action);
        break;
      case 'ACTION_ADD_ACTIVITY':
        this.editorAddActivity();
        break;
      case 'ACTION_ADD_IMAGE':
        this.editorAddImage();
        break;
      case 'ACTION_ADD_VIDEO':
        this.editorAddVideo();
        break;
      case 'DEBUG_EDITOR_STATE':
        console.log(
          'debug',
          convertToRaw(this.state.editorState.getCurrentContent())
        );
        break;
      case 'DEBUG_ACTIVITY_MAP':
        console.log('Activity map', this.state.activityMap);
        break;
      default:
        break;
    }

    this.onEditorChange();
  }

  /**
   * Maps the activities received in the API object response
   * to the Draft JS editor worbkook representation
   * @param  {Object} workbook: The workbook object retrieved from the API.
   * @return {Object} :
   * An object containing an editor state and the activity map.
   */
  mapResponseToEditor(workbook) {
    const activityMap = workbook.activities;
    const entities = workbook.content.entityMap;
    const activityBase = this.state.activityApi;

    // Build activities map.
    //* ********************
    Object.keys(entities).forEach((entity, key) => {
      const id = entities[key].data.activity_id;
      const entityType = entities[key].type;
      const activity = find(propEq('activity_id', id))(activityMap);

      if (activity && entityType === 'ACTIVITY') {
        const {
          title,
          subtitle,
          activity_id,
          description,
          content,
          tout,
          activity_code,
          activity_type_id
        } = activity;

        Object.assign(entities[key].data, activityBase, {
          title,
          subtitle,
          description,
          content,
          tout,
          activity_code,
          activity_id,
          activity_type_id
        });
      } else if (entityType === 'ACTIVITY') {
        entities[key].data = activityBase;
      }
    });

    return {
      state: EditorState.createWithContent(convertFromRaw(workbook.content)),
      activityMap: Immutable(activityMap).asMutable({ deep: true })
    };
  }

  /**
   * Updates an activity in the activity map object.
   * @param  {String} activity_id: String ID of the activity.
   * @param  {Object} newData: An object to merge into the updated activity.
   */
  updateActivityMap(id, newData) {
    const { mapToLearningOutcome, selectedActivityId } = this.props;
    const { activityMap } = this.state;
    const map = [...activityMap];
    const i1 = findIndex(propEq('activity_id', id))(map);
    const i2 = findIndex(propEq('tempId', id))(map);
    let index = null;
    if (i1 < 0 && i2 < 0) {
      throw new Error('Activity to update not found.');
    }
    if (i1 > -1) {
      index = i1;
    } else if (i2 > -1) {
      index = i2;
    }

    const newObj = { ...map[index] };
    Object.assign(newObj, newData);
    map[index] = newObj;
    this.setState({
      activityMap: map
    });
    mapToLearningOutcome(selectedActivityId);
    mapToLearningOutcome(selectedActivityId);
    mapToLearningOutcome(selectedActivityId);
    this.forceUpdate();
  }

  /**
   * Disables an activity so that it is effectively deleted for the UI.
   * In reality, it is merely 'switched off' in the case that it is restored
   * as a result of a user action.
   * @param  {String} activity_id: String ID of the activity.
   * @param  {Boolean} bool: Explicitly set the activity state value
   */
  toggleActivityState(activity_id, bool) {
    const { mapToLearningOutcome, selectedActivityId } = this.props;
    const { activityMap } = this.state;
    const map = [...activityMap];
    const index = findIndex(propEq('activity_id', activity_id))(map);
    if (index < 0) {
      throw new Error('Activity to toggle not found.');
    }
    map[index].disabled =
      typeof bool !== 'undefined' ? bool : !map[index].disabled;
    this.setState({
      activityMap: map
    });

    mapToLearningOutcome(selectedActivityId);
    this.forceUpdate();
  }

  /**
   * Adds a new activity object to map.
   * @param  {String} activityObj: Object containing any preliminary activity data.
   */
  addActivityToMap(activityObj) {
    const { activityMap } = this.state;
    const map = [...activityMap];
    map.push(activityObj);
    this.setState({
      activityMap: map
    });
    this.forceUpdate();
  }

  /**
   * Removes an activiy from map.
   * @param  {Mixed} id: Temp ID or Activity ID.
   */
  removeActivityFromMap(id) {
    const { activityMap } = this.state;
    const map = [...activityMap];
    const i1 = findIndex(propEq('activity_id', id))(map);
    const i2 = findIndex(propEq('tempId', id))(map);
    let index = null;
    if (i1 < 0 && i2 < 0) {
      throw new Error('Activity to remove not found.');
    }
    if (i1 > -1) {
      index = i1;
    } else if (i2 > -1) {
      index = i2;
    }

    map.splice(index, 1);
    this.setState({
      activityMap: map
    });
    this.forceUpdate();
  }

  editorBlockRenderer = activities => block => {
    /**
     * Handle atomic block rendering (Image, Video, Activities).
     */
    if (block.getType() === 'atomic') {
      const contentState = this.state.editorState.getCurrentContent();
      const entity = contentState.getEntity(block.getEntityAt(0));
      const entityType = entity.getType();
      const entityData = entity.getData();
      let BlockContent;
      switch (entityType) {
        case 'ACTIVITY':
          BlockContent = ActivityBlock;
          break;
        case 'IMAGE':
          BlockContent = ImageBlock;
          break;
        case 'VIDEO':
          BlockContent = VideoBlock;
          break;
        case 'LINKBLOCK':
          BlockContent = LinkBlock;
          break;
        default:
          break;
      }
      return {
        component: BlockContent,
        editable: false,
        props: {
          onRemove: blockKey => this.editorRemoveBlock(blockKey),
          activityMap: activities,
          entityType,
          entityData
        }
      };
    }
    return null;
  };

  /**
   * Handle updating a block entity data (image, video, activity).
   * Cycles thtough an array of to-be updated blocks and applies
   * the new data to the blocks in the editor.
   *  @param [Array] queue: Array of blockKey: data objects
   */
  processEntityUpdateQueue(queue) {
    const { editorState } = this.state;

    const { editorUpdateEntityQueueClear } = this.props;

    const contentState = editorState.getCurrentContent();
    let count = queue.length;

    // Cycle backwards, because why the hell not

    while (count--) {
      const blockKey = queue[count].blockKey;
      const newData = queue[count].newData;
      const block = contentState.getBlockForKey(blockKey);
      contentState.mergeEntityData(block.getEntityAt(0), newData);
    }

    // Generate a new editor state
    const newEditorState = EditorState.set(editorState, {
      currentContent: contentState
    });

    editorUpdateEntityQueueClear();
    this.props.recordLastSavedState(newEditorState);

    this.forceEditorRender();
  }

  /**
   * Editor remove block function
   * @param [String] blockKey: Draft JS instance block key
   */
  editorRemoveBlock(blockKey) {
    this.setState({
      editorState: removeBlock(this.state.editorState, blockKey)
    });
  }

  removeEmptyAtomicBlocks() {
    const findEmptAtmicBlocks = e =>
      e.type === 'atomic' && e.entityRanges.length === 0;
    const currentRawState = convertToRaw(
      this.state.editorState.getCurrentContent()
    );
    const emptyAtomicBlocks = currentRawState.blocks.filter(
      findEmptAtmicBlocks
    );
    let newState = this.state.editorState;

    emptyAtomicBlocks.forEach(e => {
      newState = removeBlock(newState, e.key);
    });

    return newState;
  }

  /**
   * Draft JS internal functions
   */

  blockStyler(block) {
    if (block.getType() === 'unstyled') {
      return 'paragraph';
    }
    return `workbook-${block.getType()}`;
  }

  editorToggleBlockType(blockType) {
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, blockType));
  }

  editorToggleInlineStyle(inlineStyle) {
    this.onChange(
      RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle)
    );
  }

  editorAddLink() {
    const linkData = {
      text: null,
      url: null
    };
    this.setState({
      editorState: insertBlock(this.state.editorState, 'LINKBLOCK', linkData)
    });
  }

  editorAddActivity() {
    this.setState({
      editorState: insertBlock(
        this.state.editorState,
        'ACTIVITY',
        this.state.activityApi
      )
    });
    this.onEditorChange();
  }

  editorAddImage() {
    const blockData = {
      image: null,
      color: null,
      title: null,
      description: null,
      position: 'block-right'
    };
    this.setState({
      editorState: insertBlock(this.state.editorState, 'IMAGE', blockData)
    });
    this.onEditorChange();
  }

  editorAddVideo() {
    const blockData = {
      video: null,
      color: null,
      title: null,
      description: null,
      position: 'block-right'
    };
    this.setState({
      editorState: insertBlock(this.state.editorState, 'VIDEO', blockData)
    });
    this.onEditorChange();
  }

  handleKeyCommand(command) {
    const { editorState } = this.state;
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return true;
    }
    return false;
  }

  forceEditorRender() {
    const { editorState } = this.state;
    this.setState({
      editorState: EditorState.forceSelection(
        editorState,
        editorState.getSelection()
      )
    });
  }

  setEntityData() {
    const { editorState } = this.state;
    const { entityUpdateQueue } = this.props;

    let newState = editorState;
    let contentState = newState.getCurrentContent();

    let count = entityUpdateQueue.length;

    // Cycle backwards, because why the hell not

    while (count--) {
      const blockKey = entityUpdateQueue[count].blockKey;
      const newData = entityUpdateQueue[count].newData;
      try {
        const block = contentState.getBlockForKey(blockKey);
        contentState.mergeEntityData(block.getEntityAt(0), newData);
      } catch (e) {}
    }

    return newState;
  }

  /**
   * Saves workbook and cleans the editor state
   */
  saveWorkbook() {
    const { saveWorkbook, unitId, workbookId } = this.props;
    const state = this.removeEmptyAtomicBlocks();
    const workbook = this.getCompiledWorkbook(true, state);
    this.setState({ editorState: state });

    saveWorkbook(workbook, unitId, workbookId);
  }

  deleteWorkbook() {
    const { deleteWorkbookFromUnit, unitId, workbookId } = this.props;
    deleteWorkbookFromUnit(unitId, workbookId);
  }

  render() {
    const {
      open,
      user,
      unitId,
      workbookId,
      lastModified,
      lastModerator,
      currentModerator
    } = this.props;

    const { editorState, customStyles } = this.state;

    let { activityMap } = this.state;
    const { saveWorkbook, deleteWorkbook } = this;

    const editorClassnames = cx({
      'workbooks-editor': true,
      open
    });

    activityMap = Immutable(activityMap);

    // NOTE can current user modify workbook?
    // allow edit anyway if workbook last edited more than 20min ago NOTE is is now disabled
    const canModify = true;
    // const minutesSinceLastModified = Math.abs(moment(lastModified).diff(moment(), 'minutes'));
    // if (currentModerator && currentModerator.member_id !== user.member_id && (minutesSinceLastModified < 20)) canModify = false;

    return (
      <div className={editorClassnames}>
        <OutcomesTray
          open={open}
          unitID={unitId}
          activityMap={activityMap}
          updateActivityMap={this.updateActivityMap}
          addActivityToMap={this.addActivityToMap}
        />
        {canModify && (
          <EditorUi
            editorState={this.state.editorState}
            callback={this.handleEditorUiClick}
          />
        )}
        <div className="rich-editor">
          <Editor
            customStyleMap={customStyles}
            blockRendererFn={this.editorBlockRenderer(activityMap)}
            blockStyleFn={this.blockStyler}
            editorState={editorState}
            handleKeyCommand={this.handleKeyCommand}
            onChange={this.onChange}
            spellCheck
            readOnly={this.state.editingImage}
            placeholder="Write something..."
            contenteditable={canModify}
          />
        </div>
        {currentModerator && currentModerator.member_id !== user.member_id && (
          <div className="current-moderator">
            <i className="fa fa-exclamation-triangle" />
            <div>
              {currentModerator.screen_name} is currently editing this workbook.
              <span>
                Last edited
                {lastModerator &&
                  ` by ${
                    lastModerator.member_id === user.member_id
                      ? 'you'
                      : lastModerator.screen_name
                  }`}{' '}
                {moment(lastModified).fromNow()}.{' '}
                {canModify && 'You can save but be careful not to override.'}
              </span>
            </div>
          </div>
        )}
        {canModify && (
          <BottomBar
            onSave={saveWorkbook}
            onDelete={deleteWorkbook}
            unit_id={unitId}
            workbook_id={workbookId}
            onCancel={() => location.reload()}
          />
        )}
      </div>
    );
  }
}

WorkbookEditor.propTypes = {
  open: PropTypes.bool.isRequired
};

const mapStateToProps = state => {
  const { workbooks, qualifications } = state;
  const { workbook } = workbooks;
  return {
    content: workbook && workbook.content,
    activities: workbook && workbook.activities,
    selectedActivityId: state.qualifications.selectedActivityId,
    title: workbook && workbook.title,
    outcomes: state.units.unit[0] && state.units.unit[0].outcomes,
    lastModified: workbook && workbook.modified,
    lastModerator: workbook && workbook.modified_by,
    currentModerator: workbook && workbook.current_moderator,
    settingCurrentModerator: workbooks.settingCurrentModerator,
    entityUpdateQueue: qualifications.entityUpdateQueue,
    creatingWorkbook: qualifications.creatingWorkbook,
    workbookExists: qualifications.workbookExists,
    isSaving: qualifications.savingWorkbook,
    contentLoaded: qualifications.entityUpdateQueue.length === 0
  };
};

const mapDispatchToProps = dispatch => {
  return {
    clearWorkbookTitle: () => {
      dispatch(WorkBookCreators.clearWorkbookTitle());
    },
    clearCachedWorkbook: () => {
      dispatch(QualificationActions.clearCachedWorkbook());
    },
    updateWorkbookTitle: title => {
      dispatch(WorkBookCreators.updateWorkbookTitle(title));
    },
    editorUpdateEntityQueueClear: () => {
      dispatch(QualificationActions.editorUpdateEntityQueueClear());
    },
    recordLastSavedState: editorState => {
      const content = convertToRaw(editorState.getCurrentContent());
      dispatch(QualificationActions.recordLastSavedState(content));
    },
    getWorkbook: (unit_id, workbook_id) => {
      dispatch(QualificationActions.getWorkbookAttempt(unit_id, workbook_id));
    },
    saveWorkbook: (workbook, unitId, workbookId) => {
      dispatch(
        WorkBookCreators.saveWorkbookAttempt(null, workbook, unitId, workbookId)
      );
    },
    deleteWorkbookFromUnit: (unit_id, workbook_id) => {
      dispatch(
        QualificationActions.deleteWorkbookFromUnitAttempt(unit_id, workbook_id)
      );
    },
    onEditorChange: workbook => {
      dispatch(QualificationActions.onEditorChange(workbook));
    },
    mapToLearningOutcome: activity_id =>
      dispatch(QualificationActions.mapToLearningOutcome(activity_id)),
    setWorkbookCurrentModerator: (unit_id, workbook_id, current_moderator) => {
      dispatch(
        WorkBookCreators.setWorkbookCurrentModeratorAttempt(
          unit_id,
          workbook_id,
          current_moderator
        )
      );
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(WorkbookEditor);
