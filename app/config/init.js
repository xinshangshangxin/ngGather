'use strict';

var path = require('path');
var requireDirectory = require('require-directory');
var util = require('util');
 
// set bluebird and lodash
global.__Promise__ = global.Promise;
global.Promise = require('bluebird');
global._ = require('lodash');

// set global ApplicationError
global.ApplicationError = function(code, message, data, constr) {
  Promise.OperationalError.call(constr || this, message || 'no ApplicationError message ');
  this.code = code;
  this.data = data;
};
util.inherits(ApplicationError, Promise.OperationalError);
ApplicationError.prototype.name = 'Application Error';

// set env
var env = (process.env.NODE_ENV || 'development').trim();
global.config = requireDirectory(module, path.resolve(__dirname, '.'), {
  exclude: function(path) {
    var reg = new RegExp('[\\/\\\\]env[\\/\\\\](?!' + env + ')');
    return reg.test(path) || /init\.js/.test(path);
  }
});
// reset env value
global.config.env = global.config.env[env];

// bootStrap Service
if(global.config.env.bootstrap && global.config.env.bootstrap.length) {
  var services = requireDirectory(module, path.resolve(__dirname, '../services'));
  return Promise.each(global.config.env.bootstrap, function(name, i) {
      console.log(name + ' start at ' + i);
      return services[name].lift();
    });
}