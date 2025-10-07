/* eslint react/no-did-update-set-state: 0 */
import React from 'react';
import moment from 'moment-timezone';
import { connect } from 'react-redux';
import { path, head, equals } from 'ramda';
import { Link, browserHistory } from 'react-router';
import Dropzone from 'react-dropzone';
import classNames from 'classnames';
import Summary from '../components/workbook/unit-view/summary';
import Outcomes from '../components/workbook/unit-view/outcomes';
import units from 'app/units';
import { Creators as WorkBooksCreators } from 'app/workbooks/actions';
import { Creators as QualificationActions } from 'app/qualifications/actions';
import { Creators as UserCreators } from 'app/user/actions';
import common from 'app/common';

import getVideoFrame from '../util/get-video-frame';
import { convertToFormData } from '../../common/util/helpers';

const { UINavigation, UILoading } = common.components;
const UnitsActions = units.Actions;
const Footer = common.components.Footer;

class WorkbooksUnitViewRoute extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: 0,
      tabs: ['Summary', 'Outcomes'],
      headerThumbnail: null,
      headerError: null,
      headerFile: null,
      coverThumbnail: null,
      coverError: null,
      coverFile: null,
      workbook_reference: ''
    };

    this.goBack = this.goBack.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
  }

  UNSAFE_componentWillMount() {
    if (this.props.params.workbook_id || this.props.workbook) {
      const workbook_id =
        this.props.params.workbook_id || this.props.workbook.workbook_id;
      if (workbook_id) {
        this.props.getWorkbook(this.props.params.unit_id, workbook_id);
      }
    }

    if (this.props.params.unit_id) {
      this.props.getUnitAttempt(this.props.params.unit_id);
    }

    if (!this.props.qualification && this.props.params.qualification_id) {
      this.props.getQualificationAttempt(
        parseInt(this.props.params.qualification_id)
      );
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!equals(this.props.newWorkbookId, nextProps.newWorkbookId)) {
      browserHistory.push(
        `${location.pathname}/${nextProps.newWorkbookId}/editor`
      );
    }

    if (
      !equals(
        path(['qualification', 'sector_id'], this.props),
        path(['qualification', 'sector_id'], nextProps)
      )
    ) {
      const { sector_id } = nextProps.qualification;
      const activeSector = this.getSectorObject(sector_id);
      this.props.setActiveSector(activeSector);
    }
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.workbook &&
      prevProps.workbook.cover !== this.props.workbook.cover &&
      this.props.workbook.cover !== 'null' &&
      typeof this.props.workbook.cover === 'string'
    ) {
      this.setState({
        coverThumbnail: common.util.helpers.createCloudinaryUrl(
          this.props.workbook.cover,
          'image',
          { width: 180, height: 250, crop: 'fill', gravity: 'center' }
        )
      });
    }
    if (
      this.props.workbook &&
      prevProps.workbook.header !== this.props.workbook.header &&
      this.props.workbook.header !== 'null' &&
      typeof this.props.workbook.header === 'string'
    ) {
      this.setState({
        headerThumbnail: `${common.util.helpers.createCloudinaryUrl(
          this.props.workbook.header,
          this.props.workbook.header_type || 'video',
          { width: 1440, height: 500, crop: 'fill', gravity: 'center' }
        )}`
      });
    }
    if (
      this.props.workbook &&
      prevProps.workbook.workbook_reference !==
        this.props.workbook.workbook_reference &&
      this.props.workbook.workbook_reference !== 'null'
    ) {
      this.setState({
        workbook_reference: this.props.workbook.workbook_reference
      });
    }
  }

  componentWillUnmount() {
    // NOTE clear current moderator if it is current user
    const { workbook, user } = this.props;
    if (
      workbook &&
      workbook.current_moderator &&
      user &&
      workbook.current_moderator.member_id === user.member_id
    ) {
      this.props.clearWorkbookCurrentModerator(
        workbook.unit_id,
        workbook.workbook_id
      );
    }

    this.props.clearWorkbookState();
  }

  goBack() {
    browserHistory.goBack();
    browserHistory.goBack();
  }

  setHeaderThumbnail(file) {
    if (file.type.indexOf('image') > -1) {
      this.setState({ headerThumbnail: file.preview });
    }
    const videoElement = document.createElement('video');
    videoElement.src = file.preview;

    // When video loads
    videoElement.onloadeddata = e => {
      getVideoFrame(
        e.target,
        e.target.videoWidth,
        e.target.videoHeight,
        url => {
          this.setState({ headerThumbnail: url });
        }
      );
    };
  }

  setCoverThumbnail(image) {
    this.setState({ coverThumbnail: image.preview });
  }

  getSectorObject(sector_id) {
    return head(
      this.props.sectorsList.filter(sector => sector.sector_id === sector_id)
    );
  }

  getActiveTab() {
    let activeTab = null;
    const { unit } = this.props;

    switch (this.state.activeTab) {
      case 0:
        activeTab = (
          <Summary
            unit_id={unit.unit_id}
            summary={unit.summary}
            reference={unit.reference}
            level={unit.level}
            credit_value={unit.credit_value}
            guided_learning_hours={unit.guided_learning_hours}
            overview={unit.overview}
            imageThumbnail={this.state.coverThumbnail}
            imageError={this.state.coverError}
            workbook_reference={this.state.workbook_reference}
            workbook={this.props.workbook}
            handleImageUpload={image => this.handleCoverUpload(image)}
            handleReferenceChange={e => this.handleReferenceChange(e)}
            onEditClick={() => this.handleEditClick()}
          />
        );
        break;
      case 1:
        activeTab = <Outcomes outcomes={unit.outcomes} />;
        break;
      default:
        break;
    }

    return activeTab;
  }

  changeTabView(newTabIndex) {
    if (this.state.activeTab !== newTabIndex) {
      this.setState({ activeTab: newTabIndex });
    } else {
      return false;
    }
    return null;
  }
  handleReferenceChange(e) {
    this.setState({ workbook_reference: e.target.value });
  }

  validateVideo(video, callback) {
    const error = [];
    const {
      videoConf: { max_file_size, formats }
    } = this.props;

    if (formats && formats.every(e => video.type.indexOf(e) === -1)) {
      error.push(`We're accepting${formats.map(format => ` .${format}`)} only`);
      return callback(false, error);
    }

    if (video.size > max_file_size) {
      error.push(`Your video is bigger than: ${max_file_size / 1024 / 1024}MB`);
      return callback(false, error);
    }

    return callback(true);
  }

  validateImage(image, callback) {
    const img = new Image();
    const error = [];
    const {
      imageConf: { max_resolution, min_resolution, max_file_size, formats }
    } = this.props;

    img.src = image.preview;
    img.type = image.type;

    if (formats && formats.every(e => image.type.indexOf(e) === -1)) {
      error.push(`We're accepting${formats.map(format => ` .${format}`)} only`);
      return callback(false, error);
    }

    if (image.size > max_file_size) {
      error.push(`Your image is bigger than: ${max_file_size / 1024 / 1024}MB`);
    }

    img.onload = () => {
      if (img.type.indexOf('svg') > -1) {
        return callback(true, null);
      }
      if (
        img.width > max_resolution.width ||
        img.height > max_resolution.height
      ) {
        error.push(
          `Your image is larger than ${max_resolution.width}x${
            max_resolution.height
          }`
        );
      }
      if (
        img.width < min_resolution.width ||
        img.height < min_resolution.height
      ) {
        error.push(
          `Your image is smaller than ${min_resolution.width}x${
            min_resolution.height
          }`
        );
      }
      return callback(!error.length, error.length ? error : null);
    };
    return null;
  }

  detectMediaType(file) {
    let result = false;

    if (file && file.type) {
      if (file.type.indexOf('image') > -1) {
        result = 'image';
      } else if (file.type.indexOf('video') > -1) {
        result = 'video';
      }
    }
    return result;
  }

  handleHeaderUpload(files) {
    const file = files[0];
    const mediaType = this.detectMediaType(file);
    const setHeader = (status, error) => {
      if (status) {
        this.setState({ headerFile: file, headerError: null }, () => {
          this.setHeaderThumbnail(file);
        });
      } else {
        this.setState({ headerError: error[0] });
      }
    };

    switch (mediaType) {
      case 'video':
        this.validateVideo(file, setHeader);
        break;
      case 'image':
        this.validateImage(file, setHeader);
        break;
      default:
        break;
    }
  }

  handleCoverUpload(files) {
    const image = files[0];
    this.validateImage(image, (status, error) => {
      if (status) {
        this.setState({ coverFile: image, coverError: null }, () => {
          this.setCoverThumbnail(image);
        });
      } else {
        this.setState({ coverError: error[0] });
      }
    });
  }

  handleCreateClick() {
    const workbook = {
      unit_id: this.props.unit.unit_id,
      header: this.state.headerFile,
      cover: this.state.coverFile,
      title: this.props.unit.title,
      overview: this.props.unit.overview,
      sector_id: this.props.qualification.sector_id,
      workbook_reference: this.state.workbook_reference,
      is_public: 1
    };
    const formData = convertToFormData(workbook);
    this.props.createWorkbookAttempt(
      formData,
      workbook,
      this.props.unit.unit_id,
      this.props.qualification.sector_id
    );
  }

  handleCancelClick(link) {
    // browserHistory.goBack();
    browserHistory.push(`/qualifications/${link}`);
  }

  handleSaveClick() {
    const updatedWorkbook = {
      unit_id: this.props.unit.unit_id,
      header: this.state.headerFile || this.props.workbook.header,
      cover: this.state.coverFile || this.props.workbook.cover,
      workbook_reference: this.state.workbook_reference
    };
    const formData = convertToFormData(updatedWorkbook);
    const { workbook_id } = this.props.params;
    this.props.saveWorkbookAttempt(
      formData,
      updatedWorkbook,
      updatedWorkbook.unit_id,
      workbook_id
    );
  }

  handleDeleteClick() {
    const { deleteWorkbookFromUnit, params } = this.props;
    const workbook_id = path(['workbook_id'], params);
    const unit_id = path(['unit_id'], params);
    deleteWorkbookFromUnit(unit_id, workbook_id);
  }

  render() {
    const { workbook, attemptingDeleteWorkbookFromUnit } = this.props;
    const { headerThumbnail, headerError, tabs, activeTab } = this.state;
    const { goBack } = this;

    const deleteWorkbookClasses = classNames('button', 'is-danger', {
      'is-loading': attemptingDeleteWorkbookFromUnit
    });

    const backButtonPath = this.props.params.qualification_id
      ? `${this.props.params.sector}/${this.props.params.qualification_id}/${
          this.props.params.unit_id
        }`
      : 'quality-assurance';

    if (this.props.unit) {
      const { reference, title } = this.props.unit;
      const navTabs = tabs.map((tab, i) => ({
        key: `wuv-${i}`,
        text: tab
      }));
      return (
        <div>
          <div className="workbooks-unit-view-container">
            {/* Header */}
            <div className="separator">
              <section
                className="content-section hero smaller workbooks-builder-header"
                style={{
                  backgroundImage: headerThumbnail
                    ? `url(${headerThumbnail})`
                    : 'none'
                }}
              >
                <div className="hero-body">
                  <div className="container top">
                    <div className="version">
                      <b>Version:</b> 1.0
                    </div>
                    {workbook && workbook.modified_by && workbook.modified && (
                      <div className="edited-by">
                        <b>Last edited by:</b>{' '}
                        {workbook.modified_by.screen_name} at{' '}
                        {moment(workbook.modified)
                          .tz('Europe/London')
                          .format('HH:mma on Do MMM YYYY')}
                      </div>
                    )}
                  </div>
                  <div className="container is-flex">
                    <div className="left">
                      <a
                        className="back-button"
                        onClick={() => this.handleCancelClick(backButtonPath)}
                      />
                      {/* <Link
                        className="back-button"
                        to={`/workbooks-builder/${backButtonPath}`}
                      /> */}
                      <div className="text">
                        <h1 className="title">{`Unit ${reference}: ${title}`}</h1>
                        {this.props.qualification && (
                          <h2 className="subtitle m-t-5">
                            {this.props.qualification &&
                              this.props.qualification.title}
                          </h2>
                        )}
                      </div>
                    </div>
                    <div className="right">
                      <Dropzone
                        className="cover-video-upload"
                        onDrop={files => this.handleHeaderUpload(files)}
                      >
                        <div className="add-cover-video">
                          <i className="icon" />
                          {headerThumbnail ? (
                            <span>Change Header Media</span>
                          ) : (
                            <span>Add Header Media</span>
                          )}
                          {headerError ? (
                            <span className="field-error">{headerError}</span>
                          ) : null}
                        </div>
                      </Dropzone>
                    </div>
                  </div>
                </div>
              </section>
              {/* Navigation */}
              <section className="content-section navigation-section">
                <div className="container">
                  <UINavigation
                    active={`wuv-${activeTab}`}
                    tabs={navTabs}
                    showSearch={false}
                    change={key => this.changeTabView(+key.substr(4))}
                  />
                </div>
              </section>
              {/* Content */}
              <section className="content-section m-t-30">
                <div className="container">{this.getActiveTab()}</div>
              </section>
            </div>
            <div className="control-footer container">
              <div
                className="button is-primary is-outlined"
                onClick={() => this.handleCancelClick(backButtonPath)}
              >
                Cancel
              </div>
              {path(['workbook_id'], workbook) && (
                <button
                  className={deleteWorkbookClasses}
                  onClick={this.handleDeleteClick}
                  disabled={attemptingDeleteWorkbookFromUnit}
                >
                  Delete workbook
                </button>
              )}
              <div
                className={classNames('button', 'is-primary', {
                  'is-loading':
                    this.props.savingWorkbook || this.props.creatingWorkbook
                })}
                onClick={() => {
                  if (workbook && workbook.workbook_id) {
                    this.handleSaveClick();
                  } else {
                    this.handleCreateClick();
                  }
                }}
              >
                {workbook && workbook.workbook_id
                  ? 'Save Changes'
                  : 'Create Workbook'}
              </div>
            </div>
          </div>
          <Footer />
        </div>
      );
    }
    return <UILoading isLoadingOverlay marginTop="50px" minHeight="100px" />;
  }
}

const mapStateToProps = state => {
  let mappedProps = {};

  // Get unit data from store
  if (state.units && state.units.unit) {
    const unit = state.units.unit[0];
    mappedProps = Object.assign(
      {
        // path([''])(state)
        unit,
        imageConf: {
          max_file_size: path(['config', 'config', 'image', 'max_file_size'])(
            state
          ),
          max_resolution: path(['config', 'config', 'image', 'max'])(state),
          min_resolution: path(['config', 'config', 'image', 'min'])(state),
          formats: path(['config', 'config', 'image', 'formats'])(state)
        },
        videoConf: {
          max_file_size: path(['config', 'config', 'video', 'max_file_size'])(
            state
          ),
          formats: path(['config', 'config', 'video', 'formats'])(state)
        }
      },
      mappedProps
    );
  }

  // Get workbook data from store
  if (state.workbooks.workbook) {
    mappedProps = Object.assign(
      {
        workbook: path(['workbooks', 'workbook'])(state)
      },
      mappedProps
    );
  }

  if (state.qualifications.currentQualification) {
    mappedProps = Object.assign(
      {
        qualification: path([
          'qualifications',
          'currentQualification',
          'qualification'
        ])(state),
        units: path(['qualifications', 'currentQualification', 'units'])(state)
      },
      mappedProps
    );
  }

  if (state.qualifications.workbook) {
    mappedProps = Object.assign(
      {
        newWorkbookId: path(['qualifications', 'workbook', 'workbook_id'])(
          state
        )
      },
      mappedProps
    );
  }

  if (state.workbooks) {
    mappedProps = Object.assign(
      {
        savingWorkbook: path(['workbooks', 'savingWorkbook'])(state),
        creatingWorkbook: path(['qualifications', 'creatingWorkbook'])(state)
      },
      mappedProps
    );
  }

  mappedProps = Object.assign(
    {
      user: path(['profile', 'user'])(state),
      sectorsList: path(['profile', 'user', 'sectors'])(state),
      lastCreatedWorkbookId: path(['qualifications', 'lastCreatedWorkbookId'])(
        state
      )
    },
    mappedProps
  );

  mappedProps = Object.assign(
    {
      attemptingDeleteWorkbookFromUnit: path(
        ['qualificationUnits', 'attemptingDeleteWorkbookFromUnit'],
        state
      )
    },
    mappedProps
  );

  return mappedProps;
};

const mapDispatchToProps = dispatch => ({
  getUnitAttempt: id => dispatch(UnitsActions.getUnitAttempt(id)),
  createWorkbookAttempt: (formData, workbook, unit_id, sector_id) =>
    dispatch(
      QualificationActions.createWorkbookAttempt(
        formData,
        workbook,
        unit_id,
        sector_id
      )
    ),
  saveWorkbookAttempt: (formData, content, unit_id, workbook_id) =>
    dispatch(
      WorkBooksCreators.saveWorkbookAttempt(
        formData,
        content,
        unit_id,
        workbook_id
      )
    ),
  deleteWorkbookFromUnit: (unit_id, workbook_id) =>
    dispatch(
      QualificationActions.deleteWorkbookFromUnitAttempt(unit_id, workbook_id)
    ),
  getWorkbook: (unit_id, workbook_id) =>
    dispatch(QualificationActions.getWorkbookAttempt(unit_id, workbook_id)),

  getQualificationAttempt: qualification_id =>
    dispatch(QualificationActions.getQualificationAttempt(qualification_id)),

  clearWorkbookState: () => dispatch(WorkBooksCreators.resetWorkbookState()),
  clearWorkbookCurrentModerator: (unit_id, workbook_id) =>
    dispatch(
      WorkBooksCreators.clearWorkbookCurrentModeratorAttempt(
        unit_id,
        workbook_id
      )
    ),
  setActiveSector: sector => dispatch(UserCreators.setActiveSector(sector))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkbooksUnitViewRoute);
