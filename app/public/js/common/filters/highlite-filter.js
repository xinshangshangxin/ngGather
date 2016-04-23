'use strict';

angular
  .module('ngGather')
  .filter('highlight', function($sce) {
    return function(text, phrase) {
      if(phrase) {
        text = text.replace(new RegExp('(' + phrase + ')', 'gi'), '<span class="highlighted">$1</span>');
      }
      console.log(text, phrase);
      return $sce.trustAsHtml(text);
    };
  });