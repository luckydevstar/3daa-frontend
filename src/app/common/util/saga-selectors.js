export const getActiveSector = ({ persisted: { sector } }) => sector;

export const languageSelector = ({ persisted: { lang } }) => lang;

export const getQualifications = ({ bookstand: { qualifications } }) =>
  qualifications;

export const getUserCentres = ({ profile: { user: { centres } } }) => centres;

export const getUser = ({ profile: { user } }) => user;
