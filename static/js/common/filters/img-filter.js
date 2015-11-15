'use strict';


// ZD图片无法直接获取
angular
  .module('ngGather')
  .filter('imgUrlChange', function(SERVERURL) {
    return function(imgUrl) {
      if (imgUrl && (/(zdfans)|(waitsun)/i).test(imgUrl)) {
        return SERVERURL + 'api/v1/getImg?imgurl=' + encodeURIComponent(imgUrl);
      }
      else {
        return imgUrl;
      }
    };
  });
