import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import * as lodash from 'lodash';
import classNames from 'classnames';
import { createCloudinaryUrl } from '../../util/helpers';
import { Text } from 'app/intl';
import { Roles } from 'app/core/config/constants';

import AddNewPathway from 'images/icon-add-new-qualification.svg';
import Isvg from 'react-inlinesvg';

const {
  CentreAdmin,
  CentreTutor,
  CentreLearner,
  SuperAdmin,
  SiteAdmin
} = Roles;

class QualificationStatus extends Component {
  render() {
    const {
      className,
      userRole,
      guided_learning_hours,
      number_of_learners,
      number_of_groups,
      number_of_centres,
      opened,
      activePathwayCta,
      viewMore
    } = this.props;
    const { editPathway, deletePathway, createPathway } = activePathwayCta;

    return (
      <div
        className={classNames(`qualification-status ${className}`, {
          opened: opened
        })}
      >
        <ul>
          <li>
            <span>
              <Text iKey="GLH" /> : &nbsp;
            </span>
            <span>{guided_learning_hours}</span>
          </li>

          {lodash.findIndex([SuperAdmin], r => r == userRole) >= 0 && (
            <li className="state m-t-10">
              <span>No. of Centres : &nbsp;</span>
              <span>{number_of_centres}</span>
            </li>
          )}

          <li className="state m-t-5">
            <span>No. of Students : &nbsp;</span>
            <span>{number_of_learners}</span>
          </li>
          <li className="state m-t-5">
            <span>No. of Groups : &nbsp;</span>
            <span>{number_of_groups}</span>
          </li>
          <li
            className="state is-flex"
            style={{ alignItems: 'center', justifyContent: 'space-between' }}
          >
            <span>
              {lodash.findIndex(
                [CentreAdmin, CentreTutor],
                r => r == userRole
              ) >= 0 && (
                <span className="is-flex" style={{ alignItems: 'center' }}>
                  <span className="p-t-5 p-r-5" onClick={createPathway}>
                    <Isvg className="small" src={AddNewPathway} />
                  </span>
                  <span className="pathway">Create New Pathway</span>
                </span>
              )}
            </span>
            {!opened && <a onClick={() => viewMore()}>View More</a>}
          </li>
        </ul>
      </div>
    );
  }
}

QualificationStatus.defaultProps = {
  className: '',
  userRole: '',
  minimum_credit: 0,
  guided_learning_hours: 0,
  number_of_learners: 0,
  number_of_groups: 0,
  number_of_centres: 0,
  opened: false,
  viewMore: () => {},
  activePathwayCta: {
    assignToGroups: () => null,
    editPathway: () => null,
    deletePathway: () => null,
    createPathway: () => null
  }
};

QualificationStatus.propTypes = {
  className: PropTypes.string,
  userRole: PropTypes.string,
  minimum_credit: PropTypes.number,
  guided_learning_hours: PropTypes.number,
  number_of_learners: PropTypes.number,
  number_of_groups: PropTypes.number,
  number_of_centres: PropTypes.number,
  opened: PropTypes.bool,
  viewMore: PropTypes.func
};
export default QualificationStatus;

// import React from 'react';
// import PropTypes from 'prop-types';
// import { Link } from 'react-router';
// import { createCloudinaryUrl } from '../../util/helpers';
// import { Text } from 'app/intl';

// const QualificationStatus = ({
//   admin,
//   credits,
//   optional,
//   mandatory,
//   creditsEarned,
//   className,
//   unitsComplete,
//   specification
// }) => {
//   const isCompleated = arr => arr[0] >= arr[1] && arr[1] > 0;
//   const check = <i className="fa fa-check" aria-hidden="true" />;
//   const specificationUrl =
//     specification && createCloudinaryUrl(specification, 'pdf');

//   // Admin only UI
//   const uiAdmin = [
//     <div className="selected-units" key={0}>
//       <Text iKey="total_credits" />
//       {`: ${credits[0]}/${credits[1]}`} {isCompleated(mandatory) ? check : ''}
//     </div>,
//     <div className="selected-units" key={1}>
//       <Text iKey="mandatory" />
//       {`: ${mandatory[0]}/${mandatory[1]}`}
//       {isCompleated(mandatory) ? check : ''}
//     </div>,
//     <div className="selected-units" key={2}>
//       <Text iKey="optional" />
//       {`: ${optional[0]}/${optional[1]}`}
//       {isCompleated(optional) ? check : ''}
//     </div>
//   ];

//   // Learner only UI
//   const uiLearner = [
//     <div className="selected-units" key={0}>
//       <Text iKey="credits_earned" />
//       {`: ${creditsEarned[0]}/${creditsEarned[1]}`}
//       {isCompleated(mandatory) ? check : ''}
//     </div>,
//     <div className="selected-units" key={1}>
//       <Text iKey="units_complete" />
//       {`: ${unitsComplete[0]}/${unitsComplete[1]}`}
//       {isCompleated(optional) ? check : ''}
//     </div>
//   ];

//   return (
//     <div className={`workbooks-qualification-status ${className}`}>
//       {admin ? uiAdmin : uiLearner}
//       {specificationUrl &&
//         <Link className="full-spec" to={specificationUrl} target="_blank">
//           <Text iKey="see_full_specification" />
//         </Link>}
//     </div>
//   );
// };

// QualificationStatus.defaultProps = {
//   credits: [0, 0],
//   mandatory: [0, 0],
//   optional: [0, 0],
//   creditsEarned: [0, 0],
//   unitsComplete: [0, 0],
//   className: '',
//   specification: null,
//   admin: true
// };

// QualificationStatus.propTypes = {
//   credits: PropTypes.arrayOf(PropTypes.number),
//   mandatory: PropTypes.arrayOf(PropTypes.number),
//   optional: PropTypes.arrayOf(PropTypes.number),
//   className: PropTypes.string,
//   specification: PropTypes.string,
//   admin: PropTypes.bool
// };
// export default QualificationStatus;
