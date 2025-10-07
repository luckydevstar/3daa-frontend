import React from 'react';
import { connect } from 'react-redux';
import { IndexLink, Link, browserHistory } from 'react-router';
import { routerActions } from 'react-router-redux';
import Toggle from 'react-toggle';
import { Helmet } from 'react-helmet';
import { contains, path } from 'ramda';
import Isvg from 'react-inlinesvg';

import IconFlagCN from 'images/flag_cn.svg';
import IconFlagUK from 'images/flag_uk.svg';

import UserComponent from 'app/user';
import { Creators as CoreCreators } from 'app/core/actions';

import config from 'brand/config';

import common from 'app/common';
import { Roles } from 'app/core/config/constants';
import { Creators as QualificationCreators } from 'app/qualifications/actions';
import { Creators as NewsCreators } from 'app/news/actions';
import Notifications from 'app/notifications/components';

import { Text, _t } from 'app/intl';
import LangMenu from './lang-menu';
import PrimaryMenu from './primary-menu';
import DMPMenu from './dmp-menu';
import SecondaryMenu from './secondary-menu';
import ProfileMenu from './profile-menu';

const UserCreators = UserComponent.Actions;

const extractUserStatus = common.util.helpers.extractUserStatus;

const ContentModalConfirm = common.components.ContentModalConfirm;

const {
  CentreAdmin,
  CentreTutor,
  CentreLearner,
  CentreEQA,
  SuperAdmin,
  SiteAdmin,
  Finance
} = Roles;

const {
  util: {
    helpers: { UserAccess, validRolesWithout }
  }
} = common;

class AppHeader extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isResponsiveMenu: false
    };

    this.toggleSidebar = this.toggleSidebar.bind(this);
    this.toggleResponsiveMenu = this.toggleResponsiveMenu.bind(this);
    this.attemptToClose = this.attemptToClose.bind(this);
    this.inEditor = this.inEditor.bind(this);
  }

  goBack() {
    // This takes us back to the previous route
    const currentLocation = browserHistory.getCurrentLocation().pathname;
    browserHistory.push(currentLocation.replace('/editor', ''));
  }

  /**
   * Fn: attemptToClose()
   * Catch click on editor close button and prompt user them to save changes, if detected
   */
  attemptToClose() {
    const { currentNews } = this.props;

    if (this.props.unsavedChanges) {
      this.confirmModal.open();
    } else {
      this.goBack();
    }
  }

  inEditor() {
    const { viewNewsArticle } = this.props;

    const pathname = window.location.pathname;
    const split = pathname.split('/');
    const inBuilder =
      split.indexOf('workbooks-builder') > -1 ||
      split.indexOf('qualifications') > -1;

    if (viewNewsArticle) return 'NEWS_EDITOR';

    if (!inBuilder) {
      return false;
    }
    // Horrible, I know. I'm sorry. WE HAVE NO TIME.
    if (split.indexOf('editor') > -1) {
      return 'EDITOR';
    }
    if (split.length === 6) {
      return 'UNIT_VIEW';
    }

    return false;
  }

  toggleProfileMenu(e) {
    e.preventDefault();
    e.stopPropagation();
    const {
      profileMenuOpen,
      profileMenuSectorsExpanded,
      toggleProfileMenu,
      toggleProfileMenuSectors
    } = this.props;
    toggleProfileMenu();
    // Expand sectors
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      if (!profileMenuOpen && !profileMenuSectorsExpanded) {
        toggleProfileMenuSectors();
      }
    }, 400);
  }

  toggleSidebar() {
    const { currentLocation, toggleSidebar, openSidebarFeature } = this.props;

    if (contains('messaging', currentLocation)) {
      openSidebarFeature('notifications');
    }
    toggleSidebar();
  }

  toggleResponsiveMenu() {
    const { isResponsiveMenu } = this.state;
    this.setState({
      isResponsiveMenu: !isResponsiveMenu
    });
  }

  render() {
    const {
      user,
      workbookTitle,
      logout,
      currentLang,
      toggleLanguage,
      previewNewsArticle,
      togglePreviewNewsArticle,
      toggleViewNewsArticle
    } = this.props;
    let headerTemplate;

    const userStatus = extractUserStatus(user);

    if (this.inEditor() === 'EDITOR' && workbookTitle !== '') {
      headerTemplate = (
        <div>
          {/* TODO construct the preview URL based on which workbook is being viewed */}
          <div className="workbook-nav-item">
            <Link
              to={`${this.props.currentLocation}/preview`}
              className="button is-primary"
            >
              Preview Live Workbook
            </Link>
          </div>
          <div className="workbook-nav-item">
            <span className="label">Show Learning Outcomes</span>
            <Toggle
              defaultChecked={this.props.showOutcomesTray}
              icons={false}
              onChange={() => this.props.toggleOutcomesTray()}
            />
          </div>
          <div
            className="workbook-close modal-close"
            onClick={() => this.attemptToClose()}
          />
          <ContentModalConfirm
            callback={this.goBack}
            ref={e => {
              this.confirmModal = e;
            }}
          >
            <p>
              You have unsaved changes. Are you sure you want to close the
              editor?
            </p>
          </ContentModalConfirm>
        </div>
      );
    } else if (this.inEditor() === 'NEWS_EDITOR') {
      headerTemplate = (
        <div>
          <div className="workbook-nav-item">
            <span
              className="label"
              style={{ marginBottom: '0', lineHeight: '1' }}
            >
              Show the news in a Preview
            </span>
            <Toggle
              defaultChecked={previewNewsArticle}
              icons={false}
              onChange={() => togglePreviewNewsArticle()}
            />
          </div>
          <div
            className="workbook-close modal-close"
            onClick={() => toggleViewNewsArticle(false)}
          />
          <ContentModalConfirm
            callback={this.goBack}
            ref={e => {
              this.confirmModal = e;
            }}
          >
            <p>
              You have unsaved changes. Are you sure you want to close the
              editor?
            </p>
          </ContentModalConfirm>
        </div>
      );
    } else if (userStatus === 'ACTIVE_USER') {
      const { displayBeacon, workbookOpen } = this.props;
      headerTemplate = (
        <div className="is-hidden-mobile">
          <PrimaryMenu routes={this.props.routes} user={this.props.user} />
          <UserAccess allowRoles={validRolesWithout(Finance)}>
            <SecondaryMenu user={this.props.user} />
          </UserAccess>

          <ProfileMenu user={this.props.user} />
          {config.uiIsSidebar && (
            <div
              onClick={() => this.toggleSidebar()}
              className="toggle-sidebar"
            >
              <Notifications.Beacon {...{ displayBeacon }} />
            </div>
          )}
        </div>
      );
    } else if (
      userStatus === 'INCOMPLETE_PROFILE' ||
      userStatus === 'UNVERIFIED_EMAIL'
    ) {
      headerTemplate = (
        <div className="navbar-item m-r-10 is-hidden-mobile">
          <div onClick={logout} className="button is-info">
            <Text iKey="sign_out" />
          </div>
        </div>
      );
    } else if (userStatus === 'INVALID_USER') {
      headerTemplate = (
        <div className="is-hidden-mobile">
          <div className="flex items-center px-4 gap-8 justify-center absolute right-1/2 transform translate-x-1/2 top-10 -translate-y-1/2">
            <Link to="#" className="text-lg !font-bold !text-black">
              Shop
            </Link>
            <Link to="#" className="text-lg !font-bold !text-black">
              Jobs
            </Link>
            <Link to="#" className="text-lg !font-bold !text-black">
              About
            </Link>
            <Link to="#" className="text-lg !font-bold !text-black">
              Online Training
            </Link>
            <Link to="#" className="text-lg !font-bold !text-black">
              Contact
            </Link>
          </div>
          <div className="flex items-center my-2 gap-2 pr-4">
            <Link to="/login" className="m-l-10 button is-info !text-base">
              Sign In
            </Link>
            <Link to="/register" className="m-l-10 button is-info !bg-[#E9E9E9] !text-base !text-black">
              Sign Up
            </Link>
          </div>
        </div>
      );
    }

    const { isResponsiveMenu } = this.state;
    return (
      <div>
        <header role="banner">
          <nav
            className="navbar top-nav has-shadow is-flex"
            role="navigation"
            aria-label="main navigation"
          >
            {/* Logo */}
            <div className="nav-left navbar-brand">
              <div className="navbar-item is-brand logo">
                <IndexLink
                  to={user ? '/dashboard' : '/'}
                  activeClassName="is-active"
                  className="!w-72 !bg-contain"
                >
                  <span className="logo" />
                </IndexLink>
              </div>
              {config.logoDesc && (
                <div className="navbar-item logo-desc">{config.logoDesc}</div>
              )}
            </div>
            <div className="header-template-container navbar-end">
              {headerTemplate}
              <div className="is-hidden-tablet responsive-menu">
                <button className="button responsive-menu-button">
                  {!isResponsiveMenu ? (
                    <i
                      className="fa fa-bars"
                      onClick={() => this.toggleResponsiveMenu()}
                    />
                  ) : (
                    <i
                      className="fa fa-close"
                      onClick={() => this.toggleResponsiveMenu()}
                    />
                  )}
                </button>
              </div>
            </div>
          </nav>
          <Helmet>
            <title>{_t('title', currentLang)}</title>
          </Helmet>
        </header>
        {isResponsiveMenu && (
          <div className="responsive-dropdown-menu">
            <div className="dropdown-label">
              <Text iKey="msg_already_have_account" />
            </div>
            <div className="dropdown-contents">
              <div
                className="content"
                onClick={() => this.toggleResponsiveMenu()}
              >
                {userStatus === 'INCOMPLETE_PROFILE' ||
                  userStatus === 'UNVERIFIED_EMAIL' ||
                  userStatus === 'ACTIVE_USER' ? (
                  <Link onClick={logout}>
                    <div className="icon">
                      <i className="fa fa-sign-out" />
                    </div>
                    <Text iKey="sign_out" />
                  </Link>
                ) : (
                  <Link to="/login">
                    <div className="icon">
                      <i className="fa fa-sign-in" />
                    </div>
                    <Text iKey="sign_in" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const workbook = state.workbooks.workbook;
  const workbookTitle = workbook && workbook.title;
  const workbookReference = workbook && workbook.workbook_reference;

  return {
    currentLang: state.persisted.lang,
    workbookOpen: state.ui.workbookOpen,
    profileMenuOpen: state.ui.profileMenuOpen,
    profileMenuSectorsExpanded: state.ui.profileMenuSectorsExpanded,
    productName: state.ui.productName,
    displayBeacon: state.interactions.filter(item => !item.isRead).length > 0,
    currentSidebarFeature: state.ui.sidebarFeature,
    workbookTitle:
      (workbookReference ? `${workbookReference} - ` : '') + workbookTitle,
    showOutcomesTray: state.qualifications.showOutcomesTray,
    user: state.profile.user,
    unsavedChanges:
      state.qualifications.editorLoaded && state.qualifications.unsavedChanges,
    currentWorkbook: workbook,
    sectorTitle: path(['persisted', 'sector', 'title'])(state),

    viewNewsArticle: path(['news', 'viewNewsArticle'])(state),
    previewNewsArticle: path(['news', 'previewNewsArticle'])(state),
    currentNews: path(['news', 'currentNews'])(state)
  };
};

const mapDispatchToProps = dispatch => ({
  toggleProfileMenu: () => {
    dispatch(CoreCreators.toggleProfileMenu());
  },
  toggleProfileMenuSectors: () => {
    dispatch(CoreCreators.toggleProfileMenuSectors());
  },
  toggleSidebar: () => dispatch(CoreCreators.toggleSidebar()),
  openSidebarFeature: feature => dispatch(CoreCreators.sidebarFeature(feature)),
  toggleLanguage: lang => dispatch(CoreCreators.language(lang)),
  logout: () => dispatch(UserCreators.logout()),

  toggleOutcomesTray: () =>
    dispatch(QualificationCreators.toggleOutcomesTray()),

  toggleViewNewsArticle: payload =>
    dispatch(NewsCreators.toggleViewNewsArticle(payload)),

  togglePreviewNewsArticle: () =>
    dispatch(NewsCreators.togglePreviewNewsArticle()),

  redirect(data) {
    dispatch(routerActions.replace(data));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(AppHeader);
