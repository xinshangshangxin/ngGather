'use strict';

var path = require('path');

function getRouterPath(relativePath) {
  return path.join(__dirname, relativePath);
}

var svc = [
  {
    name: 'view-routes',
    path: getRouterPath('./view-routes'),
  }, {
    name: 'system-routes',
    path: getRouterPath('./system-routes'),
  }, {
    name: 'webhook-routes',
    disabled: true,
    path: getRouterPath('./webhook-routes'),
  }, {
    name: 'custom-routes',
    path: getRouterPath('./custom-routes'),
  },
];


module.exports = svc;