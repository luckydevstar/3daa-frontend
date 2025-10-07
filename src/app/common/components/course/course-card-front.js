import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ProgressBadge from '../progress-badge/progress-badge';
import CloudinaryMedia from '../cloudinary-media';
import QualificationStatus from '../qualification-status';
import { Text } from 'app/intl';

import { Roles } from 'app/core/config/constants';

const {
  CentreAdmin,
  CentreTutor,
  CentreLearner,
  SuperAdmin,
  SiteAdmin
} = Roles;

class CourseCardFront extends Component {
  getWordByNumber(number) {
    return ['zero', 'one', 'two', 'three', 'four'][number] || number;
  }

  render() {
    const {
      userRole,
      className,
      fileId,
      mediaType,

      title,
      minimum_credit,
      guided_learning_hours,
      level,
      reference,
      progress_percentage,
      number_of_learners,
      number_of_groups,
      number_of_centres,
      thumbnail,

      isActive,
      opened,
      activePathwayCta,
      viewMore
    } = this.props;

    const imageDimesnions = {
      width: 320,
      height: 310
    };

    const levelColors = ['#f0ab00', '#ce0037', '#00b5e2', '#c4d600', '#002855'];

    return (
      <div className={`qualification-card-front ${className}`}>
        <div className="card-image">
          {fileId ? (
            <CloudinaryMedia
              style={{ ...imageDimesnions }}
              mediaType={mediaType}
              fileId={fileId}
              attributes={{ autoPlay: true, loop: true }}
              thumbnail={thumbnail}
              transformations={{
                width: imageDimesnions.width,
                height: imageDimesnions.height,
                crop: 'fill',
                gravity: 'north',
                quality: 100
              }}
            />
          ) : (
            <div
              style={{
                width: imageDimesnions.width,
                height: imageDimesnions.height
              }}
            />
          )}
        </div>

        <div className="card-content actions">
          <div className="card-separator">
            {userRole != SuperAdmin && (
              <div className="progress-badge">
                <ProgressBadge
                  dimensions={70}
                  strokeWidth={5}
                  innerMargin={3}
                  percentageFontSize={30}
                  percentage={progress_percentage}
                />
              </div>
            )}
            <div className="level-container">
              <div
                className="level-badge"
                style={{ backgroundColor: levelColors[level] }}
              >
                <Text iKey="level" />{' '}
                <Text iKey={this.getWordByNumber(level) || ''} />
              </div>
            </div>
          </div>
          <div className="title">
            {title.length > 78 ? `${title.slice(0, 75)}...` : title}
          </div>

          <div className="reference">
            <span>LARA Reference &nbsp;&nbsp;</span>
            <span>{reference}</span>
          </div>

          <div className="">
            <span>
              <Text iKey="credits" />:
            </span>
            <span>{minimum_credit}</span>
          </div>

          <QualificationStatus
            {...{
              userRole,
              minimum_credit,
              guided_learning_hours,
              number_of_learners,
              number_of_groups,
              number_of_centres,
              opened,
              viewMore,
              activePathwayCta
            }}
          />
        </div>
      </div>
    );
  }
}

CourseCardFront.propTypes = {
  userRole: PropTypes.string,
  className: PropTypes.string,
  title: PropTypes.string,
  level: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  minimum_credit: PropTypes.number,
  guided_learning_hours: PropTypes.number,

  fileId: PropTypes.string,
  mediaType: PropTypes.string,

  progress_percentage: PropTypes.number,
  number_of_learners: PropTypes.number,
  number_of_groups: PropTypes.number,
  number_of_centres: PropTypes.number,
  reference: PropTypes.string,
  thumbnail: PropTypes.bool,

  isActive: PropTypes.bool,
  opened: PropTypes.bool,
  viewMore: PropTypes.func
};

CourseCardFront.defaultProps = {
  userRole: '',
  className: '',
  fileId: '',
  mediaType: 'image',

  title: '',
  level: 0,
  minimum_credit: 0,
  guided_learning_hours: 0,
  progress_percentage: 0,
  number_of_learners: 0,
  number_of_groups: 0,
  number_of_centres: 0,
  reference: '',
  thumbnail: false,

  isActive: false,
  opened: false,
  activePathwayCta: {
    assignToGroups: () => null,
    editPathway: () => null,
    deletePathway: () => null,
    createPathway: () => null
  },
  viewMore: () => {}
};

export default CourseCardFront;

// import React, { Component } from 'react';
// import PropTypes from 'prop-types';
// import ProgressBadge from '../progress-badge/progress-badge';
// import CloudinaryMedia from '../cloudinary-media';
// import QualificationStatus from '../qualification-status';
// import { Text } from 'app/intl';

// class CourseCardFront extends Component {
//   getWordByNumber(number) {
//     return ['zero', 'one', 'two', 'three', 'four'][number] || number;
//   }

//   renderPathwayCta({ assignToGroups, editPathway, deletePathway }) {
//     const { qualificationId } = this.props;
//     return (
//       <div className="pathway-cta">
//         {assignToGroups &&
//           <div className="top">
//             <div
//               onClick={() => assignToGroups(qualificationId)}
//               className="button is-primary"
//             >
//               Assign To Groups
//             </div>
//           </div>}
//         <div className="bottom">
//           {editPathway &&
//             <div
//               onClick={() => editPathway(qualificationId)}
//               className="button is-primary is-outlined"
//             >
//               Edit
//             </div>}
//           {deletePathway &&
//             <div
//               onClick={() => deletePathway(qualificationId)}
//               className="button is-primary is-outlined"
//             >
//               Discard
//             </div>}
//         </div>
//       </div>
//     );
//   }

//   render() {
//     const {
//       title,
//       level,
//       fileId,
//       mediaType,
//       progress_percentage,
//       className,
//       thumbnail,
//       activePathwayCta,
//       qualManager,
//       pathways,
//       onPathwayChange,
//       isActive,
//       qualificationId,
//       currentQualificationDetails,
//       noDetails,

//       userRole,
//       minimum_credit,
//       guided_learning_hours,
//       centres,
//       groups,
//       students,
//     } = this.props;

//     const { credits, optional, mandatory, activePathway } =
//       currentQualificationDetails || {};

//     const { editPathway, deletePathway, createPathway } =
//       activePathwayCta || {};

//     const imageDimesnions = {
//       width: 350,
//       height: 360
//     };

//     return (
//       <div className={`course card-front ${className}`} onClick={onClick}>
//         <div className="card-image">
//           {fileId
//             ? <CloudinaryMedia
//                 style={{ ...imageDimesnions }}
//                 mediaType={mediaType}
//                 fileId={fileId}
//                 attributes={{ autoPlay: true, loop: true }}
//                 thumbnail={thumbnail}
//                 transformations={{
//                   width: imageDimesnions.width * 2,
//                   height: imageDimesnions.height * 2,
//                   crop: 'fill',
//                   gravity: 'north',
//                   quality: 100
//                 }}
//               />
//             : <div
//                 style={{
//                   width: imageDimesnions.width,
//                   height: imageDimesnions.height
//                 }}
//               />}
//         </div>
//         <div className="card-separator">
//           <div className="progress-badge">
//             <ProgressBadge
//               dimensions={70}
//               strokeWidth={5}
//               innerMargin={3}
//               percentageFontSize={30}
//               percentage={progress_percentage}
//             />
//           </div>
//           <div className="level-container">
//             <div className="level-badge">
//               <Text iKey="level" />{' '}
//               <Text iKey={this.getWordByNumber(level) || ''} />
//             </div>
//           </div>
//         </div>
//         <div className="card-content">
//           <div className="title">
//             {title.length > 78 ? `${title.slice(0, 75)}...` : title}
//           </div>
//           {qualManager &&
//             pathways &&
//             <div className="pathway-controls">
//               <p className="control">
//                 <span className="select">
//                   <select
//                     onChange={e => onPathwayChange(e)}
//                     value={activePathway || 0}
//                     disabled={!isActive}
//                   >
//                     {/** For Andris, so he can do project search (keywords: default pathway, pathway default, default, pathway, pathway dropdown, dropwdown pathway, qualification dropdown, qualification default pathway ) */}
//                     <option value={qualificationId}>General pathway</option>
//                     {pathways.map(pw =>
//                       <option
//                         key={pw.qualification_id}
//                         value={pw.qualification_id}
//                       >
//                         {pw.pathway}
//                       </option>
//                     )}
//                   </select>
//                 </span>
//               </p>
//               <div className="cta">
//                 {activePathway
//                   ? <div className="cta-wrapper">
//                       <i className="fa fa-pencil" onClick={editPathway} />
//                       <i
//                         className="fa fa-trash-o"
//                         onClick={() => deletePathway(activePathway)}
//                       />
//                     </div>
//                   : <div className="add-button" onClick={createPathway}>
//                       +
//                     </div>}
//               </div>
//             </div>}
//           {!noDetails &&
//             <QualificationStatus
//               {
//                 ...{
//                   userRole,
//                   minimum_credit,
//                   guided_learning_hours,
//                   centres,
//                   groups,
//                   students,
//                 }
//               }
//               viewMore={()=>viewMore()}
//             />}
//           {!noDetails &&
//             qualManager &&
//             <div className="groups">
//               {`${groups || 0} Assigned Groups`}
//             </div>}
//         </div>
//       </div>
//     );
//   }
// }

// CourseCardFront.propTypes = {
//   title: PropTypes.string,
//   fileId: PropTypes.string,
//   mediaType: PropTypes.string,
//   progress_percentage: PropTypes.number,
//   level: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
//   className: PropTypes.string,
//   activePathwayCta: PropTypes.object,
//   qualManager: PropTypes.bool,
//   noDetails: PropTypes.bool,
//   refernece: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
//   minimum_credit: PropTypes.number,
//   guided_learning_hours: PropTypes.number,
//   students: PropTypes.number,
//   groups: PropTypes.number,
//   onClick: PropTypes.func,
// };

// CourseCardFront.defaultProps = {
//   // NOTE - TEMPORARY!!!!!!
//   fileId: null,
//   title: 'Default Title',
//   mediaType: 'image',
//   progress_percentage: 0,
//   creditsEarned: 0,
//   unitsComplete: 0,
//   level: 'No data provided',
//   className: '',
//   activePathwayCta: {},
//   qualManager: false,
//   noDetails: false,

//   minimum_credit: null,
//   guided_learning_hours: null,
//   students: null,
//   groups: null,

//   onClick: () => null
// };

// export default CourseCardFront;
