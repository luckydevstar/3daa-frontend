import { createActions } from 'reduxsauce';

export const { Types, Creators } = createActions({
  appLogout: null,
  appStart: null,
  getConfigAttempt: null,
  getConfigFailure: null,
  getConfigSuccess: ['config'],
  jobsDisplayAll: null,
  sidebarFeature: ['feature'],
  sidebarPane: ['pane'],
  toggleAppLoading: ['status'],
  toggleSidebar: ['currentFeature'],
  hideSidebar: null,
  toggleProfileMenu: null,
  toggleWorkbookOpen: ['open'],
  toggleProfileMenuSectors: null,
  cloudinaryProgress: ['percent'],
  language: ['lang']
});
