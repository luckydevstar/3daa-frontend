import { Types } from '../actions';
import Immutable from 'seamless-immutable';
import { createReducer } from 'reduxsauce';
import * as lodash from 'lodash';

export const INITIAL_STATE = Immutable({
  centres: [],
  licenses: {
    qualification_licenses: [],
    total: 0
  },
  activeLayout: 'card',
  activeCentre: null,
  searchTerm: null,

  sorting: {
    config: {
      screen_name: {
        name: 'centre_name',
        order: null,
        active: false,
        sortable: true
      },
      revenue_outstanding: {
        name: 'revenue_outstanding',
        order: null,
        active: false,
        sortable: true
      },
      total_revenue: {
        name: 'total_revenue',
        order: null,
        active: false,
        sortable: true
      },
      status: {
        name: 'suspended',
        order: null,
        active: false,
        sortable: true
      },
      message: {
        name: 'message',
        sortable: false
      },
      profile: {
        name: 'profile',
        sortable: false
      }
    },
    activeProp: null
  },

  attemptingFinanceGetAllCentres: false,
  attemptingFinanceGetCentreLicenses: false,
  attemptingFinanceSuspendCentre: false,
  attemptingFinanceRestoreCentre: false,
  attemptingFinanceSuspendCentreLicense: false,
  attemptingFinanceRestoreCentreLicense: false,
  attemptingFinanceSuspendCentreLicenses: false,
  attemptingFinanceRestoreCentreLicenses: false,
  attemptingFinanceAddQualificationLicenses: false
});

const financeSetActiveLayout = (state, action) =>
  state.merge({
    activeLayout: lodash.get(action, 'layout')
  });

const financeSetActiveCentre = (state, action) =>
  state.merge({
    activeCentre: lodash.get(action, 'centre')
  });

const financeSetSearchTerm = (state, action) =>
  state.merge({
    searchTerm: lodash.get(action, 'term')
  });

const financeUpdateOrderSettings = (state, { orderProp, order }) => {
  const { sorting } = state;

  const newSorting = sorting.asMutable({ deep: true });

  const { config } = newSorting;

  const propConfig = config[orderProp];

  // const resetActive = obj => {
  //   Object.keys(obj).forEach(key => {
  //     const el = obj[key];
  //     if (el.active === true) {
  //       el.active = false;
  //       el.order = null;
  //     }
  //   });
  // };

  // resetActive(config);

  propConfig.order = order;
  propConfig.active = true;

  newSorting.activeProp = orderProp;

  return state.merge({
    sorting: newSorting
  });
};

// Finance Get All Centres
const financeGetAllCentresAttempt = (state, action) =>
  state.merge({
    attemptingFinanceGetAllCentres: true,
    errorCode: null,
    centres: []
  });

const financeGetAllCentresSuccess = (state, action) => {
  return state.merge({
    attemptingFinanceGetAllCentres: false,
    centres: lodash.get(action, 'data.data'),
    activeCentre: lodash.get(action, ['data', 'data', '0'])
  });
};

const financeGetAllCentresFailure = (state, action) =>
  state.merge({
    attemptingFinanceGetAllCentres: false
  });

// Finance Get All Qualification Licenses in Centre
const financeGetCentreLicensesAttempt = (state, action) =>
  state.merge({
    attemptingFinanceGetCentreLicenses: true,
    errorCode: null,
    licenses: {
      qualification_licenses: [],
      total: 0
    }
  });

const financeGetCentreLicensesSuccess = (state, action) => {
  return state.merge({
    attemptingFinanceGetCentreLicenses: false,
    licenses: lodash.get(action, 'data.data')
  });
};

const financeGetCentreLicensesFailure = (state, action) =>
  state.merge({
    attemptingFinanceGetCentreLicenses: false
  });

// Finance Suspend a Centre
const financeSuspendCentreAttempt = (state, action) =>
  state.merge({
    attemptingFinanceSuspendCentre: true,
    errorCode: null
  });

const financeSuspendCentreSuccess = (state, action) => {
  const centre_id = lodash.get(action, 'data.data.centre_id');
  const centres = lodash.cloneDeep(state.centres);
  const centre = lodash.find(centres, centre => centre.centre_id == centre_id);

  if (centre) centre.suspended = true;

  return state.merge({
    attemptingFinanceSuspendCentre: false,
    centres: centres
  });
};

const financeSuspendCentreFailure = (state, action) =>
  state.merge({
    attemptingFinanceSuspendCentre: false
  });

// Finance Restore a Centre
const financeRestoreCentreAttempt = (state, action) =>
  state.merge({
    attemptingFinanceRestoreCentre: true,
    errorCode: null
  });

const financeRestoreCentreSuccess = (state, action) => {
  const centre_id = lodash.get(action, 'data.data.centre_id');
  const centres = lodash.cloneDeep(state.centres);
  const centre = lodash.find(centres, centre => centre.centre_id == centre_id);

  if (centre) centre.suspended = false;

  return state.merge({
    attemptingFinanceRestoreCentre: false,
    centres: centres
  });
};

const financeRestoreCentreFailure = (state, action) =>
  state.merge({
    attemptingFinanceRestoreCentre: false
  });

// Finance Suspend a License in a Centre
const financeSuspendCentreLicenseAttempt = (state, action) =>
  state.merge({
    attemptingFinanceSuspendCentreLicense: true,
    errorCode: null
  });

const financeSuspendCentreLicenseSuccess = (state, action) => {
  const qualification_license_id = lodash.get(
    action,
    'data.data.qualification_license_id'
  );
  const licenses = lodash.cloneDeep(state.licenses);
  const qualification_licenses = lodash.get(licenses, 'qualification_licenses');
  const license = lodash.find(
    qualification_licenses,
    license => license.qualification_license_id == qualification_license_id
  );

  if (license) {
    license.suspended = true;
  }

  return state.merge({
    attemptingFinanceSuspendCentreLicense: false,
    licenses: licenses
  });
};

const financeSuspendCentreLicenseFailure = (state, action) =>
  state.merge({
    attemptingFinanceSuspendCentreLicense: false
  });

// Finance Restore a lincense in a Centre
const financeRestoreCentreLicenseAttempt = (state, action) =>
  state.merge({
    attemptingFinanceRestoreCentreLicense: true,
    errorCode: null
  });

const financeRestoreCentreLicenseSuccess = (state, action) => {
  const qualification_license_id = lodash.get(
    action,
    'data.data.qualification_license_id'
  );
  const licenses = lodash.cloneDeep(state.licenses);
  const qualification_licenses = lodash.get(licenses, 'qualification_licenses');
  const license = lodash.find(
    qualification_licenses,
    license => license.qualification_license_id == qualification_license_id
  );

  if (license) license.suspended = null;

  return state.merge({
    attemptingFinanceRestoreCentreLicense: false,
    licenses: licenses
  });
};

const financeRestoreCentreLicenseFailure = (state, action) =>
  state.merge({
    attemptingFinanceRestoreCentreLicense: false
  });

// Finance Suspend all Licenses in a Centre
const financeSuspendCentreLicensesAttempt = (state, action) =>
  state.merge({
    attemptingFinanceSuspendCentreLicenses: true,
    errorCode: null
  });

const financeSuspendCentreLicensesSuccess = (state, action) => {
  const licenses = lodash.cloneDeep(state.licenses);
  const qualification_licenses =
    lodash.get(licenses, 'qualification_licenses') || [];
  qualification_licenses.forEach(ql => {
    ql.suspended = true;
  });

  return state.merge({
    attemptingFinanceSuspendCentreLicenses: false,
    licenses: licenses
  });
};

const financeSuspendCentreLicensesFailure = (state, action) =>
  state.merge({
    attemptingFinanceSuspendCentreLicenses: false
  });

// Finance Restore all lincenses in a Centre
const financeRestoreCentreLicensesAttempt = (state, action) =>
  state.merge({
    attemptingFinanceRestoreCentreLicenses: true,
    errorCode: null
  });

const financeRestoreCentreLicensesSuccess = (state, action) => {
  const licenses = lodash.cloneDeep(state.licenses);
  const qualification_licenses =
    lodash.get(licenses, 'qualification_licenses') || [];
  qualification_licenses.forEach(ql => {
    ql.suspended = null;
  });

  return state.merge({
    attemptingFinanceRestoreCentreLicenses: false,
    licenses: licenses
  });
};

const financeRestoreCentreLicensesFailure = (state, action) =>
  state.merge({
    attemptingFinanceRestoreCentreLicenses: false
  });

// Finance Add Centre Qualification Licenses to a Centre
const financeAddCentreQualificationLicensesAttempt = (state, action) =>
  state.merge({
    attemptingFinanceAddQualificationLicenses: true,
    errorCode: null
  });

const financeAddCentreQualificationLicensesSuccess = (state, action) => {
  const qualification_id = lodash.get(action, 'data.data.qualification_id');
  const licenses = lodash.cloneDeep(state.licenses);
  const qualification_licenses = lodash.get(licenses, 'qualification_licenses');
  const license = lodash.find(
    qualification_licenses,
    license => license.qualification_id == qualification_id
  );

  if (license) {
    license.free = lodash.get(action, 'data.data.free_licenses');
    license.quantity = lodash.get(action, 'data.data.total_licenses');
  }

  return state.merge({
    attemptingFinanceAddQualificationLicenses: false,
    licenses: licenses
  });
};

const financeAddCentreQualificationLicensesFailure = (state, action) =>
  state.merge({
    attemptingFinanceAddQualificationLicenses: false
  });

export default createReducer(INITIAL_STATE, {
  [Types.FINANCE_SET_ACTIVE_LAYOUT]: financeSetActiveLayout,
  [Types.FINANCE_SET_ACTIVE_CENTRE]: financeSetActiveCentre,
  [Types.FINANCE_SET_SEARCH_TERM]: financeSetSearchTerm,
  [Types.FINANCE_UPDATE_ORDER_SETTINGS]: financeUpdateOrderSettings,

  [Types.FINANCE_GET_ALL_CENTRES_ATTEMPT]: financeGetAllCentresAttempt,
  [Types.FINANCE_GET_ALL_CENTRES_SUCCESS]: financeGetAllCentresSuccess,
  [Types.FINANCE_GET_ALL_CENTRES_FAILURE]: financeGetAllCentresFailure,

  [Types.FINANCE_GET_CENTRE_LICENSES_ATTEMPT]: financeGetCentreLicensesAttempt,
  [Types.FINANCE_GET_CENTRE_LICENSES_SUCCESS]: financeGetCentreLicensesSuccess,
  [Types.FINANCE_GET_CENTRE_LICENSES_FAILURE]: financeGetCentreLicensesFailure,

  [Types.FINANCE_SUSPEND_CENTRE_ATTEMPT]: financeSuspendCentreAttempt,
  [Types.FINANCE_SUSPEND_CENTRE_SUCCESS]: financeSuspendCentreSuccess,
  [Types.FINANCE_SUSPEND_CENTRE_FAILURE]: financeSuspendCentreFailure,

  [Types.FINANCE_RESTORE_CENTRE_ATTEMPT]: financeRestoreCentreAttempt,
  [Types.FINANCE_RESTORE_CENTRE_SUCCESS]: financeRestoreCentreSuccess,
  [Types.FINANCE_RESTORE_CENTRE_FAILURE]: financeRestoreCentreFailure,

  [Types.FINANCE_SUSPEND_CENTRE_LICENSE_ATTEMPT]: financeSuspendCentreLicenseAttempt,
  [Types.FINANCE_SUSPEND_CENTRE_LICENSE_SUCCESS]: financeSuspendCentreLicenseSuccess,
  [Types.FINANCE_SUSPEND_CENTRE_LICENSE_FAILURE]: financeSuspendCentreLicenseFailure,

  [Types.FINANCE_RESTORE_CENTRE_LICENSE_ATTEMPT]: financeRestoreCentreLicenseAttempt,
  [Types.FINANCE_RESTORE_CENTRE_LICENSE_SUCCESS]: financeRestoreCentreLicenseSuccess,
  [Types.FINANCE_RESTORE_CENTRE_LICENSE_FAILURE]: financeRestoreCentreLicenseFailure,

  [Types.FINANCE_SUSPEND_CENTRE_LICENSES_ATTEMPT]: financeSuspendCentreLicensesAttempt,
  [Types.FINANCE_SUSPEND_CENTRE_LICENSES_SUCCESS]: financeSuspendCentreLicensesSuccess,
  [Types.FINANCE_SUSPEND_CENTRE_LICENSES_FAILURE]: financeSuspendCentreLicensesFailure,

  [Types.FINANCE_RESTORE_CENTRE_LICENSES_ATTEMPT]: financeRestoreCentreLicensesAttempt,
  [Types.FINANCE_RESTORE_CENTRE_LICENSES_SUCCESS]: financeRestoreCentreLicensesSuccess,
  [Types.FINANCE_RESTORE_CENTRE_LICENSES_FAILURE]: financeRestoreCentreLicensesFailure,

  [Types.FINANCE_ADD_CENTRE_QUALIFICATION_LICENSES_ATTEMPT]: financeAddCentreQualificationLicensesAttempt,
  [Types.FINANCE_ADD_CENTRE_QUALIFICATION_LICENSES_SUCCESS]: financeAddCentreQualificationLicensesSuccess,
  [Types.FINANCE_ADD_CENTRE_QUALIFICATION_LICENSES_FAILURE]: financeAddCentreQualificationLicensesFailure
});
