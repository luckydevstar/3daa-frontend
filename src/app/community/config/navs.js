import config from 'brand/config';
// import { Roles } from 'app/core/config/constants';

// const {
//   CentreAdmin,
//   CentreTutor,
//   CentreLearner,
//   SuperAdmin,
//   SiteAdmin
// } = Roles;

// const navTabs = [
//   {
//     key: 'centre-admins',
//     url: '/community/centre-admins',
//     text: 'centre_admins',
//     roles: [CentreAdmin, CentreTutor, CentreLearner, SuperAdmin, SiteAdmin]
//   },
//   {
//     key: 'centre-tutors',
//     url: '/community/centre-tutors',
//     text: 'centre_tutors',
//     roles: [CentreAdmin, CentreTutor, CentreLearner, SuperAdmin, SiteAdmin]
//   },
//   {
//     key: 'learners',
//     url: '/community/learners',
//     text: 'learners',
//     roles: [CentreAdmin, CentreTutor, SuperAdmin, SiteAdmin]
//   },
//   // {
//   //   key: 'seats',
//   //   url: '/community/seats',
//   //   text: 'seats',
//   //   roles: [CentreAdmin]
//   // },
//   {
//     key: 'site-admins',
//     url: '/community/site-admins',
//     text: 'site_admins',
//     roles: [SuperAdmin, SiteAdmin]
//   },
//   {
//     key: 'super-admins',
//     url: '/community/super-admins',
//     text: 'super_admins',
//     roles: [SuperAdmin]
//   },
//   {
//     key: 'groups',
//     url: '/community/groups',
//     text: 'groups',
//     roles: [CentreAdmin, CentreTutor, SuperAdmin, SiteAdmin]
//   }
// ];

// export default navTabs;

import { Roles } from 'app/core/config/constants';

const {
  CentreAdmin,
  CentreTutor,
  CentreLearner,
  CentreEQA,
  CentreIQA,
  SuperAdmin,
  SiteAdmin
} = Roles;

const navTabs = [
  {
    key: 'super-admins',
    url: '/community/super-admins',
    text: 'super_admins',
    roles: [SuperAdmin]
  },
  {
    key: 'site-admins',
    url: '/community/site-admins',
    text: 'site_admins',
    roles: [SuperAdmin, SiteAdmin]
  },
  {
    key: 'centre-admins',
    url: '/community/centre-admins',
    text: config.communityCentreText || 'centre_admins',
    roles: [SuperAdmin, SiteAdmin, CentreEQA]
  },
  {
    key: 'centre-tutors',
    url: '/community/centre-tutors',
    text: config.communityCoachText || 'centre_tutors',
    roles: [
      CentreAdmin,
      SuperAdmin,
      SiteAdmin,
      CentreLearner,
      CentreEQA,
      CentreIQA,
      CentreTutor
    ]
  },
  {
    key: 'learners',
    url: '/community/learners',
    text: config.communityLearnerText || 'learners',
    roles: [
      CentreAdmin,
      CentreTutor,
      SuperAdmin,
      SiteAdmin,
      CentreLearner,
      CentreEQA,
      CentreIQA
    ]
  },
  // {
  //   key: 'seats',
  //   url: '/community/seats',
  //   text: 'seats',
  //   roles: [CentreAdmin]
  // },
  {
    key: 'groups',
    url: '/community/groups',
    text: 'groups',
    roles: [SuperAdmin, SiteAdmin, CentreTutor, CentreAdmin]
  },
  {
    key: 'iqas',
    url: '/community/iqas',
    text: 'iqas',
    roles: [SuperAdmin, CentreAdmin]
  },
  {
    key: 'eqas',
    url: '/community/eqas',
    text: "EQA's",
    roles: [SuperAdmin, CentreAdmin]
  },
  {
    key: 'awaiting_users',
    url: '/community/awaiting_users',
    text: 'Awaiting Users',
    roles: [SuperAdmin, SiteAdmin, CentreAdmin]
  },
  {
    key: 'export_manager',
    url: '/community/export_manager',
    icon: 'fa-cog',
    text: 'Export Manager',
    right: true,
    roles: [SuperAdmin, SiteAdmin, CentreTutor, CentreAdmin]
  }
];

export default navTabs;
