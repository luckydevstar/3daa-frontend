/* eslint jsx-a11y/label-has-for: 0 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Field, reduxForm, initialize } from 'redux-form';
import common from 'app/common';

const FormField = common.components.Form.field;
const TextareaField = common.components.Form.textarea;
const CloudinaryMedia = common.components.CloudinaryMedia;

class CustomiseBlock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      colors: [
        '#ffffff',
        '#007fa3',
        '#000000',
        '#003057',
        '#d2db0f',
        '#d4eae4',
        '#505759',
        '#005a70',
        '#008638',
        '#eb7601',
        '#ffb81b',
        '#9e007e',
        '#ea067e',
        '#dc001f',
        '#11b2a6',
        '#84bc02'
      ],
      activeColor: null
    };
  }

  componentDidMount() {
    this.setColorSelection(this.props.currentColor);
    this.props.setInitialValues({
      title: this.props.currentTitle,
      description: this.props.currentDescription
    });
  }

  onSubmit(formData) {
    formData = this.composeReturnObject(formData);
    this.props.saveChanges(formData);
  }

  setColorSelection(color) {
    const colorIndex = this.state.colors.indexOf(color);
    const radioElements = document.getElementsByName('color');

    radioElements.forEach(element => {
      element.checked = parseInt(element.value) === colorIndex;
    });
    this.setState({ activeColor: color });
  }

  handleColorSelect(event) {
    const color = this.state.colors[parseInt(event.target.value)];
    if (this.state.activeColor === color) {
      this.deselectColor();
    } else {
      this.setState({ activeColor: color });
    }
  }

  deselectColor() {
    const radioElements = document.getElementsByName('color');
    radioElements.forEach(element => {
      element.checked = false;
    });
    this.setState({ activeColor: null });
  }

  composeReturnObject(object) {
    object.media = this.props.currentMedia ? this.props.currentMedia : null;
    object.color = this.state.activeColor;

    return object;
  }

  renderMediaPreview(media, mediaType = 'image') {
    let result = null;

    if (media.indexOf('yout') > -1 || media.indexOf('vimeo') > -1) {
      result = <iframe src={media} width="200" height="200" frameBorder="0" />;
    } else {
      result = (
        <CloudinaryMedia
          mediaType={mediaType}
          fileId={media}
          transformations={{
            width: 200,
            height: 200,
            crop: 'fill',
            gravity: 'center'
          }}
        />
      );
    }
    return result;
  }

  render() {
    const { currentMedia, close, mediaType } = this.props;
    return (
      <div>
        <div className="workbooks-media-insertion-modal-body customize">
          <div className="sidebar">
            <div className="selected-image">
              {currentMedia ? (
                this.renderMediaPreview(currentMedia, mediaType)
              ) : (
                <span>There is no media selected</span>
              )}
            </div>
            <p>Background Colour</p>
            <div className="color-box">
              {this.state.colors.map((color, key) => (
                <div
                  key={key}
                  className="color"
                  style={{ backgroundColor: color }}
                >
                  <label className="custom checkbox">
                    <input
                      value={key}
                      type="radio"
                      name="color"
                      onClick={e => this.handleColorSelect(e)}
                    />
                    <span className="ui" />
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="body">
            <form action="post">
              <label htmlFor="title">Block title</label>
              <Field
                name="title"
                type="text"
                placeholder="Insert title here"
                component={FormField}
                inputClassName="input"
              />
              <label htmlFor="description">Block Supporting Text</label>
              <Field
                name="description"
                placeholder="Insert description here"
                component={TextareaField}
                classForField="textarea"
              />
            </form>
          </div>
        </div>
        <div className="workbooks-media-insertion-modal-footer p-t-30 p-b-30">
          <div className="button is-primary is-outlined" onClick={close}>
            Cancel
          </div>
          <button
            type="submit"
            className="button is-success"
            onClick={this.props.handleSubmit(e => this.onSubmit(e))}
          >
            Save Changes
          </button>
        </div>
      </div>
    );
  }
}

CustomiseBlock.propTypes = {
  currentMedia: PropTypes.string,
  currentColor: PropTypes.string,
  currentTitle: PropTypes.string,
  currentDescription: PropTypes.string,
  saveChanges: PropTypes.func.isRequired,
  close: PropTypes.func
};

CustomiseBlock.defaultProps = {
  currentMedia: null,
  currentColor: null,
  currentTitle: null,
  currentDescription: null,
  close: () => console.log('Please provide close function')
};

CustomiseBlock = reduxForm({
  form: 'CustomiseBlock'
})(CustomiseBlock);

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  setInitialValues: data => {
    dispatch(initialize('CustomiseBlock', data));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomiseBlock);
