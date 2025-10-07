import React, { Component } from 'react';
import common from 'app/common';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import classNames from 'classnames';
import * as lodash from 'lodash';
import UnitsSeparator from './units-separator';
import PathwaysModal from './pathways-modal';
import GroupsModal from './groups-modal';

import { Creators as QualificationActions } from 'app/qualifications/actions';
import { Creators as CommunityActions } from 'app/community/actions';
import { extractUserCentre } from 'app/common/util/helpers';
import { getQualificationIndex } from '../../util/helpers';
import {
  getLevelQualifications,
  getCurrentQualificationWorkbooks,
  getQualificationsAvailableLevels
} from 'app/qualifications/util/selectors';
import ModalGroup from 'app/modal-group/container';

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

const {
  components: {
    course: { CourseCardFront, CourseCardBack },
    UIFlipper
  }
} = common;

class QualificationCard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.editPathway = this.editPathway.bind(this);
    this.deletePathway = this.deletePathway.bind(this);
  }

  findParentQualificationId(reference) {
    return pipe(
      filter(q => q.reference === reference),
      head,
      propOr('', 'qualification_id')
    )(this.props.centreQualifications);
  }

  createPathway(pathway) {
    const { user } = this.props;
    const centre = user.centres && head(path(['centres'], user));
    this.props.createPathway(
      centre ? centre.centre_id : null,
      this.props.qualification.qualification_id,
      { pathway }
    );
    this.pathwaysModalCreate.close();
  }

  editPathway(pathway) {
    this.props.changeQualificationPathway(
      this.centre.centre_id,
      this.props.qualification.qualification_id,
      {
        pathway
      }
    );
    this.pathwaysModalEdit.close();
  }

  deletePathway(qual_id) {
    this.props.deleteQualification(qual_id);
    this.props.pushQualId(
      this.findParentQualificationId(this.props.qualification.reference)
    );
  }

  render() {
    const { qualification, opened, userRole, viewMore } = this.props;

    return (
      <div className="hover-capture">
        <UIFlipper
          key={`QualFlipper_${qualification.qualification_id}`}
          front={
            <CourseCardFront
              userRole={userRole}
              fileId={qualification.cover}
              mediaType={qualification.cover_type}
              title={qualification.title}
              level={qualification.level - 1}
              progress_percentage={qualification.progress_percentage}
              minimum_credit={qualification.minimum_credit}
              guided_learning_hours={qualification.guided_learning_hours}
              number_of_learners={qualification.number_of_learners}
              number_of_groups={qualification.number_of_groups}
              number_of_centres={qualification.number_of_centres}
              reference={'' + qualification.reference}
              opened={opened}
              viewMore={viewMore}
              activePathwayCta={{
                editPathway: () => this.pathwaysModalEdit.open(),
                deletePathway: qual_id => this.deletePathway(qual_id),
                createPathway: () => this.pathwaysModalCreate.open()
              }}
            />
          }
          back={
            <CourseCardBack
              title={qualification.short_title || ''}
              level={qualification.level - 1}
              minimum_credit={qualification.minimum_credit}
              guided_learning_hours={qualification.guided_learning_hours}
              reference={'' + qualification.reference}
              type={qualification.type}
              assignedGroupsCount={qualification.groups}
              specification={qualification.specification}
            />
          }
        />

        <PathwaysModal
          ref={e => {
            this.pathwaysModalCreate = e;
          }}
          modalType="create"
          callback={name => this.createPathway(name)}
          qualificationName={qualification.title}
        />
        <PathwaysModal
          ref={e => {
            this.pathwaysModalEdit = e;
          }}
          modalType="edit"
          currentPathway={qualification.pathway}
          callback={name => this.editPathway(name)}
          qualificationName={qualification.title}
        />
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

export default connect(mapStateToProp, mapDispatchToProps)(QualificationCard);

// mandatory={mandatory[1]}
// optional={optional[1]}
