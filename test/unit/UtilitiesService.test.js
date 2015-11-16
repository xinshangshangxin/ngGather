'use strict';
var chai = require('chai');
var should = chai.should();

var utilFuns = require('../../sites/service/utilitiesService.js');

describe('The UtilitiesService', function() {
  before(function(done) {
    done();
  });

  after(function(done) {
    done();
  });

  describe('When call calculateTimeWithNoYear', function() {
    it('should return correct result', function(done) {
      var time = utilFuns.calculateTimeWithNoYear('12-31');
      should.exist(time);
      time.should.match(new RegExp(new Date('2014/12/31').getTime()));
      done();
    });
  });
});
