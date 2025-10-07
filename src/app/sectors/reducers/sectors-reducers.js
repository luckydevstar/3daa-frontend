import Immutable from 'seamless-immutable';
import { omit, clone, pipe, prop, uniqBy, concat } from 'ramda';
import { createReducer } from 'reduxsauce';
import { Types } from 'app/sectors/actions';

const addList = (arr, field_name) => {
  return pipe(
    concat(arr ? arr : []),
    uniqBy(prop(field_name))
  );
};

export const INITIAL_STATE = Immutable({
  attemptingGetSectors: false,
  attemptingGetSector: false,
  attemptingPostSector: false,
  attemptingDeleteSector: false,
  errorCode: null,
  sectors: null,
  currentSector: {}
});

/**
 * Retrieve sectors
 */
const getSectorsAttempt = state => {
  return state.merge({
    attemptingGetSectors: true,
    errorCode: null
  });
};

const getSectorsSuccess = (state, action) => {
  return state.merge({
    attemptingGetSectors: false,
    sectors: action.sectors
  });
};

const getSectorsFailure = (state, action) =>
  state.merge({
    attemptingGetSectors: false,
    sectors: [],
    errorCode: action.errorCode
  });

const getSectorAttempt = state =>
  state.merge({
    attemptingGetSector: true,
    currentSector: {},
    errorCode: null
  });

const getSectorSuccess = (state, { sector: { sector, qualifications } }) => {
  let newQualifications = qualifications.map(qualification =>
    Object.assign(
      {},
      omit('latest_issue', qualification),
      qualification.latest_issue
    )
  );
  return state.merge({
    attemptingGetSector: false,
    currentSector: {
      sector,
      qualifications: newQualifications
    }
  });
};

const getSectorFailure = (state, action) =>
  state.merge({
    attemptingGetSector: false,
    errorCode: action.errorCode
  });

const createSectorAttempt = state => {
  return state.merge({
    attemptingPostSector: true,
    currentSector: {},
    errorCode: null
  });
};

const createSectorSuccess = (state, action) => {
  return state.merge({
    attemptingPostSector: false,
    sectors: {
      sectors: addList(state.sectors.sectors, 'sector_id')([action.response]),
      total: state.sectors.total + 1
    }
  });
};

const createSectorFailure = (state, action) => {
  return state.merge({
    attemptingPostSector: false,
    errorCode: action.errorCode
  });
};

const updateSectorAttempt = state =>
  state.merge({
    attemptingPostSector: true,
    errorCode: null
  });

const updateSectorSuccess = (state, action) => {
  let temp = clone(state.sectors.sectors);
  if (action.response && action.id) {
    const index = temp.findIndex(s => s.sector_id == action.id);
    temp.splice(index, 1, action.response);
  }

  return state.merge({
    attemptingPostSector: false,
    currentSector: { ...action.response, sector_id: action.id },
    sectors: {
      sectors: temp,
      total: state.sectors.total
    }
  });
};

const updateSectorFailure = (state, action) =>
  state.merge({
    attemptingPostSector: false,
    errorCode: action.errorCode
  });

const deleteSectorAttempt = state =>
  state.merge({
    attemptingDeleteSector: true,
    errorCode: null
  });

const deleteSectorSuccess = (state, action) => {
  let temp = state.sectors.sectors.filter(s => s.sector_id != action.id);
  return state.merge({
    attemptingDeleteSector: false,
    sectors: {
      sectors: temp,
      total: state.sectors.total - 1
    }
  });
};

const deleteSectorFailure = (state, action) =>
  state.merge({
    attemptingDeleteSector: false,
    errorCode: action.errorCode
  });

const ACTION_HANDLERS = {
  [Types.GET_SECTORS_ATTEMPT]: getSectorsAttempt,
  [Types.GET_SECTORS_SUCCESS]: getSectorsSuccess,
  [Types.GET_SECTORS_FAILURE]: getSectorsFailure,

  [Types.GET_SECTOR_ATTEMPT]: getSectorAttempt,
  [Types.GET_SECTOR_SUCCESS]: getSectorSuccess,
  [Types.GET_SECTOR_FAILURE]: getSectorFailure,

  [Types.CREATE_SECTOR_ATTEMPT]: createSectorAttempt,
  [Types.CREATE_SECTOR_SUCCESS]: createSectorSuccess,
  [Types.CREATE_SECTOR_FAILURE]: createSectorFailure,

  [Types.UPDATE_SECTOR_ATTEMPT]: updateSectorAttempt,
  [Types.UPDATE_SECTOR_SUCCESS]: updateSectorSuccess,
  [Types.UPDATE_SECTOR_FAILURE]: updateSectorFailure,

  [Types.DELETE_SECTOR_ATTEMPT]: deleteSectorAttempt,
  [Types.DELETE_SECTOR_SUCCESS]: deleteSectorSuccess,
  [Types.DELETE_SECTOR_FAILURE]: deleteSectorFailure
};

export default createReducer(INITIAL_STATE, ACTION_HANDLERS);
