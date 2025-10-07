import React from 'react';
import { connect } from 'react-redux';
import {
  path,
  equals,
  isEmpty,
  pathOr,
  either,
  isNil,
  length,
  always,
  gt,
  cond,
  __
} from 'ramda';
import common from 'app/common';
import Workbooks from '../components/workbooks';
import { Roles } from 'app/core/config/constants';
import { Creators as QualificationActions } from 'app/qualifications/actions';
import { Creators as WorkbooksCreators } from '../actions';
import { flattenQualifications } from '../util/helpers';
import classNames from 'classnames';

const {
  CentreAdmin,
  CentreTutor,
  SiteAdmin,
  SuperAdmin,
  CentreLearner
} = Roles;

const {
  components: {
    EmptyView,
    ContentModalNew,
    course: { CourseCardFront, CourseCardBack },
    UIFlipper,
    UILoading
  },
  util: {
    helpers: { extractUserRole, extractUserCentre, elementAboveHeader }
  }
} = common;

class WorkbooksExplorer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      containerClass: '',
      viewName: 'card',
      index: 0,
      activeQualifications: null,
      currentQualification: null,
      currentWorkbook: null,
      workbooks: null
    };
    this.updateLayout = this.updateLayout.bind(this);
  }

  // Scrolling func
  /**
   * NOTE - DUPLICATE CODE
   * Practically the same code exists in workbooks qualification manager.
   */
  updateLayout() {
    const { activeQualifications, containerClass } = this.state;
    const len = length(activeQualifications);

    if (!len) {
      return null;
    }

    const cardHiddenByEl = cond([
      [equals(1), always('.workbooks-nav-container')],
      [gt(__, 1), always('.qualification-carousel .qualification-title')]
    ])(len);

    const newClass = classNames({
      'fixed-card': elementAboveHeader(cardHiddenByEl),
      'fixed-nav': elementAboveHeader('.workbooks-nav-container')
    });

    // Prevent whole component rerendering on scroll
    if (newClass !== containerClass) {
      this.setState({
        containerClass: newClass
      });
    }
  }

  // Lifecycle funcs

  componentDidMount() {
    this.getQualifications(this.props);
    // On scroll events associated with pos: fixing the current qual

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
    const { index } = this.state;
    const centre = extractUserCentre(this.props.user);
    const {
      centreQualifications,
      memberQualifications,
      location: { pathname },
      sector_id
    } = this.props;

    if (
      // If switching between routes with the same component
      !equals(pathname, nextProps.location.pathname) ||
      // If the sector changes, refresh the qualifications
      !equals(sector_id, nextProps.sector_id)
    ) {
      this.getQualifications(nextProps);
    }

    // Qualification data coming from a member specific endpoint
    if (this.qualificationSource(nextProps) === 'MEMBER') {
      this.setActiveQualifications(nextProps.memberQualifications);
      // Workbooks come directly from member qualifications array
      if (
        nextProps.memberQualifications &&
        !isEmpty(nextProps.memberQualifications)
      ) {
        this.setActiveWorkbooks(
          nextProps.memberQualifications[index].workbooks
        );
      }
    }

    // Qualification data coming from a centre specific endpoint
    if (this.qualificationSource(nextProps) === 'CENTRE') {
      this.setActiveQualifications(nextProps.centreQualifications);
      // If there are newly active qualifications, we need to get
      // extra information about the qualification
      if (
        !centreQualifications &&
        nextProps.centreQualifications &&
        !isEmpty(nextProps.centreQualifications)
      ) {
        this.props.getCentreQualification(
          centre.centre_id,
          nextProps.centreQualifications[index].qualification_id
        );
      }
      // If extra qualification data has been fetched, get the
      // workbooks from it
      if (nextProps.currentQualification) {
        this.setActiveWorkbooks(nextProps.currentQualification.workbooks);
      }
    }
    // Qualification is coming from Admin specific endpoint
    // TODO: Fix naming coventions after backend for this section is rebuilt
    if (this.qualificationSource(nextProps) === 'ADMIN') {
      this.setActiveQualifications(nextProps.memberQualifications);
      if (
        !memberQualifications &&
        nextProps.memberQualifications &&
        !isEmpty(nextProps.memberQualifications)
      ) {
        this.props.getQualification(
          nextProps.memberQualifications[index].qualification_id
        );
      }
      if (nextProps.currentQualification) {
        this.setActiveWorkbooks(nextProps.currentQualification.workbooks);
      }
    }
  }

  // Events, getters and setters

  onQualificationChange({ workbooks, qualification_id }) {
    const centre = extractUserCentre(this.props.user);
    const userRole = extractUserRole(this.props.user);
    // NOTE temporary fix for sector qualifications
    if (centre) {
      if (workbooks === undefined) {
        this.props.getCentreQualification(centre.centre_id, qualification_id);
      }
      this.setActiveWorkbooks(workbooks);
    } else if (userRole === SiteAdmin || userRole === SuperAdmin) {
      if (workbooks === undefined) {
        this.props.getQualification(qualification_id);
      }
      this.setActiveWorkbooks(workbooks);
    }
  }

  // Set qualifications
  setActiveQualifications(activeQualifications) {
    this.setState({
      activeQualifications
    });
  }

  // Set workbooks
  setActiveWorkbooks(workbooks) {
    this.setState({
      workbooks
    });
  }

  getQualifications(props) {
    const {
      user,
      user: { member_id },
      getMemberQualifications,
      getAllQualifications,
      getCentreQualifications,
      routeParams: { learnerID }
    } = props;

    const role = extractUserRole(user);

    if (learnerID) {
      getMemberQualifications(learnerID);
    } else if (role === SuperAdmin || role === SiteAdmin) {
      getAllQualifications();
    } else if (role === CentreAdmin || role === CentreTutor) {
      getCentreQualifications(extractUserCentre(user).centre_id);
    } else {
      getMemberQualifications(member_id);
    }
  }

  setView(viewName) {
    this.setState({ viewName });
  }

  // Helpers

  qualificationSource(nextProps) {
    const props = nextProps || this.props;
    const {
      routeParams: { learnerID: nextLearnerID }
    } = props;
    const role = extractUserRole(props.user);

    if (nextLearnerID || role === CentreLearner) {
      return 'MEMBER';
    } else if (role === SuperAdmin || role === SiteAdmin) {
      return 'ADMIN';
    }
    return 'CENTRE';
  }

  onBookItemClick(e, workbook) {
    this.setState({ currentWorkbook: workbook }, () => {
      this.unitOverviewModal.open();
    });
  }

  openWorkbookPreview() {
    this.unitOverviewModal.close();
  }

  // JSX

  content() {
    const { activeQualifications } = this.state;
    const WorkbooksView = this.renderWorkbooksView();
    const QualCard = this.renderQualificationCard();

    switch (activeQualifications.length) {
      // There are no qualifications
      case 0:
        return (
          <EmptyView
            type="qualifications"
            description={`Looks like there are no qualifications in ${
              this.props.currentSectorTitle
            } sector.`}
          />
        );
      // There is only one qualification
      case 1:
        return (
          <Workbooks.SingleQualificationView
            card={QualCard}
            view={WorkbooksView}
          />
        );
      // There are multiple qualifications
      default:
        return (
          <Workbooks.MultipleQualificationView
            view={WorkbooksView}
            qualifications={activeQualifications}
            currentQualificationCard={this.renderQualificationCard()}
            onQualificationChange={qualification =>
              this.onQualificationChange(qualification)
            }
          />
        );
    }
  }

  renderQualificationCard() {
    const { activeQualifications } = this.state;
    return activeQualifications && activeQualifications.length ? (
      <UIFlipper
        key={`QualFlipper_${activeQualifications[0].qualification_id}`}
        front={
          <CourseCardFront
            progressPercentage={activeQualifications[0].progress_percentage}
            creditsEarned={activeQualifications[0].credit_value}
            unitsComplete={activeQualifications[0].units_complete}
            title={activeQualifications[0].title}
            level={activeQualifications[0].level}
            fileId={activeQualifications[0].video}
            mediaType={'video'}
          />
        }
        back={
          <CourseCardBack
            title={activeQualifications[0].short_title}
            reference={activeQualifications[0].reference}
            qualificationType={activeQualifications[0].type}
            level={activeQualifications[0].level}
            credit={activeQualifications[0].credit_value}
            mandatoryCredit={activeQualifications[0].minimum_credit}
            guidedLearningHours={activeQualifications[0].guided_learning_hours}
            assignedGroupsCount={activeQualifications[0].groups}
            specification={activeQualifications[0].specification}
          />
        }
      />
    ) : (
      <div />
    );
  }

  renderWorkbooksView() {
    const { viewName, workbooks, activeQualifications, index } = this.state;
    const { loadingQualifications, user } = this.props;
    const ViewComponent =
      viewName === 'card' ? Workbooks.CardView : Workbooks.ListView;
    const onBookItemClick = (e, wb) => this.onBookItemClick(e, wb);
    const centre_contact_email = path(
      ['centre_contact_email'],
      activeQualifications[index]
    );
    return (
      <ViewComponent
        workbooks={workbooks}
        onBookItemClick={onBookItemClick}
        loading={loadingQualifications}
        role={extractUserRole(user)}
        {...{ centre_contact_email }}
      />
    );
  }

  render() {
    const { searchPhrase } = this.props;
    const { activeQualifications, workbooks, containerClass } = this.state;
    return (
      <div className={containerClass}>
        <Workbooks.Nav
          tabs={{ 0: 'All Workbooks' }}
          activeTab={0}
          searchPhrase={searchPhrase}
          // onSearchChange={setSearchQuery} // TODO
          onSearchChange={() => null}
        />
        <div
          className={`workbooks-explorer-container min-content-height-inner${
            !activeQualifications || isEmpty(activeQualifications)
              ? ' align-children-center'
              : ''
          }`}
        >
          {/* Unit overview modal */}
          <ContentModalNew
            size="larger"
            className="unit-overview-modal"
            ref={e => {
              this.unitOverviewModal = e;
            }}
          >
            <Workbooks.UnitOverviewModal
              learnerID={pathOr(null, ['routeParams', 'learnerID'], this.props)}
              workbook={this.state.currentWorkbook}
              openWorkbookPreview={() => this.openWorkbookPreview()}
            />
          </ContentModalNew>

          {/* Explorer navigation */}

          {!either(isEmpty, isNil)(activeQualifications) && (
            <Workbooks.ExplorerNav
              hidden={either(isEmpty, isNil)(workbooks)}
              setView={viewName => this.setView(viewName)}
            />
          )}

          {/* Explorer content */}

          {!activeQualifications ? <UILoading /> : this.content()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: path(['profile', 'user'])(state),
    sector_id: path(['persisted', 'sector', 'sector_id'])(state),
    currentSectorTitle: path(['persisted', 'sector', 'title'])(state),
    memberQualifications: path(['qualifications', 'memberQualifications'])(
      state
    ),
    centreQualifications:
      state.qualifications.centreQualifications &&
      flattenQualifications(state.qualifications.centreQualifications),

    currentQualification: path(['qualifications', 'currentQualification'])(
      state
    ),
    qualificationsError: path(['qualifications', 'errorCode'])(state),
    routingState: path(['routing', 'locationBeforeTransitions', 'state'])(
      state
    ),
    loadingQualifications:
      path(['qualifications', 'attemptingGetQualifications'])(state) ||
      path(['qualifications', 'attemptingGetQualification'])(state),
    searchPhrase: path(['qualifications', 'searchQuery'])(state)
  };
};

const mapDispatchToProps = dispatch => ({
  toggleLearnersModal: flag => {
    dispatch(WorkbooksCreators.toggleLearnersModal(flag));
  },
  getMemberQualifications: member_id => {
    dispatch(QualificationActions.getMemberQualificationsAttempt(member_id));
  },
  getAllQualifications: () => {
    dispatch(QualificationActions.getAllQualificationsAttempt());
  },
  getQualification: qualification_id => {
    dispatch(QualificationActions.getQualificationAttempt(qualification_id));
  },
  getCentreQualifications: centre_id => {
    dispatch(QualificationActions.getCentreQualificationsAttempt(centre_id));
  },
  clearCurrentQualificaiton: () => {
    dispatch(QualificationActions.clearCurrentQualificaiton());
  },
  getCentreQualification: (centre_id, qualification_id) => {
    dispatch(
      QualificationActions.getCentreQualificationAttempt(
        centre_id,
        qualification_id
      )
    );
  },
  setActiveLevel: level =>
    dispatch(QualificationActions.setQualificationsActiveLevel(level)),
  setSearchQuery: query =>
    dispatch(QualificationActions.setWorkbooksSearchQuery(query))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkbooksExplorer);
