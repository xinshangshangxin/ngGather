'use strict';

angular
  .module('ngGather')
  .service('localSaveService', function() {
    this.get = function() {
      try {
        var localObj = JSON.parse(localStorage.getItem('shang_ngGather')) || {};
        return {
          sites: localObj.sites,
          themeType: localObj.themeType
        };
      }
      catch (e) {
        localStorage.removeItem('shang_ngGather');
        return null;
      }
    };
    this.set = function(sites, themeType) {
      localStorage.setItem('shang_ngGather', JSON.stringify({
        sites: sites,
        themeType: themeType
      }));
    };
  });
