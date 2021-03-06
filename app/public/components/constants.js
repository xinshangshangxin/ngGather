'use strict';
angular
  .module('ngGather')
  //.constant('SERVERURL', 'http://nggather.coding.io')
  .constant('SERVER_URL', '')
  .constant('ALL_SITES', [{
    name: 'ZD423',
    ischecked: true,
    description: '专注绿软，分享软件、传递最新软件资讯',
    url: 'http://www.zdfans.com/',
    site: 'zd',
    classify: 'windows'
  }, {
    name: 'llm',
    ischecked: true,
    description: '浏览迷(原浏览器之家)是一个关注浏览器及软件、IT的科技博客,致力于为广大浏览器爱好者提供一个关注浏览器、交流浏览器、折腾浏览器的专门网站',
    url: 'http://liulanmi.com/',
    site: 'llm',
    classify: 'info'
  }, {
    name: '爱Q生活网',
    ischecked: false,
    description: '爱Q生活网 - 亮亮\'blog -关注最新QQ活动动态, 掌握QQ第一资讯',
    url: 'http://www.iqshw.com/',
    site: 'iqq',
    classify: 'info'
  }, {
    name: 'waitsun',
    ischecked: true,
    chName: '爱情守望者',
    description: '爱情守望者博客以分享，互助和交流为宗旨，分享软件，电影，资源，设计和网络免费资源。',
    url: 'http://www.waitsun.com/',
    site: 'waitsun',
    classify: 'mac'
  }, {
    name: 'MacPeers',
    ischecked: false,
    url: 'http://www.macpeers.com/',
    description: '最有价值的mac软件免费分享源，提供最新mac破解软件免费下载。',
    site: 'MacPeers',
    classify: 'mac'
  }, {
    name: 'xclient',
    ischecked: true,
    url: 'http://xclient.info/s/',
    site: 'xclient',
    description: '精品MAC应用分享，每天分享大量mac软件，为您提供优质的mac破解软件,免费软件下载服务',
    classify: 'mac'
  }])
  .constant('dataChooses', [{
    value: 1,
    str: '1天内'
  }, {
    value: 2,
    str: '2天内'
  }, {
    value: 3,
    str: '3天内'
  }, {
    value: 5,
    str: '5天内'
  }]);
