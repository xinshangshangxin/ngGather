'use strict';

angular
  .module('ngGather')
  .factory('sitesInfoEntity', function($resource) {
    return $resource(
      '/api/v1/sites',
      {},
      {update: {method: 'PUT'}}
    );
  })
  .factory('updateTimeEntity', function($resource) {
    return $resource(
      '/api/v1/updateTime',
      {},
      {update: {method: 'PUT'}}
    );
  })
  .factory('allSitesEntity', function($resource) {
    return $resource(
      '/api/v1/allSites',
      {},
      {update: {method: 'PUT'}}
    );
  })
;