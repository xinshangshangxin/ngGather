'use strict';


angular
  .module('ngGather')
  .factory('sitesInfoEntity', function($resource, SERVERURL) {
    return $resource(
      SERVERURL + '/api/v1/sites',
      {},
      {update: {method: 'PUT'}}
    );
  })
  .factory('updateTimeEntity', function($resource, SERVERURL) {
    return $resource(
      SERVERURL + '/api/v1/updateTime',
      {},
      {update: {method: 'PUT'}}
    );
  })
;