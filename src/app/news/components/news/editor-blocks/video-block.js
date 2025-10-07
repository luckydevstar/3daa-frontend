import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import VideoInsertionModal from '../../modals/video-insertion-modal';
import { Creators } from 'app/news/actions';
import common from 'app/common';

const CloudinaryMedia = common.components.CloudinaryMedia;

class VideoBlock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      video: null,
      color: null,
      description: null,
      title: null,
      position: 'block-right'
    };
  }

  componentDidMount() {
    this.loadEntityData();
  }

  shouldComponentUpdate(nextProps, nextState) {
    let result = true;

    if (
      Object.keys(nextState).every(key => this.state[key] === nextState[key])
    ) {
      result = false;
    }

    return result;
  }

  componentDidUpdate() {
    this.updateEntityData();
  }

  remove() {
    this.props.blockProps.onRemove(this.props.block.getKey());
  }

  insertVideo(videoId) {
    this.setState({ video: videoId });
  }

  handleSelectChange(e) {
    const newPosition = e.target.value;
    this.setState({ position: newPosition });
  }

  handlePosterClick(e) {
    const video = e.target.nextSibling;

    video.play();
    e.target.style.display = 'none';
    video.style.display = 'block';
  }

  saveChanges(data) {
    this.setState(
      {
        video: data.media,
        color: data.color,
        title: data.title,
        description: data.description
      },
      () => {
        this.videoInsertionModal.getWrappedInstance().close();
      }
    );
  }

  updateEntityData() {
    const that = this;
    const entityData = this.props.blockProps.entityData;
    const newEntityData = {};

    Object.keys(entityData).forEach(key => {
      newEntityData[key] = that.state[key];
    });

    this.props.updateEntity(this.props.block.getKey(), newEntityData);
  }

  loadEntityData() {
    const entityData = this.props.blockProps.entityData;
    this.setState({
      video: entityData.video,
      color: entityData.color,
      title: entityData.title,
      position: entityData.position,
      description: entityData.description
    });
  }

  correctColor(color) {
    if (color === '#d4eae4' || color === '#ffffff' || color === '#d2db0f') {
      return '#4a4a4a';
    }
    return '#f9f9f9';
  }

  renderVideoPreview(video) {
    let result = null;

    if (video && video.indexOf('http') === -1) {
      result = (
        <div>
          <CloudinaryMedia
            mediaType="video"
            thumbnail
            fileId={video}
            onClick={e => this.handlePosterClick(e)}
          />
          <CloudinaryMedia
            mediaType="video"
            fileId={video}
            attributes={{ preload: 'none', controls: true }}
            style={{ display: 'none' }}
          />
        </div>
      );
    } else {
      result = (
        <iframe
          src={video}
          width="640"
          height="360"
          frameBorder="0"
          allowFullScreen
        />
      );
    }
    return result;
  }

  render() {
    const { video, color, title, description, position } = this.state;
    return (
      <div className="editor-block-container editor-block-container-image">
        <div className="editor-block-header">
          <label htmlFor="position">Video block type</label>
          <p className="control">
            <span className="select">
              <select
                value={position}
                onChange={e => this.handleSelectChange(e)}
              >
                <option value="block-right">2 Columns right</option>
                <option value="block-left">2 Columns left</option>
                <option value="block-center">Just Video</option>
              </select>
            </span>
          </p>
        </div>
        <div
          className={classNames('editor-block-body', position)}
          style={{ backgroundColor: color }}
        >
          <div
            className="text"
            style={{ color: color ? this.correctColor(color) : 'inherit' }}
          >
            <h2
              className="is-2"
              style={{ color: color ? this.correctColor(color) : '#4a4a4a' }}
            >
              {title || <span>Video Title Here</span>}
            </h2>
            <div className="description">
              {description || (
                <span>
                  Supporting content for the video will show here. You can edit
                  this content by clicking the button below.
                </span>
              )}
            </div>
          </div>
          <div className={video ? 'image' : 'image default'}>
            {video ? (
              this.renderVideoPreview(video)
            ) : (
              <i className="fa fa-file-video-o" />
            )}
          </div>
        </div>
        <div className="editor-block-footer">
          <div
            className="button is-primary"
            onClick={() => {
              this.videoInsertionModal.getWrappedInstance().open();
            }}
          >
            Customise this block
          </div>
          <div
            onClick={() => this.remove()}
            className="remove-block is-pulled-right"
          >
            Delete Block
            <i className="fa fa-trash-o" />
          </div>
        </div>
        <VideoInsertionModal
          saveChanges={e => this.saveChanges(e)}
          currentState={this.state}
          ref={e => {
            this.videoInsertionModal = e;
          }}
          onInsert={e => this.insertVideo(e)}
        />
      </div>
    );
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  updateEntity: (blockKey, newData) =>
    dispatch(Creators.newsEditorUpdateEntity(blockKey, newData))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VideoBlock);
