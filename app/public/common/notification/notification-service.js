'use strict';

angular
  .module('common')
  .service('notificationService', function($translate, $timeout) {
    var notifications = [];
    var svc = this;

    this.getNotifications = function() {
      return notifications;
    };

    this.removeNotification = function(notification) {
      notifications.splice(notifications.indexOf(notification), 1);
    };

    this.error = function(message, timeout) {
      var notification = {
        type: 'error',
        message: message
      };
      notifications.push(notification);
      $timeout(function() {
        svc.removeNotification(notification);
      }, timeout || 5000);
    };

    this.warn = function(message, timeout) {
      var notification = {
        type: 'warn',
        message: message
      };
      notifications.push(notification);
      $timeout(function() {
        svc.removeNotification(notification);
      }, timeout || 3000);
    };

    this.info = function(message, timeout) {
      var notification = {
        type: 'info',
        message: message
      };
      notifications.push(notification);
      $timeout(function() {
        svc.removeNotification(notification);
      }, timeout || 2000);
    };

    this.handleError = function(err) {
      if (_.isObject(err)) {
        if (err.data && err.data.err) {
          return svc.error($translate.instant('error.' + err.data.err));
        }
        if (err.status) {
          var errKey = 'httpStatusMessage.' + err.status;
          var errMessage = $translate.instant(errKey);
          if (errKey === errMessage) {
            errKey = 'httpStatusMessage.0';
            errMessage = $translate.instant(errKey);
          }
          return svc.error(errMessage);
        }
      }
      if (_.isString(err)) {
        svc.error($translate.instant(err));
      }
    };

    this.handleHttpError = function(data, status) {
      svc.handleError({
        status: status,
        data: data
      });
    };
  });
