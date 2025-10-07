import { createActions } from 'reduxsauce';

export const { Types, Creators } = createActions({
  setupCustomerEditAttempt: ['customer'],
  resetCustomerData: [],

  editCustomerAttempt: ['params', 'platform_customer_id'],
  editCustomerSuccess: [],
  editCustomerFailure: [],

  deleteCustomerAttempt: ['customers', 'platform_customer_id'],
  deleteCustomerSuccess: ['customers'],
  deleteCustomerFailure: [],

  createCustomerAttempt: ['params'],
  createCustomerSuccess: [],
  createCustomerFailure: ['customerErrorCode'],

  getCustomersAttempt: [],
  getCustomersSuccess: ['customers'],
  getCustomersFailure: ['customerErrorCode'],

  // Customer details actions

  setFirstName: ['firstname'],
  setLastName: ['lastname'],
  setEmail: ['email'],
  setContactNumber: ['contact_number'],
  setGender: ['gender'],

  // Business details actions

  setBusinessOwner: ['business_owner'],
  setBusinessName: ['business_name'],
  setBusinessWebsite: ['business_website'],
  setBusinessNumber: ['business_number'],
  setAddressLine1: ['address_line_1'],
  setAddressLine2: ['address_line_2'],
  setCountry: ['country'],
  setTownCity: ['town_city'],
  setPostcode: ['postcode'],

  // Other

  setBrandLogoScale: ['brand_logo_scale'],
  setBrandLogoTitle: ['brand_logo_title'],
  setBrandLogoFont: ['brand_logo_font'],
  setBrandLogoFontSize: ['brand_logo_font_size'],
  setBrandLogoColor: ['brand_logo_color'],
  setBrandWebfontSystemFont: ['brand_webfont_system_font'],
  setBrandColorsPrimary: ['brand_colors_primary'],
  setBrandColorsSecondary: ['brand_colors_secondary'],
  setBrandColorsAccent: ['brand_colors_accent'],

  setLogoType: ['logoType'],
  setUploadedLogo: ['uploadedLogo'],
  removeUploadedLogo: null,
  setLogoHeight: ['logoHeight'],
  setLogoText: ['logoText'],
  setLogoFont: ['logoFont'],
  setLogoFontSize: ['logoFontSize'],
  setLogoFontColor: ['logoFontColor'],
  setWebFont: ['webFont'],
  setColorPrimary: ['colorPrimary'],
  setColorSecondary: ['colorSecondary'],
  setColorAccent: ['colorAccent'],
  setUploadedDefaultBackground: ['uploadedDefaultBackground'],
  removeUploadedDefaultBackground: null
});
