'use strict';

var Promise = require('bluebird');
var request = Promise.promisify(require('request'));


var nnProxies = [];
var ntProxies = [];

getProxies();
function getProxies() {
  request(
    {
      url: 'http://proxy.coding.io/api/v1/proxy?type=nn',
      method: 'GET',
      json: true
    })
    .spread(function(res, body) {
      nnProxies = body;
    });

  request(
    {
      url: 'http://proxy.coding.io/api/v1/proxy?type=nt',
      method: 'GET',
      json: true
    })
    .spread(function(res, body) {
      ntProxies = body;
    });
}

setInterval(function() {
  getProxies();
}, 60 * 1000);

module.exports = {
  getProxyUrl: function(type) {
    if(!type) {
      return null;
    }
    else if (type === 1) {
      return nnProxies[parseInt(Math.random() * nnProxies.length)].url;
    }
    else if (type === 2) {
      return ntProxies[parseInt(Math.random() * ntProxies.length)].url;
    }
  }
};