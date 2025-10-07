import { createSelector } from 'reselect';
import {
  filter,
  pipe,
  any,
  path,
  propEq,
  props,
  pluck,
  uniq,
  sort,
  toString,
  toLower,
  prepend
} from 'ramda';

export const getCurrentQualificationWorkbooks = createSelector(
  state => path(['currentQualification', 'workbooks'])(state),
  state => state.searchQuery,
  (qualificationWorkbooks, query) => {
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
      )(qualificationWorkbooks || []);

      return filteredWorkbooks || [];
    }

    return qualificationWorkbooks || [];
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
  state => state.centreQualifications,
  state => state.activeLevel,
  (qualifications, level) => {
    if (qualifications && qualifications.length && level) {
      return filter(propEq('level', level))(qualifications);
    }

    return qualifications;
  }
);
