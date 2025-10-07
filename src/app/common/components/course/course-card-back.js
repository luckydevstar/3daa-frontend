import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { createCloudinaryUrl } from '../../util/helpers';
import { Text } from 'app/intl';

const getWordByNumber = number => {
  return ['zero', 'one', 'two', 'three', 'four'][number] || number;
};

const CourseCardBack = props => {
  const {
    title,
    level,
    guided_learning_hours,
    minimum_credit,
    reference,
    type,

    mandatoryCredit,
    assignedGroupsCount,
    specification
  } = props;

  const specificationUrl =
    specification && createCloudinaryUrl(specification, 'pdf');

  const levelColors = ['#f0ab00', '#ce0037', '#00b5e2', '#c4d600', '#002855'];

  return (
    <div className="course card-back">
      <div
        className="level-badge"
        style={{ backgroundColor: levelColors[level] }}
      >
        <Text iKey="level" /> <Text iKey={getWordByNumber(level) || ''} />
      </div>
      <div className="title">{title}</div>

      {/* Qualification details */}

      <div className="details-table">
        <ul>
          <li>
            <span>
              <Text iKey="reference" />:
            </span>
            <span>{reference}</span>
          </li>
          <li>
            <span>
              <Text iKey="type" />:
            </span>
            <span>{type}</span>
          </li>
          <li>
            <span>
              <Text iKey="level" />:
            </span>
            <span>{level}</span>
          </li>
          <li>
            <span>
              <Text iKey="credit_value" />:
            </span>
            <span>{minimum_credit}</span>
          </li>
          <li>
            <span>
              <Text iKey="mandatory_credit" />:
            </span>
            <span>{mandatoryCredit}</span>
          </li>
          <li>
            <span>
              <Text iKey="guided_learning_hours" />:
            </span>
            <span>{guided_learning_hours}</span>
          </li>
          <li>
            <span>
              <Text iKey="groups_assigned" />:
            </span>
            <span>{assignedGroupsCount}</span>
          </li>
        </ul>
      </div>

      {/* Download spec. button */}
      {specificationUrl && (
        <div className="download-button">
          <hr />
          <Link
            className="button is-primary is-outlined"
            to={specificationUrl}
            target="_blank"
          >
            <Text iKey="download_full_specification_pdf" />
          </Link>
        </div>
      )}

      {/* Qualification units details */}
      {/* <div className="units-table">
        <div className="columns">
          <div className="column is-two-thirds">
            Mandatory Units (4)
          </div>
          <div className="column is-one-third">4/7</div>
        </div>
        <div className="columns">
          <div className="column is-two-thirds">
            Optional units (6)
          </div>
          <div className="column is-one-third">6/37</div>
        </div>
      </div> */}
    </div>
  );
};

CourseCardBack.propTypes = {
  title: PropTypes.string.isRequired,
  level: PropTypes.number.isRequired,
  guided_learning_hours: PropTypes.number,
  minimum_credit: PropTypes.number,
  reference: PropTypes.any,
  type: PropTypes.string,

  mandatoryCredit: PropTypes.number,
  assignedGroupsCount: PropTypes.number,
  specification: PropTypes.string
};

CourseCardBack.defaultProps = {
  title: '',
  level: 0,
  guided_learning_hours: 0,
  minimum_credit: 0,
  refernece: '',
  type: '',

  mandatoryCredit: 0,
  assignedGroupsCount: 0,
  specification: null
};

export default CourseCardBack;

// <div className="columns is-mobile is-multiline">
//           <div className="column is-half">
//             <Text iKey="reference" />:
//           </div>
//           <div className="column is-half">
//             {reference}
//           </div>
//           <div className="column is-half">
//             <Text iKey="type" />:
//           </div>
//           <div className="column is-half">
//             {qualificationType}
//           </div>
//           <div className="column is-half">
//             <Text iKey="level" />:
//           </div>
//           <div className="column is-half">
//             {level}
//           </div>
//           <div className="column is-half">
//             <Text iKey="credit_value" />:
//           </div>
//           <div className="column is-half">
//             {credit}
//           </div>
//           <div className="column is-half">
//             <Text iKey="mandatory_credit" />:
//           </div>
//           <div className="column is-half">
//             {mandatoryCredit}
//           </div>
//           <div className="column is-half">
//             <Text iKey="guided_learning_hours" />:
//           </div>
//           <div className="column is-half">
//             {guidedLearningHours}
//           </div>
//           <div className="column is-half">
//             <Text iKey="groups_assigned" />:
//           </div>
//           <div className="column is-half">
//             {assignedGroupsCount}
//           </div>
//         </div>
