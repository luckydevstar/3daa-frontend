import React from 'react';
import { connect } from 'react-redux';
import ImageInsertionModal from '../../modals/image-insertion-modal';
import classNames from 'classnames';
import { Creators } from 'app/qualifications/actions';
import common from 'app/common';

const CloudinaryMedia = common.components.CloudinaryMedia;

class ImageBlock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      color: null,
      title: null,
      description: null,
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

  saveChanges(data) {
    this.setState(
      {
        image: data.media,
        color: data.color,
        title: data.title,
        description: data.description
      },
      () => {
        this.imageInsertionModal.getWrappedInstance().close();
      }
    );
  }

  handleSelectChange(e) {
    const newPosition = e.target.value;
    this.setState({ position: newPosition });
  }

  correctColor(color) {
    if (color === '#d4eae4' || color === '#ffffff' || color === '#d2db0f') {
      return '#4a4a4a';
    }
    return '#f9f9f9';
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
      image: entityData.image,
      color: entityData.color,
      title: entityData.title,
      position: entityData.position,
      description: entityData.description
    });
  }

  render() {
    const { image, color, title, description } = this.state;

    return (
      <div className="editor-block-container editor-block-container-image">
        <div className="editor-block-header">
          <label htmlFor="image-block-type">Image block type</label>
          <p className="control">
            <span className="select">
              <select
                value={this.state.position}
                onChange={e => this.handleSelectChange(e)}
              >
                <option value="block-right">2 Columns right</option>
                <option value="block-left">2 Columns left</option>
                <option value="block-center">Just image</option>
              </select>
            </span>
          </p>
        </div>
        <div
          className={classNames('editor-block-body', this.state.position)}
          style={{ backgroundColor: color }}
        >
          <div
            className="text"
            style={{ color: color ? this.correctColor(color) : '#4a4a4a' }}
          >
            <h2
              className="is-2"
              style={{ color: color ? this.correctColor(color) : '#4a4a4a' }}
            >
              {title || <span>Image Title Here</span>}
            </h2>
            <div className="description">
              {description || (
                <span>
                  Supporting content for the illustration will show here. You
                  can edit this content by clicking the button below.
                </span>
              )}
            </div>
          </div>
          <div className={image ? 'image' : 'image default'}>
            {image ? (
              <CloudinaryMedia mediaType="image" fileId={image} />
            ) : (
              <i className="fa fa-picture-o" />
            )}
          </div>
        </div>
        <div className="editor-block-footer">
          <div
            onClick={() => {
              this.imageInsertionModal.getWrappedInstance().open();
            }}
            className="button is-primary"
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
        <ImageInsertionModal
          saveChanges={data => this.saveChanges(data)}
          currentState={this.state}
          ref={e => {
            this.imageInsertionModal = e;
          }}
          onInsert={e => this.insertImage(e)}
        />
      </div>
    );
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  updateEntity: (blockKey, newData) =>
    dispatch(Creators.editorUpdateEntity(blockKey, newData))
});

export default connect(mapStateToProps, mapDispatchToProps)(ImageBlock);
