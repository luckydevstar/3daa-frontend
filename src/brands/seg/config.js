const config = {
  api: {
    API_URL_PROD: 'https://api.wla.apppixies.com/api',
    API_URL_TEST: 'https://api.wla.apppixies.com/api',
    // API_URL_DEV: 'https://seg.api.dqual.co.uk/api',
    API_URL_DEV: 'https://api.wla.apppixies.com/api',
    API_URL_STAGING: 'https://api.wla.apppixies.com/api'
  },
  PUSHER_APP_ID: '7412a8cd399899be1f03',
  STRIPE_KEY: 'pk_test_evoVBj2oSJWld7GqdMhk3UzQ', //pk_test_AmDR6NAKbOpdoFUOB0oYdm5T
  INTERCOM_APP_ID: 'q8u05dcb',
  CLOUD_NAME: 'ncfe',

  AWS_ACCESS_KEY_ID: 'AKIAZMV5DVZQ5R2XHKGW',
  AWS_SECRET_ACCESS_KEY: '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',
  AWS_DEFAULT_REGION: 'eu-west-1',
  AWS_BUCKET: 'seg-testing',

  title: 'Skills and Educational Group',
  fulTitle: 'Skills and Educational Group',
  logoDesc: '',
  registeredAddress: '24 Canning Street, Edinburgh, EH3 8EG, Scotland',
  registeredCompany: 'registered in England with company number 548078',
  phoneNumber: '0131 272 2773',
  email: 'theslta@aol.com',
  website: 'www.wla.apppixies.com',
  tempBadge: 'Level 3',
  registrationFlow: '2',

  membershipBusinessMonthly: '17.00',
  membershipBusinessYearly: '200.00',
  membershipPersonal: '10.00',
  membershipCardView: 'horizontal', // 'vertical, horizontal

  rssNewsUrl: '',

  //store
  purchaseWithBilling: false,

  // view configs
  isSideQualificationProgress: true,
  uiIsBannerVideo: false,
  uiIsSidebar: true,
  uiAddingCustomer: false,
  uiIsSocialLogin: false,
  uiIsLanguageMenu: false,
  uiIsPersonalRegistration: false,

  primaryColor: '#043956'
};

export default config;
