import React from 'react';
import { contains } from 'ramda';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import Slugify from 'slugify';
import { equals, path } from 'ramda';
import common from 'app/common';
import { Creators as UserCreators } from 'app/user/actions';
import { Creators as QualificationActions } from 'app/qualifications/actions';
import { Creators as SectorsActions } from 'app/sectors/actions';
import UserRole from '../../user/enums/user-role';

import QualificationModalEdit from '../components/modals/qualification-modal-edit';

const { Footer, UILoading, ContentModalNew, UINavigation } = common.components;
const createCloudinaryUrl = common.util.helpers.createCloudinaryUrl;

class QualificationsSectorSelectionRoute extends React.Component {
  constructor() {
    super();
    this.state = {
      selectedSector: null
    };
    this.elementSectors = this.elementSectors.bind(this);
    this.getLinkStyles = this.getLinkStyles.bind(this);
    this.openQualificationModalEdit = this.openQualificationModalEdit.bind(
      this
    );
    this.closeQualificationModalEdit = this.closeQualificationModalEdit.bind(
      this
    );
  }

  componentDidMount() {
    const { getSectorsAttempt } = this.props;
    getSectorsAttempt();
  }

  getLinkStyles(sector) {
    return {
      backgroundImage: `url(${createCloudinaryUrl(sector.image, 'image', {
        crop: 'fill'
      })})`
    };
  }

  getLinkSlug(sector) {
    return `/qualifications/${Slugify(sector.title.toLowerCase())}`;
  }

  elementSectors() {
    const { errorCode, attemptingGetSectors, sectors } = this.props;
    const { getLinkStyles } = this;

    if (!sectors) {
      return null;
    }

    if (sectors.length && !errorCode) {
      return sectors.map((sector, key) => (
        <div
          key={key}
          className="grid-item p-5"
          style={getLinkStyles(sector)}
          onClick={() => this.openQualificationModalEdit(sector)}
        >
          <div className={sector.sector_id === 6 ? 'customtitle' : 'title'}>
            {sector.title}
          </div>
          <div
            className={sector.sector_id === 6 ? 'customsubtitle' : 'subtitle'}
          >{`${sector.number_of_all_qualifications} qualifications`}</div>
        </div>
      ));
    } else if (!attemptingGetSectors && !sectors.length) {
      return <div className="not-found-message">No sectors found.</div>;
    }
    return null;
  }

  onSearch(e) {
    return null;
  }

  openQualificationModalEdit(e) {
    this.setState({ selectedSector: e });
    this.qualificationModalEdit.open();
  }

  closeQualificationModalEdit(e) {
    this.qualificationModalEdit.close();
    if (!e) return;
    this.props.setCurrentQualificationCategory(e);
    this.props.setActiveSector(this.state.selectedSector);
    browserHistory.push(this.getLinkSlug(this.state.selectedSector));
  }

  render() {
    const { elementSectors } = this;
    const { user, attemptingGetSectors } = this.props;
    const isAdmin =
      contains(UserRole.SUPER_ADMIN_ROLE, user.roles) ||
      contains(UserRole.SITE_ADMIN_ROLE, user.roles);

    return (
      <div>
        <div className="workbook-selector-selection-container min-content-height">
          <section className="content-section hero smaller gray">
            <div className="hero-body">
              <div className="container">
                <h1 className="title">Sector Selection</h1>
                <h2 className="subtitle">
                  Select the sector you want to view the qualification.
                </h2>
              </div>
            </div>
          </section>
          {/* Navigation */}
          <section className="content-section navigation-section">
            <div className="container">
              <UINavigation
                // active={activeSection}
                tabs={[]}
                onSearch={value => this.onSearch}
                searchPlaceholder="Search all qualifications"
              />
            </div>
          </section>
          {/* Qualification Edit modal */}
          <ContentModalNew
            ref={e => {
              this.qualificationModalEdit = e;
            }}
          >
            <QualificationModalEdit
              closeModal={e => this.closeQualificationModalEdit(e)}
            />
          </ContentModalNew>

          <div className="grid container">
            {attemptingGetSectors && <UILoading marginTop="100px" />}
            {elementSectors()}
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.profile.user,
  sectors: path(['sectors', 'sectors', 'sectors'])(state),
  attemptingGetSectors: path(['sectors', 'attemptingGetSectors'])(state),
  errorCode: path(['sectors', 'errorCode'])(state)
});

const mapDispatchToProps = dispatch => ({
  getSectorsAttempt: () => dispatch(SectorsActions.getSectorsAttempt()),
  setCurrentQualificationCategory: categoryId =>
    dispatch(QualificationActions.setCurrentQualificationCategory(categoryId)),
  setActiveSector: sector => dispatch(UserCreators.setActiveSector(sector))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QualificationsSectorSelectionRoute);
