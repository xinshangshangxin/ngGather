var request = require('request');
var cheerio = require("cheerio");    //jq操作DOM
var iconv = require('iconv-lite');    //解决编码转换模块
var BufferHelper = require('bufferhelper');   // bufferHelper.concat(chunk);
var q = require('q');
var moment = require('moment');

var dataQuery = require('./dataQuery');


var updateTime = new Date().getTime();

var allSites = [{
    name: 'zd',
    url: 'http://www.zdfans.com/'
}, {
    name: 'ccav',
    url: 'http://www.ccav1.com/'
}, {
    name: 'llm',
    url: 'http://liulanmi.com/'
}, {
    name: 'qiuquan',
    url: 'http://www.qiuquan.cc/'
}, {
    name: 'iqq',
    url: 'http://www.iqshw.com/'
}];

//// 调试事例
//var allSites = [{
//    name: 'qiuquan',
//    url: 'http://www.qiuquan.cc/'
//}];


var dataCache = [];
var updateTimer = null; // 延时更新 timer
updateDataCache();

function updateDataCache() {
    dataQuery.searchAll()
        .then(function(data) {
            dataCache = data;
        })
        .catch(function(err) {
            console.log(err);
        });
}


function getImg(req, res) {
    var url = req.query.imgurl;
    if (!url) {
        res.send(404);
    }
    else {
        request.get(url).pipe(res);
    }
}

function getInfo(req, res) {
    var start = parseInt(req.query.start || 0);
    res.send(dataCache.slice(start, start + 20));
}

function getLatest(req, res) {
    crawlerSites()
        .then(function(result) {
            if (result) {
                res.send(500);
            }
            else {
                res.send(dataCache.slice(0, 20));
            }
        })
        .catch(function(e) {
            res.send(500);
        });
}

function crawlerSites() {
    var arr = [];
    for (var i = 0; i < allSites.length; i++) {
        arr.push(httpGet(allSites[i]));
    }

    return q.all(arr).then(function() {
        // 记录更新时间
        updateTime = new Date().getTime();
        return null;
    }).catch(function(e) {
        console.log(e);
        return 'err';
    })
}

/**
 * 去除arr1中 在arr2中已经出现过的
 * @param arr1
 * @param arr2
 */
function uniq2Arr(arr1, arr2) {
    var temp = [];
    var temparray = [];
    var i = 0, l = 0;
    for (i = 0; i < arr2.length; i++) {
        temp[arr2[i].href] = true;
    }

    for (i = 0, l = arr1.length; i < l; i++) {
        arr1[i].gatherTime = new Date().getTime() + l - i;
        if (!temp[arr1[i].href]) {
            temparray.push(arr1[i]);
        }   // 采集时间和文章发布时间在24小时内[其实只需要30min内]可以进行判断是否为更新文章
        else if (arr1[i].gatherTime - arr1[i].time < 24 * 60 * 60 * 1000) {
            dealSameHref(arr1[i]);
        }
    }

    return temparray;
}

function dealSameHref(siteObj) {
    dataQuery.searchOne({
        href: siteObj.href
    }).then(function(docs) {
        if (docs) {
            // 本次采集到文章发表时间和之前的时间超过23小时则为更新文章
            if (siteObj.time - docs.time >= 23 * 60 * 60 * 1000) {
                dataQuery.update(siteObj).then(function(data) {
                    clearTimeout(updateTimer);
                    setTimeout(function() {
                        updateDataCache();
                    }, 1000);
                    console.log(data);
                });
            }
        }
    })
}

function saveList(name, list) {
    dataQuery.searchSite(name).then(function(docs) {
        dataQuery.addArr(uniq2Arr(list, docs), function() {
            updateDataCache();
        });
    });
}

function httpGet(siteInfo) {

    var deferred = q.defer();
    request({
        url: siteInfo.url,
        method: 'GET',
        encoding: null
    }, function(error, response, body) {
        if (error) {
            console.log('reject');
            deferred.reject();
        }
        else {
            var $ = cheerio.load(changeEncoding(body));
            var list = [];
            console.log(siteInfo.name);
            switch (siteInfo.name) {
                case 'zd':
                {
                    list = captureZDList($);
                    saveList('zd', list);
                    break;
                }
                case 'iqq':
                {
                    list = captureIQQ($);
                    saveList('iqq', list);
                    break;
                }
                case 'ccav':
                {
                    list = captureCCAV($);
                    saveList('ccav', list);
                    break;
                }
                case 'llm':
                {
                    list = captureLLM($);
                    saveList('llm', list);
                    break;
                }
                case 'qiuquan':
                {
                    list = captureQIUQUAN($);
                    saveList('qiuquan', list);
                    break;
                }
                default:
                {
                    list = [];
                }
            }
            deferred.resolve(list);
        }
    });

    return deferred.promise;
}

function captureIQQ($) {
    var list = [];
    $('#content .content-middle .content-middle-news ul li').each(function(i, e) {
        var img = 'http://www.iqshw.com/templets/iqshw_new/logo.jpg';
        var oA = $(e).children('a').last();
        var title = oA.attr('title');
        var href = oA.attr('href');
        var time = $(e).children('span').last().text();
        list.push({
            'site': 'iqq',
            "img": img,
            "title": title,
            "href": 'http://www.iqshw.com' + href,
            "time": moment((new Date().getFullYear() + '-' + time).replace('-', ' ')) + 1000 - i,
            "intro": title
        });

    });
    return list;
}

function captureZDList($) {
    var list = [];
    $(".wrapper .content-wrap .excerpt li").each(function(i, e) {
        var item = $(e).children("h2").last();
        var title = item.text();
        var link = item.children("a").last().attr("href");
        var img = $(e).children("a").first().children("img").attr('src');
        var time = $(e).children(".info").last().children(".time").last().text();
        var note = $(e).children(".note").last().text();
        list.push({
            "img": img,
            "title": title,
            "href": link,
            "time": moment((new Date().getFullYear() + '-' + time).replace('-', ' ')) + 1000 - i,
            "intro": note,
            "site": 'zd'
        });
    });
    return list;
}

function captureCCAV($) {
    var list = [];
    $('#content-list .post-list').each(function(i, e) {
        var aItem = $(e).find('.post-title').first().find('a').first();
        var img = $(e).find('.post-thumbnail').first().find('img').first();
        var timeStr = $(e).find('.ptime').text();
        var timeNu = calculateTime(timeStr);

        list.push({
            "img": img.attr('src'),
            "title": aItem.attr('title'),
            "href": aItem.attr('href'),
            "time": moment(timeNu) + 1000 - i, // 通过 + i 来西澳储sort排序不稳定性
            "intro": $(e).find('.post-excerpt').text(),
            "site": 'ccav'
        });
    });
    return list;
}

function captureQIUQUAN($) {
    var list = [];
    $('#main-wrap-left .bloglist-container .home-blog-entry').each(function(i, e) {
        var aItem = $(e).find('.home-blog-entry-text').first().find('a').first();
        var img = $(e).find('.thumb-img').first().find('img').first();
        var timeStr = $(e).find('.postlist-meta-time').text();
        var timeNu = calculateTime(timeStr);

        list.push({
            "img": img.attr('data-original'),
            "title": aItem.attr('title'),
            "href": aItem.attr('href'),
            "time": moment(timeNu) + 1000 - i,
            "intro": $(e).find('.home-blog-entry-text').first().find('p').text().replace('阅读全文', ''),
            "site": 'qiuquan'
        });
    });
    return list;
}

function captureLLM($) {
    var list = [];
    $('.content .excerpt').each(function(i, e) {
        var aItem = $(e).find('h2').first().find('a').first();
        var timeStr = $(e).find('.muted').first().text();
        var timeNu = calculateTime(timeStr);
        list.push({
            "img": $(e).find('.focus').first().find('img').first().attr('src'),
            "title": aItem.attr('title'),
            "href": aItem.attr('href'),
            "time": moment(timeNu) + 1000 - i,
            "intro": $(e).find('.note').text(),
            "site": 'llm'
        });
    });
    return list;
}

function changeEncoding(data, encoding) {
    var val = iconv.decode(data, encoding || 'utf8');
    if (val.indexOf('�') != -1) {
        val = iconv.decode(data, 'gbk');
    }

    return val;
}

function calculateTime(timeStr) {
    if (/天前/.test(timeStr)) {
        timeNu = new Date(new Date() - parseInt(timeStr) * 24 * 60 * 60 * 1000);
    }
    else if (/小时前/.test(timeStr)) {
        timeNu = new Date(new Date() - parseInt(timeStr) * 60 * 60 * 1000);
    }
    else if (/周前/.test(timeStr)) {
        timeNu = new Date(new Date() - parseInt(timeStr) * 7 * 24 * 60 * 60 * 1000);
    }
    else if (/月前/.test(timeStr)) {
        timeNu = new Date(new Date() - parseInt(timeStr) * 30 * 24 * 60 * 60 * 1000);
    }
    else if (/年前/.test(timeStr)) {
        timeNu = new Date(new Date() - parseInt(timeStr) * 365 * 24 * 60 * 60 * 1000);
    }
    else {
        timeNu = timeStr;
    }
    return timeNu;
}


function databaseOperate() {
    dataQuery.searchAll()
        .then(function(data) {
            for (var i = 0; i < data.length; i++) {
                var obj = {
                    img: data[i].img,
                    title: data[i].title,
                    href: data[i].href,
                    time: data[i].time,
                    intro: data[i].intro,
                    site: data[i].site,
                    currentTime: data[i].currentTime || 0,
                    gatherTime: data[i].currentTime || 0        // 新加
                };
                dataQuery.update(obj).then(function(doc) {
                    console.log(doc);
                }).catch(function(e) {
                    console.log(e);
                });
            }
        })
        .catch(function(err) {
            console.log(err)
        });
}


exports.getImg = getImg;
exports.getInfo = getInfo;
exports.getLatest = getLatest;
exports.databaseOperate = databaseOperate;
exports.getUpdateTime = function(req, res) {
    res.send({
        time: updateTime
    });
};