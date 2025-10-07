// import React from 'react';
// import PropTypes from 'prop-types';
// import classNames from 'classnames';
// import * as lodash from 'lodash';
// import Isvg from 'react-inlinesvg';

// import config from 'brand/config';
// import { Text } from 'app/intl';
// import common from 'app/common';

// import IconBusinessPhone from 'images/icon-business-phone.svg';
// import IconMember from 'images/icon-member.svg';
// import IconBusinessPages from 'images/icon-business-pages.svg';
// import IconLeagal from 'images/icon-leagal.svg';

// const {
//   components: { CloudinaryMedia, UILoading }
// } = common;

// const PaymentMembershipCard = ({ method, membership }) => (
//   <div className="membership-card">
//     <div className="c-header">
//       {method === 1 ? (
//         <Text iKey="personal_membership" />
//       ) : (
//         <Text iKey="business_membership" />
//       )}
//     </div>
//     <div className="c-body">
//       <div className="p-t-25">
//         <h3>
//           {method === 1 || method === 2 ? (
//             <Text iKey="years_membership" />
//           ) : (
//             <Text iKey="month_membership" />
//           )}
//         </h3>
//       </div>
//       <div className="p-t-5 p-b-15">
//         <h1>£{(lodash.get(membership, 'price') || 0).toFixed(2)}</h1>
//       </div>

//       {method == 1 && <hr />}

//       {config.membershipCardView == 'horizontal' ? ( //
//         <div className="c-content horizontal">
//           {method !== 1 && (
//             <div className="c-content-item">
//               <div className="c-content-item-title p-b-15">
//                 <div className="icon">
//                   <CloudinaryMedia
//                     fileId={lodash.get(membership, 'cloudinary_file_id', '')}
//                     mediaType="image"
//                     transformations={{
//                       width: 30,
//                       height: 30
//                     }}
//                   />
//                   <Isvg src={IconBusinessPhone} />
//                 </div>
//                 <div>
//                   <h3 className="p-t-0">You can:</h3>
//                 </div>
//               </div>
//               <div className="c-content-item-content">
//                 <p>Track all elements of a learner’s journey in real time</p>
//                 <p>Evidence high quality learning to Ofsted</p>
//                 <p>Boost retention and encourage learners to take control</p>
//                 <p>Make substantial cost saving.</p>
//               </div>
//             </div>
//           )}

//           <div
//             className={classNames('c-content-item', {
//               personal: method == 1
//             })}
//           >
//             <div className="c-content-item-title p-b-15">
//               <div className="icon">
//                 <Isvg src={IconBusinessPhone} />
//               </div>
//               <div>
//                 <h3 className="p-t-0">Your learners can:</h3>
//               </div>
//             </div>
//             <div className="c-content-item-content">
//               <p>Build a dynamic online CV</p>
//               <p>Browse community working</p>
//               <p>Speaking to peers with instant messaging</p>
//               <p>Work both on and offline.</p>
//             </div>
//           </div>
//         </div>
//       ) : (
//         <div className="c-content vertical">
//           <div className="c-content-item">
//             <div className="c-content-item-content">
//               <div className="icon">
//                 <Isvg src={IconBusinessPhone} />
//               </div>
//               <div className="desc">
//                 <Text iKey="msg_unlimited_access_to_scpls" />
//               </div>
//             </div>
//           </div>

//           <div className="c-content-item">
//             <div className="c-content-item-content">
//               <div className="icon">
//                 <Isvg src={IconMember} />
//               </div>
//               <div className="desc">
//                 <Text iKey="msg_unlimited_team_members" />
//               </div>
//             </div>
//           </div>

//           <div className="c-content-item">
//             <div className="c-content-item-content">
//               <div className="icon">
//                 <Isvg src={IconBusinessPages} />
//               </div>
//               <div className="desc">
//                 <Text iKey="msg_unlimited_business_pages" />
//               </div>
//             </div>
//           </div>

//           <div className="c-content-item">
//             <div className="c-content-item-content">
//               <div className="icon">
//                 <Isvg src={IconLeagal} />
//               </div>
//               <div className="desc">
//                 <Text iKey="msg_unlimited_leagal_advice" />
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   </div>
// );

// PaymentMembershipCard.propTypes = {
//   method: PropTypes.number
// };

// PaymentMembershipCard.defaultProps = {
//   method: 1
// };

// export default PaymentMembershipCard;

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import * as lodash from 'lodash';
import Isvg from 'react-inlinesvg';

import config from 'brand/config';
import { Text } from 'app/intl';
import common from 'app/common';

import IconBusinessPhone from 'images/icon-business-phone.svg';
import IconMember from 'images/icon-member.svg';
import IconBusinessPages from 'images/icon-business-pages.svg';
import IconLeagal from 'images/icon-leagal.svg';

const {
  components: { CloudinaryMedia, UILoading }
} = common;

const PaymentMembershipCard = ({ method, membership }) => (
  <div className="membership-card">
    <div className="c-header">
      {method === 1 ? (
        <Text iKey="personal_membership" />
      ) : (
        <Text iKey="business_membership" />
      )}
    </div>
    <div className="c-body">
      <div className="p-t-25">
        <h3>
          {method === 1 || method === 2 ? (
            <Text iKey="years_membership" />
          ) : (
            <Text iKey="month_membership" />
          )}
        </h3>
      </div>
      <div className="p-t-5 p-b-15">
        <h1>£{(lodash.get(membership, 'price') || 0).toFixed(2)}</h1>
      </div>

      {method == 1 && <hr />}

      {config.membershipCardView == 'horizontal' ? ( //
        <div className="c-content horizontal">
          {lodash
            .get(membership, 'membership_feature', [])
            .map((feature, i) => (
              <div
                key={`membership_${i}`}
                className={classNames('c-content-item', {
                  personal: method == 1
                })}
              >
                <div className="c-content-item-title p-b-15">
                  <div className="icon">
                    <CloudinaryMedia
                      fileId={lodash.get(feature, 'cloudinary_file_id', '')}
                      mediaType="image"
                      transformations={{
                        width: 30,
                        height: 30
                      }}
                    />
                  </div>
                  <div>
                    <h3 className="p-t-0">
                      {lodash.get(feature, 'title', '')}
                    </h3>
                  </div>
                </div>
                <div className="c-content-item-content">
                  {lodash.get(feature, 'description') &&
                    lodash
                      .get(feature, 'description', [])
                      .map((d, j) => (
                        <p key={`membership_description_${j}`}>{d}</p>
                      ))}
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className="c-content vertical">
          {lodash
            .get(membership, 'membership_feature', [])
            .map((feature, i) => (
              <div key={`membership_${i}`} className="c-content-item">
                <div className="c-content-item-content">
                  <div className="icon">
                    <CloudinaryMedia
                      fileId={lodash.get(feature, 'cloudinary_file_id', '')}
                      mediaType="image"
                      transformations={{
                        width: 30,
                        height: 30
                      }}
                    />
                  </div>
                  <div className="desc">
                    {lodash.get(feature, 'description', []).map((d, j) => (
                      <p key={`membership_description_${j}`}>{d}</p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  </div>
);

PaymentMembershipCard.propTypes = {
  method: PropTypes.number
};

PaymentMembershipCard.defaultProps = {
  method: 1
};

export default PaymentMembershipCard;
