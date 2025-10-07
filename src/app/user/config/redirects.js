import common from 'app/common';
import { always, both, cond, contains, equals, T, path } from 'ramda';
import * as lodash from 'lodash';
import { Roles } from 'app/core/config/constants';
import config from 'brand/config';

const extractUserRole = common.util.helpers.extractUserRole;
const extractUserStatus = common.util.helpers.extractUserStatus;

const { Member, UndefinedCentre, CentreEditor } = Roles;

const blackList = [
  '',
  '/',
  '/register/personal/create/profile',
  '/register/business/create/profile',
  '/register/personal/create/payment',
  '/register/business/create/payment',
  '/register/personal/check/voucher',
  '/register/business/check/voucher'
];

export default (user, currentPath) => {
  // REGISTRATION REDIRECTS
  const role = extractUserRole(user);
  const status = extractUserStatus(user);
  const isBusinessMember = lodash.get(user, 'is_business_member', 0);
  const isProfilePage = currentPath.indexOf('profile') !== -1;
  const isSettingsPage = currentPath.indexOf('settings') !== -1;
  const isQualificationsPage = currentPath.indexOf('qualifications') !== -1;
  const centres = user ? user.centres : [];

  let acc_type = equals(Member, role) ? 'personal' : 'business';

  let path = currentPath;
  if (status === 'UNVERIFIED_EMAIL') {
    if (config.registrationFlow === '2' && centres.length === 0) {
      path = '/regiser/profile/uln';
    } else if (config.registrationFlow === '2' && user.unverified_email) {
      path = 'register/learner/verify/key';
    } else {
      acc_type = contains('register/personal', currentPath)
        ? 'personal'
        : 'business';
      path = `/register/${acc_type}/create/profile`;
    }
  } else if (status === 'INCOMPLETE_PROFILE') {
    if (config.registrationFlow === '2' && centres.length === 0) {
      path = '/register/other/create/profile';
    } else if (user.showPaymentConfirmed) {
      if (isBusinessMember) {
        path = `/register/business/payment/confirm`;
      } else {
        path = `/register/personal/payment/confirm`;
      }
    } else if (user.centres.length > 0 && !user.centres[0].completed) {
      path = '/register/business/create/business-profile';
    } else if (user.canMoveToPayment) {
      if (isBusinessMember) {
        path = `/register/business/create/payment`;
      } else {
        path = `/register/personal/create/payment`;
      }
    } else {
      if (config.registrationFlow === '2' && centres.length > 0) {
        path = `/`;
      } else if (isBusinessMember) {
        path = `/register/business/check/voucher`;
      } else {
        path = `/register/personal/check/voucher`;
      }
    }
  } else if (status === 'ACTIVE_USER') {
    if (user.showPaymentConfirmed) {
      if (isBusinessMember) {
        path = `/register/business/payment/confirm`;
      } else {
        path = `/register/personal/payment/confirm`;
      }
    } else if (contains(currentPath, blackList)) {
      path = '/dashboard';
    }
  }

  if (
    role === CentreEditor &&
    !isProfilePage &&
    !isSettingsPage &&
    !isQualificationsPage
  ) {
    path = '/qualifications/sector-selection';
  }

  return path !== currentPath && path;
};

// import common from 'app/common';
// import { always, both, cond, contains, equals, T } from 'ramda';
// import * as lodash from 'lodash';
// import { Roles } from 'app/core/config/constants';

// const extractUserRole = common.util.helpers.extractUserRole;
// const extractUserStatus = common.util.helpers.extractUserStatus;

// const { Member, UndefinedCentre } = Roles;

// const blackList = [
//   '',
//   '/',
//   '/register/personal/create/profile',
//   '/register/business/create/profile',
//   '/register/business/create/business-profile',
//   '/register/personal/create/payment',
//   '/register/business/create/payment'
// ];

// export default (user, currentPath) => {
//   // REGISTRATION REDIRECTS
//   const role = extractUserRole(user);
//   const status = extractUserStatus(user);
//   const isBusinessMember = lodash.get(user, 'is_business_member', 0);

//   let acc_type = equals(Member, role) ? 'personal' : 'business';

//   let path = currentPath;
//   if (status === 'UNVERIFIED_EMAIL') {
//     acc_type = contains('register/personal', currentPath)
//       ? 'personal'
//       : 'business';
//     path = `/register/${acc_type}/create/profile`;
//   } else if (status === 'INCOMPLETE_PROFILE') {
//     if (!lodash.get(user, 'completed')) {
//       path = '/register/business/create/business-profile';
//     } else {
//       if (isBusinessMember) {
//         path = `/register/business/create/payment`;
//       } else {
//         path = `/register/personal/create/payment`;
//       }
//     }
//   } else if (status === 'ACTIVE_USER') {
//     if (user.showPaymentConfirmed) {
//       if (isBusinessMember) {
//         path = `/register/business/payment/confirm`;
//       } else {
//         path = `/register/personal/payment/confirm`;
//       }
//     } else if (contains(currentPath, blackList)) {
//       path = '/dashboard';
//     }
//   }

//   return path !== currentPath && path;
// };
