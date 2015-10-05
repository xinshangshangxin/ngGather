'use strict';

angular.module('ngGather')
  .controller('chooseCtrl', function($scope, $timeout, themeSwitcherService, toastService, notificationService, errorHandlingService, localSaveService, sitesInfoEntity, updateTimeEntity, ALL_SITES) {

    var localObj = localSaveService.get();
    $scope.chooseSite = localObj.sites;
    $scope.themeType = !!localObj.themeType; // 白色 false; 黑色 true

    $scope.contents = [];
    $scope.updateTime = 0;
    $scope.pageNu = 0;
    $scope.ishide = true; // 导航栏按钮显示
    $scope.chooseSite = $scope.chooseSite || ALL_SITES;
    $scope.ishow = false; // 站点选择显示
    $scope.addMoreState = 0; // 0 可以加载更多, 1 没有更多, 2 正在获取中
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
      $scope.showSites = angular.copy($scope.chooseSite);
      $scope.ishow = !$scope.ishow;
    };

    $scope.saveSites = function(isCancle) {
      $scope.ishow = !$scope.ishow;
      if (isCancle) {
        $scope.showSites = $scope.chooseSite;
        return;
      }
      var sites = [];
      $scope.chooseSite = $scope.showSites;
      _.forEach($scope.chooseSite, function(item) {
        if (item.ischecked) {
          sites.push(item.site);
        }
      });
      $scope.sites = sites;
      $scope.getData();
      localSaveService.set($scope.chooseSite, $scope.themeType);
    };

    $scope.forceUpdate = function() {
      $scope.canForceUpdte = false;
      $timeout(function() {
        $scope.canForceUpdte = true;
      }, 2 * 60 * 1000);
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
      if ($scope.addMoreState !== 0) {
        console.log($scope.addMoreState === 1 ? '没有更多' : '加载中');
        return;
      }
      $timeout.cancel(addMoreStateTimer);
      addMoreStateTimer = $timeout(function() {
        $scope.addMoreState = 0;
      }, 15 * 1000);
      $scope.addMoreState = 2;
      var query = {
        pageNu: $scope.pageNu || 0,
        updateTime: $scope.updateTime ? (new Date($scope.updateTime)).getTime() : (new Date()).getTime()
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
          if (!arr || !arr.length) {
            return ($scope.addMoreState = 1);
          }
          $scope.addMoreState = 0;
          $scope.pageNu = ($scope.pageNu || 0) + 1;
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

    var themes = [];
    $scope.changeTheme = function() {
      if (!themes || !themes.length) {
        // <!-- inject:themes -->
        themes.push({
          href: '/themes/night/night.css',
          disabled: true
        });
        // <!-- endinject -->
        themeSwitcherService.replaceThemes(themes);
      }
      themes.forEach(function(item) {
        item.disabled = !item.disabled;
      });
      $scope.themeType = !$scope.themeType;
      localSaveService.set($scope.chooseSite, $scope.themeType);
    };


    // 切换 样式
    if ($scope.themeType) {
      $scope.themeType = false;
      $scope.changeTheme();
    }

    // 加载数据; 因为首次加载也会触发 load more事件, 故无法使用 $scope.getData
    getUpdateTime();
    $scope.$on('load more', function($evt, active, locals) {
      if (locals.$percentage > 90) {
        console.log($evt, active, locals);
        $scope.addMore();
      }
    });
  });
