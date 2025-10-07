export const required = value => (value ? undefined : 'Required');
export const passwordStrengthChecker = value => {
  const strongRegex = new RegExp(
    '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})'
  );
  const mediumRegex = new RegExp(
    '^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})'
  );

  if (strongRegex.test(value)) {
    return 'strong';
  } else if (mediumRegex.test(value)) {
    return 'medium';
  } else if (value != '') {
    return 'weak';
  } else {
    return 'none';
  }
};

export default { required, passwordStrengthChecker };
