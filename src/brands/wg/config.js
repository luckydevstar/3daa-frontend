const config = {
  api: {
    API_URL_PROD: 'https://www.dqual.co.uk/api',
    API_URL_TEST: 'https://wg.testing.api.dqual.co.uk/api',
    API_URL_DEV: 'https://wg.testing.api.dqual.co.uk/api',
    API_URL_STAGING: 'https://wg.testing.api.dqual.co.uk/api'
  },
  PUSHER_APP_ID: '7412a8cd399899be1f03',
  STRIPE_KEY: 'pk_test_RUPwwxDF9AIubKU5dGQJ2V5x',
  INTERCOM_APP_ID: 'bll6ywbl',
  CLOUD_NAME: 'chelsea-fc',

  title: 'WG',
  fulTitle: 'The Wine Guild of the United Kingdom',
  logoDesc: 'Wine Guild',
  registeredAddress: '91 University Street, Belfast BT7 1HP, Northern Ireland',
  registeredCompany: ' ',
  phoneNumber: '028 9032 7578',
  email: 'enquiries@hospitalityulster.org',
  website: 'www.hospitalityulster.org',
  tempBadge: 'NIPB',
  registrationFlow: '1',

  membershipBusinessMonthly: '27.00',
  membershipBusinessYearly: '295.00',
  membershipPersonal: '10.00',

  rssNewsUrl: 'http://slta.bd.agency/feed/',

  // view configs
  isSideQualificationProgress: true,
  uiIsBannerVideo: false,
  uiIsSidebar: true,
  uiAddingCustomer: false,
  uiIsSocialLogin: true,
  uiIsLanguageMenu: true,
  uiIsPersonalRegistration: true,

  primaryColor: '#A6685D'
};

export default config;
