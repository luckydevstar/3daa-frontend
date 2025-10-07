/* global __DEV__, __TEST__, window */
import apisauce from 'apisauce';
import { sprintf } from 'sprintf-js';
import ENDPOINT from '../config/endpoints';
import config from 'brand/config';

const env = () => (__DEV__ ? 'test' : 'staging');

const baseURL = () => {
  if (__DEV__) {
    return ENDPOINT.API_URL_DEV;
  } else if (__TEST__) {
    return ENDPOINT.API_URL_TEST;
  } else if (__STAGING__) {
    return ENDPOINT.API_URL_STAGING;
  }
  return ENDPOINT.API_URL_PROD;
};

const wla = (baseURL = ENDPOINT.API_URL_PROD) => {
  // Define base URL
  if (__DEV__) {
    baseURL = ENDPOINT.API_URL_DEV;
  } else if (__TEST__) {
    baseURL = ENDPOINT.API_URL_TEST;
  } else if (__STAGING__) {
    baseURL = ENDPOINT.API_URL_STAGING;
  }

  /**
   * Define API headers
   */
  const api = apisauce.create({
    baseURL,
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/json'
    },
    timeout: 300000
  });

  const apiFormWithUrlEncoded = apisauce.create({
    baseURL,
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    timeout: 10000
  });

  const cloudinaryAPI = apisauce.create({
    baseURL: 'https://api.cloudinary.com/v1_1/' + config.CLOUD_NAME + '/',
    headers: { 'X-Requested-With': 'XMLHttpRequest' }
  });
  /**
   * Export callable API functions
   */
  return {
    // GLOBAL
    setAuthToken: token => {
      console.log(`Token ${token}`);
      return api.setHeader('X-Auth', token || '');
    },
    getConfig: () => api.get(ENDPOINT.CONFIG),

    // ASSESSMENT
    getHoursMemberActivity: member_id =>
      api.get(
        sprintf(ENDPOINT.ASSESSMENT_HOURS_MEMEBER_ACTIVITY, { member_id })
      ),
    getHoursMemberActivityQualification: (member_id, qualification_id) =>
      api.get(
        sprintf(ENDPOINT.ASSESSMENT_HOURS_MEMEBER_ACTIVITY_QUALIFICATION, {
          member_id,
          qualification_id
        })
      ),
    getElearningHours: (centre_id, params) =>
      api.get(sprintf(ENDPOINT.ELEARNING_HOURS, { centre_id }), params),
    getAssessmentGuidance: params =>
      api.get(ENDPOINT.ASSESSMENT_GUIDANCE, params),
    getAssessmentMemberQualification: (member_id, qualification_id, params) =>
      api.get(
        sprintf(ENDPOINT.ASSESSMENT_MEMBER_QUALIFICATION, {
          member_id,
          qualification_id
        })
      ),
    getAssessmentMemberUnit: (member_id, qualification_id, unit_id) =>
      api.get(
        sprintf(ENDPOINT.ASSESSMENT_MEMBER_UNIT, {
          member_id,
          qualification_id,
          unit_id
        })
      ),
    getAssessmentMemberEvidences: (member_id, qualification_id, params) =>
      api.get(
        sprintf(ENDPOINT.ASSESSMENT_MEMBER_EVIDENCES, {
          member_id,
          qualification_id
        })
      ),
    getAssessmentMemberEvidenceDetails: (
      member_id,
      qualification_id,
      evidence_id
    ) =>
      api.get(
        sprintf(ENDPOINT.ASSESSMENT_MEMBER_EVIDENCE_DETAILS, {
          member_id,
          qualification_id,
          evidence_id
        })
      ),
    getAssessmentAllCriterias: (member_id, qualification_id) =>
      api.get(
        sprintf(ENDPOINT.ASSESSMENT_CRITERIAS, {
          member_id,
          qualification_id
        })
      ),
    postAssessmentEvidence: (
      member_id,
      qualification_id,
      onUploadProgress,
      payload
    ) =>
      api.post(
        sprintf(ENDPOINT.ASSESSMENT_MEMBER_EVIDENCES, {
          member_id,
          qualification_id
        }),
        payload,
        {
          timeout: 150000,
          onUploadProgress
        }
      ),
    postAssessmentUpdateEvidence: (
      member_id,
      qualification_id,
      evidence_id,
      payload
    ) =>
      api.post(
        sprintf(ENDPOINT.ASSESSMENT_MEMBER_EVIDENCE_DETAILS, {
          member_id,
          qualification_id,
          evidence_id
        }),
        payload
      ),
    deleteAssessmentEvidence: (member_id, qualification_id, evidence_id) =>
      api.delete(
        sprintf(ENDPOINT.ASSESSMENT_MEMBER_EVIDENCE_DETAILS, {
          member_id,
          qualification_id,
          evidence_id
        })
      ),
    getAssessmentMediaComments: media_id =>
      api.get(sprintf(ENDPOINT.ASSESSMENT_MEDIA_COMMENTS, { media_id })),
    postAssessmentMediaComment: (media_id, params) =>
      api.post(
        sprintf(ENDPOINT.ASSESSMENT_MEDIA_COMMENTS, { media_id }),
        params
      ),

    postAssessmentEvidenceComment: (
      member_id,
      qualification_id,
      evidence_id,
      params
    ) =>
      api.post(
        sprintf(ENDPOINT.ASSESSMENT_EVIDENCE_ADD_COMMENT, {
          member_id,
          qualification_id,
          evidence_id
        }),
        params
      ),

    // CENTRE STUFF
    getAdminBalance: params => api.get(ENDPOINT.ADMIN_BALANCE),
    getAdminCentre: params => api.get(ENDPOINT.ADMIN_CENTRE, params),

    getCentreSeats: (id, params) =>
      api.get(sprintf(ENDPOINT.CENTRE_SEATS, { id }), {
        limit: '10',
        ...params
      }),

    getCentreMembers: (id, params) =>
      api.get(sprintf(ENDPOINT.CENTRE_MEMBERS, { id }), params),

    getCentreLearners: (id, params) =>
      api.get(sprintf(ENDPOINT.CENTRE_LEARNERS, { id }), params),

    getCentreTutorMembers: (centre_id, member_id, params) =>
      api.get(
        sprintf(ENDPOINT.CENTRE_TUTOR_LEARNERS, { centre_id, member_id }),
        params
      ),

    getCentreProfile: id => api.get(sprintf(ENDPOINT.CENTRE, { id })),

    getCentreQualifications: (centre_id, sector_id) =>
      api.get(sprintf(ENDPOINT.CENTRE_QUALIFICATIONS, { centre_id }), {
        sector_id
      }),

    getCentreQualification: (centre_id, qualification_id) =>
      api.get(
        sprintf(ENDPOINT.CENTRE_QUALIFICATION, { centre_id, qualification_id })
      ),
    postQualificationPathway: (centre_id, qualification_id, payload) =>
      api.post(
        sprintf(ENDPOINT.CENTRE_QUALIFICATION_PATHWAY, {
          centre_id,
          qualification_id
        }),
        payload
      ),
    getGroups: params => api.get(ENDPOINT.GROUPS, params),
    getCentreGroups: (id, params) =>
      api.get(sprintf(ENDPOINT.CENTRE_GROUPS, { id }), params),
    getCentreGroup: (id, group_id, params) =>
      api.get(sprintf(ENDPOINT.CENTRE_GROUP, { group_id }), params),
    // sendCentreInvite: (id, params) =>
    //   api.post(sprintf(ENDPOINT.CENTRE_INVITE, { id }), params),
    sendCentreInvite: params => api.post(ENDPOINT.CENTRE_INVITE, params),
    sendCentreMemberInvite: params =>
      api.post(ENDPOINT.CENTRE_MEMBER_INVITE, params),
    createCentre: params => api.post(ENDPOINT.CENTRE_ALL, params),
    createCentreGroup: (id, params) =>
      api.post(sprintf(ENDPOINT.CENTRE_GROUPS, { id }), params),
    updateCentreGroup: (id, group_id, params) =>
      api.post(sprintf(ENDPOINT.CENTRE_GROUP, { group_id }), params),
    deleteCentreGroup: (id, group_id) =>
      api.delete(sprintf(ENDPOINT.CENTRE_GROUP, { group_id })),
    postCentreQualification: (centre_id, qualification_id, params) =>
      api.post(
        sprintf(ENDPOINT.CENTRE_QUALIFICATION, { centre_id, qualification_id }),
        params
      ),
    inviteCentreMember: params =>
      api.post(ENDPOINT.CENTRE_INVITE_MEMBER, params),

    // LOGIN & REGISTRATION
    login: user => api.post(ENDPOINT.MEMBER_SIGNIN, user),
    logout: () => api.post(ENDPOINT.MEMBER_SIGNOUT),
    loginAsMember: member_id =>
      api.post(sprintf(ENDPOINT.MEMBER_AS_SIGNIN, { member_id })),
    validateCenter: payload => api.post(ENDPOINT.CENTRE_VALIDATE, payload),
    updateCentre: (payload, id) =>
      api.post(sprintf(ENDPOINT.CENTRE, { id }), payload),
    verifyAdminEmail: ({ verification_key }) =>
      api.get(sprintf(ENDPOINT.ADMIN_MEMBER_VERIFY, { verification_key })),
    activateAdmin: payload =>
      api.post(ENDPOINT.ADMIN_MEMBER_ACTIVATE, payload, { timeout: 30000 }),
    registerAdmin: payload => api.post(ENDPOINT.ADMIN_MEMBER_ACTIVATE, payload),
    sendEducatorEmail: payload =>
      api.post(ENDPOINT.CENTRE_VERIFY_EMAIL, payload, { timeout: 30000 }),
    registerEducator: payload => api.post(ENDPOINT.CENTRE_ACTIVATE, payload),
    reigsterOther: user => api.post(ENDPOINT.REGISTER_OTHER, user),
    setProfileWithUln: user => api.post(ENDPOINT.SET_PROFILE_WITH_ULN, user),
    updateProfileOther: profile =>
      api.post(
        sprintf(ENDPOINT.MEMBER_OTHER, { id: profile.member_id }),
        profile.values
      ),
    updateProfileOtherV1: profile =>
      api.post(
        sprintf(ENDPOINT.MEMBER_OTHER_V1, { id: profile.member_id }),
        profile.values
      ),
    verifyOtherEmail: payload => api.post(ENDPOINT.VERIFY_OTHER_EMAIL, payload),
    validateUln: params => api.post(ENDPOINT.VALIDATE_ULN, params),
    sendVerificationEmail: params =>
      api.post(ENDPOINT.SEND_VERIFICATION_EMAIL, params),
    verifyEducatorEmail: payload => api.post(ENDPOINT.CENTRE_VERIFY, payload),
    verifyCentreMemberEmail: ({ verification_key }) =>
      api.get(sprintf(ENDPOINT.CENTRE_MEMBER_VERIFY, { verification_key })),
    activateCentre: payload =>
      api.post(ENDPOINT.CENTRE_ACTIVATE, payload, { timeout: 30000 }),
    activateCentreMember: payload =>
      api.post(ENDPOINT.CENTRE_MEMBER_ACTIVATE, payload, { timeout: 30000 }),
    registerCentreMember: payload =>
      api.post(ENDPOINT.CENTRE_MEMBER_ACTIVATE, payload),
    registerLearner: user => api.post(ENDPOINT.MEMBER_SIGNUP, user),
    payMembership: data => api.post(ENDPOINT.MEMBER_PAY, data),
    getAvailableMemberships: () => api.get(ENDPOINT.MEMBERSHIP), // to get available memberships
    membershipVoucherCheck: payload =>
      api.post(ENDPOINT.MEMBERSHIP_VOUCHER_CHECK, payload, { timeout: 150000 }),
    validateEmail: payload => api.post(ENDPOINT.VALIDATE_EMAIL, payload),
    sendLearnerEmail: payload =>
      api.post(ENDPOINT.MEMBER_SEND_VERFICATION_EMAIL, payload),
    verifyLearnerEmail: payload =>
      api.post(ENDPOINT.MEMBER_VERIFY_EMAIL, payload),
    validateRegNumber: payload =>
      api.post(ENDPOINT.VALIDATE_REGISTRATION_NUMBER, payload),
    loginWithFb: token => api.post(ENDPOINT.MEMBER_AUTH_FB, { token }),
    loginWithGoogle: token => api.post(ENDPOINT.MEMBER_AUTH_GOOGLE, { token }),
    passwordReset: email => api.post(ENDPOINT.MEMBER_FORGOT_PASSWORD, email),
    updateResetPassword: values =>
      api.post(ENDPOINT.MEMBER_RESET_PASSWORD, values),
    createPersonalProfile: payload =>
      api.post(ENDPOINT.MEMBER_CREATE_PROFILE, payload),

    // SECTORS
    getAllSectors: () => api.get(ENDPOINT.SECTORS_ALL),
    getSectors: () => api.get(ENDPOINT.SECTORS),
    getSector: id => api.get(sprintf(ENDPOINT.SECTOR, { id })),
    createSector: payload => {
      console.log(payload);
      return api.post(ENDPOINT.SECTORS, payload, { timeout: 150000 }); //, { timeout: 15000 }
    },
    updateSector: (payload, id) => {
      return api.post(sprintf(ENDPOINT.SECTOR, { id }), payload, {
        timeout: 150000
      });
    },
    deleteSector: id => {
      return api.delete(sprintf(ENDPOINT.SECTOR, { id }));
    },

    // QUALIFICATIONS
    getAllQualifications: sector_id =>
      api.get(sprintf(ENDPOINT.SECTOR_ALL_QUALIFICATIONS, { sector_id })),

    getQualifications: (
      sector_id // for active qualifications only
    ) => api.get(sprintf(ENDPOINT.SECTOR_QUALIFICATIONS, { sector_id })),

    getQualificationTypes: payload =>
      api.get(ENDPOINT.QUALIFICATION_TYPES, payload),

    postQualificationMapping: (centre_id, qualification_id, params) =>
      api.post(
        sprintf(ENDPOINT.CENTRE_QUALIFICATION, { centre_id, qualification_id }),
        params
      ),

    getQualification: qualification_id => {
      return api.get(sprintf(ENDPOINT.QUALIFICATION, { qualification_id }));
    },

    getLearningQualification: qualification_id => {
      return api.get(
        sprintf(ENDPOINT.LEARNING_QUALIFICATION, { qualification_id })
      );
    },

    getInActiveLearningQualification: qualification_id =>
      api.get(
        sprintf(ENDPOINT.LEARNING_QUALIFICATION_INACTIVE, { qualification_id })
      ),

    deleteQualification: qualification_id => {
      return api.delete(
        ENDPOINT.LEARNING_QUALIFICATIONS + '/' + qualification_id
      );
    },

    postQualification: payload => {
      return api.post(ENDPOINT.LEARNING_QUALIFICATIONS, payload, {
        timeout: 150000
      }); //, { timeout: 15000 }
    },
    searchQualifications: payload => api.get(ENDPOINT.QUALIFICATIONS, payload),

    // HACK SECOND PARAMETER HARCCOED FOR NOW
    updateQualification: (payload, qualification_id) =>
      api.post(
        sprintf(ENDPOINT.LEARNING_QUALIFICATION, { qualification_id }),
        payload,
        { timeout: 150000 }
      ),

    // Learning Unit
    getLearningUnits: params =>
      api.get(
        sprintf(ENDPOINT.LEARNING_UNITS_ALL, { now: Date.now() }),
        params
      ),

    getAllUnits: () => api.get(ENDPOINT.UNITS_ALL_GET),

    getLearningUnit: (qualification_id, unit_id) =>
      api.get(
        sprintf(ENDPOINT.LEARNING_UNIT_GET, { unit_id }) +
          '?qualification_id=' +
          qualification_id
      ),

    createLearningUnit: payload => {
      return api.post(ENDPOINT.LEARNING_UNITS, payload, { timeout: 150000 }); //, { timeout: 15000 }
    },

    updateLearningUnit: (payload, unit_id) => {
      return api.post(ENDPOINT.LEARNING_UNITS + '/' + unit_id, payload, {
        timeout: 150000
      });
    },

    deleteLearningUnit: unit_id => {
      return api.delete(ENDPOINT.LEARNING_UNITS + '/' + unit_id);
    },

    changeLearningUnitStatus: (status, unit_id) => {
      return api.put(
        ENDPOINT.LEARNING_UNITS + '/' + unit_id + (status ? '/lock' : '/unlock')
      );
    },

    getMemberQualifications: (member_id, sector_id) =>
      api.get(sprintf(ENDPOINT.MEMBER_QUALIFICATION, { member_id }), {
        sector_id
      }),

    getLearningHours: id => api.get(`/centre/${id}/hours/month`),
    getLearnerLearningHours: id => api.get(`/hours/${id}/month`),
    getGroupLearningHours: (id, group_id) =>
      api.get(`/centre/${id}/group/${group_id}/hours/month`),
    getGroupPopularHours: (id, group_id) =>
      api.get(`/centre/${id}/group/${group_id}/hours/study_time`),
    getGroupLoginThisWeekHours: (id, group_id) =>
      api.get(`/centre/${id}/group/${group_id}/hours/logins`),

    // MEMBER & PROFILE
    getMember: (id, params) =>
      api.get(sprintf(ENDPOINT.MEMBER, { id }), params),
    getUser: () => {
      return api.get(ENDPOINT.MEMBER_ROOT);
    },
    getUserPermissions: id =>
      api.get(sprintf(ENDPOINT.MEMBER_PERMISSIONS, { id })),
    getAllMembers: params =>
      api.get(sprintf(ENDPOINT.MEMBER_ALL, Date.now()), params),
    getAllMembersV1: (params, centre_id) =>
      api.get(sprintf(ENDPOINT.MEMBER_ALL_v1, { centre_id }), params),
    getMemberBio: member_id =>
      api.get(sprintf(ENDPOINT.MEMBER_BIO, { member_id })),
    getMemberPhotos: id => api.get(sprintf(ENDPOINT.MEMBER_PHOTO, { id })),
    getMemberBadge: id => api.get(sprintf(ENDPOINT.MEMBER_BADGE, { id })),
    getMemberCv: id => api.get(sprintf(ENDPOINT.MEMBER_CV, { id })),
    getMemberCommunity: () => api.get(ENDPOINT.MEMBER_COMMUNITY),
    getMemberMutualConnections: id =>
      api.get(sprintf(ENDPOINT.MEMBER_CONNECTION, { id })),
    getMemberMedia: id => api.get(sprintf(ENDPOINT.MEMBER_MEDIA, { id })),
    getMemberVideos: id => api.get(sprintf(ENDPOINT.MEMBER_VIDEO, { id })),
    getMemberReference: id =>
      api.get(sprintf(ENDPOINT.MEMBER_REFERENCE, { id })),
    postMemberBio: ({ member_id, form }) =>
      api.post(sprintf(ENDPOINT.MEMBER_BIO, { member_id }), form),
    postMemberPhoto: data =>
      api.post(
        sprintf(ENDPOINT.MEMBER_PHOTO, { id: data.member_id }),
        data.payload,
        {
          timeout: 150000,
          onUploadProgress: data.onUploadProgress
        }
      ),
    postMemberVideo: data =>
      api.post(
        sprintf(ENDPOINT.MEMBER_VIDEO, { id: data.member_id }),
        data.payload,
        {
          timeout: 150000,
          onUploadProgress: data.onUploadProgress
        }
      ),

    editMemberPhoto: data =>
      api.put(
        sprintf(ENDPOINT.MEMBER_PHOTO_ID, {
          id: data.member_id,
          media_id: data.media_id
        }),
        data.params
      ),
    editMemberVideo: data =>
      api.put(
        sprintf(ENDPOINT.MEMBER_VIDEO_ID, {
          id: data.member_id,
          media_id: data.media_id
        }),
        data.params
      ),
    editMemberBio: data =>
      api.post(
        sprintf(ENDPOINT.MEMBER_BIO_ID, {
          member_id: data.member_id,
          bio_id: data.member_bio_id
        }),
        data.form
      ),
    deleteMemberBio: data =>
      api.delete(
        sprintf(ENDPOINT.MEMBER_BIO_ID, {
          member_id: data.member_id,
          bio_id: data.member_bio_id
        })
      ),
    deleteMemberPhoto: data =>
      api.delete(
        sprintf(ENDPOINT.MEMBER_PHOTO_ID, {
          id: data.member_id,
          media_id: data.media_id
        })
      ),
    deleteMemberVideo: data =>
      api.delete(
        sprintf(ENDPOINT.MEMBER_VIDEO_ID, {
          id: data.member_id,
          media_id: data.media_id
        })
      ),
    deleteMemberMedia: (member_id, media_id) =>
      api.delete(
        sprintf(ENDPOINT.MEMBER_MEDIA_DELETE, { member_id, media_id })
      ),
    updateOwnProfile: profile => api.post(ENDPOINT.MEMBER_ME, profile),
    updateProfile: profile =>
      api.post(
        sprintf(ENDPOINT.MEMBER, { id: profile.member_id }),
        profile.values
      ),
    deleteMember: member_id =>
      api.delete(sprintf(ENDPOINT.MEMBER, { id: member_id })),

    deleteMemberFromGroup: (groupID, member_id) =>
      api.delete(`centre/groups/${groupID}/members/${member_id}`),

    suspendMember: member_id => api.put(`member/${member_id}/suspend`),

    // COMMUNITY
    getAllCentres: (params, userRole) => {
      if (['SUPER_ADMIN_ROLE', 'FINANCE_ROLE'].indexOf(userRole) >= 0) {
        return api.get(ENDPOINT.CENTRE_ALL, params);
      } else {
        return api.get(ENDPOINT.MEMBER_ME);
      }
    },
    getAuthorTasks: (author_id, params) =>
      api.get(sprintf(ENDPOINT.COMMUNITY_AUTHOR_TASKS, { author_id }), params),
    createAuthorTask: params =>
      api.post(sprintf(ENDPOINT.COMMUNITY_AUTHOR_TASKS_CREATE), params),
    updateAuthorTask: (params, task_id) =>
      api.put(
        sprintf(ENDPOINT.COMMUNITY_AUTHOR_TASKS_UPDATE, { task_id }),
        params
      ),
    uploadAuthorFile: params =>
      api.post(ENDPOINT.COMMUNITY_AUTHOR_FILE_UPLOAD, params),
    getAuthorFiles: params => api.get(ENDPOINT.COMMUNITY_AUTHOR_FILES, params),
    getAuthorActivities: () =>
      api.get(ENDPOINT.COMMUNITY_AUTHOR_TASKS_ACTIVITIES),
    getAuthorActivity: activity_id =>
      api.get(
        sprintf(ENDPOINT.COMMUNITY_AUTHOR_TASKS_ACTIVITY, { activity_id })
      ),
    getCentreCommunity: (id, params) =>
      api.get(sprintf(ENDPOINT.CENTRE_MEMBERS, { id }), params),
    getCommunityUsersAwaiting: params =>
      api.get(ENDPOINT.COMMUNITY_AWAITS, params),
    getCentreCommunityOldApi: (id, params) =>
      api.get(sprintf(ENDPOINT.CENTRE_COMMUNITY, { id }), params),
    getCentreCommunitySeats: (id, params) =>
      api.get(sprintf(ENDPOINT.CENTRE_SEATS, { id }), params),
    sendAdminInvite: params =>
      api.post(ENDPOINT.ADMIN_MEMBER_INVITE, params, { timeout: 150000 }),

    assignEQAToCentre: (centre_id, params) =>
      api.post(`/centre/${centre_id}/assign_eqa_to_centre`, {
        member_id: params
      }),
    assignCentreToEQA: (member_id, params) =>
      api.post(`/member/${member_id}/assign_centre_to_eqa`, {
        centre_id: params
      }),
    getCentreEqa: params => api.get('/centre', params),
    getCentresAssignedToEqa: memberId =>
      api.get(`/centre/${memberId}/list_eqa_to_centre_invitations`),

    // CUSTOMER

    getCustomers: () => api.get(ENDPOINT.PLATFORM_CUSTOMERS),
    deleteCustomer: platform_customer_id =>
      api.delete(
        sprintf(ENDPOINT.PLATFORM_CUSTOMER_DELETE, { platform_customer_id })
      ),
    createCustomer: params =>
      api.post(ENDPOINT.PLATFORM_CUSTOMERS_CREATE, params),
    editCustomer: (params, platform_customer_id) =>
      api.post(
        sprintf(ENDPOINT.PLATFORM_CUSTOMER_EDIT, { platform_customer_id }),
        params
      ),

    // JOBS
    getJobs: centre_id => api.get(sprintf(ENDPOINT.JOBS, { centre_id })),
    getLearnerJobs: () => api.get(ENDPOINT.JOBS_LEARNER),
    getSavedJobs: () => api.get(ENDPOINT.JOBS_SAVED),
    getJobApplications: (centre_id, job_id) =>
      api.get(sprintf(ENDPOINT.JOBS_APPLICATIONS, { centre_id, job_id })),
    declineJobApplication: (centre_id, job_id, application_id, params) =>
      api.post(
        sprintf(ENDPOINT.JOBS_APPLICATION_DECLINE, {
          centre_id,
          job_id,
          application_id
        }),
        params
      ),
    interviewJobApplication: (centre_id, job_id, application_id, params) =>
      api.post(
        sprintf(ENDPOINT.JOBS_APPLICATION_INTERVIEW, {
          centre_id,
          job_id,
          application_id
        }),
        params
      ),
    createJob: (centre_id, params) =>
      api.post(sprintf(ENDPOINT.JOBS_CREATE, { centre_id }), params),
    deleteJob: (centre_id, job_id) =>
      api.delete(sprintf(ENDPOINT.JOBS_DELETE, { centre_id, job_id })),
    updateJob: (centre_id, job_id, params) =>
      api.post(sprintf(ENDPOINT.JOBS_UPDATE, { centre_id, job_id }), params),
    saveJob: (centre_id, job_id) =>
      api.post(sprintf(ENDPOINT.JOBS_SAVE, { centre_id, job_id })),
    saveLearnerJob: job_id =>
      api.post(sprintf(ENDPOINT.JOBS_LEARNER_SAVE, { job_id })),
    unsaveLearnerJob: job_id =>
      api.delete(sprintf(ENDPOINT.JOBS_LEARNER_UNSAVE, { job_id })),
    applyLearnerJob: job_id =>
      api.post(sprintf(ENDPOINT.JOBS_LEARNER_APPLY, { job_id })),

    // UNITS
    getUnits: params =>
      api.get(sprintf(ENDPOINT.UNITS_ALL, { now: Date.now() }), params),
    getUnit: id => api.get(sprintf(ENDPOINT.UNIT_GET, { id, now: Date.now() })),
    postUnits: unit => api.post(ENDPOINT.UNITS, unit),
    putUnits: unit => api.put(ENDPOINT.UNITS, unit),
    deleteUnits: id => api.delete(sprintf(ENDPOINT.UNIT, { id })),
    deleteWorkbookFromUnit: (unit_id, workbook_id) =>
      api.delete(
        sprintf(ENDPOINT.UNIT_DELETE_WORKBOOK, { unit_id, workbook_id })
      ),

    // WORKBOOKS
    getWorkbookMedia: params => api.get(ENDPOINT.WORKBOOK_MEDIA, params),
    getWorkbookActivity: (unit_id, workbook_id, activity_code) =>
      api.get(
        sprintf(ENDPOINT.UNIT_WORKBOOK_ACTIVITY, {
          unit_id,
          workbook_id,
          activity_code
        })
      ),
    getWorkbookActivities: (unit_id, workbook_id) =>
      api.get(
        sprintf(ENDPOINT.UNIT_WORKBOOK_ACTIVITIES, {
          unit_id,
          workbook_id
        })
      ),
    getWorkbookActivityMember: (member_id, activity_id) =>
      api.get(sprintf(ENDPOINT.MEMBER_ACTIVITY, { member_id, activity_id })),
    getMockWorkbooks: () =>
      api.get(ENDPOINT.LEARNING_WORKBOOKS_ALL, null, { timeout: 30000 }),
    getWorkbook: (unit_id, workbook_id) =>
      api.get(sprintf(ENDPOINT.UNIT_WORKBOOK, { unit_id, workbook_id })),
    getWorkbookMember: (member_id, workbook_id) =>
      api.get(sprintf(ENDPOINT.MEMBER_WORKBOOK, { member_id, workbook_id })),

    saveWorkbook: (formData, workbook, unit_id, workbook_id) =>
      api.post(
        sprintf(ENDPOINT.UNIT_WORKBOOK, { unit_id, workbook_id }),
        formData || workbook
      ),
    createWorkbook: (formData, unit_id) =>
      api.post(sprintf(ENDPOINT.UNIT_WORKBOOKS, { unit_id }), formData),
    postWorkbookMedia: payload =>
      api.post(ENDPOINT.WORKBOOK_MEDIA, payload, {
        timeout: 9999999999999999999
      }),
    deleteWorkbookMedia: media_id =>
      api.delete(sprintf(ENDPOINT.WORKBOOK_MEDIUM, { media_id })),
    setWorkbookCurrentModerator: (unit_id, workbook_id, current_moderator) =>
      api.post(
        sprintf(ENDPOINT.UNIT_WORKBOOK_MODERATOR, { unit_id, workbook_id }),
        current_moderator
      ),
    clearWorkbookCurrentModerator: (unit_id, workbook_id) =>
      api.delete(
        sprintf(ENDPOINT.UNIT_WORKBOOK_MODERATOR, { unit_id, workbook_id })
      ),

    // ACTIVITIES
    getActivity: activity_id =>
      api.get(sprintf(ENDPOINT.ACTIVITY, { activity_id })),
    getActivities: params => api.get(ENDPOINT.ACTIVITIES, params),
    getActivityTypes: () => api.get(ENDPOINT.ACTIVITY_TYPES),
    updateActivity: (activityFormData, activity_id) =>
      api.post(sprintf(ENDPOINT.ACTIVITY, { activity_id }), activityFormData, {
        timeout: 30000
      }),
    createActivity: activityData =>
      api.post(ENDPOINT.ACTIVITIES, activityData, { timeout: 30000 }),
    submitWorkbookActivityMapped: (member_id, workbook_id, activity_id, data) =>
      api.post(
        sprintf(ENDPOINT.MEMBER_ACTIVITY_SUBMIT_MAPPED, {
          member_id,
          workbook_id,
          activity_id
        }),
        data
      ),
    submitWorkbookActivity: (activity_id, data) =>
      api.post(sprintf(ENDPOINT.MEMBER_ACTIVITY_SUBMIT, { activity_id }), data),

    workbookActivityApprove: (activity_id, member_id) =>
      api.put(
        sprintf(ENDPOINT.MEMBER_ACTIVITY_APPROVE, { activity_id, member_id })
      ),
    workbookActivityReject: (activity_id, member_id) =>
      api.put(
        sprintf(ENDPOINT.MEMBER_ACTIVITY_REJECT, { activity_id, member_id })
      ),

    // VIDEOS
    getCategories: id =>
      api.get(sprintf(ENDPOINT.LEARNING_VIDEO_CATEGORIES, { id })),
    getAllCategories: params =>
      api.get(ENDPOINT.LEARNING_VIDEO_ALL_CATEGORIES, params),
    getCategory: (sector_id, category_id, params) =>
      api.get(
        sprintf(ENDPOINT.LEARNING_VIDEO_CATEGORY, { sector_id, category_id }),
        params
      ),
    createCategory: (id, data) =>
      api.post(sprintf(ENDPOINT.LEARNING_VIDEO_CATEGORY_CREATE, { id }), data),
    updateCategory: (sector_id, category_id, data) =>
      api.post(
        sprintf(ENDPOINT.LEARNING_VIDEO_CATEGORY, { sector_id, category_id }),
        data
      ),
    deleteCategory: (sector_id, category_id) =>
      api.delete(
        sprintf(ENDPOINT.LEARNING_VIDEO_CATEGORY, { sector_id, category_id })
      ),

    getVideos: id => api.get(sprintf(ENDPOINT.LEARNING_VIDEOS, { id })),
    getAllVideos: sector_id =>
      api.get(sprintf(ENDPOINT.LEARNING_VIDEOS_ALL, { sector_id })),
    createVideo: (id, data) =>
      api.post(sprintf(ENDPOINT.LEARNING_VIDEO_CREATE, { id }), data, {
        timeout: 0
      }),
    updateVideo: (category_id, video_id, data) =>
      api.post(
        sprintf(ENDPOINT.LEARNING_VIDEO, { category_id, video_id }),
        data
      ),
    deleteVideo: (category_id, video_id) =>
      api.delete(sprintf(ENDPOINT.LEARNING_VIDEO, { category_id, video_id })),

    // // JOBS
    // getJobs: id => api.get(sprintf(ENDPOINT.GET_VIDEOS, { id })),

    // // JOBS
    // getJobs: id => api.get(sprintf(ENDPOINT.GET_VIDEOS, { id })),

    // GENERAL MEDIA
    likeMedia: (user_id, media_id) =>
      api.put(sprintf(ENDPOINT.MEMBER_MEDIA_LIKE, { user_id, media_id })),
    unlikeMedia: (user_id, media_id) =>
      api.put(sprintf(ENDPOINT.MEMBER_MEDIA_UNLIKE, { user_id, media_id })),
    viewMedia: (user_id, media_id) =>
      api.put(sprintf(ENDPOINT.MEMBER_MEDIA_VIEW, { user_id, media_id })),

    // MESSAGING
    getChat: chat_id => api.get(sprintf(ENDPOINT.CHAT, { chat_id })),
    getChats: () => api.get(ENDPOINT.CHAT_ROOT),
    newChat: data => api.post(ENDPOINT.CHAT_ROOT, data),
    deleteChat: chat_id => api.delete(sprintf(ENDPOINT.CHAT, { chat_id })),
    leaveChat: chat_id => api.get(sprintf(ENDPOINT.CHAT_LEAVE, { chat_id })),
    updateChat: (chat_id, data) =>
      api.post(sprintf(ENDPOINT.CHAT, { chat_id }), data),
    getMessages: (chat_id, page, messages_per_page = 10) =>
      api.get(
        sprintf(ENDPOINT.CHAT_MESSAGE_PAGINATED, {
          chat_id,
          page,
          messages_per_page
        })
      ),
    deleteMessage: (chat_id, message_id) =>
      api.delete(
        sprintf(ENDPOINT.CHAT_SINGLE_MESSAGE, { chat_id, message_id })
      ),
    sendMessage: (chat_id, message) =>
      api.post(sprintf(ENDPOINT.CHAT_MESSAGE, { chat_id }), message),
    markChatRead: chat_id => api.post(sprintf(ENDPOINT.CHAT_READ, { chat_id })),
    addChatParticipants: (chat_id, participants) =>
      api.post(sprintf(ENDPOINT.CHAT_ADD_PARTICIPANTS, { chat_id }), {
        participants
      }),
    removeChatParticipants: (chat_id, participants) =>
      api.post(sprintf(ENDPOINT.CHAT_REMOVE_PARTICIPANTS, { chat_id }), {
        participants
      }),
    // ADD_PARTICIPANTS: '/chat/:chat_id/add_participants',
    // CHAT_DELETE: '/chat/:chat_id',
    // CHAT_PARTICIPANTS: '/chat/:chat_id/participants',
    // CHAT_UPDATE: '/chat/:chat_id',
    // GET_CHAT: '/chat/:chat_id',
    // MESSAGE_DELETE: '/chat/:chat_id/message/:message_id',
    // MESSAGE_SEND: '/chat/:chat_id/message',
    // MY_CHATS: '/chat',
    // REMOVE_PARTICIPANTS: '/chat/:chat_id/remove_participants'

    // Friend creation etc.
    manageConnections: (sender_id, receiver_id, action) =>
      api.post(ENDPOINT.CONNECTION, { sender_id, receiver_id, action }),

    // Get connections
    searchConnections: search => api.get(ENDPOINT.CONNECTION, { search }),

    getMemberNotifications: () => api.get(ENDPOINT.MEMBER_NOTIFICATIONS),

    cloudinaryUpload: file => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'j0gmj5an'); // Replace the preset name with your own
      formData.append('resource_type', 'raw'); // Replace the preset name with your own
      formData.append('folder', env()); // Replace the preset name with your own
      // formData.append("api_key", "1234567"); // Replace API key with your own Cloudinary key
      // formData.append("timestamp", (Date.now() / 1000) | 0);

      // Make an AJAX upload request using Axios (replace Cloudinary URL below with your own)
      return cloudinaryAPI.post(ENDPOINT.CLOUDINARY_UPLOAD, formData);
    },

    // Store
    addQualificationToStore: (payload, qualification_id) => {
      return api.post(
        sprintf(ENDPOINT.LEARNING_QUALIFICATION_TO_STORE, { qualification_id }),
        payload,
        { timeout: 150000 }
      ); //, { timeout: 15000 }
    },

    getAllQualificationsInStore: params => {
      return api.get(ENDPOINT.LEARNING_QUALIFICATIONS_IN_STORE);
    },

    getQualificationInStore: qualification_id => {
      return api.get(
        sprintf(ENDPOINT.LEARNING_QUALIFICATION_IN_STORE, { qualification_id })
      );
    },

    postQualificationPurchaseLicencesCentre: (
      qualification_id,
      centre_id,
      params
    ) => {
      return api.post(
        sprintf(ENDPOINT.LEARNING_QUALIFICATION_PURCHASE_LICENCES_CENTRE, {
          qualification_id,
          centre_id
        }),
        params
      );
    },

    getLearnersFromCSV: (not_qualification_id, file) => {
      return api.post(
        sprintf(ENDPOINT.CENTRE_SEARCH_LEARNERS_FROM_CSV, {
          not_qualification_id
        }),
        file
      );
    },

    getAdminOrders: params => {
      return api.get(ENDPOINT.ADMIN_ORDERS, params);
    },

    getOrders: (centre_id, params) => {
      return api.get(
        sprintf(ENDPOINT.CENTRE_ORDERS, {
          centre_id
        }),
        params
      );
    },

    getQualificationOrder: (centre_id, transaction_id) => {
      return api.get(
        sprintf(ENDPOINT.CENTRE_QUALIFICATION_ORDER, {
          centre_id,
          transaction_id
        })
      );
    },

    getCentreLicenses: (centre_id, parmas) => {
      return api.get(
        sprintf(ENDPOINT.CENTRE_CENTRE_LICENSES, {
          centre_id
        })
      );
    },

    postCentreLicenses: (centre_id, params) => {
      return api.post(
        sprintf(ENDPOINT.CENTRE_CENTRE_LICENSES, {
          centre_id
        }),
        params
      );
    },

    getCentreLicense: (centre_id, qualification_license_id) => {
      return api.get(
        sprintf(ENDPOINT.CENTRE_CENTRE_LICENSE, {
          centre_id,
          qualification_license_id
        })
      );
    },

    putCentreLicenseSuspend: (centre_id, qualification_license_id) => {
      return api.put(
        sprintf(ENDPOINT.CENTRE_LICENSE_SUSPEND, {
          centre_id,
          qualification_license_id
        })
      );
    },

    putCentreLicenseRestore: (centre_id, qualification_license_id) => {
      return api.put(
        sprintf(ENDPOINT.CENTRE_LICENSE_RESTORE, {
          centre_id,
          qualification_license_id
        })
      );
    },

    putCentreSuspend: centre_id => {
      return api.put(
        sprintf(ENDPOINT.CENTRE_SUSPEND, {
          centre_id
        })
      );
    },

    putCentreRestore: centre_id => {
      return api.put(
        sprintf(ENDPOINT.CENTRE_RESTORE, {
          centre_id
        })
      );
    },

    putCentreLicensesSuspend: centre_id => {
      return api.put(
        sprintf(ENDPOINT.CENTRE_LICENSES_SUSPEND, {
          centre_id
        })
      );
    },

    putCentreLicensesRestore: centre_id => {
      return api.put(
        sprintf(ENDPOINT.CENTRE_LICENSES_RESTORE, {
          centre_id
        })
      );
    },

    postPurchaseLicencesCentre: (centre_id, params) => {
      return api.post(
        sprintf(ENDPOINT.STORE_PURCHASE, {
          centre_id
        }),
        params
      );
    },

    postAssignQualificationLicencesLearners: (
      qualification_id,
      centre_id,
      params
    ) => {
      return api.post(
        sprintf(ENDPOINT.LEARNING_QUALIFICATION_ASSIGN, {
          qualification_id,
          centre_id
        }),
        params
      );
    },

    // NEWS
    getAllNews: (archived, query) => {
      if (archived) {
        return api.get(ENDPOINT.NEWS + '/archived' + '/' + (query || ''));
      } else {
        return api.get(ENDPOINT.NEWS_ALL + '/' + (query || ''));
      }
    },
    getNews: news_id => api.get(ENDPOINT.NEWS_ALL + '/' + news_id),
    createNews: payload =>
      api.post(ENDPOINT.NEWS, payload, { timeout: 150000 }),
    updateNews: (payload, news_id) =>
      api.post(ENDPOINT.NEWS + '/' + news_id, payload, {
        timeout: 150000
      }),
    deleteNews: news_id => api.delete(ENDPOINT.NEWS + '/' + news_id),
    saveNews: (news_id, save) =>
      api.put(ENDPOINT.NEWS + '/' + news_id + (save ? '/save' : '/unsave')),

    getNewsProviders: query => api.get(ENDPOINT.NEWS_PROVIDERS + '?' + query),
    getNewsProvider: news_provider_id =>
      api.get(sprintf(ENDPOINT.NEWS_PROVIDER, { news_provider_id })),
    createNewsProvider: payload =>
      api.post(ENDPOINT.NEWS_PROVIDERS, payload, { timeout: 150000 }),
    updateNewsProvider: (payload, news_provider_id) =>
      api.post(sprintf(ENDPOINT.NEWS_PROVIDER, { news_provider_id }), payload, {
        timeout: 150000
      }),
    deleteNewsProvider: news_provider_id =>
      api.delete(sprintf(ENDPOINT.NEWS_PROVIDER, { news_provider_id })),

    // SYSTEM
    getInviteTemplate: (userRole, templateType) =>
      api.get(
        ENDPOINT.SYSTEM_DOWNLOAD_INVITE_TEMPLATE +
          '?role=' +
          userRole +
          '&type=' +
          templateType
      ),
    uploadInviteFile: params =>
      api.post(ENDPOINT.SYSTEM_PARSE_INVITE_FILE, params, { timeout: 150000 }),

    // REPORTING DASHBOARD
    getUserSummary: () => api.get(ENDPOINT.USER_SUMMARY),
    getReportingTopCentres: () => api.get(ENDPOINT.REPORTING_TOP_CENTRES),
    getReportingMonthlyLearningHours: () =>
      api.get(ENDPOINT.REPORTING_MONTHLY_LEARNING_HOURS),
    getReportingDailyLogins: () => api.get(ENDPOINT.REPORTING_DAILY_LOGINS),
    getReportingTopQualifications: () =>
      api.get(ENDPOINT.REPORTING_TOP_QUALIFICATIONS),
    getReportingMonthlyTopQualifications: () =>
      api.get(ENDPOINT.REPORTING_MONTHLY_TOP_QUALIFICATIONS),
    getReportingOrders: params => api.get(ENDPOINT.REPORTING_ORDERS, params),
    getReportingOrdersMonthly: () => api.get(ENDPOINT.REPORTING_ORDERS_MONTHLY),

    // Pairing
    getPairingItems: () => api.get(ENDPOINT.PAIRING_GET_ITEMS),
    getPairingCategories: () => api.get(ENDPOINT.PAIRING_GET_CATEGORIES),
    getPairingSubCategories: parent_pairing_category_id =>
      api.get(
        sprintf(ENDPOINT.PAIRING_GET_SUB_CATEGORIES, {
          parent_pairing_category_id
        })
      ),
    createPairingCategory: params =>
      api.post(ENDPOINT.PAIRING_CREATE_CATEGORY, params),
    deletePairingCategory: pairing_category_id =>
      api.delete(
        sprintf(ENDPOINT.PAIRING_DELETE_CATEGORY, { pairing_category_id })
      ),
    createPairingCategoryItem: params =>
      api.post(ENDPOINT.PAIRING_CREATE_CATEGORY_ITEM, params),
    deletePairingCategoryItem: pairing_item_id =>
      api.delete(
        sprintf(ENDPOINT.PAIRING_DELETE_CATEGORY_ITEM, { pairing_item_id })
      ),
    searchPairingTargets: params =>
      api.get(ENDPOINT.PAIRING_GET_SEARCH_ITEMS, params),

    // USER CONFLICTS
    getUserConflictList: params => {
      console.log(params);
      return api.get(ENDPOINT.USER_CONFLICT_GET_LIST, params);
    },
    updateUserConflictEmail: (params, member_id) =>
      api.post(
        sprintf(ENDPOINT.USER_CONFLICT_UPDATE_EMAIL, { member_id }),
        params
      ),
    deleteUserConlict: member_id =>
      api.delete(sprintf(ENDPOINT.USER_CONFLICT_UPDATE_EMAIL, { member_id })),

    // EXPORT MANAGER

    generateReport: (centre_id, params) =>
      api.post(sprintf(ENDPOINT.GENERATE_REPORT, { centre_id }), params),
    getUserExportCsvData: (centre_id, user_export_id) =>
      api.get(
        sprintf(ENDPOINT.GET_USER_EXPORT_CSV_DATA, {
          centre_id,
          user_export_id
        })
      ),
    getUserExportCsvFile: (centre_id, user_export_id) =>
      api.get(
        sprintf(ENDPOINT.GET_USER_EXPORT_CSV_FILE, {
          centre_id,
          user_export_id
        })
      )
  };
};

export default {
  wla,
  baseURL
};
