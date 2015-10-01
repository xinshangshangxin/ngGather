'use strict';

angular.module('ngGather')
  .controller('chooseCtrl', function($scope, themeService, sitesInfoEntity, updateTimeEntity, ALL_SITES) {

    try {
      $scope.chooseSite = JSON.parse(localStorage.getItem('shang_ngSites'));
    }
    catch (e) {
      localStorage.removeItem('shang_ngSites');
      $scope.chooseSite = null;
    }

    $scope.contents = [];
    $scope.updateTime = 0;
    $scope.pageNu = 0;
    $scope.chooseSite = $scope.chooseSite || ALL_SITES;
    $scope.ishow = false; // 站点选择显示
    $scope.type = true; // themes 样式
    $scope.addMoreInfo = '加载更多~';
    $scope.ishide = true; // 导航栏按钮显示


    $scope.sites = []; // 选择站点名称
    _.forEach($scope.chooseSite, function(item) {
      if (item.ischecked) {
        $scope.sites.push(item.site);
      }
    });

    var getUpdateTime = function() {
      updateTimeEntity
        .get()
        .$promise
        .then(function(data) {
          $scope.updateTime = data.updateTime;
        })
        .catch(function(e) {
          console.log(e);
        });
    };

    $scope.changeSites = function() {
      $scope.oldSites = angular.copy($scope.chooseSite);
      $scope.ishow = !$scope.ishow;
    };

    $scope.saveSites = function(isCancle) {
      $scope.ishow = !$scope.ishow;
      if (isCancle) {
        return;
      }
      $scope.chooseSite = $scope.oldSites;
      var sites = [];
      _.forEach($scope.chooseSite, function(item) {
        if (item.ischecked) {
          sites.push(item.site);
        }
      });
      $scope.sites = sites;
      $scope.getData();
      localStorage.setItem('shang_ngSites', JSON.stringify($scope.chooseSite));
    };

    $scope.forceUpdate = function() {
      sitesInfoEntity
        .get({
          force: 1
        })
        .$promise
        .then(function() {

        })
        .catch(function(e) {
          console.log(e);
        });
    };

    $scope.getData = function() {
      $scope.pageNu = 0;
      $scope.addMore(true);
      getUpdateTime();
    };

    $scope.addMore = function(isClear) {
      var query = {
        pageNu: $scope.pageNu || 0
      };
      if ($scope.sites && _.isArray($scope.sites)) {
        query.sites = $scope.sites;
      }

      if (isClear) {
        query.times = new Date().getTime();
      }
      sitesInfoEntity
        .query(query)
        .$promise
        .then(function(arr) {
          $scope.pageNu = ($scope.pageNu || 0) + 1;

          if (!arr || !arr.length) {
            return ($scope.addMoreInfo = '没有更多了~');
          }
          if (isClear) {
            $scope.contents = arr;
            return;
          }
          $scope.contents = $scope.contents.concat(arr);
        })
        .catch(function(e) {
          console.log(e);
        });
    };

    $scope.getData();

    $scope.changeTheme = function() {
      var themes = [];
      if ($scope.type) {
        // <!-- inject:themes -->
        // <!-- endinject -->
      }
      else {
        themeService.clearThemes();
      }
      $scope.type = !$scope.type;
      themeService.replaceThemes(themes);
    };

  });
