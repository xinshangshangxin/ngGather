var chai = require('chai');
var should = chai.should();

var articleDao = require('.././daos/articleDao.js');

describe('articleDao', function() {
  before(function(done) {
    done();
  });

  after(function(done) {
    done();
  });

  describe('When call search', function() {
    it('search({}) should have no data', function(done) {
      articleDao
        .search({})
        .then(function(data) {
          should.exist(data);
          data.should.have.length(0);
        })
        .catch(function(e) {
          throw e;
        })
        .finally(function() {
          done();
        });
    });
    it('search({keyword: \'test\'}) should have data', function(done) {
      articleDao
        .search({
          keyword: 'test'
        })
        .then(function(data) {
          should.exist(data);
          data.should.not.have.length(0);
        })
        .catch(function(e) {
          throw e;
        })
        .finally(function() {
          done();
        });
    });
  });
});
