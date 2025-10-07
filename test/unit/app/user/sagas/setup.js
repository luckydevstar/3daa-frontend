require('babel-core/register')({
  ignore: /node_modules/
}); 
require('ignore-styles')

var chai =  require('chai');
var chaiEnzyme =  require('chai-enzyme');
var jsdom = require('jsdom').jsdom;

var exposedProperties = ['window', 'navigator', 'document'];

global.document = jsdom('');
global.window = document.defaultView;
global.__DEV__ = true;
global.expect = chai.expect;
chai.use(chaiEnzyme());
Object.keys(document.defaultView).forEach((property) => {
  if (typeof global[property] === 'undefined') {
    exposedProperties.push(property);
    global[property] = document.defaultView[property];
  }
});

global.navigator = {
  userAgent: 'node.js'
};

documentRef = document;