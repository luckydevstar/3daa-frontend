const config = {
  api: {
    API_URL_PROD: 'https://www.wla.dqual.co.uk/api',
    API_URL_TEST: 'https://wla.testing.api.dqual.co.uk/api',
    API_URL_DEV: 'https://wla.testing.api.dqual.co.uk/api',
    API_URL_STAGING: 'https://wla.testing.api.dqual.co.uk/api'
  },
  PUSHER_APP_ID: '7412a8cd399899be1f03',
  STRIPE_KEY: 'pk_test_RUPwwxDF9AIubKU5dGQJ2V5x',
  INTERCOM_APP_ID: 'k4pvuwth',
  CLOUD_NAME: 'white-label-applications-limited',

  AWS_ACCESS_KEY_ID: 'AKIAZMV5DVZQ5R2XHKGW',
  AWS_SECRET_ACCESS_KEY: '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',
  AWS_DEFAULT_REGION: 'eu-west-1',
  AWS_BUCKET: 'wla-testing',

  title: 'WLA',
  fulTitle: 'White Label Applications',
  logoDesc: '',
  registeredAddress: '24 Canning Street, Edinburgh, EH3 8EG, Scotland',
  registeredCompany: 'registered in England with company number 548078',
  phoneNumber: '0131 272 2773',
  email: 'wla@aol.com',
  website: 'www.whitelabelapplications.co.uk',
  tempBadge: 'WLA',
  registrationFlow: '1',

  membershipBusinessMonthly: '17.00',
  membershipBusinessYearly: '200.00',
  membershipPersonal: '10.00',
  membershipCardView: 'horizontal', // 'vertical, horizontal

  rssNewsUrl: 'http://slta.bd.agency/feed/',

  //store
  purchaseWithBilling: false,

  // view configs
  isSideQualificationProgress: true,
  uiIsBannerVideo: false,
  uiIsSidebar: true,
  uiAddingCustomer: true,
  uiIsSocialLogin: true,
  uiIsLanguageMenu: true,
  uiIsPersonalRegistration: true,

  primaryColor: '#029c86'
};

export default config;
