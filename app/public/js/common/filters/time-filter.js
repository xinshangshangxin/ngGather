'use strict';

angular
  .module('ngGather')
  .filter('updateTimeFilter', function($filter) {
    return function(input) {
      if (!input) {
        return '未知时间';
      }
      else {
        return $filter('date')(input, 'yy-MM-dd HH:mm');
      }
    };
  });