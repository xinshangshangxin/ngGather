'use strict';

angular.module('ngGather')
  .controller('chooseCtrl', function($scope, $timeout, themeSwitcherService, toastService, notificationService, errorHandlingService, localSaveService, sitesInfoEntity, updateTimeEntity, allSitesEntity, ALL_SITES) {

    var localObj = localSaveService.get();
    $scope.chooseSite = localObj.sites || ALL_SITES;
    $scope.themeType = !!localObj.themeType; // 白色 false; 黑色 true

    $scope.addMoreState = 0; // 0 可以加载更多, 1 没有更多, 2 正在获取中
    $scope.canForceUpdte = true;
    $scope.contents = [];
    $scope.isSearch = false; // 是否在搜索模式下
    $scope.ishide = true; // 导航栏按钮显示
    $scope.ishow = false; // 站点选择显示
    $scope.keyword = ''; // 搜索关键字
    $scope.pageNu = 0;
    $scope.sites = []; // 选择站点名称
    $scope.updateTime = 0;

    var addMoreStateTimer = null;     // 添加更多按钮恢复正常定时器
    var themes = [];                  // 主题样式

    $scope.addMore = addMore;
    $scope.changeSites = changeSites;
    $scope.changeTheme = changeTheme;
    $scope.forceUpdate = forceUpdate;
    $scope.getData = getData;         // 重新获取
    $scope.saveSites = saveSites;
    $scope.search = search;


    return init();

    function init() {
      _.forEach($scope.chooseSite, function(item) {
        if(item.ischecked) {
          $scope.sites.push(item.site);
        }
      });
      // 切换 样式
      if($scope.themeType) {
        $scope.themeType = false;
        $scope.changeTheme();
      }

      // 加载数据; 因为首次加载也会触发 load more事件, 故无法使用 $scope.getData
      getUpdateTime();
      $scope.$on('load more', function($evt, active, locals) {
        if(locals.$percentage > 90) {
          console.log($evt, active, locals);
          $scope.addMore();
        }
      });


      allSitesEntity
        .get()
        .$promise
        .then(function(sites) {
          sites = sites.allSites || [];
          sites.forEach(function(site) {
            var index = _.findIndex($scope.chooseSite, function(item) {
              return item.site === site.site;
            });
            ($scope.chooseSite[index] || {}).latesGatherTime = site.latesGatherTime;
          });
        })
        .catch(function(e) {
          console.log(e);
        });
    }

    function getUpdateTime() {
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
    }

    function getSitesUpdateTime() {
      return allSitesEntity
        .get()
        .$promise
        .then(function(sites) {
          sites = sites.allSites || [];
          sites.forEach(function(site) {
            var index = _.findIndex($scope.chooseSite, function(item) {
              return item.site === site.site;
            });
            ($scope.chooseSite[index] || {}).latesGatherTime = site.latesGatherTime;
          });
        })
        .catch(function(e) {
          console.log(e);
        });
    }

    function changeSites() {
      $scope.ishow = !$scope.ishow;
      if($scope.ishow) {
        getSitesUpdateTime()
          .then(function() {
            $scope.showSites = angular.copy($scope.chooseSite);
          });
      }
    }

    function saveSites(isCancle) {
      $scope.ishow = !$scope.ishow;
      if(isCancle) {
        $scope.showSites = $scope.chooseSite;
        return;
      }
      var sites = [];
      $scope.chooseSite = $scope.showSites;
      _.forEach($scope.chooseSite, function(item) {
        if(item.ischecked) {
          sites.push(item.site);
        }
      });
      $scope.sites = sites;
      $scope.getData();
      localSaveService.set($scope.chooseSite, $scope.themeType);
    }

    function forceUpdate() {
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
    }

    function getData() {
      $scope.pageNu = 0;
      $scope.addMore(true);
      getUpdateTime();
    }

    function search(clearSearch) {
      $scope.isSearch = true;
      if(clearSearch || !$scope.keyword) {
        $scope.isSearch = false;
        $scope.keyword = '';
      }
      $scope.pageNu = 0;
      $scope.addMore(true);
    }

    function addMore(isClear) {
      if($scope.addMoreState !== 0 && !isClear) {
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

      if($scope.sites && _.isArray($scope.sites)) {
        query.sites = $scope.sites;
      }

      if(isClear) {
        query.times = new Date().getTime();
      }
      if($scope.isSearch) {
        query.keyword = $scope.keyword;
      }
      sitesInfoEntity
        .query(query)
        .$promise
        .then(function(arr) {
          $scope.addMoreState = 0;
          $scope.pageNu = ($scope.pageNu || 0) + 1;
          if(isClear) {
            $scope.contents = arr;
          }
          else {
            $scope.contents = $scope.contents.concat(arr);
          }
          if(!arr || !arr.length) {
            $scope.addMoreState = 1;
          }
        })
        .catch(function(e) {
          $scope.addMoreState = 0;
          errorHandlingService.handleError(e);
        });
    }

    function changeTheme() {
      if(!themes || !themes.length) {
        // <!-- inject:themes -->
        themes.push({href: '/css/night/night.css',disabled: true});
        // <!-- endinject -->
        themeSwitcherService.replaceThemes(themes);
      }
      themes.forEach(function(item) {
        item.disabled = !item.disabled;
      });
      $scope.themeType = !$scope.themeType;
      localSaveService.set($scope.chooseSite, $scope.themeType);
    }
  });
