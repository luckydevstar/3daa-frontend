import React from 'react';
import { connect } from 'react-redux';
import { initialize } from 'redux-form';
import { browserHistory } from 'react-router';
import { Link } from 'react-router';

import { equals, path } from 'ramda';
import Slugify from 'slugify';

import { Roles } from 'app/core/config/constants';
import common from 'app/common';
import units from 'app/units';

import { Creators as UserCreators } from 'app/user/actions';
import { Creators as QualificationActions } from 'app/qualifications/actions';

import QualificationModalUserConfirm from '../components/modals/qualification-modal-user-confirm';
import QualificationPanel from '../components/qualification-panel';

const { SuperAdmin } = Roles;
const {
  components: { ContentModal, UINavigation, Footer, UILoading },
  util: {
    helpers: { UserAccess }
  }
} = common;

class QualificationsRoute extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      subpage: 0,
      availableLevels: ['All Levels'],
      filteredResults: [],
      selectedQualification: null,
      searchQuery: ''
    };
    this.getLinkSlug = this.getLinkSlug.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onLockQualification = this.onLockQualification.bind(this);
  }

  UNSAFE_componentWillMount() {
    this.props.clearCurrentQualification();
    this.props.getAllQualificationsAttempt();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    let qualifications = nextProps.centreQualifications;
    const { selectedQualification } = this.state;

    if (
      !nextProps.attemptingPostQualification &&
      !nextProps.errorCode &&
      selectedQualification
    ) {
      browserHistory.push(this.getLinkSlug(this.state.selectedQualification));
      return;
    }

    let filterResults = [];

    if (qualifications && qualifications.length > 0) {
      filterResults = this.filterResults(
        qualifications,
        this.state.searchQuery
      );
    }

    this.setState({ filteredResults: filterResults });

    this.setAvailableLevels(filterResults);

    // if (!equals(nextProps.editedQualification, this.props.editedQualification)) {
    //   this.props.getQualificationSector({ sector: 'business-administration' });
    //   // this.props.getSector(this.props.params.sector);
    // }

    // if (
    //   nextProps.currentSector &&
    //   !this.props.currentSector &&
    //   Slugify(nextProps.currentSector.title.toLowerCase()) ===
    //     this.props.params.sector
    // ) {
    //   if (!this.isSectorDataUniform(nextProps.currentSector)) {
    //     this.props.setActiveSector(nextProps.currentSector);
    //   }
    // }

    // if (nextProps.params.sector !== this.props.params.sector) {
    //   this.props.getSector(nextProps.params.sector);
    // }
  }

  isSectorDataUniform(currentSector) {
    return false;
    // return this.props.persistedSector.sector_id === currentSector.sector_id;
  }

  getLinkSlug(qualification) {
    let paths = browserHistory.getCurrentLocation().pathname.split('/');
    let newPath = '';
    paths.forEach(p => {
      if (p) {
        newPath += '/' + p;
      }
    });
    if (qualification && qualification.qualification_id)
      return `${newPath}/${qualification.qualification_id}`;
    else return `${newPath}/add`;
  }

  getTabs() {
    return this.state.availableLevels.map((label, i) => ({
      key: `wb-nav-${i}`,
      text: label
    }));
  }

  setActiveTab(key) {
    this.setState({ subpage: +key.substr(7) });
  }

  setAvailableLevels(quals) {
    let levels = [];
    let tempLevels;

    quals.forEach(qualification => {
      if (levels.indexOf(qualification.level) === -1) {
        levels.push(qualification.level);
      }
    });

    if (levels.length > 1) {
      levels.sort();
      levels = levels.map(level => `Level ${level - 1}`);

      tempLevels = ['All Levels', ...levels];

      this.setState({ availableLevels: tempLevels });
    }
  }

  getQualificationListContent() {
    const {
      centreQualifications,
      memberQualifications,
      attemptingGetAllQualifications,
      attemptingPostQualification,
      errorCode
    } = this.props;

    const { availableLevels, subpage, filteredResults } = this.state;
    const qualifications = centreQualifications;
    let temp = filteredResults;

    if (subpage !== 0)
      temp = temp.filter(
        q => availableLevels[subpage].indexOf(q.level - 1) > -1
      );

    if (temp && temp.length > 0 && !errorCode) {
      return temp.map((qualification, index) => (
        <div className="column is-6-desktop is-12-tablet" key={index}>
          <QualificationPanel
            key={`q-panel-${qualification.qualification_id}`}
            item={qualification}
            onEdit={() => this.onEditQualification(qualification)}
            onLock={() => this.onLockQualification(qualification)}
          />
        </div>
      ));
    } else if (
      qualifications &&
      filteredResults.length > 0 &&
      temp.length <= 0 &&
      !(attemptingGetAllQualifications || attemptingPostQualification)
    ) {
      return (
        <div className="no-qualification column has-text-centered">
          No qualifications in this level.
        </div>
      );
    } else if (
      qualifications &&
      temp.length <= 0 &&
      !(attemptingGetAllQualifications || attemptingPostQualification)
    ) {
      return (
        <div className="no-qualification column has-text-centered">
          No qualifications match your query.
        </div>
      );
    } else if (
      !qualifications ||
      (!qualifications.length &&
        !(attemptingGetAllQualifications || attemptingPostQualification))
    ) {
      return (
        <div className="no-qualification column has-text-centered">
          No qualifications available for this sector.
        </div>
      );
    }
    return null;
  }

  filterResults(qualifications, phrase) {
    phrase = phrase.trim().toLowerCase();
    let result = qualifications.filter(qualification => {
      if (
        qualification.qualification_category_id !=
        this.props.currentQualificationCategoryId
      )
        return false;
      if (!phrase || phrase === '') return true;
      if (qualification.title.toLowerCase().indexOf(phrase) < 0) return false;
      return true;
    });
    return result;
  }

  handleSearchChange(value) {
    let qualifications = this.props.centreQualifications;
    this.setState({
      searchQuery: value,
      filteredResults: this.filterResults(qualifications, value)
    });
  }

  openModal() {
    this.qualificationModalUserConfirm.open();
  }

  closeModal() {
    this.qualificationModalUserConfirm.close();
    this.setState({ selectedQualification: null });
  }

  handleSubmit(e) {
    const {
      currentQualification,
      clearCurrentQualification,
      updateQualificationAttempt
    } = this.props;
    const { selectedQualification } = this.state;
    this.qualificationModalUserConfirm.close();

    if (selectedQualification) {
      updateQualificationAttempt(
        { status: 0 },
        selectedQualification.qualification_id
      );
    } else {
      clearCurrentQualification();
      let paths = browserHistory.getCurrentLocation().pathname.split('/');
      let newPath = '';
      paths.forEach(p => {
        if (p) {
          newPath += '/' + p;
        }
      });
      browserHistory.push(`${newPath}/add`);
    }
  }

  onAddQualification() {
    this.setState({ selectedQualification: null });
    setTimeout(() => {
      this.handleSubmit(null);
    });
    // setTimeout(() => {
    //   this.openModal();
    // });
  }

  onEditQualification(qualification) {
    // if (qualification.status) {
    //   this.setState({ selectedQualification: qualification });
    //   setTimeout(() => {
    //     this.handleSubmit(null);
    //   });
    //   // setTimeout(() => {
    //   //   this.openModal();
    //   // });
    // } else {
    //   browserHistory.push(this.getLinkSlug(qualification));
    // }
    browserHistory.push(this.getLinkSlug(qualification));
  }

  onLockQualification(qualification) {
    const { updateQualificationAttempt } = this.props;
    updateQualificationAttempt(
      { status: qualification.status ? 0 : 1 },
      qualification.qualification_id
    );
  }

  render() {
    const { subpage, selectedQualification } = this.state;
    const {
      attemptingGetAllQualifications,
      attemptingPostQualification,
      persistedSector,
      currentQualificationCategoryId,
      searchQuery
    } = this.props;
    const content = this.getQualificationListContent();
    const tabs = this.getTabs();

    return (
      <div>
        <div className="workbook-sector-container qualifications min-content-height">
          {/* Header */}
          <section className="content-section hero smaller gray">
            <div className="hero-body">
              <div className="container">
                <div className="media">
                  <div className="media-left">
                    <Link
                      to="/qualifications/sector-selection"
                      className="back-button"
                    />
                  </div>
                  <div className="media-content">
                    <h1 className="title">
                      {persistedSector && persistedSector.title}
                    </h1>
                    <h2 className="subtitle">Qualification Management</h2>
                  </div>

                  {(attemptingGetAllQualifications ||
                    attemptingPostQualification) && (
                    <UILoading isLoadingOverlay />
                  )}

                  <UserAccess allowRoles={[SuperAdmin]}>
                    <div className="hero-nav">
                      <div
                        onClick={() => this.onAddQualification()}
                        className="button is-primary is-outlined"
                      >
                        +{' '}
                        {currentQualificationCategoryId == 1
                          ? 'New Unregulated Product'
                          : currentQualificationCategoryId == 2
                          ? 'New Regulated Qualification'
                          : 'New Standard'}
                      </div>
                    </div>
                  </UserAccess>
                </div>
              </div>
            </div>
          </section>

          {/* Navigation */}
          <section className="content-section navigation-section">
            <div className="container">
              <UINavigation
                tabs={tabs}
                active={`wb-nav-${subpage}`}
                change={e => {
                  this.setActiveTab(e);
                }}
                onSearch={v => this.handleSearchChange(v)}
                searchPlaceholder="Search all qualifications"
              />
            </div>
          </section>
          {/* Content */}
          <section className="content-section">
            <div className="container">
              <div className="courses columns is-multiline">{content}</div>
            </div>
          </section>
        </div>
        <ContentModal
          ref={e => {
            this.qualificationModalUserConfirm = e;
          }}
        >
          <QualificationModalUserConfirm
            editMode={selectedQualification ? 3 : 1}
            qualificationTitle={
              selectedQualification ? selectedQualification.title : ''
            }
            closeModal={() => this.closeModal()}
            handleSubmit={e => this.handleSubmit(e)}
          />
        </ContentModal>
        <Footer />
      </div>
    );
  }
}

/**
 * Redux mappings
 */
const mapStateToProps = state => ({
  persistedSector: state.persisted.sector,
  centreQualifications: state.qualifications.centreQualifications,
  memberQualifications: state.qualifications.memberQualifications,
  currentQualificationCategoryId:
    state.qualifications.currentQualificationCategoryId,
  currentQualification: state.qualifications.currentQualification,
  attemptingGetAllQualifications: path([
    'qualifications',
    'attemptingGetAllQualifications'
  ])(state),
  attemptingPostQualification: path([
    'qualifications',
    'attemptingPostQualification'
  ])(state),
  errorCode: state.qualifications.errorCode
});

const mapDispatchToProps = dispatch => ({
  getAllQualificationsAttempt: () =>
    dispatch(QualificationActions.getAllQualificationsAttempt()),

  updateQualificationAttempt: (payload, qualification_id) =>
    dispatch(
      QualificationActions.updateQualificationAttempt(payload, qualification_id)
    ),

  clearCurrentQualification: () =>
    dispatch(QualificationActions.clearCurrentQualification()),

  initializeForm: data => dispatch(initialize(FORM_NAME, data))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QualificationsRoute);
