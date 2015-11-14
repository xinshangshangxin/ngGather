'use strict';
var assert = require('assert');

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
      utilFuns.calculateTimeWithNoYear('12-31').should.match(new Date('2014/12/31').getTime());
      done();
    });
  });
});
