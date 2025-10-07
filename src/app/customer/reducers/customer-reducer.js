import Immutable from 'seamless-immutable';
import { createReducer } from 'reduxsauce';
import common from 'app/common';

import { Types } from '../actions';
const { createCloudinaryUrl } = common.util.helpers;

export const INITIAL_STATE = Immutable({
  customerToEdit: '',
  uiLoadingCustomer: false,
  createCustomerAttempting: false,
  customers: [],
  logo_media_url: '',
  organization_media_url: '',
  firstname: '',
  lastname: '',
  email: '',
  contact_number: '',
  gender: '',
  business_owner: '',
  business_name: '',
  business_website: '',
  business_number: '',
  address_line_1: '',
  address_line_2: '',
  country: '',
  town_city: '',
  postcode: '',

  // brand
  brand_logo_media_url: '',
  brand_logo_scale: 100,
  brand_logo_title: 'Example',
  brand_logo_font: 'Open Sans Regular',
  brand_logo_font_size: 45,
  brand_logo_color: '#000000',
  brand_webfont_system_font: 'Open Sans Regular',
  brand_colors_primary: '',
  brand_colors_secondary: '',
  brand_colors_accent: '',

  logoType: 'image',
  uploadedLogo: [],
  uploadedDefaultBackground: [],
  customerErrorCode: ''
});

const setLogoType = (state, { logoType }) =>
  state.merge({
    logoType
  });

const setUploadedLogo = (state, { uploadedLogo }) =>
  state.merge({
    uploadedLogo
  });

const removeUploadedLogo = state =>
  state.merge({
    uploadedLogo: []
  });

const setLogoHeight = (state, { logoHeight }) =>
  state.merge({
    logoHeight
  });

const setLogoText = (state, { logoText }) =>
  state.merge({
    logoText
  });

const setLogoFont = (state, { logoFont }) =>
  state.merge({
    logoFont
  });

const setLogoFontSize = (state, { logoFontSize }) =>
  state.merge({
    logoFontSize
  });

const setLogoFontColor = (state, { logoFontColor }) =>
  state.merge({
    logoFontColor
  });

const setWebFont = (state, { webFont }) =>
  state.merge({
    webFont
  });

const setColorPrimary = (state, { colorPrimary }) =>
  state.merge({
    colorPrimary
  });

const setColorSecondary = (state, { colorSecondary }) =>
  state.merge({
    colorSecondary
  });

const setColorAccent = (state, { colorAccent }) =>
  state.merge({
    colorAccent
  });

const setUploadedDefaultBackground = (state, { uploadedDefaultBackground }) =>
  state.merge({
    uploadedDefaultBackground
  });

const removeUploadedDefaultBackground = state =>
  state.merge({
    uploadedDefaultBackground: []
  });

const getCustomersAttempt = state =>
  state.merge({
    uiLoadingCustomer: true
  });

const getCustomersSuccess = (state, { customers }) =>
  state.merge({
    customers,
    uiLoadingCustomer: false
  });

const getCustomersFailure = (state, { customerErrorCode }) =>
  state.merge({
    uiLoadingCustomer: false,
    customerErrorCode
  });

const createCustomerAttempt = state =>
  state.merge({
    createCustomerAttempting: true
  });

const createCustomerSuccess = state =>
  state.merge({
    createCustomerAttempting: false
  });

const createCustomerFailure = state =>
  state.merge({
    createCustomerAttempting: false
  });

const setFirstName = (state, { firstname }) =>
  state.merge({
    firstname
  });

const setLastName = (state, { lastname }) =>
  state.merge({
    lastname
  });

const setEmail = (state, { email }) =>
  state.merge({
    email
  });

const setContactNumber = (state, { contact_number }) =>
  state.merge({
    contact_number
  });

const setGender = (state, { gender }) =>
  state.merge({
    gender
  });

const setBusinessOwner = (state, { business_owner }) =>
  state.merge({
    business_owner
  });

const setBusinessName = (state, { business_name }) =>
  state.merge({
    business_name
  });

const setBusinessWebsite = (state, { business_website }) =>
  state.merge({
    business_website
  });

const setBusinessNumber = (state, { business_number }) =>
  state.merge({
    business_number
  });

const setAddressLine1 = (state, { address_line_1 }) =>
  state.merge({
    address_line_1
  });

const setAddressLine2 = (state, { address_line_2 }) =>
  state.merge({
    address_line_2
  });

const setCountry = (state, { country }) =>
  state.merge({
    country
  });

const setTownCity = (state, { town_city }) =>
  state.merge({
    town_city
  });

const setPostcode = (state, { postcode }) =>
  state.merge({
    postcode
  });

const setBrandLogoScale = (state, { brand_logo_scale }) =>
  state.merge({
    brand_logo_scale
  });

const setBrandLogoTitle = (state, { brand_logo_title }) =>
  state.merge({
    brand_logo_title
  });

const setBrandLogoFont = (state, { brand_logo_font }) =>
  state.merge({
    brand_logo_font
  });

const setBrandLogoFontSize = (state, { brand_logo_font_size }) =>
  state.merge({
    brand_logo_font_size
  });

const setBrandLogoColor = (state, { brand_logo_color }) =>
  state.merge({
    brand_logo_color
  });

const setBrandWebfontSystemFont = (state, { brand_webfont_system_font }) =>
  state.merge({
    brand_webfont_system_font
  });

const setBrandColorsPrimary = (state, { brand_colors_primary }) =>
  state.merge({
    brand_colors_primary
  });

const setBrandColorsSecondary = (state, { brand_colors_secondary }) =>
  state.merge({
    brand_colors_secondary
  });

const setBrandColorsAccent = (state, { brand_colors_accent }) =>
  state.merge({
    brand_colors_accent
  });

const deleteCustomerAttempt = state => state;

const deleteCustomerSuccess = (state, { customers }) =>
  state.merge({
    customers
  });

const setupCustomerEditAttempt = (state, { customer }) => {
  return state.merge({
    customerToEdit: customer.platform_customer_id,
    firstname: customer.firstname,
    lastname: customer.lastname,
    email: customer.email,
    gender: customer.gender,
    contact_number: customer.contact_number,
    logo_media_url: createCloudinaryUrl(customer.logo_media_id),
    organization_media_url: createCloudinaryUrl(customer.organization_media_id),
    brand_logo_media_url: createCloudinaryUrl(customer.content.logo.media_id),
    business_owner: customer.business_owner,
    business_name: customer.business_name,
    business_website: customer.business_website,
    business_number: customer.business_number,
    address_line_1: customer.address_line_1,
    address_line_2: customer.address_line_2,
    country: customer.country,
    town_city: customer.city_name,
    postcode: customer.postcode,
    brand_colors_primary: `#${customer.content.colors.primary}`,
    brand_colors_secondary: `#${customer.content.colors.secondary}`,
    brand_colors_accent: `#${customer.content.colors.accent}`,
    brand_logo_scale: +customer.content.logo.scale,
    brand_webfont_system_font: customer.content.webfont.system_font
  });
};

const resetCustomerData = () => INITIAL_STATE;

const editCustomerAttempt = state =>
  state.merge({
    createCustomerAttempting: true
  });

const editCustomerSuccess = state =>
  state.merge({
    createCustomerAttempting: false
  });

const editCustomerFailure = state =>
  state.merge({
    createCustomerAttempting: false
  });

const ACTION_HANDLERS = {
  [Types.SETUP_CUSTOMER_EDIT_ATTEMPT]: setupCustomerEditAttempt,
  [Types.RESET_CUSTOMER_DATA]: resetCustomerData,

  [Types.EDIT_CUSTOMER_ATTEMPT]: editCustomerAttempt,
  [Types.EDIT_CUSTOMER_SUCCESS]: editCustomerSuccess,
  [Types.EDIT_CUSTOMER_FAILURE]: editCustomerFailure,

  [Types.DELETE_CUSTOMER_ATTEMPT]: deleteCustomerAttempt,
  [Types.DELETE_CUSTOMER_SUCCESS]: deleteCustomerSuccess,

  [Types.CREATE_CUSTOMER_ATTEMPT]: createCustomerAttempt,
  [Types.CREATE_CUSTOMER_SUCCESS]: createCustomerSuccess,
  [Types.CREATE_CUSTOMER_FAILURE]: createCustomerFailure,

  [Types.GET_CUSTOMERS_ATTEMPT]: getCustomersAttempt,
  [Types.GET_CUSTOMERS_SUCCESS]: getCustomersSuccess,
  [Types.GET_CUSTOMERS_FAILURE]: getCustomersFailure,

  [Types.SET_FIRST_NAME]: setFirstName,
  [Types.SET_LAST_NAME]: setLastName,
  [Types.SET_EMAIL]: setEmail,
  [Types.SET_CONTACT_NUMBER]: setContactNumber,
  [Types.SET_GENDER]: setGender,
  [Types.SET_BUSINESS_OWNER]: setBusinessOwner,
  [Types.SET_BUSINESS_NAME]: setBusinessName,
  [Types.SET_BUSINESS_WEBSITE]: setBusinessWebsite,
  [Types.SET_BUSINESS_NUMBER]: setBusinessNumber,
  [Types.SET_ADDRESS_LINE1]: setAddressLine1,
  [Types.SET_ADDRESS_LINE2]: setAddressLine2,
  [Types.SET_COUNTRY]: setCountry,
  [Types.SET_TOWN_CITY]: setTownCity,
  [Types.SET_POSTCODE]: setPostcode,
  [Types.SET_BRAND_LOGO_SCALE]: setBrandLogoScale,
  [Types.SET_BRAND_LOGO_TITLE]: setBrandLogoTitle,
  [Types.SET_BRAND_LOGO_FONT]: setBrandLogoFont,
  [Types.SET_BRAND_LOGO_FONT_SIZE]: setBrandLogoFontSize,
  [Types.SET_BRAND_LOGO_COLOR]: setBrandLogoColor,
  [Types.SET_BRAND_WEBFONT_SYSTEM_FONT]: setBrandWebfontSystemFont,
  [Types.SET_BRAND_COLORS_PRIMARY]: setBrandColorsPrimary,
  [Types.SET_BRAND_COLORS_SECONDARY]: setBrandColorsSecondary,
  [Types.SET_BRAND_COLORS_ACCENT]: setBrandColorsAccent,

  [Types.SET_LOGO_TYPE]: setLogoType,
  [Types.SET_UPLOADED_LOGO]: setUploadedLogo,
  [Types.REMOVE_UPLOADED_LOGO]: removeUploadedLogo,
  [Types.SET_LOGO_HEIGHT]: setLogoHeight,
  [Types.SET_LOGO_TEXT]: setLogoText,
  [Types.SET_LOGO_FONT]: setLogoFont,
  [Types.SET_LOGO_FONT_SIZE]: setLogoFontSize,
  [Types.SET_LOGO_FONT_COLOR]: setLogoFontColor,
  [Types.SET_WEB_FONT]: setWebFont,
  [Types.SET_COLOR_PRIMARY]: setColorPrimary,
  [Types.SET_COLOR_SECONDARY]: setColorSecondary,
  [Types.SET_COLOR_ACCENT]: setColorAccent,
  [Types.SET_UPLOADED_DEFAULT_BACKGROUND]: setUploadedDefaultBackground,
  [Types.REMOVE_UPLOADED_DEFAULT_BACKGROUND]: removeUploadedDefaultBackground
};

export default createReducer(INITIAL_STATE, ACTION_HANDLERS);
