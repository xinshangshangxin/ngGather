'use strict';

/**
 * 采集所有页面, 未封装成update
 * 
 */



// var p = 1;
// var isErr = false;
// var canErrNu = 3;
// var sites = [{
//   name: 'waitsun',
//   chName: '爱情守望者',
//   site: 'waitsun',
//   description: '爱情守望者博客以分享，互助和交流为宗旨，分享软件，电影，资源，设计和网络免费资源。',
//   url: 'http://www.waitsun.com/',
//   captureFun: capture.captureWaitsun,
//   classify: 'mac',
//   final: 125
// }, {
//   name: 'MacPeers',
//   url: 'http://www.macpeers.com/',
//   site: 'MacPeers',
//   description: '最有价值的mac软件免费分享源，提供最新mac破解软件免费下载。',
//   captureFun: capture.captureMacpeers,
//   classify: 'mac',
//   encoding: 'utf8',
//   noCheck: true,
//   final: 251
// }, {
//   name: 'zd',
//   url: 'http://www.zdfans.com/',
//   site: 'zd',
//   description: '专注绿软，分享软件、传递最新软件资讯',
//   captureFun: capture.captureZD,
//   classify: 'windows',
//   final: 40
// }, {
//   name: 'ccav',
//   url: 'http://www.ccav1.com/',
//   site: 'ccav',
//   description: 'Yanu - 分享优秀、纯净、绿色、实用的精品软件',
//   captureFun: capture.captureCCAV,
//   classify: 'windows',
//   final: 80
// }, {
//   name: 'llm',
//   url: 'http://liulanmi.com/',
//   site: 'llm',
//   description: '浏览迷(原浏览器之家)是一个关注浏览器及软件、IT的科技博客,致力于为广大浏览器爱好者提供一个关注浏览器、交流浏览器、折腾浏览器的专门网站',
//   captureFun: capture.captureLLM,
//   classify: 'info',
//   final: 203
// }];
// // 采集所有页面
// function captureAll() {
//   sites.forEach(function(item) {
//     item.url = item.url.replace(/(page\/\d+)+/, '');
//     item.url = item.url + 'page/' + p;
//   });
//   Promise
//     .settle(sites.map(function(item) {
//       return updateSiteArticles(item);
//     }))
//     .then(function(results) {
//       _.forEachRight(results, function(result, i) {
//         if (result.isRejected()) {
//           console.log(sites[i].name + '    ' + sites[i].url + '    ' + result.reason());
//           // sites.splice(i, 1);
//           isErr = true;
//         }
//         else {
//           console.log(sites[i].name + '    ' + sites[i].url + '    采集成功');
//           if (sites[i].final <= p) {
//             sites.splice(i, 1);
//           }
//         }
//       });
//       console.log('---------------------------');
//       console.log('---------------------------');
//       if(isErr ) {
//         canErrNu--;
//         p--;
//       }
//       else {
//         canErrNu = 3;
//       }
//       if (sites.length > 0 && canErrNu > 0) {
//         p++;
//         captureAll();
//       }
//     })
//     .catch(function(e) {
//       console.log(e);
//     });

// }
// captureAll();