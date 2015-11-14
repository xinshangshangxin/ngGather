'use strict';
var assert = require('assert');

var article = require('../../sites/models/article.js');
var capture = require('../../sites/models/capture.js');


describe('The article', function() {
  before(function(done) {
    done();
  });

  after(function(done) {
    done();
  });

  describe('When call updateSiteArticles', function() {
    it('should update failed because the article too old', function(done) {
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
          console.log(e);
        })
        .finally(function() {
          done();
        });
    });
  });
});
