import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import { connect } from 'react-redux';
import { change } from 'redux-form';

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
import { Creators as NewsActions } from 'app/news/actions';
import common from 'app/common';

import BottomBar from './bottom-bar';
import insertBlock from './editor-blocks/modifiers/insert-block';
import removeBlock from './editor-blocks/modifiers/remove-block';
import ImageBlock from './editor-blocks/image-block';
import VideoBlock from './editor-blocks/video-block';
import LinkBlock from './editor-blocks/link/link';
import EditorUi from './editor-ui';

import NewsArticlePreview from './preview/news-article-preview';

const {
  components: { CloudinaryMedia }
} = common;

class NewsArticleEditor extends Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.handleEditorUiClick = this.handleEditorUiClick.bind(this);
    this.mapResponseToEditor = this.mapResponseToEditor.bind(this);
    this.editorBlockRenderer = this.editorBlockRenderer.bind(this);
    this.processEntityUpdateQueue = this.processEntityUpdateQueue.bind(this);
    this.setEntityData = this.setEntityData.bind(this);

    this.editorRemoveBlock = this.editorRemoveBlock.bind(this);
    this.blockStyler = this.blockStyler.bind(this);
    this.editorToggleBlockType = this.editorToggleBlockType.bind(this);
    this.editorToggleInlineStyle = this.editorToggleInlineStyle.bind(this);
    this.editorAddLink = this.editorAddLink.bind(this);
    this.editorAddImage = this.editorAddImage.bind(this);
    this.editorAddVideo = this.editorAddVideo.bind(this);
    this.handleKeyCommand = this.handleKeyCommand.bind(this);

    this.onSave = this.onSave.bind(this);
    this.onEditorChange = this.onEditorChange.bind(this);
    this.getCompiledContent = this.getCompiledContent.bind(this);
    this.forceEditorRender = this.forceEditorRender.bind(this);

    this.state = {
      editorState: EditorState.createEmpty(),
      previewNewsArticle: false,
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
      }
    };
  }

  UNSAFE_componentWillMount() {
    const { title, user, content, entityUpdateQueue } = this.props;

    if (content && !this.responseProcessed) {
      let response = {};

      const parsedContent = this.getInitData(content, entityUpdateQueue, 1);

      if (typeof parsedContent !== 'object') {
        response = convertToRaw(EditorState.createEmpty().getCurrentContent());
      } else {
        response = parsedContent;
      }

      const processed = this.mapResponseToEditor(response);

      this.setState(
        {
          editorState: processed.state
        },
        this.onEditorChange
      );

      this.responseProcessed = true;
    }
  }

  componentDidMount() {}

  /**
   * Component will receive props handles the following:
   * - Creating a workbook
   * - Processing the Draft JS block update queue
   */
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { title, user, content } = nextProps;

    if (this.state.previewNewsArticle != nextProps.previewNewsArticle) {
      this.setState({ previewNewsArticle: nextProps.previewNewsArticle });
      if (!nextProps.previewNewsArticle) {
        this.responseProcessed = false;
      }
    }

    if (content && !this.responseProcessed) {
      let response = {};
      const parsedContent = this.getInitData(
        nextProps.content,
        nextProps.entityUpdateQueue,
        1
      );

      if (typeof parsedContent !== 'object') {
        response = convertToRaw(EditorState.createEmpty().getCurrentContent());
      } else {
        response = parsedContent;
      }

      const processed = this.mapResponseToEditor(response);

      this.setState(
        {
          editorState: processed.state
        },
        this.onEditorChange
      );

      this.responseProcessed = true;
    }
  }

  componentWillUnmount() {
    this.props.clearCachedNewsArticle();
    this.props.newsEditorUpdateEntityQueueClear();

    if (this.props.previewNewsArticle) this.props.togglePreviewNewsArticle();
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
      this.props.changeFieldValue(
        'newsEdit',
        'content',
        this.getCompiledContent()
      );
    }, 500);
  }

  /**
   * Compile the workbook for saving purposes
   * @param {bool} compileActivities If true activities are compiled to be served to API for saving
   * @param {*} newState Supply a different state to save
   */
  getCompiledContent(compileEntities, newState) {
    const state = this.state.editorState || newState;
    // Get content
    const compiledContent = JSON.stringify(
      convertToRaw(state.getCurrentContent())
    );
    return compiledContent;
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
        console.log('Activity map', this.activityMap);
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
  mapResponseToEditor(content) {
    return {
      state: EditorState.createWithContent(convertFromRaw(content))
    };
  }

  editorBlockRenderer(block) {
    /**
     * Handle atomic block rendering (Image, Video, Activities).
     */
    let entity = block.getEntityAt(0);
    // console.log('ppppp', block.getType());
    // if (block.getType() === 'atomic') {
    //   console.log('ooooo', entity, block);
    // }

    if (block.getType() === 'atomic' && entity) {
      const contentState = this.state.editorState.getCurrentContent();
      const entity = contentState.getEntity(block.getEntityAt(0) || {});
      const entityType = entity.getType();
      const entityData = entity.getData();
      let BlockContent;
      switch (entityType) {
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
        editable: true,
        props: {
          onRemove: blockKey => this.editorRemoveBlock(blockKey),
          entityType,
          entityData
        }
      };
    }
    return null;
  }

  processEntityUpdateQueue(queue) {
    const { editorState } = this.state;

    const {
      editorNewsUpdateEntityQueueClear,
      recordNewsLastSavedState
    } = this.props;

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

    editorNewsUpdateEntityQueueClear();
    recordNewsLastSavedState(newEditorState);

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

  createBothPreview(file, cloudinaryMediaType) {
    let result = null;
    if (file) {
      if (typeof file === 'string') {
        switch (cloudinaryMediaType) {
          case 'image':
            result = (
              <CloudinaryMedia
                fileId={file}
                mediaType={cloudinaryMediaType}
                transformations={{
                  crop: 'fill',
                  gravity: 'center'
                }}
              />
            );
            break;
          case 'video':
            result = (
              <CloudinaryMedia
                fileId={file}
                mediaType={cloudinaryMediaType}
                thumbnail
                transformations={{
                  crop: 'fill',
                  gravity: 'center'
                }}
              />
            );
            break;
          default:
        }
      } else {
        if (file.type.includes('video')) {
          result = (
            <video
              src={file.preview}
              controls
              style={{ width: '100%', height: '100%', objectFit: 'fill' }}
            />
          );
        } else if (file.type.includes('image')) {
          result = (
            <img
              src={file.preview}
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'fill' }}
            />
          );
        } else {
          result = <div />;
        }
      }
    }
    return result;
  }

  onSave() {
    const { onSave } = this.props;
    let state = this.removeEmptyAtomicBlocks();
    state = this.setEntityData();
    const content = this.getCompiledContent(true, state);
    this.setState({ editorState: state });
    onSave(content);
  }

  getInitData(content, entityUpdateQueue, returnType = 2) {
    // 1: Object, 2: String
    let response = {};
    let count = entityUpdateQueue.length;

    if (content) {
      response = JSON.parse(content);
      // Cycle backwards, because why the hell not

      while (count--) {
        const blockKey = entityUpdateQueue[count].blockKey;
        const newData = entityUpdateQueue[count].newData;
        try {
          let block = response.blocks.find(b => b.key == blockKey);
          if (block && block.entityRanges.length > 0) {
            response.entityMap[block.entityRanges[0].key].data = newData;
          }
        } catch (e) {}
      }
    }

    if (returnType == 2) return JSON.stringify(response);
    else return response;
  }

  render() {
    const {
      open,
      user,
      lastModified,
      lastModerator,
      newsProvider,
      saving,
      previewNewsArticle,
      content,
      entityUpdateQueue
    } = this.props;

    const { editorState, customStyles } = this.state;

    const { onSave } = this;

    const editorClassnames = cx({
      'workbooks-editor': true,
      open
    });

    // NOTE can current user modify workbook?
    // allow edit anyway if workbook last edited more than 20min ago NOTE is is now disabled
    const canModify = !previewNewsArticle;
    // const minutesSinceLastModified = Math.abs(moment(lastModified).diff(moment(), 'minutes'));

    return (
      <div className={editorClassnames} style={{ overflowY: 'auto' }}>
        {canModify && (
          <EditorUi
            editorState={this.state.editorState}
            callback={this.handleEditorUiClick}
          />
        )}
        <div className={cx({ 'rich-editor': !previewNewsArticle })}>
          {newsProvider && newsProvider.header && (
            <div
              className="header-background"
              style={{
                width: '100%',
                overflow: 'hidden'
              }}
            >
              {this.createBothPreview(newsProvider.header, 'image')}
            </div>
          )}

          {!previewNewsArticle ? (
            <Editor
              customStyleMap={customStyles}
              blockRendererFn={this.editorBlockRenderer}
              blockStyleFn={this.blockStyler}
              editorState={editorState}
              handleKeyCommand={this.handleKeyCommand}
              onChange={this.onChange}
              spellCheck
              readOnly={this.state.editingImage}
              placeholder="Write something..."
              contenteditable={canModify}
            />
          ) : (
            <NewsArticlePreview
              content={this.getInitData(content, entityUpdateQueue)}
            />
          )}
        </div>
        {canModify && (
          <BottomBar
            onSave={onSave}
            onCancel={() => location.reload()}
            saving={saving}
          />
        )}
      </div>
    );
  }
}

NewsArticleEditor.propTypes = {};

NewsArticleEditor.defaultProps = {
  formName: '',
  saving: false,
  onSave: () => {}
};

const mapStateToProps = state => {
  return {
    newsProvider: path(['news', 'currentNewsProvider'])(state),

    content: path(['form', 'newsEdit', 'values', 'content'])(state),
    title: path(['form', 'newsEdit', 'values', 'title'])(state),

    lastModified: path(['news', 'currentNews', 'modified'])(state),
    lastModerator: path(['news', 'currentNews', 'modified_by'])(state),
    entityUpdateQueue: path(['news', 'entityUpdateQueue'])(state),
    previewNewsArticle: path(['news', 'previewNewsArticle'])(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    changeFieldValue: (form_name, field_name, value) =>
      dispatch(change(form_name, field_name, value)),

    onNewsEditorChange: newsArticle => {
      dispatch(NewsActions.onNewsEditorChange(newsArticle));
    },

    clearCachedNewsArticle: () => {
      dispatch(NewsActions.clearCachedNewsArticle());
    },

    newsEditorUpdateEntityQueueClear: () => {
      dispatch(NewsActions.newsEditorUpdateEntityQueueClear());
    },

    recordNewsLastSavedState: editorState => {
      const content = convertToRaw(editorState.getCurrentContent());
      dispatch(NewsActions.recordNewsLastSavedState(content));
    },

    togglePreviewNewsArticle: () => {
      dispatch(NewsActions.togglePreviewNewsArticle());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewsArticleEditor);
