'use strict';


// ZD图片无法直接获取
angular
  .module('ngGather')
  .filter('imgUrlChange', function(SERVERURL) {
  return function(input) {
    if (input && input.indexOf('zdfans') !== -1) {
      return SERVERURL + 'api/v1/getImg?imgurl=' + encodeURIComponent(input);
    }
    else {
      return input;
    }
  };
});