import { Roles } from 'app/core/config/constants';

const {
  CentreAdmin,
  CentreTutor,
  CentreLearner,
  SuperAdmin,
  SiteAdmin
} = Roles;

const navTabs = [
  {
    key: 'qualification-progress',
    url: '/assessment/qualification-progress',
    text: 'qualification_progress'
  },
  {
    key: 'unit-progress',
    url: '/assessment/unit-progress',
    text: 'unit_progress'
  },
  {
    key: 'gallery-evidence',
    url: '/assessment/gallery-evidence',
    text: 'gallery_evidence'
  }
  // {
  //   key: 'action-plan',
  //   url: '/assessment/action-plan',
  //   text: 'action_plan'
  // }

  // {
  //   key: 'groups',
  //   url: '/community/groups',
  //   text: 'groups',
  //   roles: [CentreAdmin, CentreTutor, SuperAdmin, SiteAdmin]
  // }
];

export default navTabs;
