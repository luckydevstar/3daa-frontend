import cloudinary from 'cloudinary-core';
import { connect } from 'react-redux';
import React from 'react';
import moment from 'moment-timezone';
import {
  prop,
  any,
  allPass,
  pathEq,
  unless,
  is,
  pipe,
  sortBy,
  curry,
  identity,
  reverse,
  of,
  path,
  uncurryN,
  reduce,
  append,
  over,
  lensIndex,
  tap,
  mergeWith,
  all,
  lensProp,
  ifElse,
  always,
  isNil,
  filter,
  assoc,
  map
} from 'ramda';
import * as lodash from 'lodash';
import config from 'brand/config';
import { Roles } from 'app/core/config/constants';
import animatedScrollTo from './helper-library-scrollto';
import { warn } from 'app/common/util/logger';
import UILoading from '../components';

/**
 * Checks if an ancestor of an element has
 * specific classname
 * @param  {el} DOM Element
 * @param  {className} string Classname of the element
 * @return {boolean}
 */
export const ancestorHasClass = (el, className) => {
  do {
    if (el.classList && el.classList.contains(className)) {
      return true;
    }
    el = el.parentNode;
  } while (el);
  return false;
};

/**
 * Checks if an element is fully hidden under the header
 * @param  {className} string Classname of the element
 * @return {boolean}
 */
export const elementAboveHeader = (className, offset = 10) => {
  try {
    // Will always be the main header thanks
    // to it's position in the DOM
    const hh = document.querySelector('header').offsetHeight;
    const el = document.querySelector(className);
    const rect = el.getBoundingClientRect();

    return rect.top + rect.height - offset < hh;
  } catch (e) {
    throw new Error(
      `Helper - elementAboveHeader(className): className did not match any elements in the DOM.`
    );
  }
};

/**
 * Checks if the top of an element reaches to the header
 * @param  {className} string Classname of the element
 * @return {boolean}
 */
export const elementReachHeader = className => {
  try {
    // Will always be the main header thanks
    // to it's position in the DOM
    const hh = document.querySelector('header').offsetHeight;
    const el = document.querySelector(className);
    const rect = el.getBoundingClientRect();

    return rect.top <= hh;
  } catch (e) {
    throw new Error(
      `Helper - elementAboveHeader(className): className did not match any elements in the DOM.`
    );
  }
};

/**
 * Helper to organise mixed qualification data from backend
 * into a qualification: { pathways: []} structure
 */
export const organiseQualificationsAndPathways = qualifications => {
  const template = {
    coreQualifications: [],
    pathwayQualifications: []
  };

  const pathwaysLens = lensProp('pathwayQualifications');
  const coreLens = lensProp('coreQualifications');

  const splitQualifications = (acc, element) =>
    over(
      ifElse(always(isNil(element.pathway)), coreLens, pathwaysLens),
      append(element)
    )(acc);
  const qualificationsTemp = qualifications.reduce(
    splitQualifications,
    template
  );

  const qualificationPathways = reference =>
    filter(e => e.reference === reference)(
      qualificationsTemp.pathwayQualifications
    );

  const joinQualifications = elem =>
    assoc('pathways', qualificationPathways(elem.reference))(elem);

  return map(joinQualifications)(qualificationsTemp.coreQualifications);
};

/**
 * Deeply merges an object
 * @param  {a} object
 * @param  {b} object
 * @return {object}
 */
export const deepMerge = (a, b) =>
  is(Object, a) && is(Object, b) ? mergeWith(deepMerge, a, b) : b;

/**
 * Checks whether a string exists in another string
 * @param  {parent} string
 * @param  {string} string
 * @return {boolean}
 */
export const includes = (parent, child) => lodash.indexOf(parent, child) >= 0;

/**
 * Returns the passed string cut down to length with added "..."
 * @param  {string} string
 * @param  {length} int
 * @return {string}
 */
export const excerpt = (string, length) =>
  `${string.substr(0, length)}${string.length >= length ? '...' : ''}`;

/**
 * Checks whether the argument(s) is whitespace
 * @param  {string} string
 * @return {boolean}
 */
export const isWhitespace = (...args) =>
  any(string => typeof string === 'string' && !/\S/.test(string), args);

/**
 * Returns a boolean identifying
 * if the value is truthy or not,
 * returning false if its whitespace
 * @param {val}
 * @return {boolean}
 */

export const truthy = (...args) => all(val => val && !isWhitespace(val), args);

// output a date in a specific format
export const formatDate = (date, format = 'Do MMMM YYYY') =>
  moment(date).format(format);

// noop is no operation
export const noop = () => {};

// inspect ramda pipes/composes
export const rlog = tap(console.log.bind(console));

// Creates an array of length and content
// arrayOf(2, () => '...') // => ['...', '...']
// arrayOf(3, i => i) // => [0, 1, 2]
export const arrayFrom = (i, x) => Array.from({ length: i }, x);

// Convert to array if not already
// coerceArray([1, 2, 3]); //=> [1, 2, 3]
// coerceArray(1);         //=> [1]
export const coerceArray = unless(is(Array), of);

// Random number between min & max, optional float
export const random = curry((min, max, isFloat) => {
  const rand = Math.random() * (max - min) + min;
  return isFloat ? rand : Math.floor(rand);
});

export const codeExplanation = code => {
  switch (code) {
    case 'CLIENT_ERROR':
      return 'client_error';
    case 'SERVER_ERROR':
      return 'server_error';
    case 'TIMEOUT_ERROR':
      return 'timeout_error';
    case 'CONNECTION_ERROR':
      return 'connection_error';
    case 'NETWORK_ERROR':
      return 'network_error';
    case 'CANCEL_ERROR':
      return 'cancel_error';
    default:
      return 'unidentified_error';
  }
};

// checkResponse will validate and return data, for use within sagas
export const checkResponse = (resp = {}) =>
  new Promise((resolve, reject) => {
    const checks = [
      prop('ok'),
      prop('data'),
      pathEq(['data', 'status'], 'success')
    ];

    const mediaUploadChecks = [prop('ok'), prop('data'), path(['data', 'url'])];

    if (allPass(checks)(resp) || allPass(mediaUploadChecks)(resp)) {
      resolve(prop('data', resp));
      return;
    }
    reject(
      path(['data', 'data', 'reference'], resp) ||
        path(['data', 'message'], resp) ||
        codeExplanation(prop('problem', resp))
    );
  });

// Recursively split array
// splitWhenRecursive(equals(2), [1, 2, 3, 1, 2, 3]); => [[1], [2, 3, 1], [2, 3]]
export const splitWhenRecursive = uncurryN(2, fn =>
  reduce(
    (acc, value) =>
      fn(value)
        ? append(of(value), acc)
        : over(lensIndex(-1), append(value), acc),
    of([])
  )
);

/**
 * Sorts through an array of objects based on parsed key values
 * @param  {array} array  [array containing the objects]
 * @param  {string} key   [string defining the key of the values to sort by]
 * @param  {string} order ['asc' for ascending, 'desc' for descending]
 * @return {array}        [array with sorted objects]
 */
export const sortObjects = (array, key, order) => {
  if (typeof order === 'undefined') {
    warn(
      "No 'order' argument parsed to sortObjects, defaulting to 'ascending'."
    );
  } else if (order !== 'asc' && order !== 'desc') {
    throw new Error('Incorrect object sort order argument supplied');
  }
  return array.sort((a, b) => {
    if (a[key] < b[key]) {
      return order === 'asc' ? -1 : 1;
    }
    if (a[key] > b[key]) {
      return order === 'asc' ? 1 : -1;
    }
    return 0;
  });
};

/**
 *
 * @param {*[]} list
 */

export const shuffle = list => {
  let counter = list.length;
  const listCopy = [...list];
  // While there are elements in the list
  while (counter > 0) {
    // Pick a random index
    const index = Math.floor(Math.random() * counter);
    // Decrease counter by 1
    counter--;
    // And swap the last element with it
    const temp = listCopy[counter];
    listCopy[counter] = listCopy[index];
    listCopy[index] = temp;
  }
  return listCopy;
};

/**
 * Sorts an array of objects based on property
 * @param  {array} array  array of objects
 * @param  {string} sortProp   property for sorting
 * @param  {string} order asc or desc
 * @return {array}
 */
export const sortArrayOfObjectsByProperty = (array, sortProp, sortOrder) => {
  return pipe(
    sortBy(prop(sortProp)),
    sortOrder === 'asc' ? identity : reverse
  )(array);
};

/**
 * Checks if element has a class name in the DOM
 * @param  {Node}    el        DOM node
 * @param  {string}  className Class name
 * @return {boolean}
 */
export const hasClass = (el, className) => {
  if (el.classList) {
    return el.classList.contains(className);
  }
  return !!el.className.match(new RegExp(`(\\s|^)${className}(\\s|$)`));
};

/**
 * Add a class to a DOM node, jQuery style :)
 * @param {DOMnode} el        Element to which to add class
 * @param {string} className   class name to add
 */
export const addClass = (el, className) => {
  if (el.classList) {
    el.classList.add(className);
  } else if (!hasClass(el, className)) {
    el.className += ` ${className}`;
  }
};

/**
 * Remove a class from a DOM node
 * @param  {DOMnode} el          Element from which to remove class
 * @param  {string} className class name to remove
 */
export const removeClass = (el, className) => {
  if (el.classList) {
    el.classList.remove(className);
  } else if (hasClass(el, className)) {
    const reg = new RegExp(`(\\s|^)${className}(\\s|$)`);
    el.className = el.className.replace(reg, ' ');
  }
};

export const scrollTo = animatedScrollTo;

/**
 * Searches for the specified string <str> in an Array of Object
 * Example given an array of objects
 * myArray = [{name:'john', gender:'man', title: 'engineer'}, {name:'jane', gender:'woman', title: 'manager'}]
 * To search for 'ne' in the title and the name fields should return both results as
 * search('ne', myArray, ['name', 'title'])
 * Similarly searching just against the title will return one object as [{name:'john', gender:'man', title: 'engineer'}]
 */

export const search = (str, array, fieldsArray) => {
  const resultsArray = [];
  array.forEach(item => {
    fieldsArray.forEach(field => {
      if (item[field].toUpperCase().indexOf(str.toUpperCase()) >= 0) {
        resultsArray.push(item);
      }
    });
  });
  return resultsArray;
};

/**
 * Converts an object of key - value pairs into formData
 * @param  {Object} object Object to convert
 * @return {Object}        FormData type object
 */

// export const convertToFormData = object => {
//   const form = new FormData();
//   Object.keys(object).forEach(key => {
//     if (Array.isArray(object[key])) {
//       // appendFormArray(form, object[key], key);
//       object[key].forEach(val => {
//         form.append(
//           `${key}[]`,
//           val
//         );
//       });
//     } else {
//       form.append(
//         key,
//         object[key] === null || object[key] === undefined
//           ? ''
//           : object[key]
//       );
//     }
//   });
//   return form;
// };
export const convertToFormData = object => {
  const form = new FormData();
  Object.keys(object).forEach(key => {
    if (Array.isArray(object[key])) {
      object[key].forEach(val => {
        form.append(
          `${key}[]`,
          typeof val === 'object' && !(val instanceof File)
            ? JSON.stringify(val)
            : val
        );
      });
    } else {
      form.append(
        key,
        object[key] === null || object[key] === undefined
          ? ''
          : typeof object[key] === 'object' && !(object[key] instanceof File)
          ? JSON.stringify(object[key])
          : object[key]
      );
    }
  });
  return form;
};

export const appendFormArray = (form_data, values, name) => {
  if (!values && name) form_data.append(name, '');
  else {
    if (typeof values == 'object') {
      for (key in values) {
        if (typeof values[key] == 'object')
          appendFormArray(form_data, values[key], name + '[' + key + ']');
        else appendFormArray.append(name + '[' + key + ']', values[key]);
      }
    } else form_data.append(name, values);
  }

  return form_data;
};

/**
 * Generate a cloudinary URL
 * @param  {[type]} fileId          TODO
 * @param  {[type]} mediaType       TODO
 * @param  {[type]} transformations TODO
 * @return {[type]}                 TODO
 */
export const createCloudinaryUrl = (fileId, mediaType, transformations) => {
  // let url;
  // const cl = cloudinary.Cloudinary.new();

  // cl.config('cloud_name', config.CLOUD_NAME);
  // cl.config('secure', true);

  // switch (mediaType) {
  //   case 'video':
  //     cl.config('resource_type', 'video');
  //     url = cl.url(fileId, transformations);
  //     break;
  //   case 'image':
  //     url = cl.url(fileId, transformations);
  //     break;
  //   case 'thumbnail':
  //     cl.config('resource_type', 'video');
  //     url = `${cl.url(fileId, transformations)}.jpg`;
  //     break;
  //   case 'pdf':
  //     url = cl.url(fileId);
  //     break;
  //   default:
  //     url = cl.url(fileId);
  //     break;
  // }
  return fileId;
};

export const createAmazonS3Url = fieldId => {
  return `https://${config.AWS_BUCKET}.s3.${
    config.AWS_DEFAULT_REGION
  }.amazonaws.com/${fieldId.replace(
    `https://${config.AWS_BUCKET}.s3.${config.AWS_DEFAULT_REGION}.amazonaws.com/`,
    ''
  )}`;
};

/**
 * Converts the first letter of a word to uppercase
 */
export const firstLetterCaps = word => {
  let newWord = '';
  for (let i = 0; i < word.length; i++) {
    if (i === 0) {
      newWord += word[0].toUpperCase();
    } else {
      newWord += word[i];
    }
  }
  return newWord;
};

/**
 * Extracts a single user role type as per R1 guidelines
 * from the passed user object
 * @param {object} user
 */

const {
  CentreAdmin,
  CentreTutor,
  CentreLearner,
  CentreEditor,
  SuperAdmin,
  SiteAdmin,
  InvalidUser,
  Member,
  UndefinedCentre,
  CentreEQA,
  CentreIQA,
  Finance,
  Author
} = Roles;

export const extractUserRole = user => {
  if (!user || !user.roles) {
    return InvalidUser;
  }

  if (lodash.indexOf(lodash.get(user, 'roles', []), SuperAdmin) >= 0) {
    return SuperAdmin;
  }
  if (lodash.indexOf(lodash.get(user, 'roles', []), SiteAdmin) >= 0) {
    return SiteAdmin;
  }
  if (lodash.indexOf(lodash.get(user, 'roles', []), CentreEQA) >= 0) {
    return CentreEQA;
  }
  if (lodash.indexOf(lodash.get(user, 'roles', []), CentreIQA) >= 0) {
    return CentreIQA;
  }
  if (lodash.indexOf(lodash.get(user, 'roles', []), Finance) >= 0) {
    return Finance;
  }
  if (lodash.indexOf(lodash.get(user, 'roles', []), Author) >= 0) {
    return Author;
  }

  if (lodash.get(user, 'centres.length')) {
    const centre_role = lodash.get(user, ['centres', '0', 'roles', '0']);
    // CENTRE_TUTOR_ROLE, CENTRE_ADMIN_ROLE
    return centre_role || UndefinedCentre;
  }
  return Member;
};

/**
 * Cycles through the valid roles and cuts out
 * passed roles
 * @param {Array} rolesArray
 */
export const validRolesWithout = (...args) => {
  return [
    CentreAdmin,
    CentreTutor,
    CentreLearner,
    CentreEditor,
    SuperAdmin,
    SiteAdmin,
    CentreEQA,
    CentreIQA,
    Finance,
    Author
  ].filter(role => lodash.indexOf(args, role) === -1);
};

export const humanReadableRole = userRole => {
  const role = userRole.split('_');
  role.splice(role.length - 1, 1);
  return role.join(' ').toLowerCase();
};

/**
 * Extracts the user status flag as per R1 guildines
 * from the passed user object
 * @param {object} user
 */

export const extractUserStatus = user => {
  if (!user) {
    return 'INVALID_USER';
  }
  if (user.unverified_email) {
    return 'UNVERIFIED_EMAIL';
  }
  if (user.centres.length > 0 && config.registrationFlow === '2') {
    return 'ACTIVE_USER';
  }

  if (
    // !user.completed ||
    config.registrationFlow !== '2' &&
    !user.membership_completed &&
    lodash.indexOf(lodash.get(user, 'roles', []), SuperAdmin) < 0 &&
    lodash.indexOf(lodash.get(user, 'roles', []), SiteAdmin) < 0
  ) {
    return 'INCOMPLETE_PROFILE';
  }
  if (
    // !user.completed ||
    config.registrationFlow === '2' &&
    !user.activated &&
    lodash.indexOf(lodash.get(user, 'roles', []), SuperAdmin) < 0 &&
    lodash.indexOf(lodash.get(user, 'roles', []), SiteAdmin) < 0
  ) {
    return 'INCOMPLETE_PROFILE';
  }
  if (user && config.registrationFlow === '2' && user.activated) {
    return 'ACTIVE_USER';
  }
  const centre = user.centres && user.centres[0];
  if (centre && !centre.completed) {
    return 'INCOMPLETE_PROFILE';
  }
  return 'ACTIVE_USER';
};

/**
 * Extracts the user centre
 * @param {object} user
 */
export const extractUserCentre = user => {
  if (user.centres && user.centres.length) {
    return user.centres[0];
  }
  return null;
};

/**
 * Helper for matchPermissions()
 * @param {Array} baseResource
 * @param {Array} matchedResource
 */
const checkResourceForMatch = (baseResource, matchedResource) => {
  return baseResource.some(
    permission => lodash.indexOf(matchedResource, permission) >= 0
  );
};

/**
 * Matches a users permissions against a comparison object,
 * returns a match flag
 * @param {Object} userPermissions
 * @param {Object} comparePermissions
 */
export const matchPermissions = (userPermissions, comparePermissions) => {
  let value;
  if (!userPermissions || !comparePermissions) {
    return null;
  }

  Object.keys(userPermissions).forEach(resourceName => {
    const baseResource = userPermissions[resourceName];
    const matchedResource = comparePermissions[resourceName];
    const splitName = resourceName.split('/');

    if (matchedResource) {
      // Matched resource has a parent resource
      if (splitName.length > 2) {
        const matchedParentResource = comparePermissions[`/${splitName[1]}`];
        const mpr = matchedParentResource; // dev friendly code, amirite?
        // If parent exists, only cares about resource or has a permission match
        if (mpr && (!mpr.length || checkResourceForMatch(baseResource, mpr))) {
          value = true;
        }
      }

      // Route only cares about the resource
      if (matchedResource.length === 0) {
        value = true;
      }
      // Route cares about the resource and the resource permissions
      if (checkResourceForMatch(baseResource, matchedResource)) {
        value = true;
      }
    }
  });

  return value || false;
};

/**
 * Check if Roles and permissions match those of a passed user.
 * @param {Object} user
 * @param {Array} allowRoles
 * @param {Object} allowPermissions
 */
export const checkRolesAndPermissions = (
  user,
  allowRoles,
  allowPermissions
) => {
  const userRole = extractUserRole(user);

  // If we need to compare roles
  if (allowRoles instanceof Array && lodash.indexOf(allowRoles, userRole) < 0) {
    return false;
  }

  // If we need to compare permissions
  if (
    allowPermissions instanceof Object &&
    !matchPermissions(user.permissions, allowPermissions)
  ) {
    return false;
  }

  return true;
};

/**
 * @param {Array} role
 * @return {boolean}
 */
export const isEmptySeat = ({ centre_roles, roles, title, group_id }) =>
  !group_id && !Array.isArray(centre_roles) && !title && !roles;

/**
 * @param {String} title
 * @return {boolean}
 */
export const isGroup = ({ title }) => typeof title === 'string';

/**
 * @param {Array} role
 * @return {boolean}
 */
export const isLearner = ({ centre_roles }) =>
  centre_roles && centre_roles[0] === CentreLearner;

/**
 * @param {number} gender
 * @return {string}
 */
export const getDefaultImageIdForGender = gender =>
  gender === 2
    ? 'assets/user_card_female_g3tnuj'
    : 'assets/user_card_male_gaibtr';

export const getPhotoUrl = ({ gender, cloudinary_file_id }) => {
  const img = id => (id ? createCloudinaryUrl(id, 'image') : false);
  // If card type is user
  return img(cloudinary_file_id) || img(getDefaultImageIdForGender(gender));
};

/**
 * @param {Array} centre_roles
 * @param {number} gender
 * @param {strind} cloudinary_file_id
 * @return {string} Claudinary Url
 */
export const getCommunityProfilePhotoUrl = ({
  centre_roles,
  roles,
  gender,
  cloudinary_file_id,
  group_id
}) => {
  const img = id => (id ? createCloudinaryUrl(id, 'image') : false);
  // If card type is group
  if (group_id && !cloudinary_file_id) {
    return img('assets/user_card_group_ka31ja');
  }
  // If card type is empty seat
  if (isEmptySeat({ centre_roles, roles, group_id })) {
    return img('assets/user_card_seat_olhtg1');
  }

  // If card type is user
  return img(cloudinary_file_id) || img(getDefaultImageIdForGender(gender));
};

/**
 * @param {Array} centre_roles
 * @param {number} gender
 * @param {strind} cloudinary_file_id
 * @return {string} Claudinary Url
 */
export const getCommunityProfilePhotoId = ({
  centre_roles,
  roles,
  gender,
  cloudinary_file_id,
  group_id
}) => {
  // If card type is group
  if (group_id && !cloudinary_file_id) {
    return 'assets/user_card_group_ka31ja';
  }
  // If card type is empty seat
  if (isEmptySeat({ centre_roles, roles, group_id })) {
    return 'assets/user_card_seat_olhtg1';
  }

  // If card type is user
  return cloudinary_file_id || getDefaultImageIdForGender(gender);
};

/**
 * Format a number to 2 letters
 */

export const formatN2 = n => {
  if (n < 0) {
    return '00';
  } else if (n < 10) {
    return `0${parseInt(n)}`;
  } else if (n < 100) {
    return `${parseInt(n)}`;
  }

  return '99';
};

/**
 * User access component
 */
class UserHasAccess extends React.Component {
  // Evaluates the children, makes sure
  // that all the children are valid react elements.
  validChildren() {
    const { children } = this.props;
    let toReturn;
    // Children is an array
    if (Array.isArray(children)) {
      toReturn = children.filter(child => React.isValidElement(child));
      toReturn = toReturn.length ? <div>{toReturn}</div> : null;
      // Children is a single value
    } else {
      toReturn = React.isValidElement(children) ? children : null;
    }
    return toReturn;
  }

  element() {
    const { user, allowRoles, allowPermissions } = this.props;
    // No props OR all match conditions have been met, pass the children
    // Can only be valid react elements
    if (checkRolesAndPermissions(user, allowRoles, allowPermissions)) {
      return this.validChildren();
    }
    return null;
  }

  render() {
    return this.props.user ? this.element() : <UILoading />;
  }
}

function mapStateToProps(state) {
  return {
    user: state.profile.user
  };
}

export const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

export const UserAccess = connect(mapStateToProps)(UserHasAccess);
