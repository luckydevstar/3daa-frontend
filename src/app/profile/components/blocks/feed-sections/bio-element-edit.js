import React from 'react';
import common from 'app/common';

const CloudinaryMedia = common.components.CloudinaryMedia;

class BioEdit extends React.Component {
  constructor(props) {
    super(props);
    const { bio } = this.props;
    this.state = {
      localBio: {
        member_bio_id: bio.member_bio_id,
        type: bio.type,
        title: bio.title,
        subtitle: bio.subtitle ? bio.subtitle : '',
        from_date: bio.from_date,
        to_date: bio.to_date ? bio.to_date : '',
        description: bio.description ? bio.description : '',
        photo: bio.photo,
        location: bio.location
      },
      localFile: false
    };
  }

  handleChange(e) {
    const stateCopy = this.state.localBio;
    const name = e.target.name;
    stateCopy[name] = e.target.value;
    this.setState({ localBio: stateCopy }, () => {
      this.props.callback(this.state.localBio);
    });
  }

  validateFile(file) {
    const result = {
      valid: true,
      errorMeassage: ''
    };
    if (!file) {
      result.valid = false;
      result.errorMeassage = "You didn't select a file";
      return result;
    }
    if (file.length > 1) {
      result.valid = false;
      result.errorMeassage = 'Only one file is allowed';
      return result;
    }

    if (
      file[0].type !== 'image/jpeg' &&
      file[0].type !== 'image/jpg' &&
      file[0].type !== 'image/png'
    ) {
      result.valid = false;
      result.errorMeassage = 'We accept only jpg/jpeg/png file extensions';
      return result;
    }

    if (file[0].size > 10000000) {
      result.valid = false;
      result.errorMeassage = 'Max file size is 10MB';
      return result;
    }

    return result;
  }

  displayUploadedImage(file) {
    this.setState({ localFile: true }, () => {
      const output = document.getElementById(
        `image${this.props.bio.member_bio_id}`
      );
      output.style.backgroundImage = `url(${window.URL.createObjectURL(file)})`;
    });
  }

  handleFileUpload(e) {
    if (this.validateFile(e.target.files).valid) {
      const newState = this.state.localBio;

      newState.photo = e.target.files[0];
      this.setState({ localBio: newState }, () => {
        this.props.callback(this.state.localBio);
      });

      this.displayUploadedImage(e.target.files[0]);
    }
  }

  render() {
    const { bio } = this.props;
    const { localBio } = this.state;
    return (
      <div key={bio.member_bio_id} className="item m-b-40">
        {bio.photo && !this.state.localFile
          ? <CloudinaryMedia
              fileId={bio.photo}
              mediaType="image"
              transformations={{
                width: 50,
                height: 50,
                crop: 'fill',
                gravity: 'center'
              }}
              className="media-left m-b-10"
            />
          : <div
              id={`image${bio.member_bio_id}`}
              className="media-left m-b-10"
              style={{
                backgroundImage: 'url(https://unsplash.it/50?image=972)'
              }}
            />}

        <label htmlFor="file">Update file</label>
        <p className="control">
          <input
            onChange={e => this.handleFileUpload(e)}
            className="m-b-10"
            type="file"
            name="file"
          />
        </p>

        <div className="media-content">
          <label htmlFor="title">Title</label>
          <p className="control">
            <input
              className="input"
              name="title"
              type="text"
              value={localBio.title}
              onChange={e => this.handleChange(e)}
            />
          </p>
          <label htmlFor="subtitle">Subtitle</label>
          <p className="control">
            <input
              className="input"
              name="subtitle"
              type="text"
              value={localBio.subtitle}
              onChange={e => this.handleChange(e)}
            />
          </p>
          <label htmlFor="from_date">Date start</label>
          <p className="control">
            <input
              className="input"
              name="from_date"
              type="text"
              placeholder="yyyy-mm-dd"
              value={localBio.from_date}
              onChange={e => this.handleChange(e)}
            />
          </p>
          <label htmlFor="to_date">Date finish</label>
          <p className="control">
            <input
              className="input"
              name="to_date"
              type="text"
              placeholder="yyyy-mm-dd"
              value={localBio.to_date}
              onChange={e => this.handleChange(e)}
            />
          </p>
          <label htmlFor="description">Details</label>
          <p className="control">
            <textarea
              className="textarea"
              name="description"
              type="text"
              value={localBio.description}
              onChange={e => this.handleChange(e)}
            />
          </p>
        </div>
      </div>
    );
  }
}

export default BioEdit;
