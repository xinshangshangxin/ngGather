'use strict';


// 图片无法直接获取
angular
  .module('ngGather')
  .filter('imgUrlChange', function(SERVER_URL) {
    return function(imgUrl) {
      return SERVER_URL + '/api/v1/proxy/img?url=' + encodeURIComponent(imgUrl);
    };
  });
