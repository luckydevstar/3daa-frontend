# White Label Applications

Table of Contents
=================
   * [Build process](#build-process)
   * [Tech stack overview](#tech-stack-overview)
   * [App structure overview](#app-structure-overview)
   * [Component conventions](#component-conventions)
      * [Actions](#actions)
      * [Reducers](#reducers)
      * [Sagas](#sagas)
   * [Common Component overview](#component-overview)
   * [A note on tests](#a-note-on-tests)

Build process 
===================

You will need Yarn or NPM to setup the app. `cd` to directory and run `npm install`. 

After that it is 
```
npm run server
```
to run the development server and 
```
npm run build
``` 
to build the app into the `/www` folder.

### Other commands

Run tests/Karma:
```
npm run test
```
Access ESLint:
```
npm run lint
```
Build production version:
```
npm run build-prod
```

See the [package.json](https://github.com/depub/pearson-one-account/blob/development/package.json) file for a full list of all CL commands available. The app is built with Webpack [(webpack.config.js)](https://github.com/depub/pearson-one-account/blob/development/webpack.config.js) and uses Karma to run tests, ESLint and Prettier for code styling and Babel as its ES6 transpiler.

Building the app and pushing it live is handle by Teamcity.

Tech stack overview
===================

The app is built entirely on React and heavily utilises a number of packages, with the backbone comprised of
- React Redux 
- Redux Sagas (w/ `axios` as the API request lib)
- React Router

Ramda is heavily used in many components, and both `pusher-js` and `react-pusher` seem to be utilised for the implementation of some Pusher.js based realtime services. 

The design is implemented using SCSS and with the excellent [Bulma](https://github.com/reactjs/react-redux) serving as the CSS framework.

Cloudinary is used to serve dynamic assets (images/video).

Redux forms are used as the main approach to handling forms. 

App structure overview
===================
Below is an overview of the important locations and files within the project.
```
web-app                         
|-- src/
|   |-- index.html                             # index.html
|   |-- main.js                                # App entry point
|   |-- app/                                   # General App folder
|   |   |-- core/                              # App core setup folder
|   |   |   |-- config/                        # Core config
|   |   |   |   |-- api.js                     # API base domain name setup
|   |   |   |   |-- endpoints.js               # API endpoint constants
|   |   |   |   |-- routes.js                  # Core routes container
|   |   |   |   |-- routing-manager.js         # Routing/redirection manager
|   |   |   |   |-- store.js                   # Redux store setup
|   |   |   |-- reducers/                      
|   |   |   |   |-- index.js                   # Redux store reducers container config
|   |   |   |   |-- persisted-reducer.js       # Data persisting between refreshes
|   |   |   |-- sagas/              
|   |   |   |   |-- index.js                   # Core sagas setup
|   |   |   |-- services/
|   |   |       |-- pusher.js                  # Some core pusher setup (Pusher neds refactoring)
|   |   |       |-- redux-persist-service.js   # Persisted reducer setup
|   |   |       |-- api.js                     # API endpoint constants to call function bindings
|   |   |-- common/                            # Common app resources
|   |       |-- components/                    # Common UI and other React components
|   |       |-- util/
|   |           |-- helpers.js                 # Primary helpers file
|   |-- assets/
|       |-- images/                            # Images
|       |-- styles/                            # Styles
|           |-- styles.scss                    # Styles entry point
|           |-- globals/                       # Global styles
|           |-- components/                    # Component styles
|           |-- user-interface/                # General UI styles
|-- tests                                      # Underutilised test suite
```

Component conventions
===================

If you'd like to get straight into the code then there is a main boilerplate component at `/src/app/__boilerplate`.

Main site components all have their root directory in `/src/app`. Each main component follows a general structure enabling it to hook into the app's React/Redux state. 

e.g. 
```
community       
|-- actions/      # Redux action creators
|-- reducers/     # Redux state reducers
|-- sagas/        # Redux sagas & API calls
|-- components/   # React presentational components
|-- containers/   # React container 
|-- config/       # General config (usually inc. routes)
```
There can be more or less of these between components but the majority of main components use it and it should be ensure that in the future `src/app` is only populated by relevant components.

### Actions

Any actions related to calling the API generally handle data flow by handling splitting the task up into three different actions: 

```
ACTION_NAME_ATTEMPT
ACTION_NAME_FAILURE
ACTION_NAME_SUCCESS
```

You will see examples of this further down the line. Whenever an action is dispatched it calls the appropriately bound Saga and Reducer handlers. Action generation is helped by [reduxsauce](https://github.com/skellock/reduxsauce):

*/src/app/community/actions/index.js*

```javascript
export const { Types, Creators } = createActions({
  communityUsersAttempt: ['userType', 'params', 'viewSeenByRole'],
  // ...
});
```

The above function will generate an object with a function expecting 3 arguments, the return of which is an action creator object that can be used to then dispatch actions to the Redux store:

```javascript
{
  communityUsersAttempt: (userType, params, viewSeenByRole)  => ({
    type: COMMUNITY_USERS_ATTEMPT,
    userType,
    params,
    viewSeenByRole
  })
}
```
Actions are usually dispatched by React components:

*/src/app/community/containers/community-users.js*

```javascript
import { Creators } from '../actions';

//...

classFuncion(){
  this.props.communityUsersAttempt();
}
//...

const {
  communityUsersAttempt,
  //...
} = Creators;

//...

// Bind dispatch to props
const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      //..
      communityUsersAttempt,
      //...
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(CommunityUsers);
```

## NOTE
> UI component action dispatchers are generally created and mapped to their React Class haphazardly throughout the project, with many different approaches to both problems being present. It would be good practice to refactor and standardize this in the future.


### Reducers

All component reducers are imported and combined in `/src/app/core/reducers/index.js`, the result of which is then imported and attached to Redux in `/src/app/core/store.js`.

```javascript
import Immutable from 'seamless-immutable';
import { createReducer } from 'reduxsauce';

// Import Action types
import Type from '../actions';
 
// Define initial state
export const INITIAL_STATE = Immutable({
  //... 
});


// Define Action handler state manipulation
const getActivitiesSuccess = (state, action) => state.merge({
  activities: action.payload.activities,
  totalActivities: action.payload.total,
  attemptingGetActivities: false,
  errorCode: null
});

//...

// Map Action types to handlers
const ACTION_HANDLERS = {
  [Type.GET_ACTIVITIES_ATTEMPT]: getActivitiesAttempt,
  [Type.GET_ACTIVITIES_SUCCESS]: getActivitiesSuccess,
  [Type.GET_ACTIVITIES_FAILURE]: getActivitiesFailure
};

export default createReducer(INITIAL_STATE, ACTION_HANDLERS);
```
### Sagas

All component Sagas get imported and combined in `/src/app/core/sagas/index.js`, the result of which is then imported and attached to Redux in `/src/app/core/store.js`.

*/src/app/libraries/sagas/library-sagas.js*

```javascript
import { takeEvery, put, call } from 'redux-saga/effects';
import { checkResponse } from 'app/common/util/helpers';
import Type from '../actions/type';
import Actions from '../actions/creator';

export default api => {
  function* getActivitiesAttempt(action) {
    try {
      const resp = yield call(api.getActivities, action.payload);
      const { data } = yield checkResponse(resp);
      yield put(Actions.getActivitiesSuccess(data));
    } catch (err) {
      yield put(Actions.getActivitiesFailure(err));
    }
  }
  
  function* startWatchers() {
    // Map action type to handler
    yield takeEvery(Type.GET_ACTIVITIES_ATTEMPT, getActivitiesAttempt);
  }

  return {
    startWatchers,
    getActivitiesAttempt,
  };
};
```

Common component overview
===================

#### &lt;CloudinaryMedia&gt;

Used to serve Cloudinary based assets, usually images or video.

#### &lt;ContentCarousel&gt;

Standard P360 item carousel. Usually used to display qualifications.

#### &lt;ContentModal&gt; - DEPRECATED

Old modal component. Use &lt;ContentModalNew&gt; instead.

> NOTE: ContentModal needs to be removed from the codebase.

#### &lt;ContentModalConfirm&gt;

A confirm modal using &lt;ContentModal&gt;

#### &lt;ContentModalNew&gt;

The currently used implementation of a modal throughout the app. 

#### &lt;ContentModalNew&gt;

Content slider, used for implementing step based UI.

#### &lt;ConvertDraftObjectToHtml&gt;

A simple stateless component that accepts a Draft JS content object and converts it to HTML ready for output.

#### Course - &lt;Course.CourseCardFront&gt; &lt;Course.CourseCardBack&gt;

Course UI component, including subcomponents that can be used with the &lt;UIFlipper&gt; to create a flipping course card.

#### &lt;EmptyView&gt; 

Empty dataset placeholder component. 

#### &lt;ExpandableButton&gt;

An expandable button UI component.


#### &lt;Footer&gt; 

App footer

#### Form

Exports the following components, which are then used as `props.component` in Redux form fields:

```javascript
import field from './form-field';
import file from './form-file';
import select from './form-select';
import radio from './form-radio';
import checkbox from './form-checkbox';
import dropzone from './form-dropzone';
import textarea from './form-textarea';
import dateform from './form-date';
import tagging from './form-tags';
```

#### &lt;ImagePreview&gt;

Generates default and other image preview UI.

#### &lt;InlineEditor&gt;

Simple inline editor UI component, used only to update Unit details at the moment. 

#### &lt;MediaLightbox&gt;

Used to display a gallery of media.

#### &lt;MediaUpload&gt;

A step based modal UI guiding a user through the process of uploading media.

#### &lt;Navigation&gt;

General main site section navigation (subsections and search)

#### &lt;Pagination&gt;

App pagination UI

#### &lt;ProfileAvatar&gt;

Profile avatar UI component

#### &lt;ProgressBadge&gt;

Progress badge UI component, used to display the radial graph alongside with optional user picture and progress value.

#### &lt;QualificationLevel&gt; 

Simple stateless component to display qualification level UI.

#### &lt;QualificationStatus&gt;

Simple stateless component to display qualification status UI.

#### &lt;SearchBar&gt;

Simple search bar UI component.

#### &lt;TransparentVideo&gt; 

Component used to convert remove the background in real time from a specially set up video.

#### &lt;UIFlipper&gt;

Component used to create 'flipping UI'.

A note on tests
===================
The framework necessary to run a full testing suite is there. Unfortunately implementation of unit and other tests is lacking. Also due to the constantly changing nature of the app specification they are rendered essentially useless, with new functionality often breaking them and causing builds to fail. Improving the testing of the app is critically important.
