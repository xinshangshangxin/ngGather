var path = require('path');
var chai = require('chai');
var should = chai.should();

var appPath = __filename.replace(/ngGather.*/, 'ngGather/app');
var articleDao = require(path.join(appPath, 'daos/articleDao.js'));

describe('articleDao', function() {
  before(function(done) {
    articleDao
      .add({
        title: 'ngGather Test'
      })
      .then(function() {
        done();
      })
      .catch(done);
  });

  after(function(done) {
    articleDao
      .remove('ngGather Test')
      .then(function() {
        done();
      })
      .catch(done);
  });

  describe('When call search', function() {
    it('search({}) should have no data', function(done) {
      articleDao
        .search({})
        .then(function(data) {
          should.exist(data);
          data.should.have.length(0);
          done();
        })
        .catch(function(e) {
          console.log(e.stack);
          done(e);
        });
    });
    it('search({keyword: \'ngGather Test\'}) should have data', function(done) {
      articleDao
        .search({
          keyword: 'ngGather Test'
        })
        .then(function(data) {
          should.exist(data);
          data.should.not.have.length(0);
          done();
        })
        .catch(function(e) {
          console.log(e.stack);
          done(e);
        });
    });
  });
});
