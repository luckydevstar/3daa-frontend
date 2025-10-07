import React from 'react';
import { contains } from 'ramda';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import Slugify from 'slugify';
import { equals, path } from 'ramda';
import common from 'app/common';
import { Creators as UserCreators } from 'app/user/actions';
import { Creators as NewsActions } from 'app/news/actions';
import { Creators as SectorsActions } from 'app/sectors/actions';
import UserRole from '../../user/enums/user-role';

const { Footer, UILoading, ContentModalNew, UINavigation } = common.components;
const createCloudinaryUrl = common.util.helpers.createCloudinaryUrl;

class NewsSectorSelectionContainer extends React.Component {
  constructor() {
    super();
    this.state = {
      selectedSector: null
    };
    this.elementSectors = this.elementSectors.bind(this);
    this.getLinkStyles = this.getLinkStyles.bind(this);
    this.openModalEdit = this.openModalEdit.bind(this);
    this.closeModalEdit = this.closeModalEdit.bind(this);
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
    // return `${location.pathname}/${Slugify(sector.title.toLowerCase())}`;
    return `/news/provider/${Slugify(sector.title.toLowerCase())}`;
  }

  elementSectors() {
    const { errorCode, loading, sectors } = this.props;
    const { getLinkStyles } = this;

    if (!sectors) {
      return null;
    }

    if (sectors.length && !errorCode) {
      return sectors.map((sector, key) => (
        <div
          key={key}
          className="grid-item m-5"
          style={getLinkStyles(sector)}
          onClick={() => this.openModalEdit(sector)}
        >
          <div className={sector.sector_id === 6 ? 'customtitle' : 'title'}>
            {sector.title}
          </div>
          <div
            className={sector.sector_id === 6 ? 'customsubtitle' : 'subtitle'}
          >{`${sector.number_of_qualifications} news providers`}</div>
        </div>
      ));
    } else if (!loading && !sectors.length) {
      return <div className="not-found-message">No sectors found.</div>;
    }
    return null;
  }

  onSearch(e) {
    return null;
  }

  openModalEdit(e) {
    // this.setState({ selectedSector: e });
    // this.modalEdit.open();
    this.props.setActiveSector(e);
    browserHistory.push(this.getLinkSlug(e));
  }

  closeModalEdit(e) {
    this.modalEdit.close();
    if (!e) return;
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
                  Select the sector you want to view.
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
                searchPlaceholder="Search"
              />
            </div>
          </section>
          {/* Edit modal */}

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
  errorCode: state.news.errorCode
});

const mapDispatchToProps = dispatch => ({
  getSectorsAttempt: () => dispatch(SectorsAction.getSectorsAttempt()),
  setActiveSector: sector => dispatch(UserCreators.setActiveSector(sector))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewsSectorSelectionContainer);

// <ContentModalNew
//   ref={e => {
//     this.qualificationModalEdit = e;
//   }}
// >
//   <QualificationModalEdit
//     closeModal={e => this.closeModalEdit(e)}
//   />
// </ContentModalNew>
