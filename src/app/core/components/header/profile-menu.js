import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { equals } from 'ramda';
import { Link } from 'react-router';
import { push } from 'react-router-redux';
import Slugify from 'slugify';
import { connect } from 'react-redux';
import * as lodash from 'lodash';

import { Creators as CoreCreators } from 'app/core/actions';
import { Creators as Actions } from 'app/user/actions';
import { Creators as VideoActions } from 'app/video/actions';
import Dropdown, {
  DropdownTrigger,
  DropdownContent
} from 'react-simple-dropdown';
import { Roles } from 'app/core/config/constants';
import common from 'app/common';
import Collapsible from 'react-collapsible';
import { Text } from 'app/intl';

const {
  util: {
    helpers: {
      createCloudinaryUrl,
      extractUserRole,
      extractUserCentre,
      humanReadableRole,
      UserAccess,
      validRolesWithout
    }
  },
  components: { ProfileAvatar }
} = common;

const {
  CentreAdmin,
  CentreTutor,
  CentreLearner,
  CentreEditor,
  SuperAdmin,
  SiteAdmin,
  Eqa
} = Roles;

class ProfileMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sector: null,
      newSector: null
    };

    this.elementUserBadge = this.elementUserBadge.bind(this);
    this.updateSector = this.updateSector.bind(this);
    this.toggleSectors = this.toggleSectors.bind(this);
    this.goBackToPrevTokenAttempt = this.goBackToPrevTokenAttempt.bind(this);
  }

  UNSAFE_componentWillMount() {
    const { sector } = this.props;
    const { updateSector } = this;
    updateSector(sector);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { menuOpen, sectorsExpanded, sector } = this.props;
    const { updateSector } = this;
    // A sector hasn't been set before -
    // circumvent the animation
    if (!this.state.sector) {
      updateSector(nextProps.sector);
    }

    // New sector from store
    if (this.state.sector && !equals(sector, nextProps.sector)) {
      // Collapse sectors if expanded
      if (sectorsExpanded) {
        this.toggleSectors();
      }

      // Record the new sector in the state
      this.setState(
        {
          newSector: nextProps.sector
        },
        () => {
          // After the animation has finished set the current sector
          // as the new sector (this reverts the animation)
          setTimeout(() => {
            this.setState({
              newSector: null,
              sector: nextProps.sector
            });
          }, 450);
        }
      );
    }

    // Collapse sectors if expanded
    if (!equals(menuOpen, nextProps.menuOpen)) {
      const dropdownIsActive = this.dropdownMenu.isActive();
      if (dropdownIsActive && nextProps.sectorsExpanded) {
        this.toggleSectors();
      }
    }
  }

  onSectorClick(sector) {
    this.props.setActiveSector(sector);

    if (sector && sector.sector_id) {
      this.props.selectVideoSector(sector.sector_id);
    }
    // Redirect if inside workbooks-builder
    const slugifiedSector = Slugify(sector.title.toLowerCase());
    const { pathname } = window.location;

    if (
      pathname.includes('workbooks-builder') &&
      !pathname.includes(slugifiedSector)
    ) {
      this.props.redirect(`/workbooks-builder/${slugifiedSector}`);
    }
  }

  // Quick helper function to update the sector
  updateSector(sector) {
    this.setState({
      sector
    });
  }

  // User badge
  elementUserBadge() {
    const { user } = this.props;
    const userRole = extractUserRole(user);
    const userCentre = extractUserCentre(user);
    const readableRole = humanReadableRole(userRole);

    if (userRole === CentreTutor || userRole === CentreAdmin) {
      return (
        <div className="user-description media-content">
          <div className="user-name">{userCentre.centre_name}</div>
          <div className="user-role">{`${
            user.screen_name
          } (${readableRole})`}</div>
        </div>
      );
    }

    if (userRole === CentreLearner) {
      return (
        <div className="user-description media-content">
          <div className="user-name">{user.screen_name}</div>
          <div className="user-role">{`${userCentre.centre_name}`}</div>
        </div>
      );
    }

    if (userRole === SiteAdmin) {
      return (
        <div className="user-description media-content">
          <div className="user-name">{user.screen_name}</div>
          <div className="user-role">{`${readableRole}`}</div>
        </div>
      );
    }

    if (userRole === SuperAdmin) {
      return (
        <div className="user-description media-content">
          <div className="user-name">{user.screen_name}</div>
          <div className="user-role">{`${readableRole}`}</div>
          <div className="user-subtitle">
            With great power comes great responsibility.
          </div>
        </div>
      );
    }

    return (
      <div className="user-description media-content">
        <div className="user-name">{user.screen_name}</div>
      </div>
    );
  }

  isProfileImage() {
    const { cloudinary_file_id } = this.props.user;
    return Boolean(cloudinary_file_id);
  }

  toggleSectors() {
    this.props.toggleProfileMenuSectors();
  }

  goBackToPrevTokenAttempt() {
    const { goBackToPrevToken, prevToken } = this.props;

    goBackToPrevToken(prevToken);
  }

  render() {
    const { newSector, sector } = this.state;
    const {
      toggleProfileMenu,
      sectorsExpanded,
      user,
      onLogout,
      loggedAsMember
    } = this.props;
    const { elementUserBadge } = this;
    const userRole = extractUserRole(user);

    return (
      <Dropdown
        className="user-menu navbar-item"
        ref={c => {
          this.dropdownMenu = c;
        }}
        active={this.props.menuOpen}
        onShow={toggleProfileMenu}
        onHide={toggleProfileMenu}
      >
        <DropdownTrigger>
          <div className="media">
            <div className="user-avatar media-left">
              <ProfileAvatar
                avatarSize={44}
                title={user.screen_name}
                fileId={user.photo}
                gender={user.gender}
              />
            </div>
            {elementUserBadge()}
          </div>
        </DropdownTrigger>

        {/* Dropdown */}

        <DropdownContent>
          {/* User panel */}

          <div className="user-panel larger media">
            <ProfileAvatar
              avatarSize={64}
              title={user.screen_name}
              fileId={user.photo}
              gender={user.gender}
            />
            <div className="user-description">
              <Link
                to={'/profile'}
                onClick={this.closeMenu}
                className="user-name fs-18"
              >
                {user.screen_name}
              </Link>
              <div className="user-email">{user.email}</div>
            </div>
          </div>

          <UserAccess
            allowRoles={[CentreAdmin, CentreTutor, SuperAdmin, SiteAdmin]}
          >
            <div className="sector-selection-menu-container">
              <div
                className={`current-sector-container${
                  newSector ? ' show-new-sector' : ''
                }`}
              >
                <div className="slider">
                  <div className="half">
                    {newSector && (
                      <div
                        className="new-sector sector-option"
                        style={{
                          backgroundImage: `url(${createCloudinaryUrl(
                            newSector.image,
                            'image'
                          )})`
                        }}
                      >
                        <div className="overlay">{newSector.title}</div>
                      </div>
                    )}
                  </div>
                  <div className="half">
                    {sector && (
                      <div
                        className="selected sector-option"
                        style={{
                          backgroundImage: `url(${createCloudinaryUrl(
                            sector.image,
                            'image'
                          )})`
                        }}
                      >
                        <div className="overlay">{sector.title}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <Collapsible
                transitionTime={450}
                easing="ease-out"
                ref={e => {
                  this.sectorMenu = e;
                }}
                open={sectorsExpanded}
                handleTriggerClick={this.toggleSectors}
                trigger={
                  <div className="more-sectors-link">
                    <Text iKey="your_other_sectors" />
                  </div>
                }
              >
                {lodash.get(user, 'sectors', []).map((option, i) => (
                  <div
                    className="sector-option"
                    key={i}
                    onClick={() => this.onSectorClick(option)}
                    style={{
                      backgroundImage: `url(${createCloudinaryUrl(
                        option.image,
                        'image'
                      )})`
                    }}
                  >
                    <div className="overlay">{option.title}</div>
                  </div>
                ))}
              </Collapsible>
            </div>
          </UserAccess>

          {/* Inner nav */}

          <div className="inner">
            <nav>
              <UserAccess allowRoles={validRolesWithout(Eqa, CentreEditor)}>
                <Link
                  to={'/dashboard'}
                  onClick={this.closeMenu}
                  className="my-progress"
                >
                  <Text iKey="dashboard" />
                </Link>
              </UserAccess>
              <UserAccess allowRoles={[CentreAdmin]}>
                <Link
                  to={'/workbooks/qualification-manager'}
                  onClick={this.closeMenu}
                  className="workbooks"
                >
                  <Text iKey="workbooks" />
                </Link>
              </UserAccess>
              <UserAccess
                allowRoles={[SuperAdmin, SiteAdmin, CentreLearner, CentreTutor]}
              >
                <Link
                  to={'/bookstand'}
                  onClick={this.closeMenu}
                  className="workbooks"
                >
                  <Text iKey="workbooks" />
                </Link>
              </UserAccess>
              <Link
                to={'/profile'}
                onClick={this.closeMenu}
                className="my-profile"
              >
                <Text iKey="my_profile" />
              </Link>
              {/* <Link to={'/dashboard'} className="my-badges">My Badges</Link>
              <Link to={'/dashboard'} className="my-career-path">My Career path</Link> */}
            </nav>
            {/* <nav>
              <a href="" className="create-brand-account">Create brand account</a>
            </nav> */}
            <nav className="last">
              <Link
                to={'/user/settings'}
                onClick={this.closeMenu}
                className="account-settings"
              >
                <Text iKey="account_settings" />
              </Link>
              {userRole === CentreAdmin && (
                <Link
                  to={'/organisation/settings'}
                  onClick={this.closeMenu}
                  className="account-settings"
                >
                  <Text iKey="organisation_settings" />
                </Link>
              )}
            </nav>
            {!loggedAsMember ? (
              <button
                type="button"
                className="button is-primary"
                onClick={onLogout}
              >
                <Text iKey="sign_out" />
              </button>
            ) : (
              <button
                type="button"
                className="button is-primary"
                onClick={() => this.goBackToPrevTokenAttempt()}
              >
                <Text iKey="Go back to Admin" />
              </button>
            )}
          </div>
        </DropdownContent>
      </Dropdown>
    );
  }
}

ProfileMenu.propTypes = {
  user: PropTypes.object.isRequired
};

/**
 * Redux mappings
 */
const mapStateToProps = ({
  ui: { profileMenuOpen, profileMenuSectorsExpanded },
  profile: { user },
  persisted: { sector, loggedAsMember, prevToken },
  notifications
}) => ({
  menuOpen: profileMenuOpen,
  sectorsExpanded: profileMenuSectorsExpanded,
  user,
  sector,
  notifications,
  loggedAsMember,
  prevToken
});

const mapDispatchToProps = dispatch => ({
  toggleProfileMenu: () => {
    dispatch(CoreCreators.toggleProfileMenu());
  },
  toggleProfileMenuSectors: () => {
    dispatch(CoreCreators.toggleProfileMenuSectors());
  },
  onLogout: () => {
    dispatch(Actions.logout());
  },
  setActiveSector: sector => {
    dispatch(Actions.setActiveSector(sector));
  },
  redirect: pathname => {
    dispatch(push(pathname));
  },
  selectVideoSector: sectorId => dispatch(VideoActions.selectSector(sectorId)),
  goBackToPrevToken: prevToken => {
    dispatch(Actions.goBackToPrevToken(prevToken));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileMenu);
