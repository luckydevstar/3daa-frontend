import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router';
import CurrencyFormat from 'react-currency-format';
import Isvg from 'react-inlinesvg';

import common from 'app/common';
import { Text } from 'app/intl';

import IconMan from 'images/icon_male_profile.svg';
import IconWoMen from 'images/icon_female_profile.svg';

const {
  util: {
    helpers: { createCloudinaryUrl }
  }
} = common;

class FinanceListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      itemData,
      isActive,

      onSelected,
      openChat,
      onActive,

      activating,
      suspending
    } = this.props;

    // Item data
    const {
      member_id,
      centre_id,
      screen_name,
      cloudinary_file_id,
      logo,
      number_of_learners,
      suspended,
      outstanding_revenue,
      total_revenue,
      online
    } = itemData;

    const imgUrl = createCloudinaryUrl(cloudinary_file_id, 'image');

    return (
      <tr
        className={classNames('finance-list-item', {
          selected: isActive
        })}
        onClick={() => onSelected(itemData)}
      >
        <td>
          <div className="is-flex">
            <div className="centre-badge">
              {imgUrl ? (
                <div
                  className={classNames('image')}
                  style={{
                    backgroundImage: imgUrl ? `url(${imgUrl})` : ''
                  }}
                />
              ) : (
                <div className="no-photo" />
              )}
            </div>
            <div className="name">
              <div>
                <div>{screen_name}</div>
                <div>
                  <Text iKey="registration_number" />: {member_id}
                </div>
              </div>
            </div>
          </div>
        </td>

        <td>
          <CurrencyFormat
            value={outstanding_revenue}
            displayType={'text'}
            thousandSeparator={true}
            prefix={'£'}
            renderText={value => <span>{value}</span>}
          />
        </td>

        <td>
          <CurrencyFormat
            value={total_revenue}
            displayType={'text'}
            thousandSeparator={true}
            prefix={'£'}
            renderText={value => <span>{value}</span>}
          />
        </td>

        <td>
          <div
            className="is-flex"
            style={{ justifyContent: 'flex-end', alignItems: 'center' }}
          >
            <div className="semibold m-r-15">
              <span>Account</span>&nbsp;
              <span>{!!suspended ? 'Suspended' : 'Active'}</span>
            </div>
            {isActive && (activating || suspending) ? (
              <div className="control is-loading" style={{ width: '56px' }} />
            ) : (
              <div className="field">
                <input
                  id={`centre${member_id}`}
                  type="checkbox"
                  name="account_suspended"
                  className="switch is-rounded is-success"
                  checked={!!suspended}
                  onChange={e => onActive(e.target, itemData)}
                />
                <label htmlFor={`centre${member_id}`} />
              </div>
            )}
          </div>
        </td>

        <td>
          <div className="action" onClick={() => openChat(itemData)}>
            <div className="action-message" />
            <div className="action-title">
              <Text iKey="message" />
            </div>
          </div>
        </td>

        <td>
          <Link to={`/finance/accounts/${centre_id}`}>
            <div className="action-profile">
              {/*gender == 1 ? <Isvg src={IconMan} /> : <Isvg src={IconWoMen} />*/}
            </div>
            <div className="action-title">
              <Text iKey="profile" />
            </div>
          </Link>
        </td>
      </tr>
    );
  }
}

FinanceListItem.propTypes = {};

FinanceListItem.defaultProps = {};

export default FinanceListItem;

// import React from 'react';
// import PropTypes from 'prop-types';
// import { Link, browserHistory } from 'react-router';
// import { connect } from 'react-redux';
// import { contains } from 'ramda';

// import common from 'app/common';
// import CommunityProgressBadge from './community-progress-badge';

// import { Creators } from 'app/workbooks/actions';
// import { Roles } from 'app/core/config/constants';
// import { Text } from 'app/intl';

// import Isvg from 'react-inlinesvg';

// import IconMan from 'images/icon_male_profile.svg';
// import IconWoMen from 'images/icon_female_profile.svg';

// const { SuperAdmin } = Roles;

// const {
//   components: { UICheckbox },
//   util: {
//     helpers: { isLearner, isEmptySeat, isGroup, getCommunityProfilePhotoId }
//   }
// } = common;

// const CommuntyListItem = ({
//   userData,
//   canSeeOthersProgress,
//   canAccessWorkbooks,
//   seenByTutor,
//   seenByMemberId,
//   seenByGlobalAdmin,
//   openChat,
//   dispatch,
//   activeSection,
//   openDeleteGroupModal,
//   role,
//   onRemoveButtonClick,
//   showCheckbox,
//   showCalendar,
//   showTask,
//   showPortfolio,
//   onChange
// }) => {
//   const {
//     member_id,
//     online,
//     screen_name,
//     date_of_birth,
//     title,
//     created_by,
//     current_qualification,
//     group_id,
//     total,
//     gender
//   } = userData;

//   let sector;
//   let short_title;
//   let progress_percentage;
//   if (current_qualification) {
//     sector = current_qualification.sector;
//     short_title = current_qualification.short_title;
//     progress_percentage = current_qualification.progress_percentage;
//   }

//   const checkOnline = parseInt(online);
//   const isEmptySeatItem = isEmptySeat(userData);
//   const isLearnerItem = isLearner(userData);

//   const isGroupItem = isGroup(userData);
//   const canEditGroup = isGroupItem && created_by === seenByMemberId;

//   const showPercentage = contains(activeSection, ['learners']);

//   const showChat = seenByGlobalAdmin || (!isEmptySeatItem && !isLearnerItem);
//   const showWorkbooks =
//     isLearnerItem && canAccessWorkbooks && !seenByGlobalAdmin;

//   const profilePhotoId = getCommunityProfilePhotoId(userData);

//   const handleAssessClick = () => {
//     browserHistory.push(`/bookstand/assess/${member_id}`);
//     dispatch(Creators.setAssessWorkbooksActiveLearnerId(member_id));
//   };

//   return (
//     <tr className="community-list-item">
//       <td>
//         <div className="columns">
//           {showCheckbox && (
//             <UICheckbox checked={true} onChange={e => onChange(e)} />
//           )}
//           <div className="column no-grow">
//             <CommunityProgressBadge
//               {...{
//                 profilePhotoId,
//                 canSeeOthersProgress,
//                 progress_percentage,
//                 isLearner: isLearnerItem,
//                 gender
//               }}
//             />
//             {/* TODO implement overlay in the ProgressBadge with props
//             overlay:bool overlayColor:string */}
//             {!isEmptySeatItem && !isGroupItem && (
//               <div className="image overlay">
//                 <div className="value">
//                   {canSeeOthersProgress
//                     ? progress_percentage &&
//                       `${Math.round(progress_percentage)}%`
//                     : 0}
//                 </div>
//               </div>
//             )}
//           </div>
//           <div className="column name">
//             {!isEmptySeatItem &&
//               ((isGroupItem && title) || (
//                 <div>
//                   {screen_name}
//                   <div className="reg-id">
//                     <Text iKey="registration_id" /> {member_id}
//                   </div>
//                 </div>
//               ))}
//             {isEmptySeatItem && <Text iKey="empty_seat" />}
//           </div>
//         </div>
//       </td>
//       {!isEmptySeatItem && !isGroupItem && <td>{sector || 'n/a'}</td>}
//       {!isEmptySeatItem && !isGroupItem && <td>{short_title || 'n/a'}</td>}
//       {!isEmptySeatItem && !isGroupItem && isLearnerItem && showPercentage && (
//         <td className="text-center">
//           {progress_percentage ? `${Math.round(progress_percentage)}%` : 0}
//         </td>
//       )}
//       {!isEmptySeatItem && !isGroupItem && (
//         <td>
//           <div className="columns text-center">
//             {showWorkbooks && (
//               <div className="column action">
//                 <div onClick={() => handleAssessClick(member_id)}>
//                   <div className="action-workbook" />
//                   <div className="action-title">
//                     {seenByTutor ? (
//                       <div>
//                         {' '}
//                         <Text iKey="assess" /> <Text iKey="workbooks" />{' '}
//                       </div>
//                     ) : (
//                       <div>
//                         {' '}
//                         <Text iKey="view" /> <Text iKey="workbooks" />{' '}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {showTask && (
//               <div className="column action">
//                 <Link>
//                   <div className="action-task" />
//                   <div className="action-title">
//                     <Text iKey="task" />
//                   </div>
//                 </Link>
//               </div>
//             )}

//             {showPortfolio && (
//               <div className="column action">
//                 <Link to={`/assessment/qualification-progress/${member_id}`}>
//                   <div className="action-portfolio" />
//                   <div className="action-title">
//                     <Text iKey="portfolio" />
//                   </div>
//                 </Link>
//               </div>
//             )}

//             {showCalendar && (
//               <div className="column action">
//                 <Link>
//                   <div className="action-calendar" />
//                   <div className="action-title">
//                     <Text iKey="calendar" />
//                   </div>
//                 </Link>
//               </div>
//             )}

//             {showChat && (
//               <div
//                 className="column action"
//                 onClick={() => openChat(userData, screen_name)}
//               >
//                 <div className="action-message" />
//                 <div className="action-title">
//                   <Text iKey="message" />
//                 </div>
//               </div>
//             )}
//             <div className="column action">
//               <Link to={`/profile/${member_id}`}>
//                 <div className="action-profile">
//                   {/*gender == 1 ? <Isvg src={IconMan} /> : <Isvg src={IconWoMen} />*/}
//                 </div>
//                 <div className="action-title">
//                   <Text iKey="profile" />
//                 </div>
//               </Link>
//             </div>
//             {role === SuperAdmin && (
//               <div
//                 className="column action"
//                 onClick={() => onRemoveButtonClick(member_id)}
//               >
//                 <div className="action-remove" />
//                 <div className="action-title">
//                   <Text iKey="remove_user" />
//                 </div>
//               </div>
//             )}
//           </div>
//         </td>
//       )}
//       {isGroupItem && (
//         <td>
//           {`${total} `}
//           <Text iKey="member" />
//           {`${total > 1 ? 's' : ''}`}
//         </td>
//       )}
//       {isGroupItem && (
//         <td>
//           <div className="columns text-center">
//             {/* <div
//               className="column action"
//               onClick={() => alert('Message group')}
//             >
//               <div className="action-message" />
//               <div className="action-title">Message</div>
//             </div> */}
//             <div
//               className="column action"
//               onClick={() => {
//                 browserHistory.push(`/community/groups/${group_id}`);
//               }}
//             >
//               <div className="action-group" />
//               <div className="action-title">
//                 <Text iKey="view_group" />
//               </div>
//             </div>
//             {canEditGroup && (
//               <div
//                 className="column action"
//                 onClick={() => openDeleteGroupModal(group_id)}
//               >
//                 <div className="action-remove" />
//                 <div className="action-title">
//                   <Text iKey="remove_group" />
//                 </div>
//               </div>
//             )}
//           </div>
//         </td>
//       )}

//       {/* !isEmptySeatItem &&
//         <td className="has-text-centered">
//           <div className="user-type">{type}</div>
//         </td> */}

//       {!isEmptySeatItem && !isGroupItem && (
//         <td className="text-center">
//           <div className={checkOnline ? 'dot dot-green' : 'dot dot-red'} />
//           <div className="status">
//             {checkOnline ? <Text iKey="online" /> : <Text iKey="offline" />}
//           </div>
//         </td>
//       )}
//       {isEmptySeatItem && !isGroupItem && <td>{member_id}</td>}
//       {isEmptySeatItem && !isGroupItem && (
//         <td>{date_of_birth || '99/99/1999'}</td>
//       )}
//     </tr>
//   );
// };

// CommuntyListItem.propTypes = {
//   showCalendar: PropTypes.bool,
//   showTask: PropTypes.bool,
//   showPortfolio: PropTypes.bool
// };

// CommuntyListItem.defaultProps = {
//   showCalendar: false,
//   showTask: false,
//   showPortfolio: false
// };

// export default connect()(CommuntyListItem);
