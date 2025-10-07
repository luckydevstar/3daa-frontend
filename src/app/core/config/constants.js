export const MIN_WINDOW_WIDTH = 768;

export const FileUploadSizes = {
  MAX_IMAGE_SIZE: 40000000, // 40mb
  MAX_VIDEO_SIZE: 500000000 // 500mb
};

export const Roles = {
  // Roles
  CentreAdmin: 'CENTRE_ADMIN_ROLE',
  CentreTutor: 'CENTRE_TUTOR_ROLE',
  CentreLearner: 'CENTRE_LEARNER_ROLE',
  CentreEditor: 'CENTRE_EDITOR_ROLE',
  CentreEQA: 'CENTRE_EQA_ROLE',
  CentreIQA: 'CENTRE_IQA_ROLE',
  SuperAdmin: 'SUPER_ADMIN_ROLE',
  SiteAdmin: 'SITE_ADMIN_ROLE',
  UndefinedCentre: 'UNDEFINED_CENTRE_ROLE',
  InvalidUser: 'INVALID_MEMBER_ROLE',
  Member: 'MEMBER_ROLE',
  Finance: 'FINANCE_ROLE',
  Author: 'AUTHOR_ROLE'
};

export const RoleNameMap = {
  CENTRE_ADMIN_ROLE: 'centre',
  CENTRE_TUTOR_ROLE: 'tutor',
  CENTRE_MANAGER_ROLE: 'manager',
  CENTRE_LEARNER_ROLE: 'learner',
  CENTRE_EQA_ROLE: 'eqa',
  CENTRE_IQA_ROLE: 'iqa',
  CENTRE_EDITOR_ROLE: 'editor',
  SUPER_ADMIN_ROLE: 'super_admin',
  SITE_ADMIN_ROLE: 'site_admin',
  FINANCE_ROLE: 'finance',
  EQA_ROLE: 'eqa',
  AUTHOR_ROLE: 'author',
  IQA_ROLE: 'iqa'
};

export default {
  FileUploadSizes,
  Roles,
  RoleNameMap
};
