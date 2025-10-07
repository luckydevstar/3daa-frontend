const config = {
  api: {
    API_URL_PROD: 'https://www.dqual.co.uk/api',
    API_URL_TEST: 'https://testing.api.slta.dqual.co.uk/api',
    API_URL_DEV: 'https://testing.api.slta.dqual.co.uk/api',
    API_URL_STAGING: 'https://testing.api.slta.dqual.co.uk/api'
  },
  PUSHER_APP_ID: '7412a8cd399899be1f03',
  STRIPE_KEY: 'pk_test_AmDR6NAKbOpdoFUOB0oYdm5T',
  INTERCOM_APP_ID: 'cgcz912x',
  CLOUD_NAME: 'the-slta',

  title: 'SLTA',
  fulTitle: 'SLTA Excel Limited',
  logoDesc: '',
  registeredAddress: '24 Canning Street, Edinburgh, EH3 8EG, Scotland',
  registeredCompany: 'registered in England with company number 548078',
  phoneNumber: '0131 272 2773',
  email: 'theslta@aol.com',
  website: 'www.theslta.co.uk',
  tempBadge: 'SCPLH',
  registrationFlow: '1',

  membershipBusinessMonthly: '17.00',
  membershipBusinessYearly: '200.00',
  membershipPersonal: '10.00',

  rssNewsUrl: 'http://slta.bd.agency/feed/',

  // view configs
  isSideQualificationProgress: true,
  uiIsBannerVideo: true,
  uiIsSidebar: true,
  uiAddingCustomer: false,
  uiIsSocialLogin: true,
  uiIsLanguageMenu: true,
  uiIsPersonalRegistration: true,

  primaryColor: '#00a287'
};

export default config;
