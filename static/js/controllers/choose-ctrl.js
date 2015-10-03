'use strict';

angular.module('ngGather')
  .controller('chooseCtrl', function($scope, $timeout, themeSwitcherService, toastService, notificationService, errorHandlingService, sitesInfoEntity, updateTimeEntity, ALL_SITES) {

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
    $scope.ishide = true; // 导航栏按钮显示
    $scope.chooseSite = $scope.chooseSite || ALL_SITES;
    $scope.ishow = false; // 站点选择显示
    $scope.type = true; // themes 样式
    $scope.addMoreState = 0; // 0 可以加载更多, 1 没有更多, 2重在获取中
    $scope.canForceUpdte = true;

    var addMoreStateTimer = null;


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
          errorHandlingService.handleError(e);
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
      $scope.canForceUpdte = false;
      $timeout(function() {
        $scope.canForceUpdte = true;
      }, 20 * 1000);
      notificationService.info('强制重新采集中~~请稍后刷新~', 3500);
      sitesInfoEntity
        .get({
          force: 1
        })
        .$promise
        .then(function() {

        })
        .catch(function(e) {
          console.log(e);
          errorHandlingService.handleError(e);
        });
    };

    $scope.getData = function() {
      $scope.pageNu = 0;
      $scope.addMore(true);
      getUpdateTime();
    };

    $scope.addMore = function(isClear) {
      $timeout.cancel(addMoreStateTimer);
      addMoreStateTimer = $timeout(function() {
        $scope.addMoreState = 0;
      }, 10 * 1000);
      $scope.addMoreState = 2;
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
            return ($scope.addMoreState = 1);
          }
          $scope.addMoreState = 0;
          if (isClear) {
            $scope.contents = arr;
            return;
          }
          $scope.contents = $scope.contents.concat(arr);
        })
        .catch(function(e) {
          $scope.addMoreState = 0;
          errorHandlingService.handleError(e);
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
        themeSwitcherService.clearThemes();
      }
      $scope.type = !$scope.type;
      themeSwitcherService.replaceThemes(themes);
    };
  });
