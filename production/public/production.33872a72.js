"use strict";angular.module("ngGather",["pascalprecht.translate","ui.router","ui.bootstrap","ngResource","angular-loading-bar","ngAnimate","pc035860.scrollWatch"]).config(["$locationProvider","$translateProvider",function(e,t){t.useStaticFilesLoader({prefix:"languages/",suffix:".json"}),t.preferredLanguage("zh-hans"),e.html5Mode(!0)}]),function(e){try{e=angular.module("ngGather")}catch(t){e=angular.module("ngGather",[])}e.run(["$templateCache",function(e){e.put("index.html",'<!DOCTYPE html>\n<html ng-app="ngGather">\n\n<head lang="en">\n  <meta charset="utf-8">\n  <meta http-equiv="X-UA-Compatible" content="IE=edge">\n  <meta name="viewport" content="width=device-width, initial-scale=1">\n  <title>gather</title>\n  <base href="/">\n  <link rel="shortcut icon" href="http://7xiblm.com1.z0.glb.clouddn.com/o_19ijj1r296801fl2ttqs028149.ico" />\n  <!-- inject:css -->\n  <!-- endinject -->\n  <theme-switcher></theme-switcher>\n</head>\n\n<body>\n  <div class="notification-bar" notification-bar></div>\n  <div class="container">\n    <div ui-view></div>\n  </div>\n  <toast></toast>\n  <!-- <notification-bar></notification-bar> -->\n  <!-- inject:js -->\n  <!-- endinject -->\n</body>\n\n</html>\n')}])}(),function(e){try{e=angular.module("ngGather")}catch(t){e=angular.module("ngGather",[])}e.run(["$templateCache",function(e){e.put("templates/home.html",'<div>\n  <nav class="navbar navbar-default">\n    <div class="navbar-header">\n      <a class="navbar-brand text-center btn-link more-option" ng-click="ishide = !ishide">ngGather</a>\n    </div>\n    <ul class="nav navbar-nav navbar-left" ng-class="{\'mobile-hide\': ishide}">\n      <li>\n        <a class="btn btn-link" ng-click="changeSites()">站点选择</a>\n      </li>\n      <li ng-class="{\'mobile-hide\': ishide}">\n        <form class="navbar-form navbar-left search" role="search" ng-submit="search()">\n          <div class="form-group">\n            <input type="text" class="form-control" placeholder="回车搜索" ng-model="keyword">\n          </div>\n          <a ng-show="!!keyword" class="btn btn-link" ng-click="search(true)">取消搜索</a>\n        </form>\n      </li>\n    </ul>\n    <ul class="nav navbar-nav navbar-right">\n      <li ng-class="{\'mobile-hide\': ishide}">\n        <a class="btn btn-link" ng-click="addMoreState !== 0 || getData()" ng-disabled="addMoreState !== 0">重新获取</a>\n      </li>\n      <li ng-class="{\'mobile-hide\': ishide}">\n        <a class="btn btn-link" ng-click="changeTheme()">{{themeType ? \'换白色主题\' : \'换黑色主题\'}}</a>\n      </li>\n      <li>\n        <a class="btn btn-link" ng-click="!canForceUpdte || forceUpdate()" ng-disabled="!canForceUpdte">更新时间: {{updateTime | updateTimeFilter}}</a>\n      </li>\n    </ul>\n  </nav>\n  <div ng-show="ishow" id="sites">\n    <table class="table table-bordered table-striped">\n      <tr ng-repeat="choose in (showSites || chooseSite)">\n        <td>\n          <div class="checkbox">\n            <label>\n              <input type="checkbox" ng-model="choose.ischecked" />{{choose.name}}\n            </label>\n          </div>\n        </td>\n        <td>\n          <a href="{{choose.url}}" target="_blank">{{choose.description}}</a>\n        </td>\n      </tr>\n      <tr>\n        <td>\n        </td>\n        <td>\n          <a class="btn btn-primary" ng-click="saveSites()">保存</a>\n          <a class="btn btn-warning" ng-click="saveSites(true)">取消</a>\n        </td>\n      </tr>\n    </table>\n  </div>\n</div>\n<div scroll-watch="{from: 0, to: -1}" sw-broadcast="{\'load more\': \'$percentage > 90\'}">\n  <div class="row" ng-repeat="content in contents">\n    <div class="contents">\n      <div class="col-xs-12 col-sm-3 text-center">\n        <a ng-href="{{content.href}}" target="_blank">\n          <img ng-src="{{content.img | imgUrlChange}}">\n        </a>\n      </div>\n      <div class="col-xs-12 col-sm-9">\n        <div class="col-xs-12 col-sm-10">\n          <a ng-href="{{content.href}}" target="_blank">\n            <div class="title">[{{content.site}}] {{content.title}}</div>\n          </a>\n        </div>\n        <div class="col-xs-12 col-sm-2 detail">\n          {{content.gatherTime | date:"yy/MM/dd HH:mm"}}\n        </div>\n        <div class="col-xs-12 col-sm-12">\n          {{content.intro}}\n        </div>\n      </div>\n      <div class="col-xs-12 col-sm-12">\n        <hr/>\n      </div>\n    </div>\n  </div>\n  <div class="addmore text-center">\n    <a class="btn btn-primary" ng-click="addMoreState !== 0 || addMore()" ng-disabled="addMoreState !== 0">{{[\'加载更多~\', \'没有更多了~~\', \'加载中~~\'][addMoreState]}}</a>\n  </div>\n</div>\n')}])}(),function(e){try{e=angular.module("ngGather")}catch(t){e=angular.module("ngGather",[])}e.run(["$templateCache",function(e){e.put("components/notification/notification-bar.tpl.html",'<alert class="center-block col-sm-6" ng-repeat="notification in notifications" type="{{types[notification.type]}}" close="close($index)">{{notification.message}}</alert>')}])}(),angular.module("ngGather").directive("notificationBar",function(){return{restrict:"AE",templateUrl:"components/notification/notification-bar.tpl.html",controller:["$scope","notificationService",function(e,t){e.notifications=t.getNotifications(),e.types={error:"danger",warn:"warning",info:"info"},e.close=function(t){e.notifications.splice(t,1)}}]}}),angular.module("ngGather").service("notificationService",["$timeout",function(e){var t=[],n=this;this.getNotifications=function(){return t},this.removeNotification=function(e){t.splice(t.indexOf(e),1)},this.error=function(a,i){var o={type:"error",message:a};t.push(o),e(function(){n.removeNotification(o)},i||5e3)},this.warn=function(a,i){var o={type:"warn",message:a};t.push(o),e(function(){n.removeNotification(o)},i||3e3)},this.info=function(a,i){var o={type:"info",message:a};t.push(o),e(function(){n.removeNotification(o)},i||2e3)}}]),angular.module("ngGather").directive("themeSwitcher",function(){return{restrict:"AE",template:'<link rel="stylesheet" ng-repeat="style in styles" ng-href="{{ style.href || style }}" ng-disabled="!!style.disabled"/>',replace:!0,scope:!0,controller:["$scope","themeSwitcherService",function(e,t){e.styles=t.getThemes()}]}}),angular.module("ngGather").service("themeSwitcherService",function(){var e=[],t=this;this.getThemes=function(){return e},this.addThemes=function(t){_.isArray(t)?e.push.apply(e,t):e.push(t)},this.removeTheme=function(t){e.splice(e.indexOf(t),1)},this.clearThemes=function(){e.length=0},this.replaceThemes=function(e){t.clearThemes(),t.addThemes(e)}}),angular.module("ngGather").directive("toast",function(){return{restrict:"AE",template:'<div class="toast" ng-show="toast && toast.length"><span class="msg">{{toast[0]}}</span></div>',replace:!0,scope:!0,controller:["$scope","toastService",function(e,t){e.toast=t.getToast()}]}}),angular.module("ngGather").service("toastService",["$timeout",function(e){var t=[];this.setToast=function(n,a){t.length=0,t.push(n),e(function(){t.length=0},a||1500)},this.clearToast=function(){t.length=0},this.getToast=function(){return t}}]),angular.module("ngGather").controller("chooseCtrl",["$scope","$timeout","themeSwitcherService","toastService","notificationService","errorHandlingService","localSaveService","sitesInfoEntity","updateTimeEntity","ALL_SITES",function(e,t,n,a,i,o,r,s,c,l){function h(){_.forEach(e.chooseSite,function(t){t.ischecked&&e.sites.push(t.site)}),e.themeType&&(e.themeType=!1,e.changeTheme()),d(),e.$on("load more",function(t,n,a){a.$percentage>90&&e.addMore()})}function d(){c.get().$promise.then(function(t){e.updateTime=t.updateTime})["catch"](function(e){o.handleError(e)})}function u(){e.showSites=angular.copy(e.chooseSite),e.ishow=!e.ishow}function m(t){if(e.ishow=!e.ishow,t)return void(e.showSites=e.chooseSite);var n=[];e.chooseSite=e.showSites,_.forEach(e.chooseSite,function(e){e.ischecked&&n.push(e.site)}),e.sites=n,e.getData(),r.set(e.chooseSite,e.themeType)}function g(){e.canForceUpdte=!1,t(function(){e.canForceUpdte=!0},12e4),i.info("强制重新采集中~~请稍后刷新~",3500),s.get({force:1}).$promise.then(function(){})["catch"](function(e){o.handleError(e)})}function f(){e.pageNu=0,e.addMore(!0),d()}function p(t){e.isSearch=!0,(t||!e.keyword)&&(e.isSearch=!1,e.keyword=""),e.pageNu=0,e.addMore(!0)}function v(n){if(0===e.addMoreState||n){t.cancel(w),w=t(function(){e.addMoreState=0},15e3),e.addMoreState=2;var a={pageNu:e.pageNu||0,updateTime:e.updateTime?new Date(e.updateTime).getTime():(new Date).getTime()};e.sites&&_.isArray(e.sites)&&(a.sites=e.sites),n&&(a.times=(new Date).getTime()),e.isSearch&&(a.keyword=e.keyword),s.query(a).$promise.then(function(t){e.addMoreState=0,e.pageNu=(e.pageNu||0)+1,n?e.contents=t:e.contents=e.contents.concat(t),t&&t.length||(e.addMoreState=1)})["catch"](function(t){e.addMoreState=0,o.handleError(t)})}}function b(){y&&y.length||(y.push({href:"/themes/night/night.0565b4b2.css",disabled:!0}),n.replaceThemes(y)),y.forEach(function(e){e.disabled=!e.disabled}),e.themeType=!e.themeType,r.set(e.chooseSite,e.themeType)}var S=r.get();e.chooseSite=S.sites||l,e.themeType=!!S.themeType,e.addMoreState=0,e.canForceUpdte=!0,e.contents=[],e.isSearch=!1,e.ishide=!0,e.ishow=!1,e.keyword="",e.pageNu=0,e.sites=[],e.updateTime=0;var w=null,y=[];return e.addMore=v,e.changeSites=u,e.changeTheme=b,e.forceUpdate=g,e.getData=f,e.saveSites=m,e.search=p,h()}]),angular.module("ngGather").config(["$stateProvider",function(e){e.state("home.contents",{url:"/contents",templateUrl:"templates/contents.html",controller:"contentsCtrl"})}]),angular.module("ngGather").config(["$stateProvider","$urlRouterProvider",function(e,t){t.when("","/contents"),t.otherwise("/contents"),e.state("home",{url:"",templateUrl:"templates/home.html",controller:"chooseCtrl"})}]),angular.module("ngGather").factory("sitesInfoEntity",["$resource","SERVERURL",function(e,t){return e(t+"/api/v1/sites",{},{update:{method:"PUT"}})}]).factory("updateTimeEntity",["$resource","SERVERURL",function(e,t){return e(t+"/api/v1/updateTime",{},{update:{method:"PUT"}})}]),angular.module("ngGather").service("localSaveService",function(){this.get=function(){try{var e=JSON.parse(localStorage.getItem("shang_ngGather"))||{};return{sites:e.sites,themeType:e.themeType}}catch(t){return localStorage.removeItem("shang_ngGather"),null}},this.set=function(e,t){localStorage.setItem("shang_ngGather",JSON.stringify({sites:e,themeType:t}))}}),angular.module("ngGather").filter("imgUrlChange",["SERVERURL",function(e){return function(t){return t&&/(zdfans)|(waitsun)/i.test(t)?e+"api/v1/getImg?imgurl="+encodeURIComponent(t):t}}]),angular.module("ngGather").filter("updateTimeFilter",["$filter",function(e){return function(t){return t?e("date")(t,"yy-MM-dd HH:mm"):"未知时间"}}]),angular.module("ngGather").constant("SERVERURL","").constant("ALL_SITES",[{name:"ZD423",ischecked:!0,description:"专注绿软，分享软件、传递最新软件资讯",url:"http://www.zdfans.com/",site:"zd",classify:"windows"},{name:"CCAV",ischecked:!0,description:"Yanu - 分享优秀、纯净、绿色、实用的精品软件",url:"http://www.ccav1.com/",site:"ccav",classify:"windows"},{name:"llm",ischecked:!0,description:"浏览迷(原浏览器之家)是一个关注浏览器及软件、IT的科技博客,致力于为广大浏览器爱好者提供一个关注浏览器、交流浏览器、折腾浏览器的专门网站",url:"http://liulanmi.com/",site:"llm",classify:"info"},{name:"爱Q生活网",ischecked:!0,description:"爱Q生活网 - 亮亮'blog -关注最新QQ活动动态, 掌握QQ第一资讯",url:"http://www.iqshw.com/",site:"iqq",classify:"info"},{name:"waitsun",ischecked:!0,chName:"爱情守望者",description:"爱情守望者博客以分享，互助和交流为宗旨，分享软件，电影，资源，设计和网络免费资源。",url:"http://www.waitsun.com/",site:"waitsun",classify:"mac"},{name:"MacPeers",ischecked:!0,url:"http://www.macpeers.com/",description:"最有价值的mac软件免费分享源，提供最新mac破解软件免费下载。",site:"MacPeers",classify:"mac"}]).constant("dataChooses",[{value:1,str:"1天内"},{value:2,str:"2天内"},{value:3,str:"3天内"},{value:5,str:"5天内"}]),angular.module("ngGather").service("errorHandlingService",["$state","$translate","notificationService",function(e,t,n){var a=this;this.handleError=function(e){if(_.isObject(e)){if(e.data&&e.data.err)return n.error(t.instant("error."+e.data.err));if(e.status){var a="httpStatusMessage."+e.status,i=t.instant(a);return a===i&&(a="httpStatusMessage.0",i=t.instant(a)),n.error(i)}}_.isString(e)&&n.error(t.instant(e))},this.handleHttpError=function(e,t){a.handleError({status:t,data:e})}}]);