'use strict';

angular
  .module('ngGather')
  .service('themeSwitcherService', function() {
    var allThemes = [];
    var ctrl = this;
    this.getThemes = function() {
      return allThemes;
    };
    this.addThemes = function(themes) {
      if (_.isArray(themes)) {
        allThemes.push.apply(allThemes, themes);
      }
      else {
        allThemes.push(themes);
      }
    };
    this.removeTheme = function(theme) {
      allThemes.splice(allThemes.indexOf(theme), 1);
    };
    this.clearThemes = function() {
      allThemes.length = 0;
    };
    this.replaceThemes = function(themes) {
      ctrl.clearThemes();
      ctrl.addThemes(themes);
    };
  });
