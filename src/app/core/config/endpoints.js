import config from 'brand/config';

const ENDPOINTS = {
  ...config.api,

  // Global
  CONFIG: '/system/config',

  // Activities
  ACTIVITIES: '/activities',
  ACTIVITY: '/activities/%(activity_id)s',
  ACTIVITY_TYPES: '/activities/types',

  // Admin Endpoints
  ADMIN_BALANCE: '/admin/balance',
  ADMIN_CENTRE: '/admin/centre',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_MEMBER_ACTIVATE: '/admin/member/activate',
  ADMIN_MEMBER_INVITE: '/admin/member/send_admin_invite_email',
  ADMIN_MEMBER_VERIFY: '/admin/member/verify/%(verification_key)s',
  ADMIN_REPORTS_ORDERS_MONTHLY: 'admin/reports/orders_montly',

  // Assessment Tools
  ASSESSMENT_HOURS_MEMEBER_ACTIVITY: '/hours/%(member_id)s/activity',
  ASSESSMENT_HOURS_MEMEBER_ACTIVITY_QUALIFICATION:
    '/hours/%(member_id)s/activity/%(qualification_id)s',
  ASSESSMENT_GUIDANCE: '/assessment/guidance',
  ASSESSMENT_MEMBER_QUALIFICATION:
    'assessment/%(member_id)s/qualification/%(qualification_id)s',
  ASSESSMENT_MEMBER_UNIT:
    'assessment/%(member_id)s/qualification/%(qualification_id)s/unit/%(unit_id)s',
  ASSESSMENT_MEMBER_EVIDENCES:
    'assessment/%(member_id)s/qualification/%(qualification_id)s/evidence',
  ASSESSMENT_MEMBER_EVIDENCE_DETAILS:
    'assessment/%(member_id)s/qualification/%(qualification_id)s/evidence/%(evidence_id)s',
  ASSESSMENT_CRITERIAS:
    'assessment/%(member_id)s/qualification/%(qualification_id)s/criteria',
  ASSESSMENT_EVIDENCE:
    'assessment/%(member_id)s/qualification/%(qualification_id)s/evidence',
  ASSESSMENT_MEDIA_COMMENTS: '/member/media_comment/%(media_id)s',
  ASSESSMENT_EVIDENCE_ADD_COMMENT:
    '/assessment/%(member_id)s/qualification/%(qualification_id)s/evidence/%(evidence_id)s/comment',

  // Centre endpoints
  CENTRE_ALL: '/centre',
  CENTRE: '/centre/%(id)s',
  CENTRE_CENTRE_LICENSES: '/centre/%(centre_id)s/licenses',
  CENTRE_CENTRE_LICENSE:
    '/centre/%(centre_id)s/licenses/%(qualification_license_id)s',
  CENTRE_SUSPEND: '/centre/%(centre_id)s/suspend',
  CENTRE_RESTORE: '/centre/%(centre_id)s/restore',
  CENTRE_LICENSES_SUSPEND: '/centre/%(centre_id)s/licenses/suspend',
  CENTRE_LICENSES_RESTORE: '/centre/%(centre_id)s/licenses/restore',
  CENTRE_ACTIVATE: '/centre/activate',
  CENTRE_COMMUNITY: '/centre/%(id)s/community',
  CENTRE_GROUP: '/centre/groups/%(group_id)s',
  CENTRE_GROUPS: '/centre/%(id)s/groups',
  CENTRE_INVITE_MEMBER: '/centre/member/invite',

  // CENTRE_INVITE: '/centre/%(id)s/send_invitation',
  CENTRE_INVITE: '/centre/invite',
  CENTRE_MEMBER_INVITE: '/centre/invite_member',
  CENTRE_MEMBER_ACTIVATE: '/centre/member/activate',
  CENTRE_MEMBER_VERIFY: '/centre/member/verify/%(verification_key)s',
  CENTRE_MEMBERS: '/v1.1/centre/%(id)s/member',
  CENTRE_TUTORS: '/v1.1/centre/%(id)s/member',
  CENTRE_LEARNERS: '/v1.1/centre/%(id)s/learners',
  CENTRE_TUTOR_LEARNERS: '/centre/%(centre_id)s/tutor/%(member_id)s/learners',
  CENTRE_ORDERS: '/centre/%(centre_id)s/orders',
  CENTRE_QUALIFICATION_ORDER: '/centre/%(centre_id)s/orders/%(transaction_id)s',
  CENTRE_LICENSE_RESTORE:
    '/centre/%(centre_id)s/licenses/%(qualification_license_id)s/restore',
  CENTRE_LICENSE_SUSPEND:
    '/centre/%(centre_id)s/licenses/%(qualification_license_id)s/suspend',
  CENTRE_SEARCH_LEARNERS_FROM_CSV: 'v1.1/centre/%(id)s/search_learners',
  CENTRE_QUALIFICATION:
    '/centre/%(centre_id)s/qualification/%(qualification_id)s',
  CENTRE_QUALIFICATION_PATHWAY:
    '/centre/%(centre_id)s/qualification/%(qualification_id)s/pathway',
  CENTRE_QUALIFICATIONS: 'centre/%(centre_id)s/qualification',
  CENTRE_REPORTS_TOP_QUALIFICATIONS_REVENUE:
    '/centre/%(centre_id)s/reports/top_qualifications_revenue',
  CENTRE_REPORTS_ORDER_MONTHLY: 'centre/%(centre_id)s/reports/orders_monthly',
  CENTRE_SEATS: '/centre/%(id)s/seats',
  CENTRE_VALIDATE: '/centre/validate',
  CENTRE_VERIFY: '/centre/verify',
  CENTRE_VERIFY_EMAIL: '/centre/send_verification_email',

  // Chat
  CHAT: '/chat/%(chat_id)s',
  CHAT_ADD_PARTICIPANTS: '/chat/%(chat_id)s/add_participants',
  CHAT_LEAVE: '/chat/%(chat_id)s/leave_chat',
  CHAT_REMOVE_PARTICIPANTS: '/chat/%(chat_id)s/remove_participants',
  CHAT_MESSAGE: '/chat/%(chat_id)s/message',
  CHAT_SINGLE_MESSAGE: '/chat/%(chat_id)s/message/%(message_id)s',
  CHAT_MESSAGE_PAGINATED:
    '/chat/%(chat_id)s/message?page=%(page)s&messages_per_page=%(messages_per_page)s',
  CHAT_READ: '/chat/%(chat_id)s/read',
  CHAT_ROOT: '/chat',

  // Cloudinary Upload
  CLOUDINARY_UPLOAD: '/upload',

  // Connection
  CONNECTION: '/connection',

  // E Laearning Hours
  ELEARNING_HOURS: '/centre/%(centre_id)s/hours/month',

  //Group
  GROUPS: '/groups',

  // learning
  LEARNING_WORKBOOKS_ALL: 'learning/workbooks/all',
  LEARNING_QUALIFICATION: 'v1.1/learning/qualifications/%(qualification_id)s', // ** Second parameter hard coded
  LEARNING_QUALIFICATIONS: 'v1.1/learning/qualifications',
  LEARNING_QUALIFICATION_INACTIVE:
    'v1.1/learning/qualifications/%(qualification_id)s/inactive',

  LEARNING_VIDEO:
    '/learning/video_categories/%(category_id)s/video/%(video_id)s',
  LEARNING_VIDEO_CATEGORY_CREATE: '/learning/video_categories/%(id)s/category',
  LEARNING_VIDEO_CATEGORIES: '/learning/video_categories/%(id)s?by_role=1',
  LEARNING_VIDEO_ALL_CATEGORIES: '/learning/video_categories/',
  LEARNING_VIDEO_CATEGORY:
    '/learning/video_categories/%(sector_id)s/category/%(category_id)s',
  LEARNING_VIDEO_CREATE: '/learning/video_categories/%(id)s/video',
  LEARNING_VIDEOS: '/learning/video_categories/%(id)s/videos',
  LEARNING_VIDEOS_ALL: '/learning/videos?sector_id=%(sector_id)s&by_role=1',

  LEARNING_UNIT: '/unit',
  LEARNING_UNITS: '/units',

  LEARNING_UNIT_GET: 'v1.1/units/all/%(unit_id)s',
  LEARNING_UNITS_ALL: 'v1.1//units/all?%(now)s',

  LEARNING_QUALIFICATION_TO_STORE:
    'v1.1/learning/qualifications/%(qualification_id)s/store',
  LEARNING_QUALIFICATION_IN_STORE:
    'v1.1/learning/qualification/%(qualification_id)s/store',
  LEARNING_QUALIFICATIONS_IN_STORE: 'v1.1/learning/qualification/store',
  LEARNING_QUALIFICATION_ASSIGN:
    'v1.1/learning/qualification/%(qualification_id)s/assign/%(centre_id)s',
  LEARNING_QUALIFICATION_PURCHASE_LICENCES_CENTRE:
    'v1.1/learning/qualification/%(qualification_id)s/purchase/%(centre_id)s',

  // member endpoints
  MEMBER: '/member/%(id)s',
  MEMBER_ACTIVITY: '/member/%(member_id)s/activity/%(activity_id)s',
  MEMBER_ACTIVITY_APPROVE:
    '/member/%(member_id)s/activity/%(activity_id)s/approve',
  MEMBER_ACTIVITY_REJECT:
    '/member/%(member_id)s/activity/%(activity_id)s/reject',
  MEMBER_ACTIVITY_SUBMIT: '/member/activity/%(activity_id)s',
  MEMBER_ACTIVITY_SUBMIT_MAPPED:
    '/member/%(member_id)s/workbook/%(workbook_id)s/activity/%(activity_id)s',
  MEMBER_ALL: '/member/list_all?%s',
  MEMBER_ALL_v1: '/v1.1/centre/%(centre_id)s/member',
  MEMBER_AUTH_FB: '/member/auth/facebook',
  MEMBER_AUTH_GOOGLE: '/member/sign_up/gplus',
  MEMBER_BIO: '/member/%(member_id)s/bio',
  MEMBER_BIO_ID: '/member/%(member_id)s/bio/%(bio_id)s',
  MEMBER_CREATE_PROFILE: '/member/profile',
  MEMBER_COMMUNITY: '/member/community',
  MEMBER_CONNECTION: '/member/%(id)s/connection/mutual',
  MEMBER_FORGOT_PASSWORD: '/member/forgot_password',
  MEMBER_ME: '/member/me',
  MEMBER_MEDIA: '/member/%(id)s/media',
  MEMBER_MEDIA_LIKE: '/member/%(user_id)s/media/like/%(media_id)s',
  MEMBER_MEDIA_UNLIKE: '/member/%(user_id)s/media/unlike/%(media_id)s',
  MEMBER_MEDIA_VIEW: '/member/%(user_id)s/media/view/%(media_id)s',
  MEMBER_NOTIFICATIONS: '/member/notifications',
  MEMBER_PAY: '/member/pay',
  MEMBER_PERMISSIONS: '/member/%(id)s/acl',
  MEMBER_PHOTO: '/member/%(id)s/media/photo',
  MEMBER_PHOTO_ID: '/member/%(id)s/media/photo/%(media_id)s',
  MEMBER_BADGE: '/member/%(id)s/digital_badges',
  MEMBER_CV: '/member/cv?member_id=%(id)s',
  MEMBER_QUALIFICATION: '/member/%(member_id)s/qualification',
  MEMBER_REFERENCE: '/member/%(id)s/reference',
  MEMBER_RESET_PASSWORD: '/member/reset_password',
  MEMBER_ROOT: '/member',
  MEMBER_VERIFY_EMAIL: '/member/verify_email',
  MEMBER_SEND_VERFICATION_EMAIL: '/member/send_verification_email',
  MEMBER_SIGNIN: '/member/sign_in',
  MEMBER_SIGNOUT: '/member/sign_out',
  MEMBER_SIGNUP: '/member/sign_up',
  MEMBER_SIGNUP_V1: 'v1.3/member/sign_up',
  MEMBER_AS_SIGNIN: '/admin/member/sign_in_as/%(member_id)s',
  MEMBER_VIDEO: '/member/%(id)s/media/video',
  MEMBER_VIDEO_ID: '/member/%(id)s/media/video/%(media_id)s',
  MEMBER_WORKBOOK: '/member/%(member_id)s/workbook/%(workbook_id)s',
  MEMBER_MEDIA_DELETE: '/member/%(member_id)s/media/file/%(media_id)s',
  MEMBERSHIP: '/membership', // https://testing.api.ncfe.dqual.co.uk/docs/api/index.html#api-Member-Registration_Step_4__List_of_available_memberships
  MEMBERSHIP_VOUCHER_CHECK: '/membership/voucher/check', // https://testing.api.ncfe.dqual.co.uk/docs/api/index.html#api-Member-Registration_Step_4__Pay___Check_Membership_Voucher_Code
  COMMUNITY_AWAITS: '/member/awaiting',

  // Qualifications
  QUALIFICATION: 'v1.1/qualifications/%(qualification_id)s',
  QUALIFICATIONS: '/learning/qualification',
  QUALIFICATION_TYPES: '/qualifications/types',

  // Sectors
  SECTOR: '/sectors/%(id)s',
  SECTOR_QUALIFICATIONS: 'v1.1/sectors/%(sector_id)s/qualifications',
  SECTOR_ALL_QUALIFICATIONS: 'v1.1/sectors/%(sector_id)s/qualifications/all',
  SECTORS: '/sectors',
  SECTORS_ALL: '/sectors/all',

  // Store
  STORE_PURCHASE: '/store/purchase/%(centre_id)s',

  // System
  SYSTEM_DOWNLOAD_INVITE_TEMPLATE: '/system/download_invite_template',
  SYSTEM_PARSE_INVITE_FILE: '/system/parse_invite_file',

  // Units
  UNIT: '/units/%(id)s',
  UNIT_GET: '/units/all/%(id)s?%(now)s',
  UNIT_DELETE_WORKBOOK: '/units/%(unit_id)s/workbooks/%(workbook_id)s',
  UNIT_WORKBOOK: '/units/%(unit_id)s/workbooks/%(workbook_id)s',
  UNIT_WORKBOOK_ACTIVITY:
    '/units/%(unit_id)s/workbooks/%(workbook_id)s/activities/%(activity_code)s',
  UNIT_WORKBOOK_MODERATOR:
    '/units/%(unit_id)s/workbooks/%(workbook_id)s/current_moderator',
  UNIT_WORKBOOK_ACTIVITIES:
    '/units/%(unit_id)s/workbooks/%(workbook_id)s/activities',
  UNIT_WORKBOOKS: '/units/%(unit_id)s/workbooks',
  UNITS: '/units',
  UNITS_ALL: '/units/all?%(now)s',
  UNITS_ALL_GET: '/units/all',

  // Validation endpoints
  VALIDATE_EMAIL: '/validate/email',
  VALIDATE_REGISTRATION_NUMBER: '/validate/registration_number',

  // Workbooks
  WORKBOOK_MEDIA: '/workbook/media',
  WORKBOOK_MEDIUM: '/workbook/media/%(media_id)s',

  // news
  NEWS_PROVIDERS: '/news/providers',
  NEWS_PROVIDER: '/news/providers/%(news_provider_id)s',
  NEWS: '/news',
  NEWS_ALL: '/news/all',
  NEWS_ARCHIVE: '/news/archived',

  NEWS_LIKED: '/news/%(news_id)/liked',
  NEWS_UNLIKE: '/news/%(news_id)/unlike',

  NEWS_SAVED: '/news/%(news_id)/saved',
  NEWS_UNSAVED: '/news/%(news_id)/unsave',

  NEWS_VIEWED: '/news/viewed',

  //Reporting dashboard
  USER_SUMMARY: '/admin/reports/total_users',
  REPORTING_TOP_CENTRES: '/admin/reports/top_centres',
  REPORTING_MONTHLY_LEARNING_HOURS: '/admin/reports/monthly_learning_hours',
  REPORTING_DAILY_LOGINS: '/admin/reports/daily_logins',
  REPORTING_TOP_QUALIFICATIONS: '/admin/reports/top_qualifications',
  REPORTING_MONTHLY_TOP_QUALIFICATIONS:
    '/admin/reports/monthly_top_qualifications',
  REPORTING_ORDERS: '/admin/orders',
  REPORTING_ORDERS_MONTHLY: '/admin/reports/orders_montly',

  // Community Tasks
  COMMUNITY_AUTHOR_TASKS: '/member/tasks/%(author_id)s',
  COMMUNITY_AUTHOR_TASKS_CREATE: '/member/tasks/create',
  COMMUNITY_AUTHOR_FILES: '/member/tasks/files',
  COMMUNITY_AUTHOR_FILE_UPLOAD: '/member/tasks/upload',
  COMMUNITY_AUTHOR_TASKS_UPDATE: '/member/tasks/update/%(task_id)s',
  COMMUNITY_AUTHOR_TASKS_ACTIVITIES: '/activities',
  COMMUNITY_AUTHOR_TASKS_ACTIVITY: '/activities/%(activity_id)s',

  // Customer
  PLATFORM_CUSTOMERS: '/admin/platform_customers',
  PLATFORM_CUSTOMERS_CREATE: '/admin/platform_customers/create',
  PLATFORM_CUSTOMER_DELETE:
    '/admin/platform_customers/%(platform_customer_id)s/delete',
  PLATFORM_CUSTOMER_EDIT:
    '/admin/platform_customers/%(platform_customer_id)s/update',

  // Jobs
  JOBS: '/centre/%(centre_id)s/jobs',
  JOBS_LEARNER: '/member/jobs',
  JOBS_LEARNER_SAVE: '/member/jobs/%(job_id)s/save',
  JOBS_LEARNER_UNSAVE: '/member/jobs/%(job_id)s/save',
  JOBS_LEARNER_APPLY: '/member/jobs/%(job_id)s/applications',
  JOBS_CREATE: '/centre/%(centre_id)s/jobs',
  JOBS_SAVED: '/member/jobs/saved',
  JOBS_APPLICATIONS: '/centre/%(centre_id)s/jobs/%(job_id)s/applications',
  JOBS_DELETE: '/centre/%(centre_id)s/jobs/%(job_id)s',
  JOBS_SAVE: '/centre/%(centre_id)s/jobs/%(job_id)s/save',
  JOBS_UPDATE: '/centre/%(centre_id)s/jobs/%(job_id)s',
  JOBS_APPLICATION_DECLINE:
    '/centre/%(centre_id)s/jobs/%(job_id)s/applications/%(application_id)s/decline',
  JOBS_APPLICATION_INTERVIEW:
    '/centre/%(centre_id)s/jobs/%(job_id)s/applications/%(application_id)s/interview',

  // Registration Other
  REGISTER_OTHER: '/v1.3/member/sign_up',
  VERIFY_OTHER_EMAIL: '/v1.3/member/verify_email',
  SET_PROFILE_WITH_ULN: '/v1.3/member',
  VALIDATE_ULN: '/v1.3/member/validate_uln',
  MEMBER_OTHER: '/v1.3/member/%(id)s',
  MEMBER_OTHER_V1: '/v1.0/member/%(id)s',
  SEND_VERIFICATION_EMAIL: '/v1.3/member/send_verification_email',
  // Pairing
  PAIRING_GET_CATEGORIES: '/pairing_wheel/categories',
  PAIRING_GET_SUB_CATEGORIES:
    '/pairing_wheel/subcategories/%(parent_pairing_category_id)s',
  PAIRING_GET_ITEMS: '/pairing_wheel/items',
  PAIRING_CREATE_CATEGORY: '/pairing_wheel/categories',
  PAIRING_DELETE_CATEGORY: '/pairing_wheel/categories/%(pairing_category_id)s',
  PAIRING_CREATE_CATEGORY_ITEM: '/pairing_wheel/items',
  PAIRING_DELETE_CATEGORY_ITEM: '/pairing_wheel/items/%(pairing_item_id)s',
  PAIRING_GET_SEARCH_ITEMS: '/pairing_wheel',

  // User Conflict
  USER_CONFLICT_GET_LIST: '/member/unverified',
  USER_CONFLICT_UPDATE_EMAIL: '/member/unverified/%(member_id)s',

  // Export Manager
  GENERATE_REPORT: '/export/%(centre_id)s/users',
  GET_USER_EXPORT_CSV_DATA: '/export/%(centre_id)s/users/%(user_export_id)s',
  GET_USER_EXPORT_CSV_FILE: '/export/%(centre_id)s/users/%(user_export_id)s/1'
};

export default ENDPOINTS;
