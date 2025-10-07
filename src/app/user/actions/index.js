import { createActions } from 'reduxsauce';

export const { Types, Creators } = createActions({
  /**
   * Set active sector
   */
  setActiveSector: ['sector'],

  /**
   * Login
   */
  loginAttempt: ['user'],
  loginSuccess: ['loginData', 'user'],
  loginFailure: ['errorCode'],
  setUserToken: ['token'],

  loginAsMemberAttempt: ['memberId'],
  loginAsMemberSuccess: ['loginData'],
  loginAsMemberFailure: ['errorCode'],
  goBackToPrevToken: ['prevToken'],
  setAsMember: null,

  /**
   * Login with token
   */
  getUserByTokenAttempt: ['token', 'isNewSocialAccount'],
  getUserByTokenSuccess: ['user', 'isNewSocialAccount', 'token'],
  getUserByTokenFailure: ['errorCode'],

  /**
   * Login with FB
   */
  loginWithFbAttempt: ['token'],
  loginWithFbSuccess: ['loginData'],
  loginWithFbFailure: ['errorCode'],

  /**
   * Login with Google
   */
  loginWithGoogleAttempt: ['token'],
  loginWithGoogleSuccess: ['loginData'],
  loginWithGoogleFailure: ['errorCode'],

  /**
   * Register
   */
  registerAttempt: ['user'],
  registerSuccess: ['user'],
  registerFailure: ['errorCode'],

  /**
   * Send Verification Email
   */
  sendVerificationEmailAttempt: ['email'],
  sendVerificationEmailSuccess: null,
  sendVerificationEmailFailure: ['errorCode'],

  /**
   * Email
   */
  validateEmailAttempt: ['payload', 'formPromise'],
  validateEmailSuccess: null,
  validateEmailFailure: null,

  /**
   * Validate learner number
   */
  validateRegNumberAttempt: ['payload', 'formPromise'],
  validateRegNumberSuccess: null,
  validateRegNumberFailure: null,

  /**
   * Validate center number
   */
  validateCenterAttempt: ['payload', 'formPromise'],
  validateCenterSuccess: null,
  validateCenterFailure: null,

  /**
   * Update center
   */
  updateCentreAttempt: ['payload', 'id'],
  updateCentreSuccess: ['data'],
  updateCentreFailure: null,

  /**
   * Activate user attempt
   */
  verifyEmailAttempt: ['verification_key', 'acc_type'],
  verifyEmailSuccess: ['activationData', 'acc_type'],
  verifyEmailFailure: ['errorCode'],

  /**
   * Create profile
   */
  createPersonalProfileAttempt: ['data', 'acc_type'],

  /**
   * Create business profile
   */
  createBusinessProfileAttempt: ['user', 'data'],

  /**
   * Pay Membership
   */
  payMembershipAttempt: ['payload', 'token'],

  getAvailableMembershipsAttempt: null,
  getAvailableMembershipsSuccess: ['data'],
  getAvailableMembershipsFailure: ['errorCode'],

  membershipVoucherCheckAttempt: ['payload'],
  membershipVoucherCheckSuccess: ['data'],
  membershipVoucherCheckFailure: ['errorCode'],

  /**
   * Send learner email
   */
  sendLearnerEmailAttempt: ['email'],
  sendLearnerEmailSuccess: null,
  sendLearnerEmailFailure: ['errorCode'],

  /**
   * Send educator verification email
   */
  sendEducatorEmailAttempt: ['user'],
  sendEducatorEmailSuccess: ['user'],
  sendEducatorEmailFailure: ['errorCode'],

  /**
   * Verify educator email
   */
  verifyEducatorEmailAttempt: ['verification_key'],
  verifyEducatorEmailSuccess: ['activationCode'],
  verifyEducatorEmailFailure: ['errorCode'],

  /**
   * Verify admin email
   */
  verifyInvitationEmailAttempt: ['verification_key', 'account_type'],
  verifyInvitationEmailSuccess: ['data'],
  verifyInvitationEmailFailure: ['errorCode'],

  verifyLearnerInvitationEmailAttempt: ['verification_key'],
  verifyLearnerInvitationEmailSuccess: [],
  verifyLearnerInvitationEmailFailure: ['errorCode'],

  verifyTutorInvitationEmailAttempt: ['verification_key'],

  activationAttempt: ['userData', 'account_type'],
  activationSuccess: ['registerData'],
  activationFailure: ['errorCode'],

  setActivationData: ['activationData'],

  verifyAdminEmailAttempt: ['verification_key'],
  verifyAdminEmailSuccess: ['activationCode'],
  verifyAdminEmailFailure: ['errorCode'],

  /**
   * Verify centre member email
   */
  verifyCentreMemberEmailAttempt: ['verification_key'],
  verifyCentreMemberEmailSuccess: ['activationCode'],
  verifyCentreMemberEmailFailure: ['errorCode'],

  /**
   * Centre member registration
   */
  registerCentreMemberAttempt: ['userData'],
  registerCentreMemberSuccess: ['registerData'],
  registerCentreMemberFailure: ['errorCode'],

  /**
   * Educator registration
   */
  registerEducatorAttempt: ['userData'],
  registerEducatorSuccess: ['registerData'],
  registerEducatorFailure: ['errorCode'],

  /**
   * Admin registration
   */
  registerAdminAttempt: ['userData'],
  registerAdminSuccess: ['registerData'],
  registerAdminFailure: ['errorCode'],

  /**
   * Update profile
   */
  updateOwnProfileAttempt: ['payload', 'extraUserData'],
  updateOwnProfileSuccess: ['user'],
  updateOwnProfileFailure: ['errorCode'],

  /**
   * Logout
   */
  logout: ['noRedirect', 'noNotification'],

  /**
   * Reset password
   */
  passwordResetAttempt: ['email'],
  passwordResetSuccess: null,
  passwordResetFailure: null,
  updateResetPasswordAttempt: ['values'],
  updateResetPasswordSuccess: null,
  updateResetPasswordFailure: ['error'],

  /**
   * Update settings
   */
  updateSettingsAttempt: ['member_id', 'values'],
  updateSettingsSuccess: null,
  updateSettingsFailure: ['error'],
  updateLocalUser: ['user'],

  /**
   * Get centre user seats
   */
  getCentreSeatsAttempt: ['id'],
  getCentreSeatsSuccess: ['seats'],
  getCentreSeatsFailure: null,

  /**
   * Centre user profile
   */
  getCentreProfileAttempt: ['id'],
  getCentreProfileSuccess: ['profile'],
  getCentreProfileFailure: null,

  sendRegisterRequestFailure: ['err'],

  changeLoadingStatus: ['loading'],

  getAdminBalanceAttempt: ['params'],
  getAdminBalanceSuccess: ['data'],
  getAdminBalanceFailure: ['errorCode'],

  // Register other
  registerOtherAttempt: ['user'],
  registerOtherSuccess: ['user'],
  registerOtherFailure: ['errorCode'],

  verifyOtherEmailAttempt: ['params'],
  verifyOtherEmailSuccess: null,
  verifyOtherEmailFailure: null,

  validateUlnAttempt: ['params'],
  validateUlnSuccess: ['uln', 'lastname'],
  validateUlnFailure: ['err'],

  setProfileWithUlnAttempt: ['user'],
  setProfileWithUlnSuccess: ['user'],
  setProfileWithUlnFailure: null,

  resendVerificationEmailAttempt: ['email'],
  resendVerificationEmailSuccess: null,
  resendVerificationEmailFailure: ['err'],

  // Profile

  updateProfileAttempt: ['params'],
  updateProfileSuccess: null,
  updateProfileFailure: ['err']
});
