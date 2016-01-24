'use strict';
var path = require('path');
var chai = require('chai');
var should = chai.should();

var appPath = __filename.replace(/ngGather.*/, 'ngGather/app');
var utilFuns = require(path.join(appPath, 'service/utilitiesService.js'));

describe('The UtilitiesService', function() {
  before(function(done) {
    done();
  });

  after(function(done) {
    done();
  });

  describe('When call calculateTimeWithNoYear', function() {
    it('should return correct result', function(done) {

      var now = new Date();
      if(now.getMonth() === 12 && now.getDate() === 31) {
        throw 'today can not check this function';
      }

      var testDate = new Date((now.getFullYear() - 1) +'/12/31');

      var time = utilFuns.calculateTimeWithNoYear('12-31');
      should.exist(time);
      time.should.match(new RegExp(testDate.getTime()));
      done();
    });
  });
});
