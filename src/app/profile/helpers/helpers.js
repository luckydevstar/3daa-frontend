import common from 'app/common';

const CENTRE_LEARNER_ROLE = 'CENTRE_LEARNER_ROLE';

const { util: { helpers: { extractUserRole } } } = common;

const isAllowedAccess = (currentUser, loggedInUser, excludeRole) => {
  if (currentUser && loggedInUser) {
    const currentUserRole = extractUserRole(currentUser);
    const loggedInUserRole = extractUserRole(loggedInUser);

    /* No permission check needed */
    if (!excludeRole) {
      return true;
    }

    /* If viewing own profile */
    if (currentUser.member_id === loggedInUser.member_id) {
      return true;
    }

    /* If any role except centre learner */
    if (loggedInUserRole !== CENTRE_LEARNER_ROLE) {
      return true;
    }

    /* If centre learner but viewing any profile that isn't centre learner */
    if (
      loggedInUserRole === CENTRE_LEARNER_ROLE &&
      currentUserRole !== CENTRE_LEARNER_ROLE
    ) {
      return true;
    }

    if (
      loggedInUserRole === CENTRE_LEARNER_ROLE &&
      currentUserRole === CENTRE_LEARNER_ROLE
    ) {
      return false;
    }

    return true;
  }

  return false;
};

export default isAllowedAccess;
