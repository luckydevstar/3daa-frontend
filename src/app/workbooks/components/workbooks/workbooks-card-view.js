// import React from 'react';
// import PropTypes from 'prop-types';
// import common from 'app/common';
// import classNames from 'classnames';
// import WorkbooksEmptyBookstand from './workbooks-empty-bookstand';
// import { Text } from 'app/intl';

// const {
//   components: { ProgressBadge, UILoading },
//   util: {
//     helpers: { excerpt }
//   }
// } = common;
// const createCloudinaryUrl = common.util.helpers.createCloudinaryUrl;
// const CardView = ({
//   contentManagerMode,
//   workbooks,
//   selectedWorkbooks,
//   loading,
//   searchPhrase,
//   onBookItemClick,
//   centre_contact_email,
//   role
// }) => {
//   const isSelected = ({ workbook_id, is_mandatory }) =>
//     (contentManagerMode && is_mandatory) ||
//     selectedWorkbooks.includes(workbook_id);
//   const isMandatory = ({ is_mandatory, mandatory }) =>
//     !!is_mandatory || !!mandatory;
//   return (
//     <div className="workbooks-card-view columns is-multiline">
//       {loading && <UILoading isLoadingOverlay alignMiddle />}
//       {/* Display workbooks or empty view if necessary */}
//       {workbooks &&
//         (workbooks.length ? (
//           workbooks.map((workbook, key) => (
//             <div
//               key={key}
//               className="column is-3-widescreen is-4-desktop is-6-tablet is-12-mobile"
//             >
//               <div
//                 onClick={e => onBookItemClick(e, workbook)}
//                 className="book book-item"
//               >
//                 <div className="fallback-background">
//                   <div
//                     className="inner-image"
//                     style={
//                       workbook.cover && {
//                         backgroundImage: `url(${createCloudinaryUrl(
//                           workbook.cover,
//                           'image',
//                           {
//                             width: 228,
//                             height: 240,
//                             crop: 'fill',
//                             gravity: 'south'
//                           }
//                         )})`
//                       }
//                     }
//                   />
//                 </div>
//                 {isSelected(workbook) && (
//                   <div className="book-item-ribbon">
//                     <Text iKey="selected" />
//                   </div>
//                 )}
//                 {!contentManagerMode && isMandatory(workbook) && (
//                   <div className="book-item-ribbon">
//                     <Text iKey="mandatory" />
//                   </div>
//                 )}
//                 <div className="info">
//                   <div className="title">
//                     {workbook.title && excerpt(workbook.title, 50)}
//                     <div className="progress-badge">
//                       {contentManagerMode ? (
//                         !isMandatory(workbook) && (
//                           <div
//                             className={classNames('content-manager-badge', {
//                               selected: isSelected(workbook)
//                             })}
//                           >
//                             <i
//                               className="fa fa-check check"
//                               aria-hidden="true"
//                             />
//                           </div>
//                         )
//                       ) : workbook.progress_percentage !== 'undefined' ? (
//                         <ProgressBadge
//                           dimensions={40}
//                           strokeWidth={3}
//                           percentage={workbook.progress_percentage}
//                           percentageFontSize={15}
//                           innerMargin={0}
//                         />
//                       ) : null}
//                     </div>
//                   </div>
//                   <div className="wrapper">
//                     <div className="description">
//                       <div className="learning-hours">
//                         <Text iKey="guided_learning_hours" />{' '}
//                         {workbook.guided_learning_hours || 0}
//                       </div>
//                       <div className="credit-value">
//                         <Text iKey="credit_value" />{' '}
//                         {workbook.credit_value || 0}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))
//         ) : (
//           <WorkbooksEmptyBookstand
//             {...{ role, loading, searchPhrase }}
//             centreEmail={centre_contact_email}
//           />
//         ))}
//     </div>
//   );
// };

// CardView.propTypes = {
//   contentManagerMode: PropTypes.bool,
//   workbooks: PropTypes.array,
//   selectedWorkbooks: PropTypes.array,
//   loading: PropTypes.bool,
//   searchPhrase: PropTypes.string
// };

// CardView.defaultProps = {
//   contentManagerMode: false,
//   workbooks: [],
//   selectedWorkbooks: [],
//   loading: false,
//   searchPhrase: '',
//   centre_contact_email: ''
// };

// export default CardView;

import React from 'react';
import PropTypes from 'prop-types';
import common from 'app/common';
import classNames from 'classnames';
import WorkbooksEmptyBookstand from './workbooks-empty-bookstand';
import { Text } from 'app/intl';

const {
  components: { ProgressBadge, UILoading },
  util: {
    helpers: { excerpt }
  }
} = common;
const createCloudinaryUrl = common.util.helpers.createCloudinaryUrl;
const CardView = ({
  contentManagerMode,
  workbooks,
  selectedWorkbooks,
  loading,
  searchPhrase,
  onBookItemClick,
  centre_contact_email,
  role
}) => {
  const isSelected = ({ workbook_id, is_mandatory }) =>
    (contentManagerMode && is_mandatory) ||
    selectedWorkbooks.includes(workbook_id);
  const isMandatory = ({ is_mandatory, mandatory }) =>
    !!is_mandatory || !!mandatory;

  return (
    <div className="workbooks-card-view">
      {loading && <UILoading isLoadingOverlay alignMiddle />}
      {/* Display workbooks or empty view if necessary */}
      {workbooks &&
        (workbooks.length ? (
          workbooks.map((workbook, key) => (
            <div key={key} className="workbook-card">
              <div
                onClick={e => onBookItemClick(e, workbook)}
                className="book book-item"
              >
                <div className="fallback-background">
                  <div
                    className="inner-image"
                    style={
                      workbook.cover && {
                        backgroundImage: `url(${createCloudinaryUrl(
                          workbook.cover,
                          'image',
                          {
                            height: 278,
                            crop: 'fit',
                            gravity: 'south'
                          }
                        )})`
                      }
                    }
                  />
                </div>
                {isSelected(workbook) && (
                  <div className="book-item-ribbon">
                    <Text iKey="selected" />
                  </div>
                )}
                {!contentManagerMode && isMandatory(workbook) && (
                  <div className="book-item-ribbon">
                    <Text iKey="mandatory" />
                  </div>
                )}
                <div className="info">
                  <div className="title">
                    {workbook.title && excerpt(workbook.title, 50)}

                    {contentManagerMode && !isMandatory(workbook) ? (
                      <div className="progress-badge">
                        <div
                          className={classNames('content-manager-badge', {
                            selected: isSelected(workbook)
                          })}
                        >
                          <i className="fa fa-check check" aria-hidden="true" />
                        </div>
                      </div>
                    ) : workbook.progress_percentage !== 'undefined' ? (
                      <div className="progress-badge">
                        <ProgressBadge
                          dimensions={40}
                          strokeWidth={3}
                          percentage={workbook.progress_percentage}
                          percentageFontSize={15}
                          innerMargin={0}
                        />
                      </div>
                    ) : null}
                  </div>
                  <div className="wrapper">
                    <div className="description">
                      <div className="learning-hours">
                        <Text iKey="guided_learning_hours" />{' '}
                        {workbook.guided_learning_hours || 0}
                      </div>
                      <div className="credit-value">
                        <Text iKey="credit_value" />{' '}
                        {workbook.credit_value || 0}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <WorkbooksEmptyBookstand
            {...{ role, loading, searchPhrase }}
            centreEmail={centre_contact_email}
          />
        ))}
    </div>
  );
};

CardView.propTypes = {
  contentManagerMode: PropTypes.bool,
  workbooks: PropTypes.array,
  selectedWorkbooks: PropTypes.array,
  loading: PropTypes.bool,
  searchPhrase: PropTypes.string
};

CardView.defaultProps = {
  contentManagerMode: false,
  workbooks: [],
  selectedWorkbooks: [],
  loading: false,
  searchPhrase: '',
  centre_contact_email: ''
};

export default CardView;
