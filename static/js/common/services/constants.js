'use strict';
angular
  .module('ngGather')
  //.constant('SERVERURL', 'http://nggather.coding.io')
  .constant('SERVERURL', '')
  .constant('ALL_SITES', [{
    name: 'ZD423',
    ischecked: true,
    description: '专注绿软，分享软件、传递最新软件资讯',
    href: 'http://www.zdfans.com/',
    site: 'zd'
  }, {
    name: 'CCAV',
    ischecked: true,
    description: 'Yanu - 分享优秀、纯净、绿色、实用的精品软件',
    href: 'http://www.ccav1.com/',
    site: 'ccav'
  }, {
    name: 'llm',
    ischecked: true,
    description: '浏览迷(原浏览器之家)是一个关注浏览器及软件、IT的科技博客,致力于为广大浏览器爱好者提供一个关注浏览器、交流浏览器、折腾浏览器的专门网站',
    href: 'http://liulanmi.com/',
    site: 'llm'
  }, {
    name: '爱Q生活网',
    ischecked: true,
    description: '爱Q生活网 - 亮亮\'blog -关注最新QQ活动动态, 掌握QQ第一资讯',
    href: 'http://www.iqshw.com/',
    site: 'iqq'
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
  }])
;