import { Roles } from 'app/core/config/constants';

const {
  CentreAdmin,
  CentreTutor,
  CentreLearner,
  CentreEQA,
  SuperAdmin,
  SiteAdmin
} = Roles;

const navTabs = [
  {
    key: 'finance_centres',
    url: '/finance',
    text: 'centres'
    // roles: [SuperAdmin]
  }
];

export default navTabs;
