'use strict';

var path = require('path');

function getRouterPath(relativePath) {
  return path.join(__dirname, relativePath);
}

var svc = [{
  name: 'leancloud-routes',
  path: getRouterPath('./leancloud-routes.js'),
}, {
  name: 'view-routes',
  path: getRouterPath('./view-routes.js'),
}, {
  name: 'system-routes',
  path: getRouterPath('./system-routes.js'),
}, {
  name: 'webhook-routes',
  disabled: true,
  path: getRouterPath('./webhook-routes.js'),
}, {
  name: 'custom-routes',
  path: getRouterPath('./custom-routes.js'),
}];


module.exports = svc;