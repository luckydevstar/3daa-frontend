export const age_to_range = (min_value, max_value) => {
  if (min_value) {
    let temp = '' + min_value;
    if (max_value) {
      temp += '-' + max_value;
    } else {
      temp += '+';
    }

    const result = AGE_RANGE.find(r => r.name == temp);
    if (result) return result.key;
  }
  return AGE_RANGE[AGE_RANGE.length - 1];
};

export const range_to_age = range_value => {
  switch (range_value) {
    case 1:
      return { age_min: 14, age_max: 16 };
    case 2:
      return { age_min: 16, age_max: 18 };
    case 3:
      return { age_min: 18, age_max: 21 };
    case 4:
      return { age_min: 21, age_max: null };
    case 5:
      return {};
  }
};

export const AGE_RANGE = [
  { key: 1, name: '14-16' },
  { key: 2, name: '16-18' },
  { key: 3, name: '18-21' },
  { key: 4, name: '21+' },
  { key: 5, name: 'All Age Ranges' }
];
