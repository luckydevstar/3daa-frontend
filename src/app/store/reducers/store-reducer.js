import { createReducer } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { find, not, propEq, filter } from 'ramda';
import * as lodash from 'lodash';
import { Types } from '../actions';
import initialCourses from '../config/courses';
import config from 'brand/config';

export const INITIAL_STATE = Immutable({
  courses: initialCourses[config.title],
  cart: [],
  attemptingGetQualificationsInStore: false,
  attemptingGetQualificationInStore: false,
  attemptingGetCentreMembers: false,
  attemptingPurchaseQualification: false,
  attemptingPurchase: false,
  attemptingOrdersInAccount: false, // Orders of account
  attemptingQualificationOrder: false,
  attemptingQualificationLicense: false,
  attemptingAssign: false,

  currentQualification: null,
  centreMembers: {
    total: 0,
    members: []
  },
  qualifications: [],
  selectedCentreMembers: [],
  orders: {
    total: 0,
    orders: []
  },
  qualificationOrder: null,
  qualificationLicenses: {
    total: 0,
    qualification_licenses: []
  },
  qualificationLicense: null
});

const setCourses = (state, { courses }) =>
  state.merge({
    courses
  });

const addToCart = (state, { qualification_id, count }) => {
  const qualification = find(propEq('qualification_id', qualification_id))(
    state.cart
  );
  // let qualifications = lodash.cloneDeep(state.qualifications);
  // let temp = qualifications.find(q => q.qualification_id == qualification_id);
  // temp.free_licenses = temp.free_licenses - count;

  if (qualification) {
    const cart = state.cart.filter(
      item => item.qualification_id !== qualification_id
    );

    return state.merge({
      // qualifications: qualifications,
      cart: [
        ...cart,
        {
          qualification_id,
          count: count
          // count: course.count + count
        }
      ]
    });
  } else {
    return state.merge({
      // qualifications: qualifications,
      cart: [
        ...state.cart,
        {
          qualification_id,
          count
        }
      ]
    });
  }
};

const removeFromCart = (state, { qualification_id }) => {
  const newCart = state.cart.filter(
    item => item.qualification_id !== qualification_id
  );

  // const qualification = state.cart.find(
  //   item => item.qualification_id == qualification_id
  // );

  // let qualifications = lodash.cloneDeep(state.qualifications);
  // let temp = qualifications.find(q => q.qualification_id == qualification_id);
  // temp.free_licenses = temp.free_licenses + lodash.get(qualification, 'count', 0);

  return state.merge({
    // qualifications: qualifications,
    cart: newCart
  });
};

const setItemCount = (state, { index, count }) => {
  const newCart = state.cart.map((item, i) => {
    if (index === i) {
      return {
        ...item,
        count
      };
    } else {
      return item;
    }
  });

  return state.merge({
    cart: newCart
  });
};

const getAllQualificationsInStoreAttempt = state =>
  state.merge({
    attemptingGetQualificationsInStore: true,
    qualifications: [],
    selectedCentreMembers: [],
    errorCode: null
  });

const getAllQualificationsInStoreSuccess = (state, action) => {
  const qualifications = action.response.data.qualifications || [];
  return state.merge({
    attemptingGetQualificationsInStore: false,
    qualifications: qualifications,
    errorCode: null
  });
};

const getAllQualificationsInStoreFailure = (state, action) => {
  return state.merge({
    attemptingGetQualificationsInStore: false,
    errorCode: null
  });
};

const setActiveQualification = (state, action) => {
  return state.merge({
    currentQualification: action.qualification
  });
};

const getQualificationInStoreAttempt = state => {
  return state.merge({
    attemptingGetQualificationInStore: true,
    currentQualification: null,
    errorCode: null
  });
};

const getQualificationInStoreSuccess = (state, action) => {
  console.log(action);
  return state.merge({
    attemptingGetQualificationInStore: false,
    currentQualification: lodash.get(action, 'response.qualification', null)
  });
};

const getQualificationInStoreFailure = (state, action) => {
  return state.merge({
    attemptingGetQualificationInStore: false,
    errorCode: null
  });
};

const getCentreMembersNotQualificationAttempt = state =>
  state.merge({
    attemptingGetCentreMembers: true,
    centreMembers: {
      total: 0,
      members: []
    },
    errorCode: null
  });

const getCentreMembersNotQualificationSuccess = (state, action) => {
  return state.merge({
    attemptingGetCentreMembers: false,
    centreMembers: {
      total: lodash.get(action, 'response.data.total', 0),
      members: lodash.get(action, 'response.data.members', [])
    },
    errorCode: null
  });
};

const getCentreMembersNotQualificationFailure = (state, action) => {
  return state.merge({
    attemptingGetCentreMembers: false,
    errorCode: null
  });
};

const getOrdersInAccountAttempt = state =>
  state.merge({
    attemptingOrdersInAccount: true,
    orders: {
      total: 0,
      orders: []
    },
    errorCode: null
  });

const getOrdersInAccountSuccess = (state, action) => {
  const orders = lodash.get(action, 'response.data', []) || [];
  return state.merge({
    attemptingOrdersInAccount: false,
    orders: orders
  });
};

const getOrdersInAccountFailure = (state, action) => {
  return state.merge({
    attemptingOrdersInAccount: false
  });
};

const getQualificationOrderAttempt = state =>
  state.merge({
    attemptingQualificationOrder: true,
    qualificationOrder: [],
    errorCode: null
  });

const getQualificationOrderSuccess = (state, action) => {
  const temp = lodash.get(action, 'response.data', []) || [];
  return state.merge({
    attemptingQualificationOrder: false,
    qualificationOrder: temp
  });
};

const getQualificationOrderFailure = (state, action) => {
  return state.merge({
    attemptingQualificationOrder: false
  });
};

const getQualificationLicensesAttempt = state =>
  state.merge({
    attemptingQualificationLicensess: true,
    qualificationLicenses: [],
    errorCode: null
  });

const getQualificationLicensesSuccess = (state, action) => {
  const temp = lodash.get(action, 'response.data', []) || [];
  return state.merge({
    attemptingQualificationLicenses: false,
    qualificationLicenses: temp
  });
};

const getQualificationLicensesFailure = (state, action) => {
  return state.merge({
    attemptingQualificationLicenses: false
  });
};

const getQualificationLicenseAttempt = state =>
  state.merge({
    attemptingQualificationLicense: true,
    qualificationLicense: null,
    errorCode: null
  });

const getQualificationLicenseSuccess = (state, action) => {
  const temp = lodash.get(action, 'response.data', []) || [];
  return state.merge({
    attemptingQualificationLicense: false,
    qualificationLicense: temp
  });
};

const getQualificationLicenseFailure = (state, action) => {
  return state.merge({
    attemptingQualificationLicense: false
  });
};

const postQualificationPurchaseLicencesCentreAttempt = state =>
  state.merge({
    attemptingPurchaseQualification: true,
    errorCode: null
  });

const postQualificationPurchaseLicencesCentreSuccess = (state, action) => {
  return state.merge({
    attemptingPurchaseQualification: false,
    errorCode: null
  });
};

const postQualificationPurchaseLicencesCentreFailure = (state, action) => {
  console.log(action);
  return state.merge({
    attemptingPurchaseQualification: false,
    errorCode: null
  });
};

const postPurchaseLicencesCentreAttempt = state =>
  state.merge({
    attemptingPurchase: true,
    errorCode: null
  });

const postPurchaseLicencesCentreSuccess = (state, action) => {
  // const qualification = lodash.get(action, 'response.data') || [];
  // const temp = lodash.cloneDeep(state.qualifications);
  // const currentTemp = lodash.cloneDeep(state.currentQualification);

  // if (qualification) {
  //   const q = temp.find(
  //     i => i.qualification_id == qualification.qualification_id
  //   );

  //   if (q) {
  //     q.free_licenses = qualification.quantity - qualification.used;
  //   }

  //   if (
  //     currentTemp &&
  //     currentTemp.qualification_id == qualification.qualification_id
  //   ) {
  //     currentTemp.free_licenses = qualification.quantity - qualification.used;
  //   }
  // }

  return state.merge({
    attemptingPurchase: false,
    cart: [],
    // qualifications: temp,
    // currentQualification: currentTemp,
    errorCode: null
  });
};

const postPurchaseLicencesCentreFailure = (state, action) => {
  return state.merge({
    attemptingPurchase: false,
    errorCode: null
  });
};

const postAssignQualificationLicencesLearnersAttempt = state =>
  state.merge({
    attemptingAssign: true,
    errorCode: null
  });

const postAssignQualificationLicencesLearnersSuccess = (state, action) => {
  const qualifications = lodash.get(action, 'response.data') || [];
  const temp = lodash.cloneDeep(state.qualifications);
  const currentTemp = lodash.cloneDeep(state.currentQualification);

  qualifications.forEach(item => {
    const q = temp.find(i => i.qualification_id == item.qualification_id);

    if (q) q.free_licenses = item.quantity - item.used;

    if (currentTemp && currentTemp.qualification_id == item.qualification_id) {
      currentTemp.free_licenses = item.quantity - item.used;
    }
  });

  return state.merge({
    attemptingAssign: false,
    cart: [],
    // qualifications: temp,
    // currentQualification: currentTemp,
    errorCode: null
  });
};

const postAssignQualificationLicencesLearnersFailure = (state, action) => {
  return state.merge({
    attemptingAssign: false,
    errorCode: null
  });
};

const selectCecntreMember = (state, action) => {
  const { selectedCentreMembers } = state;
  let newSelectedMembers = [];
  const index = selectedCentreMembers.findIndex(
    sm => sm.member_id == action.member.member_id
  );

  if (index >= 0) {
    newSelectedMembers = selectedCentreMembers.filter(
      sm => sm.member_id != action.member.member_id
    );
  } else {
    newSelectedMembers = [...selectedCentreMembers, action.member];
  }

  return state.merge({
    selectedCentreMembers: newSelectedMembers
  });
};

const deselectCentreMember = (state, action) => {
  const { selectedCentreMembers } = state;
  let newSelectedMembers = selectedCentreMembers.filter(
    sm => sm.member_id != action.member.member_id
  );

  return state.merge({
    selectedCentreMembers: newSelectedMembers
  });
};

const cleanSelectedCentreMembers = state => {
  return state.merge({
    selectedCentreMembers: []
  });
};

const ACTION_HANDLERS = {
  [Types.SET_COURSES]: setCourses,
  [Types.ADD_TO_CART]: addToCart,
  [Types.REMOVE_FROM_CART]: removeFromCart,
  [Types.CLEAN_CENTRE_SELECTED_MEMBERS]: cleanSelectedCentreMembers,
  [Types.SET_ITEM_COUNT]: setItemCount,
  [Types.SELECT_CENTRE_MEMBER]: selectCecntreMember,
  [Types.DESELECT_CENTRE_MEMBER]: deselectCentreMember,

  [Types.SET_ACTIVE_QUALIFICATION]: setActiveQualification,

  [Types.GET_ALL_QUALIFICATIONS_IN_STORE_ATTEMPT]: getAllQualificationsInStoreAttempt,
  [Types.GET_ALL_QUALIFICATIONS_IN_STORE_SUCCESS]: getAllQualificationsInStoreSuccess,
  [Types.GET_ALL_QUALIFICATIONS_IN_STORE_FAILURE]: getAllQualificationsInStoreFailure,

  [Types.GET_QUALIFICATION_IN_STORE_ATTEMPT]: getQualificationInStoreAttempt,
  [Types.GET_QUALIFICATION_IN_STORE_SUCCESS]: getQualificationInStoreSuccess,
  [Types.GET_QUALIFICATION_IN_STORE_FAILURE]: getQualificationInStoreFailure,

  [Types.GET_QUALIFICATION_IN_STORE_ATTEMPT]: getQualificationInStoreAttempt,
  [Types.GET_QUALIFICATION_IN_STORE_SUCCESS]: getQualificationInStoreSuccess,
  [Types.GET_QUALIFICATION_IN_STORE_FAILURE]: getQualificationInStoreFailure,

  [Types.GET_CENTRE_MEMBERS_NOT_QUALIFICATION_ATTEMPT]: getCentreMembersNotQualificationAttempt,
  [Types.GET_CENTRE_MEMBERS_NOT_QUALIFICATION_SUCCESS]: getCentreMembersNotQualificationSuccess,
  [Types.GET_CENTRE_MEMBERS_NOT_QUALIFICATION_FAILURE]: getCentreMembersNotQualificationFailure,

  [Types.GET_ORDERS_IN_ACCOUNT_ATTEMPT]: getOrdersInAccountAttempt,
  [Types.GET_ORDERS_IN_ACCOUNT_SUCCESS]: getOrdersInAccountSuccess,
  [Types.GET_ORDERS_IN_ACCOUNT_FAILURE]: getOrdersInAccountFailure,

  [Types.GET_QUALIFICATION_ORDER_ATTEMPT]: getQualificationOrderAttempt,
  [Types.GET_QUALIFICATION_ORDER_SUCCESS]: getQualificationOrderSuccess,
  [Types.GET_QUALIFICATION_ORDER_FAILURE]: getQualificationOrderFailure,

  [Types.GET_QUALIFICATION_LICENSES_ATTEMPT]: getQualificationLicensesAttempt,
  [Types.GET_QUALIFICATION_LICENSES_SUCCESS]: getQualificationLicensesSuccess,
  [Types.GET_QUALIFICATION_LICENSES_FAILURE]: getQualificationLicensesFailure,

  [Types.GET_QUALIFICATION_LICENSE_ATTEMPT]: getQualificationLicenseAttempt,
  [Types.GET_QUALIFICATION_LICENSE_SUCCESS]: getQualificationLicenseSuccess,
  [Types.GET_QUALIFICATION_LICENSE_FAILURE]: getQualificationLicenseFailure,

  [Types.POST_QUALIFICATION_PURCHASE_LICENCES_CENTRE_ATTEMPT]: postQualificationPurchaseLicencesCentreAttempt,
  [Types.POST_QUALIFICATION_PURCHASE_LICENCES_CENTRE_SUCCESS]: postQualificationPurchaseLicencesCentreSuccess,
  [Types.POST_QUALIFICATION_PURCHASE_LICENCES_CENTRE_FAILURE]: postQualificationPurchaseLicencesCentreFailure,

  [Types.POST_PURCHASE_LICENCES_CENTRE_ATTEMPT]: postPurchaseLicencesCentreAttempt,
  [Types.POST_PURCHASE_LICENCES_CENTRE_SUCCESS]: postPurchaseLicencesCentreSuccess,
  [Types.POST_PURCHASE_LICENCES_CENTRE_FAILURE]: postPurchaseLicencesCentreFailure,

  [Types.POST_ASSIGN_QUALIFICATION_LICENCES_LEARNERS_ATTEMPT]: postAssignQualificationLicencesLearnersAttempt,
  [Types.POST_ASSIGN_QUALIFICATION_LICENCES_LEARNERS_SUCCESS]: postAssignQualificationLicencesLearnersSuccess,
  [Types.POST_ASSIGN_QUALIFICATION_LICENCES_LEARNERS_FAILURE]: postAssignQualificationLicencesLearnersFailure
};

export default createReducer(INITIAL_STATE, ACTION_HANDLERS);
