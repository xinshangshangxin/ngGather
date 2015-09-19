'use strict';

angular.module('ngGather')
  .controller('chooseCtrl', function($scope, sitesInfoEntity, updateTimeEntity, ALL_SITES) {

    $scope.contents = [];
    $scope.updateTime = 0;
    $scope.pageNu = 0;
    $scope.isloading = true;
    $scope.chooseSite = ALL_SITES;
    $scope.ishow = false;
    $scope.addMoreInfo = '加载更多~';


    $scope.changeShow = function() {
      $scope.ishow = !$scope.ishow;
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
    };

    $scope.addMore = function(isClear) {
      $scope.isloading = true;
      sitesInfoEntity
        .query({
          pageNu: $scope.pageNu || 0
        })
        .$promise
        .then(function(arr) {
          $scope.isloading = false;
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
          $scope.isloading = false;
        });
    };

    $scope.getData();
    updateTimeEntity
      .get()
      .$promise
      .then(function(data) {
        $scope.updateTime = data.updateTime;
      })
      .catch(function(e) {
        console.log(e);
      });
  });