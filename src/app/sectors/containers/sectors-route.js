import React from 'react';
import { contains } from 'ramda';
import { connect } from 'react-redux';
import { uniq, without, map, addIndex, equals, path, clone } from 'ramda';
import { browserHistory } from 'react-router';
import Slugify from 'slugify';
import cx from 'classnames';
import common from 'app/common';
import { Creators as UserCreators } from 'app/user/actions';
import { Creators as Actions } from 'app/sectors/actions';
import UserRole from 'app/user/enums/user-role';

const { ContentModalConfirm } = common.components;
import ModalAddSector from '../components/modals/modal-add-sector';

const { Footer, UILoading, ContentModal, UINavigation } = common.components;
const createCloudinaryUrl = common.util.helpers.createCloudinaryUrl;

class SectorsRoute extends React.Component {
  constructor() {
    super();
    this.state = {
      selectedSector: null,
      attemptingDeleteSectorState: false
    };
    this.elementSectors = this.elementSectors.bind(this);
    this.getLinkStyles = this.getLinkStyles.bind(this);
    (this.openModalDeleteConfirm = this.openModalDeleteConfirm.bind(this)),
      (this.onDelete = this.onDelete.bind(this));
  }

  componentDidMount() {
    const { getSectorsAttempt } = this.props;
    getSectorsAttempt();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { attemptingDeleteSector } = nextProps;
    const { attemptingDeleteSectorState } = this.state;
    if (!attemptingDeleteSector && attemptingDeleteSectorState) {
      this.setState({
        attemptingDeleteSectorState: attemptingDeleteSector,
        selectedSector: null
      });
    }
  }

  openModalEdit(sector) {
    this.setState({ selectedSector: sector });
    setTimeout(() => {
      this.modalAddSector.open();
    });
  }

  openModalDeleteConfirm(sector) {
    this.setState({ selectedSector: sector });
    setTimeout(() => {
      this.confirmModal.open();
    });
  }

  getLinkStyles(sector) {
    return {
      backgroundImage: `url(${createCloudinaryUrl(sector.image, 'image', {
        crop: 'fill'
      })})`
    };
  }

  elementSectors() {
    const { errorCode, attemptingGetSectors, sectors } = this.props;
    const { getLinkStyles } = this;

    if (!sectors) {
      return null;
    }

    if (sectors.length && !errorCode) {
      return sectors.map((sector, key) => (
        <div key={key} className="grid-item p-5" style={getLinkStyles(sector)}>
          <div className={sector.sector_id === 6 ? 'customtitle' : 'title'}>
            {sector.title}
          </div>
          <div className="customtitle">
            <div className="is-flex">
              <button
                className="button is-outlined is-primary m-r-15"
                onClick={e => this.openModalEdit(sector)}
              >
                Edit
              </button>

              <button
                className="button is-outlined is-danger"
                onClick={e => this.openModalDeleteConfirm(sector)}
              >
                Delete
              </button>
            </div>
          </div>
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

  closeModalAddSector() {
    this.modalAddSector.close();
  }

  onDelete() {
    const { deleteSectorAttempt } = this.props;
    const { selectedSector } = this.state;
    if (selectedSector) {
      deleteSectorAttempt(selectedSector.sector_id);
      this.setState({ attemptingDeleteSectorState: true });
    }
  }

  render() {
    const { user, attemptingGetSectors } = this.props;
    const { selectedSector } = this.state;
    const { elementSectors } = this;

    const isAdmin =
      contains(UserRole.SUPER_ADMIN_ROLE, user.roles) ||
      contains(UserRole.SITE_ADMIN_ROLE, user.roles);

    return (
      <div>
        <div className="workbook-selector-selection-container min-content-height">
          <ContentModal
            ref={e => {
              this.modalAddSector = e;
            }}
          >
            <ModalAddSector
              sector={selectedSector}
              closeModal={() => this.closeModalAddSector()}
            />
          </ContentModal>
          <section className="content-section hero smaller gray">
            <div className="hero-body">
              <div className="container">
                <h1 className="title">Sector Selection</h1>
                <h2 className="subtitle">
                  Select the sector you want to edit.
                </h2>
                <div className="hero-nav">
                  <div
                    onClick={() => this.openModalEdit()}
                    className="button is-primary is-outlined"
                  >
                    +{' Add Sector'}
                  </div>
                </div>
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
                searchPlaceholder="Search all sectors"
              />
            </div>
          </section>

          <div className="grid container">
            {attemptingGetSectors && <UILoading marginTop="100px" />}
            {elementSectors()}
          </div>
        </div>
        <Footer />

        <ContentModalConfirm
          callback={this.onDelete}
          ref={e => {
            this.confirmModal = e;
          }}
        >
          <h3>Are you sure you want to delete the sector?</h3>
        </ContentModalConfirm>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.profile.user,
  sectors: path(['sectors', 'sectors', 'sectors'])(state),
  attemptingGetSectors: path(['sectors', 'attemptingGetSectors'])(state),
  attemptingDeleteSector: path(['sectors', 'attemptingDeleteSector'])(state),
  errorCode: state.sectors.errorCode
});

const mapDispatchToProps = dispatch => ({
  getSectorsAttempt: () => dispatch(Actions.getSectorsAttempt()),
  setActiveSector: sector => dispatch(UserCreators.setActiveSector(sector)),
  deleteSectorAttempt: sector_id =>
    dispatch(Actions.deleteSectorAttempt(sector_id))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SectorsRoute);
