var mainModule = angular.module('MainModule', []);
var SERVERURL = ''; //'http://localhost:1340';

mainModule.factory('choosesData', ['$http', function($http) {

    var _timeSelect = 0;
    var _allSitesChoose = [{
        name: 'ZD423',
        ischecked: true,
        detail: '专注绿软，分享软件、传递最新软件资讯',
        href: 'http://www.zdfans.com/',
        site: 'zd'
    }, {
        name: 'CCAV',
        ischecked: true,
        detail: 'Yanu - 分享优秀、纯净、绿色、实用的精品软件',
        href: 'http://www.ccav1.com/',
        site: 'ccav'
    }, {
        name: 'llm',
        ischecked: true,
        detail: '浏览迷(原浏览器之家)是一个关注浏览器及软件、IT的科技博客,致力于为广大浏览器爱好者提供一个关注浏览器、交流浏览器、折腾浏览器的专门网站',
        href: 'http://liulanmi.com/',
        site: 'llm'
    }, {
        name: 'qiuquan',
        ischecked: true,
        detail: '专注于软件的绿化、精简与打包，承接 Inno Setup 安装包定制',
        href: 'http://www.qiuquan.cc/',
        site: 'qiuquan'
    }, {
        name: '爱Q生活网',
        ischecked: true,
        detail: '爱Q生活网 - 亮亮\'blog -关注最新QQ活动动态, 掌握QQ第一资讯',
        href: 'http://www.iqshw.com/',
        site: 'iqq'
    }];

    return {
        hadChooses: [],
        getAllSitesChoose: function() {
            return _allSitesChoose;
        },
        setTimeSelect: function(nu) {
            _timeSelect = nu;
        },
        getTimeSelect: function() {
            return _timeSelect;
        },
        saveChooses: function() {
            var obj = {};
            for (var i = 0, l = _allSitesChoose.length; i < l; i++) {
                if (_allSitesChoose[i].ischecked) {
                    obj[_allSitesChoose[i].site] = true;
                }
            }
            localStorage.setItem('shang_chooses', JSON.stringify(obj));
        },
        getData: function(fun, isforce, start) {
            this.saveChooses();

            if (isforce) {
                $http.get(SERVERURL + '/getlatest')
                    .success(function(data) {
                        try {
                            fun && fun(data);
                        }
                        catch (e) {

                        }
                    })
                    .error(function(e) {
                        console.log(e);
                    });
            }
            else {
                start = start || 0;
                $http.get(SERVERURL + '/getinfo?start=' + start)
                    .success(function(data) {
                        console.log('data', data);
                        try {
                            fun && fun(data);
                        }
                        catch (e) {

                        }
                    })
                    .error(function(e) {
                        console.log(e);
                    });
            }


        },
        getUpdateTime: function(cb) {
            $http.get(SERVERURL + '/getupdatetime')
                .success(function(data) {
                    cb(data.time);
                })
                .error(function(data) {
                    cb(0);
                });
        }
    }
}]);

mainModule.controller('ChooseCtrl', ['$rootScope', '$scope', 'choosesData', function($rootScope, $scope, choosesData) {

    $scope.ishow = false;

    $scope.changeShow = function() {
        $scope.ishow = !$scope.ishow;
    };

    $scope.forceUpdate = function() {
        $rootScope.$broadcast('force.update');
    };

    $scope.$on('force.update.end', function() {
        choosesData.getUpdateTime(function(data) {
            console.log(data);
            $scope.updateTime = data;
        });
    });

    $scope.getData = function() {
        $rootScope.$broadcast('info.update');

        choosesData.getUpdateTime(function(data) {
            $scope.updateTime = data;
        });
    };

    $scope.selectValue = {
        value: 0,
        str: '不限'
    };

    $scope.dataChooses = [{
        value: 0,
        str: '不限'
    }, {
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
    }];

    $scope.selectChange = function() {
        choosesData.setTimeSelect($scope.selectValue);
    };

    $scope.CheckChange = function() {
        choosesData.saveChooses();
    };

    $scope.updateTime = 0;
    choosesData.getUpdateTime(function(data) {
        $scope.updateTime = data;
    });


    var localChooseObj = null;

    try {
        localChooseObj = JSON.parse(localStorage.getItem('shang_chooses')).data;
    }
    catch (e) {
        localChooseObj = null;
    }

    if (!localChooseObj) {
        $scope.hadChooses = choosesData.getAllSitesChoose();
    }
    else {
        var allSitesChoose = choosesData.getAllSitesChoose();
        for (var i = 0, l = allSitesChoose.length; i < l; i++) {
            allSitesChoose[i].ischecked = localChooseObj.hasOwnProperty(allSitesChoose[i].site);
        }
        $scope.hadChooses = allSitesChoose;
    }

    choosesData.saveChooses();
}]);

mainModule.controller('contentsCtrl', ['$scope', '$rootScope', '$http', 'choosesData', function($scope, $rootScope, $http, choosesData) {

    var start = 0;

    $scope.contents = [];
    $scope.isloading = true;
    $scope.addMoreInfo = '加载更多~';

    choosesData.getData(function(arr) {
        $scope.contents = arr;
        start = start + arr.length;
        $scope.isloading = false;
    });

    $scope.addMore = function() {
        choosesData.getData(function(arr) {
            if (arr.length === 0) {
                $scope.addMoreInfo = '没有更多了~';
            }
            else {
                start = start + arr.length;
                $scope.contents = $scope.contents.concat(arr);
                $scope.isloading = false;
            }
        }, false, start);
    };

    $scope.$on('info.update', function() {
        $scope.isloading = true;
        choosesData.getData(function(arr) {
            $scope.contents = arr;
            start = arr.length;
            $scope.addMoreInfo = '加载更多~';
            $scope.isloading = false;
        });
    });

    $scope.$on('force.update', function() {
        $scope.isloading = true;
        choosesData.getData(function(arr) {
            $scope.contents = arr;
            $scope.isloading = false;
            $rootScope.$broadcast('force.update.end');
        }, true);
    });


}]);

// ZD图片无法直接获取
mainModule.filter('imgUrlChange', function() {
    return function(input) {
        if (input && input.indexOf('zdfans') !== -1) {
            return SERVERURL + '/getImg?imgurl=' + encodeURIComponent(input);
        }
        else {
            return input;
        }
    }
});

mainModule.filter('timeFilter', ['choosesData', function(choosesData) {
    return function(input) {
        var time = choosesData.getTimeSelect() || 0;
        var currentTime = new Date();
        var arr = [];

        if (time === 0) {
            return input;
        }
        else {
            time = time * 24 * 60 * 60 * 1000;
        }

        for (var i = 0; i < input.length; i++) {
            var obj = input[i];

            if (currentTime - new Date(obj.time) < time) {
                arr.push(obj);
            }
        }
        return arr;
    }
}]);

mainModule.filter('contentFilter', ['choosesData', function(choosesData) {
    return function(input) {
        var siteChoose = choosesData.getAllSitesChoose();

        var obj = {};
        for (var i = 0, l = siteChoose.length; i < l; i++) {
            if (siteChoose[i].ischecked) {
                obj[siteChoose[i].site] = true;
            }
        }

        var arr = [];
        for (i = 0; i < input.length; i++) {
            if (obj.hasOwnProperty(input[i].site)) {
                arr.push(input[i]);
            }
        }

        return arr;
    }
}]);

mainModule.filter('updateTimeFilter', ['$filter', function($filter) {
    return function(input) {
        if (!input) {
            return '未知时间';
        }
        else {
            return $filter('date')(input, 'yy-MM-dd HH:mm');
        }
    }
}]);
