import React from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import classNames from 'classnames';
import {
  UnitsSeparator,
  PathwaysModal,
  GroupsModal
} from '../components/qualification-manager';
import Workbooks from '../components/workbooks';
import { Creators as QualificationActions } from 'app/qualifications/actions';
import { Creators as CommunityActions } from 'app/community/actions';
import { extractUserCentre } from 'app/common/util/helpers';
import { getQualificationIndex } from '../util/helpers';
import {
  getLevelQualifications,
  getCurrentQualificationWorkbooks,
  getQualificationsAvailableLevels
} from 'app/qualifications/util/selectors';
import ModalGroup from 'app/modal-group/container';
import { _tLevel, _t, _tf } from 'app/intl';

import {
  cond,
  path,
  pipe,
  map,
  filter,
  without,
  update,
  head,
  prop,
  propOr,
  nth,
  either,
  isNil,
  and,
  gte,
  gt,
  equals,
  isEmpty,
  length,
  pathOr,
  always,
  __
} from 'ramda';
import common from 'app/common';

const {
  util: {
    helpers: { ancestorHasClass, elementAboveHeader }
  },
  components: {
    EmptyView,
    ContentModalNew,
    course: { CourseCardFront, CourseCardBack },
    UIFlipper,
    UIPortal,
    UINavigation
  }
} = common;

const {
  MultipleQualificationView,
  SingleQualificationView,
  ExplorerNav
} = Workbooks;

class WorkbooksQualificationManagerRoute extends React.Component {
  constructor(props) {
    super(props);
    this.centre = extractUserCentre(props.user);
    // Workbook helper functions
    this.totalCreditInitial = e => e.workbook_selected || e.is_mandatory;
    this.mandatoryUnitsInitial = e => e.is_mandatory;
    this.optionalUnitsInitial = e => e.workbook_selected && !e.is_mandatory;
    this.totalCredit = () => true;
    this.mandatoryUnits = e => e.is_mandatory;
    this.optionalUnits = e => !e.is_mandatory;
    this.state = {
      viewType: 'list',
      containerClass: '',
      showSelectedWorkbooks: false,
      workbookDataForModal: null,
      initialQualificationId: props.params
        ? parseInt(props.params.qualificationID)
        : null
    };

    this.updateLayout = this.updateLayout.bind(this);
  }

  updateLayout() {
    const { containerClass } = this.state;
    const len = length(this.props.centreQualifications);

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

  UNSAFE_componentWillMount() {
    const {
      centreQualifications,
      currentQualification,
      getCentreQualifications,
      getCentreQualification,
      currentSectorId
    } = this.props;

    const { initialQualificationId } = this.state;
    const noCentreQualifications = !this.isPresent(centreQualifications);
    const centreQualificationsFromOtherSector =
      centreQualifications &&
      centreQualifications.length &&
      centreQualifications[0].sector_id !== currentSectorId;
    const noCurrentQualification = !this.isPresent(currentQualification);
    const currentQualificationDoesntMatchParams =
      currentQualification &&
      currentQualification.qualification_id !== initialQualificationId;

    if (noCentreQualifications || centreQualificationsFromOtherSector) {
      getCentreQualifications(this.centre.centre_id);
    } else if (
      noCurrentQualification ||
      currentQualificationDoesntMatchParams
    ) {
      const index = getQualificationIndex(
        initialQualificationId,
        centreQualifications
      );
      getCentreQualification(
        this.centre.centre_id,
        centreQualifications[index].qualification_id
      );
      if (!initialQualificationId && noCurrentQualification) {
        this.props.pushQualId(centreQualifications[index].qualification_id);
      }
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      currentQualification,
      centreQualifications,
      currentSectorId,
      loadingQualification,
      createdPathwayId,
      activeLevel
    } = nextProps;
    const { getCentreQualifications } = this.props;
    const noCurrentQualification = !this.isPresent(currentQualification);
    const currentQualificationDoesntMatchParams =
      this.isPresent(currentQualification) &&
      currentQualification.qualification_id !==
        parseInt(nextProps.params.qualificationID);
    const sectorWillChange = currentSectorId !== this.props.currentSectorId;
    const levelFilterWillChange = activeLevel !== this.props.activeLevel;
    const firstQualificationId =
      centreQualifications &&
      centreQualifications.length &&
      centreQualifications[0].qualification_id;
    const qualificaitonWillChange =
      this.isPresent(currentQualification) &&
      this.isPresent(this.props.currentQualification) &&
      !equals(currentQualification, this.props.currentQualification);
    const firstQualificationIsLoading =
      this.isPresent(currentQualification) &&
      !this.isPresent(this.props.currentQualification);
    const pathwayWasAdded =
      this.isPresent(createdPathwayId) &&
      !equals(createdPathwayId, this.props.createdPathwayId);
    const mappingSaved =
      this.props.attemptingMapQualification === true &&
      nextProps.attemptingMapQualification === false;

    if (this.isPresent(centreQualifications)) {
      if (
        (isNil(currentQualification) ||
          currentQualificationDoesntMatchParams) &&
        !loadingQualification
      ) {
        this.props.pushQualId(
          nextProps.params.qualificationID || firstQualificationId
        );
        this.getSingleQualification(
          parseInt(nextProps.params.qualificationID) || firstQualificationId
        );
        if (!noCurrentQualification) {
          this.setState({ initialQualificationId: firstQualificationId });
        }
      }
      if (qualificaitonWillChange) {
        this.setQualificationDetails(currentQualification, true);
      }
      if (firstQualificationIsLoading) {
        this.setQualificationDetails(currentQualification);
      }
      if (levelFilterWillChange) {
        this.setState({ initialQualificationId: firstQualificationId }, () => {
          this.props.pushQualId(firstQualificationId);
        });
      }
      if (!nextProps.params.qualificationID) {
        this.setState({ initialQualificationId: firstQualificationId });
      }
    }
    if (sectorWillChange) {
      // reset
      this.props.clearCurrentQualification();
      this.props.resetCurrentQualificationDetails();
      this.props.setSearchQuery('');
      this.props.setActiveLevel(0);
      this.props.pushQualId('');
      // re-fetch
      getCentreQualifications(this.centre.centre_id);
    }
    if (pathwayWasAdded) {
      this.props.pushQualId(createdPathwayId);
    }
    if (mappingSaved) {
      this.groupModal.open();
    }
  }

  componentDidMount() {
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

  onQualificationChange(qualification_id) {
    this.props.pushQualId(qualification_id);
    this.getSingleQualification(qualification_id);
  }

  onPathwayChange(e) {
    const qualification_id = parseInt(e.target.value);
    this.props.pushQualId(qualification_id);
  }

  onGroupAdded() {
    this.groupModal.close();
    this.props.incrementGroupCount(
      this.props.currentQualification.qualification_id
    );
  }

  onBookItemClick(e, workbook) {
    if (
      ancestorHasClass(e.target, 'progress-badge') &&
      !prop('is_mandatory', workbook)
    ) {
      this.handleWorkbookSelect(workbook);
    } else {
      this.setState({ workbookDataForModal: workbook }, () => {
        this.unitOverviewModal.open();
      });
    }
  }

  setQualificationDetails(qual, recalculateWorkbooks) {
    const { workbooks } = qual;
    const { currentQualificationDetails } = this.props;

    // Check whether workbooks selected
    const selected = !isEmpty(currentQualificationDetails.selectedWorkbooks);

    // Assign selected workbooks
    const selectedWorkbooks =
      selected && !recalculateWorkbooks
        ? currentQualificationDetails.selectedWorkbooks
        : workbooks && this.fetchSelectedWorkbookIds(workbooks);

    // Currently active pathway
    const activePathway = this.isPathway(qual) ? qual.qualification_id : null;

    // Define qualification details
    const details = {
      credits: [
        this.currentCredits(workbooks, this.totalCreditInitial),
        qual.minimum_credit
      ],
      mandatory: [
        this.currentCredits(workbooks, this.mandatoryUnitsInitial),
        qual.mandatory_credit
      ],
      optional: [
        this.currentCredits(workbooks, this.optionalUnitsInitial),
        qual.minimum_credit - qual.mandatory_credit
      ],
      selectedWorkbooks,
      specification: qual.specification,
      activePathway
    };

    this.props.setCurrentQualificationDetails(details);
  }

  getSingleQualification(qualification_id) {
    this.props.getCentreQualification(this.centre.centre_id, qualification_id);
  }

  isPresent(obj) {
    return !either(isEmpty, isNil)(obj);
  }

  isPathway(qual) {
    return Boolean(qual.pathway);
  }

  updateQualificationDetails(workbooksList) {
    const {
      credits,
      mandatory,
      optional,
      activePathway,
      specification
    } = this.props.currentQualificationDetails;
    this.props.setCurrentQualificationDetails({
      credits: update(
        0,
        this.currentCredits(null, this.totalCredit, workbooksList)
      )(credits),
      mandatory,
      optional: update(
        0,
        this.currentCredits(null, this.optionalUnits, workbooksList)
      )(optional),
      selectedWorkbooks: workbooksList,
      activePathway,
      specification
    });
  }

  fetchSelectedWorkbookIds(workbooks) {
    return pipe(
      filter(wb => wb.workbook_selected || wb.is_mandatory),
      map(wb => wb.workbook_id)
    )(workbooks);
  }

  calculateCredit(workbooks, compareFn) {
    const result = workbooks
      .filter(compareFn)
      .reduce((acc, wb) => acc + wb.credit_value, 0);
    return result;
  }

  // Data should be an array [current, total]
  calculatePercentage(data) {
    const percentage = data[1] > 0 ? Math.floor((data[0] / data[1]) * 100) : 0;
    return percentage > 100 ? 100 : percentage;
  }

  currentCredits(workbooks = null, compareFn, workbooksList) {
    let result = null;

    const selectedWorkbooks =
      workbooksList || this.props.currentQualificationDetails;
    const { currentQualification } = this.props;
    // Only initial calculation
    if (workbooks) {
      result = this.calculateCredit(workbooks, compareFn);
    } else {
      result = this.calculateCredit(
        currentQualification.workbooks.filter(wb =>
          selectedWorkbooks.includes(wb.workbook_id)
        ),
        compareFn
      );
    }
    return result;
  }

  isWorkbookSelected(workbook_id) {
    // NOTE: What does this code do? If this is String.prototype.includes(),
    // that function is not well supported
    return this.props.currentQualificationDetails.selectedWorkbooks.includes(
      workbook_id
    );
  }

  createPathway(pathway) {
    this.props.createPathway(
      this.centre.centre_id,
      this.props.currentQualification.qualification_id,
      { pathway }
    );
    this.pathwaysModalCreate.close();
  }

  resetChanges() {
    this.setQualificationDetails(this.props.currentQualification, true);
  }

  saveMapping() {
    const {
      currentQualificationDetails: { selectedWorkbooks }
    } = this.props;
    this.props.saveQualificationMapping(
      this.centre.centre_id,
      this.props.currentQualificationId,
      {
        workbook_ids: selectedWorkbooks
      }
    );
  }

  selectWorkbook(workbook_id) {
    const { currentQualificationDetails } = this.props;
    const selectedWorkbooks = currentQualificationDetails.selectedWorkbooks.concat(
      workbook_id
    );
    this.updateQualificationDetails(selectedWorkbooks);
    this.unitOverviewModal.close();
  }

  deSelectWorkbook(workbook_id) {
    const { currentQualificationDetails } = this.props;
    const selectedWorkbooks = without([workbook_id])(
      currentQualificationDetails.selectedWorkbooks
    );
    this.updateQualificationDetails(selectedWorkbooks);
    this.unitOverviewModal.close();
  }

  validateQualificationMapping() {
    const {
      currentQualificationDetails: { mandatory, optional }
    } = this.props;
    const min = nth(0, mandatory);
    const max = nth(1, mandatory);
    const minOptional = nth(0, optional);
    const maxOptional = nth(1, optional);
    return and(gte(min, max), gte(minOptional, maxOptional));
  }

  handleWorkbookSelect({ workbook_id }) {
    if (this.isWorkbookSelected(workbook_id)) {
      this.deSelectWorkbook(workbook_id);
    } else {
      this.selectWorkbook(workbook_id);
    }
  }

  handleAssignToGroupsClick() {
    this.props.getCurrentCentreGroups();
    this.groupsModal.open();
  }

  assignToGroups(groups) {
    const group_ids = map(prop('group_id'), groups);
    const { qualification_id } = this.props.currentQualification;
    const { centre_id } = this.centre;
    this.props.assignGroupToQualification(
      centre_id,
      qualification_id,
      group_ids
    );
    this.groupsModal.close();
  }

  findParentQualificationId(reference) {
    return pipe(
      filter(q => q.reference === reference),
      head,
      propOr('', 'qualification_id')
    )(this.props.centreQualifications);
  }

  editPathway(pathway) {
    this.props.changeQualificationPathway(
      this.centre.centre_id,
      this.props.currentQualificationId,
      {
        pathway
      }
    );
    this.pathwaysModalEdit.close();
  }

  deletePathway(qual_id) {
    this.props.deleteQualification(qual_id);
    this.props.pushQualId(
      this.findParentQualificationId(this.props.currentQualification.reference)
    );
  }

  openWorkbookPreview() {
    this.unitOverviewModal.close();
    const {
      location: { pathname }
    } = this.props;
    const { workbookDataForModal } = this.state;
    const unitId = path(['unit_id'], workbookDataForModal);
    const workbookId = path(['workbook_id'], workbookDataForModal);
    if (pathname && unitId && workbookId) {
      browserHistory.push(`${pathname}/preview/${unitId}/${workbookId}`);
    }
  }

  renderQualificationCard() {
    const {
      centreQualifications,
      currentQualificationDetails,
      currentQualification
    } = this.props;
    const id =
      currentQualification &&
      this.findParentQualificationId(currentQualification.reference);
    const index = id ? getQualificationIndex(id, centreQualifications) : 0;

    return (
      centreQualifications && (
        <UIFlipper
          key={`QualFlipper_${id}`}
          front={
            <CourseCardFront
              progressPercentage={this.calculatePercentage(
                currentQualificationDetails.credits
              )}
              title={(currentQualification && currentQualification.title) || ''}
              level={currentQualification && currentQualification.level}
              mediaType={'video'}
              fileId={currentQualification && currentQualification.video}
              qualManager
              isActive
              pathways={centreQualifications[index].pathways}
              activePathway={
                currentQualification &&
                currentQualificationDetails.activePathway
              }
              qualificationId={centreQualifications[index].qualification_id}
              onPathwayChange={e => this.onPathwayChange(e)}
              managerProgress={this.calculatePercentage(
                currentQualificationDetails.credits
              )}
              activePathwayCta={{
                editPathway: () => this.pathwaysModalEdit.open(),
                deletePathway: qual_id => this.deletePathway(qual_id),
                createPathway: () => this.pathwaysModalCreate.open()
              }}
              {...{ currentQualificationDetails }}
            />
          }
          back={
            currentQualification && (
              <CourseCardBack
                title={currentQualification.title}
                reference={currentQualification.reference}
                qualificationType={currentQualification.type}
                level={currentQualification.level}
                credit={currentQualification.credit_value}
                mandatoryCredit={currentQualification.minimum_credit}
                guidedLearningHours={currentQualification.guided_learning_hours}
                assignedGroupsCount={currentQualification.groups}
                specification={currentQualification.specification}
              />
            )
          }
        />
      )
    );
  }

  renderWorkbooksView() {
    const {
      currentQualificationWorkbooks,
      user,
      currentQualificationDetails: { selectedWorkbooks }
    } = this.props;
    const { showSelectedWorkbooks, viewType } = this.state;

    return (
      <UnitsSeparator
        workbooks={currentQualificationWorkbooks}
        showSelectedWorkbooks={showSelectedWorkbooks}
        viewType={viewType}
        onBookItemClick={(e, wb) => this.onBookItemClick(e, wb)}
        user={user}
        {...{ selectedWorkbooks }}
      />
    );
  }

  render() {
    const {
      children,
      currentSectorTitle,
      centreQualifications,
      currentQualification,
      language,
      loadingQualification,
      currentQualificationDetails,
      currentQualificationDetails: { mandatory, optional, selectedWorkbooks },
      availableLevels,
      activeLevel,
      setActiveLevel,
      setSearchQuery,
      attemptingMapQualification
    } = this.props;
    const {
      showSelectedWorkbooks,
      initialQualificationId,
      containerClass
    } = this.state;
    const qualificationName =
      currentQualification && currentQualification.title;
    const { groups } = currentQualification || 0;
    const { qualificationID } = this.props.params;
    let headerProps;
    let View = null;
    const WorkbooksView = this.renderWorkbooksView();

    const tabs = Object.keys(availableLevels).map(key => ({
      key: `wbqm-level-${key}`,
      text: _tLevel(availableLevels[key], language)
    }));

    // Identify which type of view to render - single or multiple qual.
    if (centreQualifications) {
      // No qualifications found - show empty view
      if (isEmpty(centreQualifications)) {
        View = (
          <EmptyView
            type="qualifications"
            description={`Looks like there are no qualifications in ${currentSectorTitle} sector. Please switch to a different sector.`}
          />
        );
        // If there is more than one qualification
      } else if (length(centreQualifications) > 1) {
        headerProps = {
          handleCohortClick: () => this.saveMapping()
        };
        View = (
          <MultipleQualificationView
            qualifications={centreQualifications}
            onQualificationChange={qual =>
              this.onQualificationChange(qual.qualification_id)
            }
            view={WorkbooksView}
            qualificationDetails={currentQualificationDetails}
            currentQualificationCard={this.renderQualificationCard()}
            managerProgress={this.calculatePercentage(
              currentQualificationDetails.credits
            )}
            onPathwayChange={e => this.onPathwayChange(e)}
            activePathwayCta={{
              assignToGroups: () => this.handleAssignToGroupsClick(),
              editPathway: () => this.pathwaysModalEdit.open(),
              deletePathway: qual_id => this.deletePathway(qual_id),
              createPathway: () => this.pathwaysModalCreate.open()
            }}
            qualManager
            {...{
              loadingQualification,
              initialQualificationId,
              groups,
              qualificationID
            }}
          />
        );
        // If there is only one qualification
      } else if (currentQualificationDetails) {
        headerProps = {
          handleCohortClick: () => this.saveMapping()
        };
        View = (
          <SingleQualificationView
            qualificationDetails={currentQualificationDetails}
            card={this.renderQualificationCard()}
            view={this.renderWorkbooksView()}
            qualManager
            managerProgress={this.calculatePercentage(
              currentQualificationDetails.credits
            )}
          />
        );
      }
    }

    return (
      <div className={containerClass}>
        <Workbooks.Header
          {...{
            ...headerProps,
            subtitle: `${_tf(
              'learning_material_for_any_sector',
              [currentSectorTitle],
              language
            )}`,
            attemptingMapQualification
          }}
        />
        <section className="content-section navigation-section">
          <div className="container">
            <UINavigation
              tabs={tabs}
              active={`wbqm-level-${activeLevel}`}
              change={key => setActiveLevel(+key.substr(11))}
              onSearch={value => {
                setSearchQuery(value);
              }}
              searchPlaceholder={_t('filter_workbooks', language)}
              translate={false}
            />
          </div>
        </section>
        <div
          className={`qualification-manager-route min-content-height-inner${
            !centreQualifications || isEmpty(centreQualifications)
              ? ' align-children-center'
              : ''
          }`}
        >
          <PathwaysModal
            ref={e => {
              this.pathwaysModalCreate = e;
            }}
            modalType="create"
            callback={name => this.createPathway(name)}
            mandatory={mandatory[1]}
            optional={optional[1]}
            {...{ qualificationName }}
          />
          <PathwaysModal
            ref={e => {
              this.pathwaysModalEdit = e;
            }}
            modalType="edit"
            currentPathway={
              currentQualification && currentQualification.pathway
            }
            callback={name => this.editPathway(name)}
            mandatory={mandatory[1]}
            optional={optional[1]}
            {...{ qualificationName }}
          />
          <GroupsModal
            ref={e => {
              this.groupsModal = e;
            }}
            groups={this.props.userGroups}
            onSubmit={data => this.assignToGroups(data)}
            loading={this.props.loadingUserGroups}
            {...{ qualificationName }}
            mandatory={mandatory[1]}
            optional={optional[1]}
          />
          {/* Manage group modal */}
          <ContentModalNew
            className="manage-group-modal"
            size="large"
            height="fixed"
            ref={e => {
              this.groupModal = e;
            }}
          >
            <ModalGroup
              selectedQualificationId={
                currentQualification && currentQualification.qualification_id
              }
              closeModal={() => this.onGroupAdded()}
            />
          </ContentModalNew>
          {centreQualifications && !isEmpty(centreQualifications) && (
            <ExplorerNav
              showSelected={showSelectedWorkbooks}
              onSelectedChange={() =>
                this.setState({
                  showSelectedWorkbooks: !showSelectedWorkbooks
                })
              }
              setView={viewType => this.setState({ viewType })}
              handleCohortClick={() => this.saveMapping()}
              {...{ attemptingMapQualification }}
            />
          )}
          {centreQualifications && View}

          <ContentModalNew
            size="larger"
            className="unit-overview-modal"
            ref={e => {
              this.unitOverviewModal = e;
            }}
          >
            <Workbooks.UnitOverviewModal
              learnerID={pathOr(null, ['routeParams', 'learnerID'], this.props)}
              workbook={this.state.workbookDataForModal}
              openWorkbookPreview={() => this.openWorkbookPreview()}
              handleWorkbookSelect={wb => this.handleWorkbookSelect(wb)}
              {...{ selectedWorkbooks }}
            />
          </ContentModalNew>
        </div>
        {children && (
          <UIPortal isOpened>
            <div>{children}</div>
          </UIPortal>
        )}
      </div>
    );
  }
}

const mapStateToProp = ({ profile, qualifications, community, persisted }) => ({
  user: prop('user', profile),
  errorCode: prop('errorCode', qualifications),
  currentSectorId: path(['sector', 'sector_id'])(persisted),
  currentSectorTitle: path(['sector', 'title'])(persisted),
  language: persisted.lang,
  loadingUserGroups: prop('attemptingUsersGet', community),
  userGroups: prop('users', community),
  attemptingMapQualification: prop(
    'attemptingMapQualification',
    qualifications
  ),
  centreQualifications: getLevelQualifications(qualifications), // NOTE 0 -> all qualifications
  currentQualification: prop('currentQualification', qualifications),
  // TODO currentQualification: pipe(prop('currentQualification'), ifElse(isNil, identity, omit('workbooks')))(qualifications),
  currentQualificationWorkbooks: getCurrentQualificationWorkbooks(
    qualifications
  ),
  createdPathwayId: prop('createdPathwayId', qualifications),
  currentQualificationDetails: prop(
    'currentQualificationDetails',
    qualifications
  ),
  currentQualificationId: path(
    ['currentQualification', 'qualification_id'],
    qualifications
  ),
  loadingQualification: prop('attemptingGetQualification', qualifications),
  availableLevels: getQualificationsAvailableLevels(
    prop('centreQualifications', qualifications)
  ),
  activeLevel: prop('activeLevel', qualifications),
  searchPhrase: prop('searchQuery', qualifications)
});

const mapDispatchToProps = dispatch => ({
  getCentreQualifications: centre_id =>
    dispatch(QualificationActions.getCentreQualificationsAttempt(centre_id)),
  getCentreQualification: (centre_id, qualification_id) =>
    dispatch(
      QualificationActions.getCentreQualificationAttempt(
        centre_id,
        qualification_id
      )
    ),
  getCurrentCentreGroups: () =>
    dispatch(CommunityActions.communityUsersAttempt('groups')),

  saveQualificationMapping: (centre_id, qualification_id, params) =>
    dispatch(
      QualificationActions.postQualificationMappingAttempt(
        centre_id,
        qualification_id,
        params
      )
    ),
  changeQualificationPathway: (centre_id, qualification_id, params) =>
    dispatch(
      QualificationActions.postQualificationMappingAttempt(
        centre_id,
        qualification_id,
        params
      )
    ),
  createPathway: (centre_id, qualification_id, payload) =>
    dispatch(
      QualificationActions.postQualificationPathwayAttempt(
        centre_id,
        qualification_id,
        payload
      )
    ),
  clearCurrentQualification: qual_id =>
    dispatch(QualificationActions.clearCurrentQualification(qual_id)),
  setCurrentQualificationDetails: currentQualificationDetails =>
    dispatch(
      QualificationActions.setCurrentQualificationDetails(
        currentQualificationDetails
      )
    ),
  assignGroupToQualification: (centre_id, qualification_id, groups) =>
    dispatch(
      QualificationActions.postQualificationToGroupsMappingAttempt(
        centre_id,
        qualification_id,
        groups
      )
    ),
  resetCurrentQualificationDetails: () =>
    dispatch(QualificationActions.resetCurrentQualificationDetails()),
  pushQualId: qual_id =>
    dispatch(push(`/workbooks/qualification-manager/${qual_id}`)),
  setActiveLevel: level =>
    dispatch(QualificationActions.setQualificationsActiveLevel(level)),
  setSearchQuery: query =>
    dispatch(QualificationActions.setWorkbooksSearchQuery(query)),
  deleteQualification: qual_id =>
    dispatch(QualificationActions.deleteQualificationAttempt(qual_id)),
  incrementGroupCount: () =>
    dispatch(QualificationActions.incrementGroupCount())
});

export default connect(
  mapStateToProp,
  mapDispatchToProps
)(WorkbooksQualificationManagerRoute);
