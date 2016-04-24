'use strict';

angular
  .module('ngGather')
  .controller('chooseCtrl', function($scope, $timeout, $aside, themeSwitcherService, toastService, notificationService, localSaveService, sitesInfoEntity, updateTimeEntity, allSitesEntity, ALL_SITES) {

    var localObj = localSaveService.get();
    // TODO 需要优化写法
    var ngModel = {};
    $scope.ngModel = ngModel;
    ngModel.chooseSite = localObj.sites || ALL_SITES;
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
    $scope.openAside = openAside;

    return init();

    function init() {
      _.forEach(ngModel.chooseSite, function(item) {
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

          var querySites = [];

          _.forEach(ngModel.chooseSite || [], function(localSite) {
            _.forEach(sites, function(remoteSite) {
              if(remoteSite.site !== localSite.site) {
                return;
              }
              // 用本地的代替
              remoteSite.ischecked = localSite.ischecked;

              // 放入 querySites
              if(remoteSite.ischecked) {
                querySites.push(remoteSite.site);
              }
            });
          });


          // 和首次选取有不一样的, 从新获取
          var arr = _.difference(querySites, $scope.sites);
          if(arr && arr.length || ngModel.chooseSite.length !== sites.length)  {
            console.log('和首次选取有不一样的, 从新获取!');
            ngModel.chooseSite = sites;
            localSaveService.set(sites, $scope.themeType);
          }
          else {
            ngModel.chooseSite = sites;
          }

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
          notificationService.handleError(e);
        });
    }

    function getSitesUpdateTime() {
      return allSitesEntity
        .get()
        .$promise
        .then(function(sites) {
          sites = sites.allSites || [];
          _.forEach(ngModel.chooseSite || [], function(localSite) {
            _.forEach(sites, function(remoteSite) {
              if(remoteSite.site !== localSite.site) {
                return;
              }
              // 用本地的代替
              remoteSite.ischecked = localSite.ischecked;
            });
          });

          ngModel.chooseSite = sites;
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
            ngModel.showSites = angular.copy(ngModel.chooseSite);
          });
      }
    }

    function saveSites(isCancle) {
      $scope.ishow = !$scope.ishow;
      if(isCancle) {
        ngModel.showSites = ngModel.chooseSite;
        return;
      }
      var sites = [];
      ngModel.chooseSite = ngModel.showSites;
      _.forEach(ngModel.chooseSite, function(item) {
        if(item.ischecked) {
          sites.push(item.site);
        }
      });
      $scope.sites = sites;
      $scope.getData();
      localSaveService.set(ngModel.chooseSite, $scope.themeType);
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
          notificationService.handleError(e);
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
          notificationService.handleError(e);
        });
    }

    function changeTheme() {
      if(!themes || !themes.length) {
        themes.push({href: '/css/themes/night/night.css', disabled: true});
        themeSwitcherService.replaceThemes(themes);
      }
      themes.forEach(function(item) {
        item.disabled = !item.disabled;
      });
      $scope.themeType = !$scope.themeType;
      localSaveService.set(ngModel.chooseSite, $scope.themeType);
    }

    function openAside(position, backdrop) {
      getSitesUpdateTime()
        .then(function() {
          ngModel.showSites = angular.copy(ngModel.chooseSite);

          $aside
            .open({
              templateUrl: 'home/choose-site.tpl.html',
              placement: position,
              size: 'lg',
              backdrop: backdrop,
              controller: ['$scope', '$uibModalInstance', function($scope, $uibModalInstance) {

                $scope.chooseSite = ngModel.chooseSite;
                $scope.showSites = ngModel.showSites;

                $scope.ok = function(e) {
                  $uibModalInstance.close();
                  e.stopPropagation();
                };
                $scope.cancel = function(e) {
                  $uibModalInstance.dismiss();
                  e.stopPropagation();
                };
              }]
            })
            .result
            .then(function ok() {
              saveSites();
            }, function cancel() {
              saveSites(true);
            });
        });
    }
  });
