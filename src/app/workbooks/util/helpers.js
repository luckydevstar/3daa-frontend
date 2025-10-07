import {
  __,
  always,
  cond,
  contains,
  dropWhile,
  equals,
  F,
  filter,
  head,
  isEmpty,
  isNil,
  length,
  lensIndex,
  map,
  merge,
  not,
  over,
  pathOr,
  pickAll,
  pipe,
  prop,
  flatten,
  concat,
  propEq,
  T,
  findIndex,
  lensPath,
  set,
  takeWhile,
  trim,
  ifElse,
  identity
} from 'ramda';
import { coerceArray, splitWhenRecursive } from 'app/common/util/helpers';

const unitKeys = [
  'is_mandatory',
  'guided_learning_hours',
  'credit_value',
  'workbook_selected',
  'specification'
];

export const extractWorkbooksFromQualification = qualification => {
  // THIS is temporary solution, until we solve the issues with copying workbook
  // --------------------------  TEMPORARY -------------------------------------

  const { centre_id, abstract_sector_id } = qualification;
  const filterSelected = wb => propEq('workbook_selected', wb.workbook_id)(wb);
  const filterCentre = wb => propEq('centre_id', centre_id)(wb);
  const filterSector = wb => propEq('sector_id', abstract_sector_id)(wb);
  const filterDefault = wb => propEq('is_default', 1)(wb);
  const hasWorkbooks = unit => pipe(prop('workbooks'), length)(unit);
  const extractWorkbooksAndAddKeys = unit =>
    pipe(
      prop('workbooks'),
      map(merge(pickAll(unitKeys, unit))),
      ifElse(
        pipe(filter(filterSelected), length),
        pipe(filter(filterSelected), head),
        ifElse(
          pipe(filter(filterCentre), length),
          pipe(filter(filterCentre), head),
          ifElse(
            pipe(filter(filterSector), filter(filterDefault), length),
            pipe(filter(filterSector), filter(filterDefault), head),
            ifElse(length, head, identity)
          )
        )
      )
    )(unit);

  const getworkbooks = pipe(
    prop('units'),
    filter(hasWorkbooks),
    map(extractWorkbooksAndAddKeys),
    flatten
  );
  return getworkbooks(qualification);
};

export const correctFontColor = cond([
  [isNil, always('#4a4a4a')],
  [contains(__, ['#d4eae4', '#ffffff', '#d2db0f']), always('#4a4a4a')],
  [T, always('#f9f9f9')]
]);

const isTypeH1 = propEq('type', 'h1');
const isFirstItemNotH1 = pipe(head, head, isTypeH1, not);
const isChildEmpty = pipe(
  pathOr('', ['props', 'children', 1, 0]),
  trim,
  isEmpty
);
const isChapterStart = pipe(
  coerceArray,
  head,
  x => isTypeH1(x) && !isChildEmpty(x)
);

/**
 *
 * @param {Number} activity_id
 * @param {String} status
 * @param {Object} state
 * @return {Object} state with replaced, selected activity status
 */
export const setActivityStatus = (activity_id, status, state) => {
  const activityIndex = findIndex(propEq('activity_id', activity_id))(
    state.workbook.activities
  );
  const activityLens = lensPath([
    'workbook',
    'activities',
    activityIndex,
    'status'
  ]);
  const setAsSubmitted = set(activityLens, status);
  const newState = setAsSubmitted(state);

  return state.merge({ ...newState });
};

export const splitContentToChapters = pipe(
  splitWhenRecursive(isChapterStart),
  filter(length),
  x => {
    if (isFirstItemNotH1(x)) {
      const beginning = flatten(takeWhile(isFirstItemNotH1, x));
      const rest = dropWhile(isFirstItemNotH1, x);

      if (!length(rest)) return [beginning]; // No h1 in book

      // Update first chapter with content preceeding first h1
      return over(lensIndex(0), first => [...beginning, ...first], rest);
    }
    // First item is h1
    return x;
  }
);

export const animationDirection = (x, opposite = false) =>
  cond([
    [equals('block-left'), always(opposite ? 'right' : 'left')],
    [equals('block-right'), always(opposite ? 'left' : 'right')],
    [equals('block-center'), always('top')],
    [T, F]
  ])(x);

export const flattenQualifications = qualifications => {
  if (isNil(qualifications) || isEmpty(qualifications)) {
    return qualifications;
  }

  return pipe(map(qual => qual.pathways), flatten, concat(qualifications))(
    qualifications
  );
};

export const getQualificationIndex = (qualification_id, qualifications) => {
  let result;
  const qualificationIndex = (id, quals) =>
    findIndex(propEq('qualification_id', parseInt(id)))(quals);
  if (qualification_id && qualifications) {
    result = qualificationIndex(qualification_id, qualifications);
    const currentQualification = pipe(
      filter(q => qualificationIndex(qualification_id, q.pathways) > -1),
      head
    )(qualifications);
    // If there is no qualification with this ID, search withing pathways
    if (result === -1) {
      result =
        currentQualification &&
        qualificationIndex(
          currentQualification.qualification_id,
          qualifications
        );
    }
  }
  return result >= 0 ? result : 0;
};

export default extractWorkbooksFromQualification;
