/* eslint jsx-a11y/label-has-for: 0 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import common from 'app/common';

const { Pagination, UILoading } = common.components;
const createCloudinaryUrl = common.util.helpers.createCloudinaryUrl;

class AssetLibrary extends Component {
  constructor(props) {
    super(props);
    this.elementsPerPage = 8;
    this.state = {
      selectedMedia: null
    };
  }

  componentDidUpdate() {
    this.applySelection();
  }

  handleCheckAction(e) {
    const claudinary_image_id = e.target.value;
    this.setState({ selectedMedia: claudinary_image_id });
  }

  applySelection() {
    const radioElements = document.getElementsByName('mediaSelect');
    radioElements.forEach(element => {
      element.checked = element.value === this.state.selectedMedia;
    });
  }

  renderMediaElement() {
    const { media, mediaType, search, handleMediaDelete } = this.props;
    let result = search ? (
      <div className="errorMessage">There is no results for your search</div>
    ) : (
      <div className="errorMessage">{`There is no ${mediaType}s in the assets library`}</div>
    );

    if (media.length) {
      result = media.map(element => {
        const isFullUrl = element.cloudinary_file_id.indexOf('http') !== -1;
        return (
          <div
            key={element.cloudinary_file_id}
            className="media-box-container"
            style={{
              backgroundImage: `url(${createCloudinaryUrl(
                element.cloudinary_file_id,
                this.props.mediaType,
                {
                  width: 140,
                  height: 140,
                  crop: 'fill',
                  gravity: 'center'
                }
              )})`
            }}
          >
            {isFullUrl && (
              <video
                style={{
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center'
                }}
              >
                <source src={element.cloudinary_file_id} type="video/mp4" />
              </video>
            )}
            <div className="media-box">
              <span
                className="delete"
                onClick={() => handleMediaDelete(element.media_id)}
              />
              <label className="custom checkbox">
                <input
                  value={element.cloudinary_file_id}
                  type="radio"
                  name="mediaSelect"
                  onClick={e => {
                    this.handleCheckAction(e);
                  }}
                />
                <span className="ui" />
                <div className="overlay">
                  <div className="title">{element.title}</div>
                  <p>{element.description}</p>
                </div>
              </label>
            </div>
          </div>
        );
      });
    }

    return result;
  }

  render() {
    const { selectedMedia } = this.state;
    const {
      media,
      setCurrentMedia,
      close,
      totalMedia,
      elementsPerPage,
      handlePaginationChange
    } = this.props;

    return (
      <div className="library">
        <div className="workbooks-media-insertion-modal-body">
          {media ? this.renderMediaElement() : <UILoading />}
        </div>
        <Pagination
          itemsLength={totalMedia}
          itemsPerPage={elementsPerPage}
          maxPagesDisplayed={4}
          onPageChange={nextPage => handlePaginationChange(nextPage)}
        />
        <div className="workbooks-media-insertion-modal-footer">
          <div className="button is-primary is-outlined" onClick={close}>
            Cancel
          </div>
          <div
            className="button is-success"
            disabled={!selectedMedia}
            onClick={() => setCurrentMedia(selectedMedia)}
          >
            Choose Selected
          </div>
        </div>
      </div>
    );
  }
}

AssetLibrary.propTypes = {
  close: PropTypes.func.isRequired,
  handlePaginationChange: PropTypes.func.isRequired,
  mediaType: PropTypes.string.isRequired,
  setCurrentMedia: PropTypes.func.isRequired,
  totalMedia: PropTypes.number,
  elementsPerPage: PropTypes.number,
  search: PropTypes.string
};

AssetLibrary.defaultProps = {
  search: null,
  totalMedia: null,
  elementsPerPage: 8
};

export default AssetLibrary;
