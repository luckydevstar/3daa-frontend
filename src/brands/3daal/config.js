console.log('>>>>>>>>>>>>>>>>>', process.env.PUSHER_APP_ID);

const config = {
  api: {
    API_URL_PROD: 'http://api.testing.3darchitecturalacademy.com/api',
    API_URL_TEST: 'http://api.testing.3darchitecturalacademy.com/api',
    API_URL_DEV: 'https://api.testing.3darchitecturalacademy.com/api',
    API_URL_STAGING: 'http://api.testing.3darchitecturalacademy.com/api'
  },
  // api: {
  //   API_URL_PROD: 'https://api.3daa.apppixies.local/api',
  //   API_URL_TEST: 'https://api.3daa.apppixies.local/api',
  //   API_URL_DEV: 'https://api.3daa.apppixies.local/api',
  //   API_URL_STAGING: 'https://api.3daa.apppixies.local/api',
  // },

  PUSHER_APP_ID: process.env.PUSHER_APP_ID,
  STRIPE_KEY: process.env.STRIPE_KEY, //pk_test_AmDR6NAKbOpdoFUOB0oYdm5T
  INTERCOM_APP_ID: process.env.INTERCOM_APP_ID,
  CLOUD_NAME: process.env.CLOUD_NAME,

  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  AWS_DEFAULT_REGION: process.env.AWS_DEFAULT_REGION,
  AWS_BUCKET: process.env.AWS_BUCKET,

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
