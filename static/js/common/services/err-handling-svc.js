'use strict';

angular
  .module('ngGather')
  .service('errorHandlingService', function($state, $translate, notificationService) {
    var svc = this;
    this.handleError = function(err) {
      if (_.isObject(err)) {
        if (err.data && err.data.err) {
          return notificationService.error($translate.instant('error.' + err.data.err));
        }
        if (err.status) {
          var errKey = 'httpStatusMessage.' + err.status;
          var errMessage = $translate.instant(errKey);
          if (errKey === errMessage) {
            errKey = 'httpStatusMessage.0';
            errMessage = $translate.instant(errKey);
          }
          return notificationService.error(errMessage);
        }
      }
      if (_.isString(err)) {
        notificationService.error($translate.instant(err));
      }
    };

    this.handleHttpError = function(data, status) {
      svc.handleError({
        status: status,
        data: data
      });
    };
  });
