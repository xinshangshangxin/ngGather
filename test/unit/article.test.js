'use strict';
var path = require('path');
var chai = require('chai');
chai.should();


var appPath = __filename.replace(/ngGather.*/, 'ngGather/app');
var article = require(path.join(appPath, 'models/article.js'));
var capture = require(path.join(appPath, 'models/capture.js'));


describe('The article', function() {
  before(function(done) {
    done();
  });

  after(function(done) {
    done();
  });

  describe('When call updateSiteArticles', function() {
    it('should update some data', function(done) {
      article
        .updateSiteArticles({
          name: 'llm',
          url: 'http://liulanmi.com/category/dl/page/36',
          site: 'llm',
          description: '浏览迷(原浏览器之家)是一个关注浏览器及软件、IT的科技博客,致力于为广大浏览器爱好者提供一个关注浏览器、交流浏览器、折腾浏览器的专门网站',
          captureFun: capture.captureLLM,
          classify: 'info'
        })
        .then(function(data) {
          data.should.match(/更新站点llm\s*\d+\s*篇文章成功 !!/gi);
          done();
        })
        .catch(function(e) {
          console.log(e.stack);
          done(e);
        });
    });
  });
});
