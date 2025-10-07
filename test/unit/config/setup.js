require('babel-core/register')({ ignore: /node_modules/ });

const chai = require('chai');
const chaiEnzyme = require('chai-enzyme');
const jsdom = require('jsdom').jsdom;

const exposedProperties = ['window', 'navigator', 'document'];

global.document = jsdom('');
global.window = document.defaultView;
global.expect = chai.expect;
chai.use(chaiEnzyme());

Object.keys(document.defaultView).forEach(property => {
  if (typeof global[property] === 'undefined') {
    exposedProperties.push(property);
    global[property] = document.defaultView[property];
  }
});

global.navigator = { userAgent: 'node.js' };
