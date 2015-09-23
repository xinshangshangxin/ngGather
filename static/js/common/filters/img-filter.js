'use strict';


// ZD图片无法直接获取
angular
  .module('ngGather')
  .filter('imgUrlChange', function(SERVERURL) {
  return function(imgUrl) {
    if (imgUrl && imgUrl.indexOf('zdfans') !== -1) {
      return SERVERURL + 'api/v1/getImg?imgurl=' + encodeURIComponent(imgUrl);
    }
    else {
      return imgUrl;
    }
  };
});