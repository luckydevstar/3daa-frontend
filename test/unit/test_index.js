require('babel-polyfill');

const testsContext = require.context('../../src/app', true, /.spec.js$/);
testsContext.keys().forEach(testsContext);
