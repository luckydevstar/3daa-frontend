const config = {
  // api: {
  //   API_URL_PROD: 'http://api.testing.3darchitecturalacademy.com/api',
  //   API_URL_TEST: 'http://api.testing.3darchitecturalacademy.com/api',
  //   API_URL_DEV: 'http://api.testing.3darchitecturalacademy.com/api',
  //   API_URL_STAGING: 'http://api.testing.3darchitecturalacademy.com/api',
  // },
  api: {
    API_URL_PROD: 'https://api.3daa.apppixies.local/api',
    API_URL_TEST: 'https://api.3daa.apppixies.local/api',
    API_URL_DEV: 'https://api.3daa.apppixies.local/api',
    API_URL_STAGING: 'https://api.3daa.apppixies.local/api',
  },
  
  PUSHER_APP_ID: '7412a8cd399899be1f03',
  STRIPE_KEY: 'pk_test_evoVBj2oSJWld7GqdMhk3UzQ', //pk_test_AmDR6NAKbOpdoFUOB0oYdm5T
  INTERCOM_APP_ID: 'q8u05dcb',
  CLOUD_NAME: 'ncfe',

  AWS_ACCESS_KEY_ID: 'AKIA6DARUYOM2K65VXC4',
  AWS_SECRET_ACCESS_KEY: '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',
  AWS_DEFAULT_REGION: 'eu-west-2',
  AWS_BUCKET: '3daa-static',

  title: '3DAA APX',
  fulTitle: '3D Architectural Academy APX',
  logoDesc: '',
  registeredAddress: '3DAA City, Street Address, Building',
  registeredCompany: '3DAA REGISTERED COMPANY',
  phoneNumber: '0123 456 789',
  email: 'amatiyenko@gmail.com',
  website: 'localhost:3000',
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

  primaryColor: '#488AFF'
};

export default config;
