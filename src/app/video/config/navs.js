import { Roles } from 'app/core/config/constants';

const { SiteAdmin, SuperAdmin } = Roles;

export const navTabs = [
  {
    key: 'video-content-manager',
    text: 'content_manager',
    url: '/videos/content-manager',
    icon: 'fa-gear',
    right: true,
    roles: [SiteAdmin, SuperAdmin]
  }
];

export const navMenus = [
  {
    key: 'videos-featured',
    text: 'featured',
    url: '/videos'
  },
  {
    key: 'video-favourites',
    text: 'favourites',
    url: '/videos/favourites'
  },
  {
    key: 'video-history',
    text: 'History',
    url: '/videos/history'
  }
];
