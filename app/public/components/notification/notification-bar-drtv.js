'use strict';

angular
  .module('ngGather')
  .directive('notificationBar', function() {
    return {
      restrict: 'AE',
      templateUrl: 'components/notification/notification-bar.tpl.html',
      controller: function($scope, notificationService) {
        $scope.notifications = notificationService.getNotifications();
        $scope.types = {
          error: 'danger',
          warn: 'warning',
          info: 'info'
        };
        $scope.close = function(index) {
          $scope.notifications.splice(index, 1);
        };
      }
    };
  });
