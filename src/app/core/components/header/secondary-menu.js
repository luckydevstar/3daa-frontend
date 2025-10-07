import React from 'react';
import { Link } from 'react-router';
import * as lodash from 'lodash';
import { path, forEach } from 'ramda';
import UserRole from 'app/user/enums/user-role';
import common from 'app/common';
import config from 'brand/config';
import Dropdown, {
  DropdownTrigger,
  DropdownContent
} from 'react-simple-dropdown';
import { Roles } from 'app/core/config/constants';
import { Text } from 'app/intl';

const {
  CentreAdmin,
  CentreTutor,
  CentreLearner,
  CentreEditor,
  SuperAdmin,
  SiteAdmin,
  Eqa,
  Finance,
  Author
} = Roles;

const {
  util: {
    helpers: { UserAccess, validRolesWithout, extractUserRole }
  }
} = common;

class SecondaryMenu extends React.Component {
  constructor() {
    super();
    this.handleShow = this.handleShow.bind(this);
    this.bindListeners = this.bindListeners.bind(this);
    this.closeDropdown = this.closeDropdown.bind(this);
    this.applyAriaHidden = this.applyAriaHidden.bind(this);
    this.state = {
      ariaHidden: 'false'
    };
  }

  componentDidMount() {
    this.bindListeners();
  }

  bindListeners() {
    document
      .querySelector('.more-menu .dropdown__content')
      .addEventListener('click', this.closeDropdown);
  }

  closeDropdown() {
    this.refs.dropdown.hide();
  }

  handleShow() {
    document
      .querySelector('.more-menu .container')
      .setAttribute('aria-hidden', 'false');
  }

  // Currently not working
  applyAriaHidden() {
    this.setState({ ariaHidden: 'true' });
  }

  render() {
    const { user } = this.props;
    const isSiteAdmin =
      lodash.indexOf(lodash.get(user, 'roles', []), UserRole.SITE_ADMIN_ROLE) >=
      0;
    const isSuperAdmin =
      lodash.indexOf(
        lodash.get(user, 'roles', []),
        UserRole.SUPER_ADMIN_ROLE
      ) >= 0;
    const isAuthor =
      lodash.indexOf(lodash.get(user, 'roles', []), UserRole.AUTHOR_ROLE) >= 0;

    let isCentreEditor = false;
    const centres = path(['centres'], user);
    forEach(centre => {
      isCentreEditor = centre.roles.indexOf(CentreEditor) !== -1;
    }, centres);

    return (
      <Dropdown
        className="more-menu navbar-item has-sa"
        ref="dropdown"
        onShow={this.bindClicks}
        onHide={this.ariaHidden}
      >
        <DropdownTrigger className="p-r-20">
          <div className="is-hidden-mobile">
            <Text iKey="more" />
            <div className="caret" />
          </div>
          <div className="is-hidden-tablet">
            Menu
            <div className="caret" />
          </div>
        </DropdownTrigger>
        <DropdownContent>
          <div className="inner">
            <div className="" role="menu" aria-hidden={this.state.data}>
              {/* Main dropdown nav */}

              <div className="columns is-multiline">
                {/* Fulfilment */}
                <UserAccess
                  allowRoles={validRolesWithout(Eqa, CentreEditor, Author)}
                >
                  <div className="column">
                    <h2 className="title separate-mobile">
                      <Text iKey="Fulfilment" />
                    </h2>
                    <ul role="menu">
                      <li role="menuitem">
                        <Link to="/news">
                          <Text iKey="News" />
                        </Link>
                      </li>
                      {/* <UserAccess allowRoles={validRolesWithout(CentreAdmin)}> */}
                      {/*{window.location.href.includes('testing') && (*/}
                        <li role="menuitem">
                          <Link to="/jobs">
                            <Text iKey="jobs" />
                          </Link>
                        </li>
                      {/*)}*/}
                      {/* </UserAccess> */}
                      <UserAccess allowRoles={[SuperAdmin]}>
                        <li role="menuitem">
                          <Link to="/store">
                            <Text iKey="Store" />
                          </Link>
                        </li>
                      </UserAccess>
                      <UserAccess allowRoles={[SuperAdmin]}>
                        <li role="menuitem">
                          <Link to="/store/accounts">
                            <Text iKey="Account" />
                          </Link>
                        </li>
                      </UserAccess>
                      <li role="menuitem">
                        <Link to="/messaging">
                          <Text iKey="message" />
                        </Link>
                      </li>
                      <li role="menuitem">
                         <Link to="/test">
                           <Text iKey="test" />
                         </Link>
                      </li>
                    </ul>
                  </div>
                </UserAccess>

                {/* News Manager */}
                <UserAccess allowRoles={[SuperAdmin]}>
                  <div className="column">
                    <h2 className="title">
                      <Text iKey="news_manager" />
                    </h2>
                    <ul role="menu">
                      <li role="menuitem">
                        <Link to="/news/provider">
                          <Text iKey="news_provider" />
                        </Link>
                      </li>
                      <li role="menuitem">
                        <Link to="/news/article">
                          <Text iKey="news_article_builder" />
                        </Link>
                      </li>
                    </ul>
                  </div>
                </UserAccess>
                {/* News Manager */}

                {/* My Community */}
                <UserAccess
                  allowRoles={validRolesWithout(
                    Eqa,
                    Finance,
                    CentreEditor,
                    Author
                  )}
                >
                  <div className="column">
                    <h2 className="title">
                      <Text iKey="my_community" />
                    </h2>
                    <UserAccess allowRoles={[CentreAdmin]}>
                      <ul role="menu">
                        <UserAccess
                          allowRoles={validRolesWithout(
                            CentreAdmin,
                            CentreTutor
                          )}
                        >
                          <li role="menuitem">
                            <Link to="/community/centre-admins">
                              <Text iKey="centre_admins" />
                            </Link>
                          </li>
                        </UserAccess>
                        <li role="menuitem">
                          <Link to="/community/centre-tutors">
                            <Text iKey="centre_tutors" />
                          </Link>
                        </li>
                        <li role="menuitem">
                          <Link to="/community/learners">
                            <Text iKey="learners" />
                          </Link>
                        </li>
                        <li role="menuitem">
                          <Link to="/community/seats">
                            <Text iKey="seats" />
                          </Link>
                        </li>
                        <li role="menuitem">
                          <Link to="/community/groups">
                            <Text iKey="groups" />
                          </Link>
                        </li>
                      </ul>
                    </UserAccess>

                    <UserAccess allowRoles={[CentreTutor]}>
                      <ul role="menu">
                        <li role="menuitem">
                          <Link to="/community/centre-tutors">
                            <Text iKey="centre_tutors" />
                          </Link>
                        </li>
                        <li role="menuitem">
                          <Link to="/community/learners">
                            <Text iKey="learners" />
                          </Link>
                        </li>
                        <li role="menuitem">
                          <Link to="/community/groups">
                            <Text iKey="groups" />
                          </Link>
                        </li>
                      </ul>
                    </UserAccess>

                    <UserAccess allowRoles={[CentreLearner]}>
                      <ul role="menu">
                        <li role="menuitem">
                          <Link to="/community/centre-admins">
                            <Text iKey="centre_admins" />
                          </Link>
                        </li>
                        <li role="menuitem">
                          <Link to="/community/centre-tutors">
                            <Text iKey="centre_tutors" />
                          </Link>
                        </li>
                        <li role="menuitem">
                          <Link to="/community/learners">Learners</Link>
                        </li>
                        <li role="menuitem">
                          <Link to="/community/friends">Friends</Link>
                        </li>
                      </ul>
                    </UserAccess>

                    <UserAccess allowRoles={[SuperAdmin]}>
                      <ul role="menu">
                        <li role="menuitem">
                          <Link to="/community/super-admins">
                            <Text iKey="super_admins" />
                          </Link>
                        </li>
                        <li role="menuitem">
                          <Link to="/community/site-admins">
                            <Text iKey="site_admins" />
                          </Link>
                        </li>
                        <li role="menuitem">
                          <Link to="/community/centre-admins">
                            <Text iKey="centre_admins" />
                          </Link>
                        </li>
                        <li role="menuitem">
                          <Link to="/community/centre-tutors">
                            <Text iKey="centre_tutors" />
                          </Link>
                        </li>
                        <li role="menuitem">
                          <Link to="/community/learners">
                            <Text iKey="learners" />
                          </Link>
                        </li>
                        <li role="menuitem">
                          <Link to="/community/iqas">
                            <Text iKey="iqas" />
                          </Link>
                        </li>
                      </ul>
                    </UserAccess>

                    <UserAccess allowRoles={[SiteAdmin]}>
                      <ul role="menu">
                        <li role="menuitem">
                          <Link to="/community/site-admins">
                            <Text iKey="site_admins" />
                          </Link>
                        </li>
                        <li role="menuitem">
                          <Link to="/community/centre-admins">
                            <Text iKey="centre_admins" />
                          </Link>
                        </li>
                        <li role="menuitem">
                          <Link to="/community/centre-tutors">
                            <Text iKey="centre_tutors" />
                          </Link>
                        </li>
                        <li role="menuitem">
                          <Link to="/community/learners">
                            <Text iKey="learners" />
                          </Link>
                        </li>
                      </ul>
                    </UserAccess>

                    <UserAccess allowRoles={[Eqa]}>
                      <ul role="menu">
                        <li role="menuitem">
                          <Link to="/community/centre-admins">
                            <Text iKey="centre_admins" />
                          </Link>
                        </li>
                        <li role="menuitem">
                          <Link to="/community/centre-tutors">
                            <Text iKey="centre_tutors" />
                          </Link>
                        </li>
                        <li role="menuitem">
                          <Link to="/community/learners">
                            <Text iKey="learners" />
                          </Link>
                        </li>
                        <li role="menuitem">
                          <Link to="/community/eqas">
                            <Text iKey="EQAs" />
                          </Link>
                        </li>
                      </ul>
                    </UserAccess>
                  </div>
                </UserAccess>
                {/* Workbooks */}
                <UserAccess
                  allowRoles={validRolesWithout(
                    Eqa,
                    Finance,
                    CentreEditor,
                    CentreAdmin,
                    Author
                  )}
                >
                  <div className="column">
                    <h2 className="title separate-mobile">
                      <Text iKey="workbooks" />
                    </h2>
                    <UserAccess allowRoles={[CentreAdmin]}>
                      <ul role="menu">
                        <li role="menuitem">
                          <Link to="/workbooks/qualification-manager">
                            <Text iKey="qualification_manager" />
                          </Link>
                        </li>
                      </ul>
                    </UserAccess>

                    {/* All roles but CENTRE & SITE admin */}
                    <UserAccess allowRoles={[CentreTutor, CentreLearner]}>
                      <ul role="menu">
                        <li role="menuitem">
                          <Link to="/bookstand">
                            <Text iKey="bookstand" />
                          </Link>
                        </li>
                      </ul>
                    </UserAccess>

                    <UserAccess allowRoles={[SiteAdmin, SuperAdmin]}>
                      <ul>
                        <li role="menuitem">
                          <Link to="/bookstand">
                            <Text iKey="bookstand" />
                          </Link>
                        </li>
                        <li role="menuitem">
                          <Link to="/workbooks-builder">
                            <Text iKey="workbook_builder" />
                          </Link>
                        </li>
                      </ul>
                    </UserAccess>
                  </div>
                </UserAccess>
                {/* Videos */}
                <UserAccess
                  allowRoles={validRolesWithout(
                    Eqa,
                    Finance,
                    CentreEditor,
                    Author
                  )}
                >
                  <div className="column">
                    <h2 className="title separate-mobile">
                      <Text iKey="videos" />
                    </h2>
                    <UserAccess
                      allowRoles={validRolesWithout(
                        SiteAdmin,
                        SuperAdmin,
                        CentreEditor
                      )}
                    >
                      <ul role="menu">
                        <li role="menuitem">
                          <Link to="/videos">
                            <Text iKey="featured_videos" />
                          </Link>
                        </li>
                        <li role="menuitem">
                          <Link to="/videos/favourites">
                            <Text iKey="favourite_videos" />
                          </Link>
                        </li>
                      </ul>
                    </UserAccess>

                    <UserAccess allowRoles={[SiteAdmin, SuperAdmin]}>
                      <ul role="menu">
                        <li role="menuitem">
                          <Link to="/videos">
                            <Text iKey="featured_videos" />
                          </Link>
                        </li>
                        <li role="menuitem">
                          <Link to="/videos/favourites">
                            <Text iKey="favourite_videos" />
                          </Link>
                        </li>
                        <li role="menuitem">
                          <Link to="/videos/content-manager">
                            <Text iKey="video_manager" />
                          </Link>
                        </li>
                      </ul>
                    </UserAccess>
                  </div>
                </UserAccess>
                {/* Assessment */}
                {/* <UserAccess
                  allowRoles={[CentreAdmin, CentreTutor, CentreLearner]}
                > */}
                {/*{window.location.href.includes('testing') && (*/}
                <UserAccess allowRoles={validRolesWithout(CentreEditor)}>
                  <div className="column">
                    <h2 className="title separate-mobile">Assessment Tool</h2>
                    <ul role="menu">
                      <li role="menuitem">
                        <Link to="/assessment/assessment-progress">
                          Assessment Progress
                        </Link>
                      </li>
                    </ul>
                  </div>
                </UserAccess>
                {/*)}*/}

                {/* </UserAccess> */}

                {/* Admin column for SITE ADMIN and SUPER ADMIN */}
                {isSiteAdmin || isSuperAdmin || isAuthor || isCentreEditor ? (
                  <div className="column">
                    <UserAccess
                      allowRoles={[SiteAdmin, SuperAdmin, CentreEditor, Author]}
                    >
                      <h2 className="title separate-mobile">
                        <Text iKey="qualification_manager" />
                      </h2>
                      <ul role="menu">
                        <li role="menuitem">
                          <Link to="/qualifications/sector-selection">
                            <Text iKey="qualification" />
                          </Link>
                        </li>
                        <UserAccess
                          allowRoles={[SiteAdmin, SuperAdmin, Author]}
                        >
                          <li role="menuitem">
                            <Link to="/units">
                              <Text iKey="unit_management" />
                            </Link>
                          </li>
                        </UserAccess>
                        {/*
                          <li role="menuitem">
                            <Link to="/workbooks-builder">
                              <Text iKey="workbook_builder" />
                            </Link>
                          </li>
                          <li role="menuitem">
                            <Link to="/workbooks-builder/quality-assurance">
                              <Text iKey="quality_assurance" />
                            </Link>
                          </li>
                          */}
                      </ul>
                    </UserAccess>
                  </div>
                ) : null}

                {/* // Only superAdmin */}
                {isSuperAdmin ? (
                  <div className="column">
                    <UserAccess allowRoles={[SuperAdmin]}>
                      <h2 className="title separate-mobile">
                        <Text iKey="administration" />
                      </h2>
                      <ul role="menu">
                        {/* <li role="menuitem">
                          <Link to="/customer/add">
                            <Text iKey="Create a White Label" />
                          </Link>
                        </li> */}
                        {config.title === 'WLA' && (
                          <li rore="menuitem">
                            <Link to="/pairing/pairing-wheel">
                              <Text iKey="Pairing Wheel" />
                            </Link>
                          </li>
                        )}
                        <li role="menuitem">
                          <Link to="/sectors">
                            <Text iKey="Sectors" />
                          </Link>
                        </li>
                        <li role="menuitem">
                          <Link to="/user-conflict">
                            <Text iKey="User Conflict" />
                          </Link>
                        </li>
                        {config.uiAddingCustomer && (
                          <li role="menuitem">
                            <Link to="/customer">
                              <Text iKey="Customers" />
                            </Link>
                          </li>
                        )}
                      </ul>
                    </UserAccess>
                  </div>
                ) : null}

                {/* Help & Support */}
                <div className="column">
                  <h2 className="title separate-mobile">
                    <Text iKey="help_support" />
                  </h2>
                  <ul role="menu">
                    <li role="menuitem">
                      <a
                        href="http://help.pearson360.com/frequently-asked-questions"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Text iKey="faq" />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </DropdownContent>
      </Dropdown>
    );
  }
}

export default SecondaryMenu;
