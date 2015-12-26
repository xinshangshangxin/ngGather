'use strict';
var chai = require('chai');
var should = chai.should();

var article = require('.././models/article.js');
var capture = require('.././models/capture.js');


describe('The article', function() {
  before(function(done) {
    done();
  });

  after(function(done) {
    done();
  });

  describe('When call updateSiteArticles', function() {
    it('should update 0 data', function(done) {
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
          data.should.match(/更新站点llm\s*0\s*篇文章成功 !!/gi);
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
