import React from 'react';

class SelectIocnModalUpload extends React.Component {
  constructor(props) {
    super(props);

    this.onDrop = this.onDrop.bind(this);
    this.uploadClick = this.uploadClick.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
    this.inputChange = this.inputChange.bind(this);
  }
  onDrop(e) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    this.uploadFile(file);
  }
  onDragOver(e) {
    e.preventDefault();
  }
  uploadFile(file) {
    const { setLocalUploadedImage } = this.props;
    if (file.type.indexOf('image') !== -1) {
      const reader = new FileReader();
      reader.onload = () => {
        const imageObj = {
          url: reader.result,
          file
        };
        setLocalUploadedImage(imageObj);
      };

      reader.readAsDataURL(file);
    }
  }
  uploadClick() {
    document
      .querySelector('.pairing-wheel__select-icon-content__upload__input')
      .click();
  }
  inputChange(e) {
    const file = e.target.files[0];
    if (file) {
      this.uploadFile(file);
    }
  }

  render() {
    const { uploadedImage } = this.props;
    return (
      <div className="pairing-wheel__select-icon-content__upload">
        <div
          className="pairing-wheel__select-icon-content__upload__dropzone"
          onDrop={this.onDrop}
          onDragOver={this.onDragOver}
        >
          {uploadedImage && <img src={uploadedImage.url} alt="" />}
          {uploadedImage && (
            <a
              className="pairing-wheel__select-icon-content__upload__dropzone__text3"
              onClick={this.uploadClick}
            >
              Select different
            </a>
          )}
          {!uploadedImage && (
            <div className="pairing-wheel__select-icon-content__upload__dropzone__text1">
              Drop file here
            </div>
          )}
          {!uploadedImage && (
            <div className="pairing-wheel__select-icon-content__upload__dropzone__text2">
              or
            </div>
          )}
          {!uploadedImage && (
            <a
              className="pairing-wheel__select-icon-content__upload__dropzone__text3"
              onClick={this.uploadClick}
            >
              Select image
            </a>
          )}
        </div>
        <input
          type="file"
          className="pairing-wheel__select-icon-content__upload__input"
          onChange={this.inputChange}
        />
      </div>
    );
  }
}

export default SelectIocnModalUpload;
