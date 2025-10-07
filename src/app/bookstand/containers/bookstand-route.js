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
import { browserHistory } from 'react-router';
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
import { Text, _t, _tf, _tLevel } from 'app/intl';

// TODO move to common ???
import Workbooks from 'app/workbooks/components/workbooks';

const {
  components: {
    EmptyView,
    ContentModalNew,
    Footer,
    course: { CourseCardFront, CourseCardBack },
    UIFlipper,
    UIPortal,
    UINavigation,
    UILoading
  },
  util: {
    helpers: { extractUserRole, extractUserCentre, elementAboveHeader }
  }
} = common;

const {
  SuperAdmin,
  SiteAdmin,
  // CentreAdmin,
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

class BookstandRoute extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      containerClass: '',
      viewType: 'list',
      workbook: null,
      qualification: null
    };

    this.onBookItemClick = this.onBookItemClick.bind(this);
    this.openWorkbookPreview = this.openWorkbookPreview.bind(this);

    this.updateLayout = this.updateLayout.bind(this);
  }

  updateLayout() {
    const { containerClass } = this.state;
    const len = length(this.props.qualifications);

    if (!len) {
      return null;
    }

    const cardHiddenByEl = cond([
      [equals(1), always('.explorer-nav')],
      [gt(__, 1), always('.qualification-carousel')]
    ])(len);

    const newClass = classNames({
      'fixed-card': elementAboveHeader(cardHiddenByEl)
    });

    // Prevent whole component rerendering on scroll
    if (newClass !== containerClass) {
      this.setState({
        containerClass: newClass
      });
    }
  }

  componentDidMount() {
    const { currentSectorId } = this.props;
    this.props.getQualifications(currentSectorId);
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

    if (
      nextProps.qualifications &&
      !isEmpty(nextProps.qualifications) &&
      (!equals(qualifications, nextProps.qualifications) ||
        activeLevel !== nextProps.activeLevel)
    ) {
      // Get qualification when qualifications or level changed
      const qualification = head(nextProps.qualifications);
      this.getActiveQualification(qualification);
    }
    // TODO assess another learner
  }

  onQualificationChange(qualification) {
    this.getActiveQualification(qualification);
  }

  onBookItemClick(e, workbook) {
    this.setState({ workbook }, () => {
      this.unitOverviewModal.open();
    });
  }

  getActiveQualification(qualification) {
    const qualificationId = prop('qualification_id', qualification);
    // NOTE
    // Set active qualification in state
    // because level filter clears store
    this.setState({ qualification }, () =>
      this.props.getQualification(qualificationId)
    );
  }

  getTabs() {
    const { availableLevels, lang } = this.props;
    const keys = Object.keys(availableLevels);
    return keys.map(key => ({
      key: `bs-level-${key}`,
      text: _tLevel(availableLevels[key], lang)
    }));
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
      browserHistory.push(`${pathname}/preview/${unitId}/${workbookId}`);
    }
  }

  // Render
  renderQualificationCard() {
    const qualification = or(
      this.props.qualification,
      this.state.qualification
    );

    if (qualification) {
      const {
        qualification_id,
        progress_percentage,
        credit_value,
        minimum_credit,
        units_complete,
        guided_learning_hours,
        groups,
        title,
        short_title,
        reference,
        type,
        level,
        video,
        specification
      } = qualification;

      return (
        <UIFlipper
          key={`QualFlipper_${qualification_id}`}
          front={
            <CourseCardFront
              progressPercentage={progress_percentage}
              creditsEarned={credit_value}
              unitsComplete={units_complete}
              title={title}
              level={level}
              fileId={video}
              mediaType={'video'}
            />
          }
          back={
            <CourseCardBack
              title={title}
              reference={reference}
              qualificationType={type}
              level={level}
              credit={credit_value}
              mandatoryCredit={minimum_credit}
              guidedLearningHours={guided_learning_hours}
              assignedGroupsCount={groups}
              specification={specification}
            />
          }
        />
      );
    }

    return null;
  }

  renderWorkbooksView() {
    const {
      uiGettingQualification,
      qualification,
      workbooks,
      searchPhrase,
      userRole
    } = this.props;

    const centre_contact_email = path(['centre_contact_email'], qualification);
    const ViewComponent =
      this.state.viewType === 'card' ? WorkbookCardView : ListView;

    return (
      <ViewComponent
        workbooks={workbooks}
        onClickBookItem={this.onBookItemClick}
        loading={uiGettingQualification}
        searchPhrase={searchPhrase}
        role={userRole}
        {...{ centre_contact_email }}
      />
    );
  }

  renderContent() {
    const {
      currentSectorTitle,
      uiGettingQualifications,
      uiGettingAssessLearner,
      qualifications,
      lang
    } = this.props;

    if (uiGettingQualifications || uiGettingAssessLearner) {
      return <UILoading isLoadingOverlay alignMiddle />;
    }

    if (qualifications && !isEmpty(qualifications)) {
      const { containerClass } = this.state;
      const ExplorerNavComponent = (
        <ExplorerNav setView={viewType => this.setState({ viewType })} />
      );
      let ViewComponent = null;

      if (qualifications.length > 1) {
        // 1+ qualifications
        ViewComponent = (
          <MultipleQualificationView
            view={this.renderWorkbooksView()}
            qualifications={qualifications}
            currentQualificationCard={this.renderQualificationCard()}
            onQualificationChange={qualification =>
              this.onQualificationChange(qualification)
            }
          />
        );
      } else {
        // 1 qualification
        ViewComponent = (
          <SingleQualificationView
            card={this.renderQualificationCard()}
            view={this.renderWorkbooksView()}
          />
        );
      }

      return (
        <div className={containerClass}>
          {ExplorerNavComponent}
          {ViewComponent}
        </div>
      );
    }

    return (
      <div className="min-content-height-inner align-children-middle">
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

  render() {
    const {
      children,
      currentSectorTitle,
      workbooks,
      activeLevel,
      setActiveLevel,
      searchPhrase,
      setSearchQuery,
      assessingLearner,
      startChat,
      lang
    } = this.props;
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
              change={setActiveLevel}
              tabs={this.getTabs()}
              onSearch={value => {
                if (!isEmpty(workbooks) || searchPhrase) setSearchQuery(value);
              }}
              searchPlaceholder={_t('filter_workbooks', lang)}
              translate={false}
            />
          </div>
        </section>

        {/* Content */}
        <div className="bookstand-container workbooks-explorer-container min-content-height-inner">
          {this.renderContent()}
        </div>

        <Footer />

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

        {children && <UIPortal isOpened>{children}</UIPortal>}
      </div>
    );
  }
}

const mapStateToProps = ({ persisted, profile, bookstand }) => {
  return {
    user: prop('user')(profile),
    currentSectorId: path(['sector', 'sector_id'])(persisted),
    currentSectorTitle: path(['sector', 'title'])(persisted),
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
    startChat: member =>
      dispatch(
        MessagingCreators.startChatAttempt(
          [member.member_id],
          member.screen_name,
          true
        )
      ),
    toggleWorkbookOpen: open => dispatch(CoreCreators.toggleWorkbookOpen(open))
  };
}

export default connect(
  mapStateToProps,
  null,
  mergeProps
)(BookstandRoute);
