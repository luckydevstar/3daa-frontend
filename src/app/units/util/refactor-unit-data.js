// Refactores API data to usable format

// Transform Object to array
function objectToArray(obj) {
  const array = [];
  for (const key of Object.keys(obj)) {
    array.push(obj[key]);
  }
  return array;
}

export default obj => {
  if (!obj) return obj;
  let result = obj;
  result = objectToArray(result);
  result.forEach((value, key) => {
    if (result[key].outcomes) {
      result[key].outcomes = objectToArray(value.outcomes);
      result[key].outcomes.forEach((value2, key2) => {
        if (result[key].outcomes[key2].assessment_criteria) {
          result[key].outcomes[key2].assessment_criteria = objectToArray(
            value2.assessment_criteria
          );
        }
      });
    }
  });
  return result;
};
