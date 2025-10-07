const config = {
  api: {
    API_URL_PROD: 'https://www.dqual.co.uk/api',
    API_URL_TEST: 'https://tri.testing.api.dqual.co.uk/api',
    API_URL_DEV: 'https://tri.testing.api.dqual.co.uk/api',
    API_URL_STAGING: 'https://tri.staging.api.dqual.co.uk/api'
  },
  PUSHER_APP_ID: '7412a8cd399899be1f03',
  STRIPE_KEY: 'pk_test_evoVBj2oSJWld7GqdMhk3UzQ', //pk_test_AmDR6NAKbOpdoFUOB0oYdm5T
  INTERCOM_APP_ID: 'pan5c9yk',
  CLOUD_NAME: 'ncfe',

  title: 'Triumph',
  fulTitle: 'Triumph Motorcycles',
  logoDesc: '',
  registeredAddress: '24 Canning Street, Edinburgh, EH3 8EG, Scotland',
  registeredCompany: 'registered in England with company number 548078',
  phoneNumber: '0131 272 2773',
  email: 'theslta@aol.com',
  website: 'www.theslta.co.uk',
  tempBadge: 'Level 3',
  registrationFlow: '1',

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
  uiIsPersonalRegistration: true,

  primaryColor: '#825AA4'
};

export default config;
