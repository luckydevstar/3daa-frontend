import { Types } from 'app/core/actions';
import Immutable from 'seamless-immutable';
import SidebarFeatures from 'app/core/constants';
import Messaging from 'app/messaging';
import { createReducer } from 'reduxsauce';

export const INITIAL_STATE = Immutable({
  profileMenuOpen: false,
  profileMenuSectorsExpanded: false,
  sidebarOpen: false,
  workbookOpen: false,
  sidebarFeature: SidebarFeatures.MESSAGING,
  sidebarPane: Messaging.constants.CHATS,
  appLoading: true,
  productName: 'Apprentice 360',
  cloudinaryProgress: 0,
  lang: 'en'
});

const toggleProfileMenu = state =>
  state.merge({
    profileMenuOpen: !state.profileMenuOpen
  });

const toggleWorkbookOpen = (state, { open }) =>
  state.merge({
    workbookOpen: open
  });

const toggleProfileMenuSectors = state =>
  state.merge({
    profileMenuSectorsExpanded: !state.profileMenuSectorsExpanded
  });

const toggleSidebar = state => state.merge({ sidebarOpen: !state.sidebarOpen });

const hideSidebar = state => state.merge({ sidebarOpen: false });

const sidebarFeature = (state, { feature }) =>
  state.merge({ sidebarFeature: feature });

const sidebarPane = (state, { pane }) => state.merge({ sidebarPane: pane });

const toggleAppLoading = (state, { status }) =>
  state.merge({ appLoading: status });

const cloudinaryProgress = (state, { percent }) =>
  state.merge({ cloudinaryProgress: percent });

const language = (state, { lang }) => state.merge({ lang });

// map our types to our handlers
const ACTION_HANDLERS = {
  [Types.TOGGLE_SIDEBAR]: toggleSidebar,
  [Types.HIDE_SIDEBAR]: hideSidebar,
  [Types.TOGGLE_PROFILE_MENU]: toggleProfileMenu,
  [Types.TOGGLE_WORKBOOK_OPEN]: toggleWorkbookOpen,
  [Types.TOGGLE_PROFILE_MENU_SECTORS]: toggleProfileMenuSectors,
  [Types.SIDEBAR_FEATURE]: sidebarFeature,
  [Types.SIDEBAR_PANE]: sidebarPane,
  [Types.TOGGLE_APP_LOADING]: toggleAppLoading,
  [Types.CLOUDINARY_PROGRESS]: cloudinaryProgress,
  [Types.LANGUAGE]: language
};

export default createReducer(INITIAL_STATE, ACTION_HANDLERS);
