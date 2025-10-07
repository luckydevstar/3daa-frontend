import components from './components';
import containers from './containers';

import { Types, Creators as Actions } from './actions';
import sagas from './sagas/';
import reducers from './reducers/';
import util from './util';
import routes from './config/routes';

export default {
  components,
  containers,
  Types,
  Actions,
  sagas,
  reducers,
  routes,
  util
};
