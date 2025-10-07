/* global localStorage */
import ReduxPersistSettings from '../config/persistence/redux-persist-settings';
import { persistStore } from 'redux-persist';

const updateReducers = store => {
  const localVersion = localStorage.getItem('poaw.reducerVersion');
  const reducerVersion = ReduxPersistSettings.reducerVersion;
  const config = ReduxPersistSettings.storeConfig;

  if (localVersion !== reducerVersion) {
    console.log('PURGING STORE ', localVersion, 'vs. ', reducerVersion);
    // Purge store and refresh
    persistStore(store, config, () => {
      // Start a fresh store
      persistStore(store, config);
    }).purge();

    localStorage.setItem('poaw.reducerVersion', reducerVersion);
  } else {
    persistStore(store, config);
  }
};

export default {
  updateReducers
};
