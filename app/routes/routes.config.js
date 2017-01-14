'use strict';

var path = require('path');

function getRouterPath(relativePath) {
  return path.join(__dirname, relativePath);
}

var svc = [
  {
    name: 'system-routes',
    disabled: false,
    path: getRouterPath('./system-routes'),
  }, {
    name: 'webhook-routes',
    disabled: true,
    path: getRouterPath('./webhook-routes'),
  }, {
    name: 'user-routes',
    disabled: false,
    path: getRouterPath('./routes'),
  },
];


module.exports = svc;