import React from 'react';
import { connect } from 'react-redux';
import {
  cond,
  contains,
  equals,
  gt,
  always,
  head,
  prop,
  path,
  pipe,
  ifElse,
  isEmpty,
  isNil,
  identity,
  omit,
  or,
  length,
  __
} from 'ramda';
import * as lodash from 'lodash';
import { Link, browserHistory } from 'react-router';
import classNames from 'classnames';
import common from 'app/common';
import { Roles } from 'app/core/config/constants';
import { Creators as BookstandCreators } from '../actions';
import { Creators as MessagingCreators } from 'app/messaging/actions';
import { Creators as CoreCreators } from 'app/core/actions';
import {
  getQualificationsAvailableLevels,
  getLevelQualifications,
  getQualificationWorkbooks
} from '../util/selectors';
import { Text, Option, _t, _tf, _tLevel } from 'app/intl';
import QualificationCard from '../components/qualifications/qualification-card';

// TODO move to common ???
import Workbooks from '../components/workbooks';

const {
  components: {
    EmptyView,
    Footer,
    ContentModalNew,
    ConvertDraftObjectToHtml,
    UINavigation,
    UILoading
  },
  util: {
    helpers: {
      extractUserRole,
      extractUserCentre,
      createCloudinaryUrl,
      elementAboveHeader
    }
  }
} = common;

const {
  SuperAdmin,
  SiteAdmin,
  CentreAdmin,
  CentreTutor,
  CentreLearner
} = Roles;

const {
  Header,
  ExplorerNav,
  SingleQualificationView,
  MultipleQualificationView,
  WorkbookCardView,
  ListView,
  UnitOverviewModal
} = Workbooks;

class QualificationRoute extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      qualificationCardClass: 'qualification-card',
      workbooksContainerClass: 'workbooks',
      qualification: null,
      workbook: null,
      qualifications: [],
      units: []
    };

    this.getActiveQualification = this.getActiveQualification.bind(this);
    this.openWorkbookPreview = this.openWorkbookPreview.bind(this);
    this.onClickBookItem = this.onClickBookItem.bind(this);
    this.onChangeTab = this.onChangeTab.bind(this);
    this.updateLayout = this.updateLayout.bind(this);
  }

  componentDidMount() {
    const { currentSectorId, qualifications, qualification } = this.props;

    if (!qualification) {
      this.props.getQualifications(currentSectorId);
    }

    this.setState({
      qualifications: qualifications,
      units: this.getUnits(qualifications)
    });

    document
      .querySelector('.content-container')
      .addEventListener('scroll', this.updateLayout);
    window.addEventListener('resize', this.updateLayout);
  }

  componentWillUnmount() {
    document
      .querySelector('.content-container')
      .removeEventListener('scroll', this.updateLayout);
    window.removeEventListener('resize', this.updateLayout);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { currentSectorId, qualifications, activeLevel } = this.props;

    if (currentSectorId !== nextProps.currentSectorId) {
      // Get qualifications when sector changed
      this.props.getQualifications(nextProps.currentSectorId);
    }

    if (this.state.qualifications != qualifications) {
      this.setState({
        qualifications: qualifications,
        units: this.getUnits(qualifications)
      });
    }

    // if (
    //   nextProps.qualifications &&
    //   !isEmpty(nextProps.qualifications) &&
    //   (!equals(qualifications, nextProps.qualifications) ||
    //     activeLevel !== nextProps.activeLevel)
    // ) {
    //   // Get qualification when qualifications or level changed
    //   const qualification = head(nextProps.qualifications);
    //   this.getActiveQualification(qualification);
    // }
    // TODO assess another learner
  }

  getUnits(qualifications) {
    let units = [];

    lodash.forEach(qualifications, q => {
      const temp = lodash.get(q, 'units');
      if (temp) {
        units = units.concat(temp);
      }
    });
    return units;
  }

  updateLayout() {
    const {
      qualificationCardClass,
      workbooksContainerClass,
      qualification
    } = this.state;
    const len = length(this.props.workbooks);

    if (!len || !qualification) {
      return null;
    }

    const cardHiddenByEl = cond([
      [equals(1), always('.explorer-nav')],
      [gt(__, 1), always('.active-qualification-container')]
    ])(len);

    let newQualificationCardClass = 'qualification-card';
    let newWorkbooksClass = 'workbooks';

    if (elementAboveHeader(cardHiddenByEl)) {
      newQualificationCardClass = classNames(
        'qualification-card',
        'qualification-fixed-card'
      );
      newWorkbooksClass = classNames('workbooks', 'workbooks-right');
    }

    // Prevent whole component rerendering on scroll
    if (newQualificationCardClass !== qualificationCardClass) {
      this.setState({
        qualificationCardClass: newQualificationCardClass,
        workbooksContainerClass: newWorkbooksClass
      });
    }
  }

  onClickBookItem(e, workbook) {
    this.setState({ workbook }, () => {
      this.unitOverviewModal.open();
    });
  }

  onChangeTab(e) {
    this.setState({ qualification: null });
    this.props.setActiveLevel(e);
  }

  openWorkbookPreview() {
    this.unitOverviewModal.close();
    const {
      location: { pathname },
      toggleWorkbookOpen
    } = this.props;
    toggleWorkbookOpen(true);
    const { workbook } = this.state;
    const unitId = path(['unit_id'], workbook);
    const workbookId = path(['workbook_id'], workbook);
    if (pathname && unitId && workbookId) {
      browserHistory.push(`bookstand/preview/${unitId}/${workbookId}`);
    }
  }

  onPathwayChange(e) {
    const qualification_id = parseInt(e.target.value);
    this.props.pushQualId(qualification_id);
  }

  getActiveQualification(qualification) {
    const qualificationId = prop('qualification_id', qualification);

    this.setState({ qualification }, () =>
      this.props.getQualification(qualificationId)
    );
  }

  getTabs() {
    const { availableLevels, lang } = this.props;
    return availableLevels.map(key => ({
      key: `bs-level-${key}`,
      text: _tLevel(key, lang)
    }));
  }

  renderQualifications() {
    const {
      userRole,
      currentSectorTitle,
      uiGettingQualifications,
      uiGettingAssessLearner,
      searchPhrase,
      lang
    } = this.props;

    const { qualifications, units } = this.state;

    if (uiGettingQualifications || uiGettingAssessLearner) {
      return <UILoading isLoadingOverlay alignMiddle />;
    }

    let filteredQualifications = qualifications;
    let filteredUnits = units;

    if (searchPhrase) {
      const tempPhrase = searchPhrase.trim().toLowerCase();

      filteredQualifications = lodash.filter(filteredQualifications, q => {
        if (q.title.toLowerCase().includes(tempPhrase)) return true;
        if (q.reference.toLowerCase().includes(tempPhrase)) return true;
        return false;
      });

      filteredUnits = lodash.filter(filteredUnits, u => {
        if (u.title.toLowerCase().includes(tempPhrase)) return true;
        if (u.reference.toLowerCase().includes(tempPhrase)) return true;
        return false;
      });

      filterResults = filterResults.filter(element =>
        element.title.toLowerCase().includes(searchPhrase.trim().toLowerCase())
      );
    }

    if (lodash.size(filteredQualifications)) {
      return (
        <div className="container bookstand-container min-content-height-inner animated fadeIn">
          <div className="qualifications-card-view">
            {filteredQualifications.map((q, i) => (
              <div
                className="qualification-card"
                key={'qualification_card' + i}
              >
                <QualificationCard
                  qualification={q}
                  {...{ userRole }}
                  viewMore={() => this.getActiveQualification(q)}
                />
              </div>
            ))}
          </div>
        </div>
      );
    } else if (lodash.size(filteredUnits)) {
      return (
        <div className="container bookstand-container min-content-height-inner animated fadeIn">
          <div className="qualifications-card-view">
            {filteredUnits.map((u, i) => (
              <div
                className="qualification-card"
                key={'qualification_card' + i}
              >
                <QualificationCard
                  qualification={u}
                  {...{ userRole }}
                  viewMore={() => this.getActiveQualification(q)}
                />
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="container bookstand-container min-content-height-inner">
        <EmptyView
          type="qualifications"
          description={_tf(
            'empty_qualifications_placeholder',
            [currentSectorTitle],
            lang
          )}
        />
      </div>
    );
  }

  renderWorkbooksView() {
    const {
      uiGettingQualification,
      workbooks,
      searchPhrase,
      userRole
    } = this.props;

    const { qualification } = this.state;

    const centre_contact_email = path(['centre_contact_email'], qualification);
    // const ViewComponent = this.state.viewType === 'card' ? WorkbookCardView : ListView;
    const ViewComponent = WorkbookCardView;

    return (
      <ViewComponent
        workbooks={workbooks}
        onClickBookItem={this.onClickBookItem}
        loading={uiGettingQualification}
        searchPhrase={searchPhrase}
        role={userRole}
        {...{ centre_contact_email }}
      />
    );
  }

  renderActiveQualification() {
    const {
      userRole,
      uiGettingQualification,
      workbooks,
      lang,
      qualification
    } = this.props;

    const { qualificationCardClass, workbooksContainerClass } = this.state;

    const pathways = [];
    const activePathway = null;
    const isActive = null;

    if (!qualification) {
      return null;
    }

    const specification = lodash.get(qualification, 'specification', null);
    const specificationUrl =
      specification && createCloudinaryUrl(specification, 'pdf');

    return (
      <div className="container bookstand-container min-content-height-inner animated fadeBig">
        <div className="active-qualification-container">
          <div className={qualificationCardClass}>
            <QualificationCard
              qualification={qualification}
              opened={true}
              {...{ userRole }}
            />
          </div>

          <div className="qualification-details">
            <div className="qualification-details-header m-b-15">
              <div className="qualification-title">
                {qualification.title && qualification.title.length > 80
                  ? `${qualification.title.slice(0, 77)}...`
                  : qualification.title}
              </div>
              <div
                className="close"
                onClick={() => this.setState({ qualification: null })}
              >
                <div style={{ fontSize: '22px' }}>x</div>
                <div>close</div>
              </div>
              <div className="reference">
                <span>LARA Reference &nbsp;&nbsp;</span>
                <span>{qualification.reference}</span>
              </div>
              <div className="glh">
                <span>
                  <Text iKey="GLH" /> : &nbsp;
                </span>
                <span>{qualification.guided_learning_hours}</span>
              </div>
            </div>

            <div className="overview is-hidden-mobile  m-b-15">
              {<ConvertDraftObjectToHtml object={qualification.overview} />}
            </div>
            <div
              className="is-flex"
              style={{ justifyContent: 'space-between', alignItems: 'center' }}
            >
              {lodash.findIndex(
                [CentreAdmin, CentreTutor],
                r => r == userRole
              ) >= 0 && (
                <div className="pathway-controls">
                  <p className="control">
                    <span className="select">
                      <select
                        onChange={e => this.onPathwayChange(e)}
                        value={activePathway || 0}
                        disabled={!isActive}
                      >
                        <Option
                          iKey="pathway_here"
                          value={qualification.qualification_id}
                        />
                        {pathways &&
                          pathways.length > 0 &&
                          pathways.map(pw => (
                            <option
                              key={pw.qualification_id}
                              value={pw.qualification_id}
                            >
                              {pw.pathway}
                            </option>
                          ))}
                      </select>
                    </span>
                  </p>
                </div>
              )}

              {specificationUrl && (
                <div style={{ marginLeft: 'auto' }}>
                  <Link
                    className="full-spec"
                    to={specificationUrl}
                    target="_blank"
                  >
                    <Text iKey="see_full_specification" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {uiGettingQualification ? (
          <UILoading isLoadingOverlay alignMiddle />
        ) : workbooks && !isEmpty(workbooks) ? (
          <div className={workbooksContainerClass}>
            {this.renderWorkbooksView()}
          </div>
        ) : (
          <div className={workbooksContainerClass}>
            <EmptyView
              type="workbooks"
              description={_tf(
                'empty_workbooks_placeholder',
                [qualification.short_title],
                lang
              )}
            />
          </div>
        )}

        {/* Modals */}
        <ContentModalNew
          size="larger"
          className="unit-overview-modal"
          ref={e => {
            this.unitOverviewModal = e;
          }}
        >
          <UnitOverviewModal
            workbook={this.state.workbook}
            openWorkbookPreview={this.openWorkbookPreview}
          />
        </ContentModalNew>
      </div>
    );
  }

  render() {
    const {
      currentSectorTitle,
      qualifications,
      activeLevel,
      searchPhrase,
      setSearchQuery,
      assessingLearner,
      startChat,
      lang,
      currentSector,
      qualification
    } = this.props;

    // const { qualification } = this.state;

    let headerProps;

    // Define header for assessing learner
    if (assessingLearner) {
      headerProps = {
        title: `${assessingLearner.first_name}'s Bookstand`,
        // backButtonLink: '/workbooks/assess-workbooks',
        expandableButtonProps: {
          mainButtonText: 'assessing_learner',
          expandableButtons: [
            // [
            //   'Assess another Learner',
            //   () => this.props.toggleLearnersModal(true)
            // ],
            [
              <Text iKey="view_profile" />,
              () =>
                browserHistory.push(`/profile/${assessingLearner.member_id}`)
            ],
            [<Text iKey="send_message" />, () => startChat(assessingLearner)]
          ]
        }
      };
    }

    return (
      <div className="bookstand-route">
        {/* Header */}
        <Header
          {...headerProps}
          sector={currentSector}
          subtitle={`${_tf(
            'learning_material_for_any_sector',
            [currentSectorTitle],
            lang
          )}`}
        />

        {/* Nav */}
        <section className="content-section navigation-section">
          <div className="container">
            <UINavigation
              active={`bs-level-${activeLevel}`}
              change={e => this.onChangeTab(e)}
              tabs={this.getTabs()}
              onSearch={value => {
                if (!isEmpty(qualifications) || searchPhrase)
                  setSearchQuery(value);
              }}
              searchPlaceholder={_t(
                qualification ? 'filter_workbooks' : 'filter_qualifications',
                lang
              )}
              translate={false}
            />
          </div>
        </section>

        {/* Qualifications */}
        {qualification
          ? this.renderActiveQualification()
          : this.renderQualifications()}
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = ({ persisted, profile, bookstand }) => {
  return {
    user: prop('user')(profile),
    currentSectorId: path(['sector', 'sector_id'])(persisted),
    currentSectorTitle: path(['sector', 'title'])(persisted),
    currentSector: prop('sector', persisted),
    uiGettingQualifications: prop('uiGettingQualifications')(bookstand),
    uiGettingQualification: prop('uiGettingQualification')(bookstand),
    uiGettingAssessLearner: prop('uiGettingAssessLearner')(bookstand),
    qualifications: getLevelQualifications(bookstand),
    qualification: pipe(
      prop('qualification'),
      ifElse(isNil, identity, omit('workbooks'))
    )(bookstand),
    workbooks: getQualificationWorkbooks(bookstand),
    availableLevels: getQualificationsAvailableLevels(
      prop('qualifications', bookstand)
    ),
    activeLevel: prop('activeLevel', bookstand),
    searchPhrase: prop('searchQuery', bookstand),
    assessingLearner: prop('assessingLearner', bookstand),
    lang: persisted.lang
  };
};

function mergeProps(stateProps, dispatchProps, ownProps) {
  const { dispatch } = dispatchProps;
  const { isAssess, learnerId } = ownProps;
  const {
    user,
    currentSectorId,
    currentSectorTitle,
    currentSector,
    uiGettingQualifications,
    uiGettingQualification,
    uiGettingAssessLearner,
    qualifications,
    qualification,
    workbooks,
    availableLevels,
    activeLevel,
    searchPhrase,
    assessingLearner,
    lang
  } = stateProps;
  const userRole = extractUserRole(user);
  const userCentre = extractUserCentre(user);
  let memberId;
  const centreId = userCentre && userCentre.centre_id;

  if (userRole === CentreLearner) {
    memberId = user.member_id;
  } else if (learnerId) {
    memberId = learnerId;
  }

  return {
    ...ownProps,
    userRole,
    // userCentre,
    currentSectorId,
    currentSectorTitle,
    currentSector,
    uiGettingQualifications,
    uiGettingQualification,
    uiGettingAssessLearner,
    qualifications,
    qualification,
    workbooks,
    availableLevels,
    activeLevel,
    searchPhrase,
    assessingLearner,
    lang,
    getQualifications: sectorId => {
      if (memberId) {
        if (isAssess && !assessingLearner) {
          dispatch(BookstandCreators.getAssessLearnerAttempt(memberId));
        }
        dispatch(
          BookstandCreators.getLearnerQualificationsAttempt(memberId, sectorId)
        );
      } else if (contains(userRole, [SuperAdmin, SiteAdmin])) {
        dispatch(BookstandCreators.getSectorQualificationsAttempt(sectorId));
      } else if (contains(userRole, [CentreTutor])) {
        dispatch(
          BookstandCreators.getCentreTutorQualificationsAttempt(
            centreId,
            sectorId
          )
        );
      }
    },
    getQualification: qualificationId => {
      if (memberId) {
        dispatch(
          BookstandCreators.getLearnerQualificationAttempt(qualificationId)
        );
      } else if (contains(userRole, [SuperAdmin, SiteAdmin])) {
        dispatch(
          BookstandCreators.getSectorQualificationAttempt(qualificationId)
        );
      } else if (contains(userRole, [CentreTutor])) {
        dispatch(
          BookstandCreators.getCentreTutorQualificationAttempt(
            centreId,
            qualificationId
          )
        );
      }
    },
    setActiveLevel: level =>
      dispatch(BookstandCreators.setBookstandActiveLevel(+level.substr(9))),
    setSearchQuery: query =>
      dispatch(BookstandCreators.setBookstandSearchQuery(query)),
    startChat: member => {
      dispatch(
        MessagingCreators.startChatAttempt([member], member.screen_name, true)
      );
    },
    pushQualId: qual_id =>
      dispatch(push(`/workbooks/qualification-manager/${qual_id}`)),
    toggleWorkbookOpen: open => dispatch(CoreCreators.toggleWorkbookOpen(open))
  };
}

export default connect(mapStateToProps, null, mergeProps)(QualificationRoute);
