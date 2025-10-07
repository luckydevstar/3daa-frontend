import { createSelector } from 'reselect';
import {
  filter,
  pipe,
  any,
  path,
  prepend,
  propEq,
  props,
  pluck,
  uniq,
  sort,
  toString,
  toLower
} from 'ramda';

export const getQualificationWorkbooks = createSelector(
  state => path(['qualification', 'workbooks'])(state),
  state => state.searchQuery,
  (workbooks, query) => {
    if (query) {
      const filteredWorkbooks = filter(
        pipe(
          props([
            'unit_id',
            'workbook_id',
            'workbook_reference',
            'reference',
            'title'
          ]),
          any(pipe(toString, toLower, str => str.includes(query.toLowerCase())))
        )
      )(workbooks || []);

      return filteredWorkbooks || [];
    }

    return workbooks || [];
  }
);

export const getQualificationsAvailableLevels = createSelector(
  state => state,
  qualifications => {
    if (qualifications && qualifications.length) {
      const extractedLevels = pipe(pluck('level'), uniq, x =>
        sort((a, b) => a - b, x)
      )(qualifications);
      return prepend(0, extractedLevels);
    }

    return [0];
  }
);

export const getLevelQualifications = createSelector(
  state => state.qualifications,
  state => state.activeLevel,
  (qualifications, level) => {
    if (qualifications && qualifications.length && level) {
      return filter(propEq('level', level))(qualifications);
    }

    return qualifications;
  }
);
