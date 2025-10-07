import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const uploadButtonClasses = [
  'init',
  'button',
  'is-success',
  'animate',
  'fade-in'
];

class CommunityMediaAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      videoURL: '',
      fileData: null
    };
    this.onDrop = this.onDrop.bind(this);
    this.onDragOver = this.onDragOver.bind(this);
    this.fileChange = this.fileChange.bind(this);
    this.updateFileURL = this.updateFileURL.bind(this);
    this.upload = this.upload.bind(this);
  }
  onDrop(e) {
    e.preventDefault();
    if (e.dataTransfer.items[0].kind === 'file') {
      const file = e.dataTransfer.items[0].getAsFile();
      this.updateFileURL(file);
    }
  }
  onDragOver(e) {
    e.preventDefault();
  }
  fileChange(e) {
    const file = e.target.files[0];
    this.updateFileURL(file);
  }
  updateFileURL(file) {
    const fileURL = URL.createObjectURL(file);
    const fileData = new FormData();
    fileData.append('task_file', file);
    this.setState({
      videoURL: fileURL,
      fileData
    });
  }
  upload() {
    const { authorFileUploadAttempt, memberId } = this.props;
    const { fileData } = this.state;
    authorFileUploadAttempt(fileData, {
      member_id: memberId,
      source: 'task',
      type: 'video'
    });
  }
  render() {
    const { attemptingAuthorFileUpload } = this.props;
    const { videoURL, fileData } = this.state;
    return (
      <div className="community-media-add">
        <h3 className="media-upload__step-title has-text-centered m-t-20 m-b-30">
          Add Video
        </h3>
        <label htmlFor="community-task-file-upload">
          <div
            className="community-media-add__dropzone"
            onDrop={this.onDrop}
            onDragOver={this.onDragOver}
          >
            {videoURL && (
              <div>
                <video controls autoPlay src={videoURL} />
                <a>Select different video</a>
              </div>
            )}
            {!videoURL && (
              <div>
                <p className="title is-4">Drop file here</p>
                <p>or</p>
                <a>Select video</a>
              </div>
            )}
          </div>
          <input
            id="community-task-file-upload"
            className="input-hidden"
            type="file"
            onChange={this.fileChange}
          />
        </label>
        <div className="community-media-add__btn">
          <button
            disabled={!fileData}
            className={classNames(...uploadButtonClasses, {
              'is-loading': attemptingAuthorFileUpload
            })}
            onClick={this.upload}
          >
            Upload
          </button>
        </div>
      </div>
    );
  }
}

CommunityMediaAdd.propTypes = {
  memberId: PropTypes.number.isRequired,
  authorFileUploadAttempt: PropTypes.func,
  attemptingAuthorFileUpload: PropTypes.bool
};

CommunityMediaAdd.defaultProps = {
  authorFileUploadAttempt: () => {},
  attemptingAuthorFileUpload: false
};

export default CommunityMediaAdd;
