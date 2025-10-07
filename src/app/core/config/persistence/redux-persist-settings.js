import immutablePersistenceTransform from './immutable-persistence-transform';
// import localForage from 'localForage'

import { persistentStoreWhitelist } from '../../reducers/';

const REDUX_PERSIST_SETTINGS = {
  active: true,
  reducerVersion: '1.0.0',
  storeConfig: {
    whitelist: persistentStoreWhitelist,
    transforms: [immutablePersistenceTransform]
  }
};

export default REDUX_PERSIST_SETTINGS;
