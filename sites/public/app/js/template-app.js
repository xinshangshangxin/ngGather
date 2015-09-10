(function(module) {
try { module = angular.module("ngGather"); }
catch(err) { module = angular.module("ngGather", []); }
module.run(["$templateCache", function($templateCache) {
  $templateCache.put("app/tpls/choosePanel.html",
    "<div ng-controller=\"ChooseCtrl\">\n" +
    "    <nav class=\"navbar navbar-default\">\n" +
    "        <div class=\"navbar-header\">\n" +
    "            <div class=\"navbar-brand\">ngGather</div>\n" +
    "        </div>\n" +
    "        <ul class=\"nav navbar-nav navbar-left\">\n" +
    "            <li>\n" +
    "                <a class=\"btn graybtn\" ng-click=\"changeShow()\">站点选择</a>\n" +
    "            </li>\n" +
    "            <li>\n" +
    "                <select class=\"form-control\" ng-model=\"selectValue\"\n" +
    "                        ng-options=\"dataChoose.value as dataChoose.str\n" +
    "                                for dataChoose in dataChooses\"\n" +
    "                        ng-change=\"selectChange()\">\n" +
    "                    <option value=\"\">不限</option>\n" +
    "                </select>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "        <ul class=\"nav navbar-nav navbar-right\">\n" +
    "            <li>\n" +
    "                <a class=\"btn\" ng-click=\"getData()\">重新获取</a>\n" +
    "            </li>\n" +
    "            <li>\n" +
    "                <a class=\"btn\" ng-click=\"forceUpdate()\">强制更新</a>\n" +
    "            </li>\n" +
    "            <li>\n" +
    "                <a class=\"btn\">更新时间: {{updateTime | updateTimeFilter}}</a>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "    </nav>\n" +
    "    <div ng-show=\"ishow\" id=\"sites\">\n" +
    "        <table class=\"table table-bordered table-striped\">\n" +
    "            <tr ng-repeat=\"choose in hadChooses\">\n" +
    "                <td>\n" +
    "                    <div class=\"checkbox\">\n" +
    "                        <label>\n" +
    "                            <input type=\"checkbox\" ng-model=\"choose.ischecked\" ng-change=\"CheckChange()\"/>{{choose.name}}\n" +
    "                        </label>\n" +
    "                    </div>\n" +
    "                </td>\n" +
    "                <td style=\"vertical-align: middle\">\n" +
    "                    <a href=\"{{choose.href}}\" target=\"_blank\">{{choose.detail}}</a>\n" +
    "                </td>\n" +
    "            </tr>\n" +
    "        </table>\n" +
    "    </div>\n" +
    "</div>");
}]);
})();

(function(module) {
try { module = angular.module("ngGather"); }
catch(err) { module = angular.module("ngGather", []); }
module.run(["$templateCache", function($templateCache) {
  $templateCache.put("app/tpls/contents.html",
    "<div ng-controller=\"contentsCtrl\">\n" +
    "    <div id=\"circularG\" ng-show=\"isloading\" class=\"center-block\">\n" +
    "        <div id=\"circularG_1\" class=\"circularG\">\n" +
    "        </div>\n" +
    "        <div id=\"circularG_2\" class=\"circularG\">\n" +
    "        </div>\n" +
    "        <div id=\"circularG_3\" class=\"circularG\">\n" +
    "        </div>\n" +
    "        <div id=\"circularG_4\" class=\"circularG\">\n" +
    "        </div>\n" +
    "        <div id=\"circularG_5\" class=\"circularG\">\n" +
    "        </div>\n" +
    "        <div id=\"circularG_6\" class=\"circularG\">\n" +
    "        </div>\n" +
    "        <div id=\"circularG_7\" class=\"circularG\">\n" +
    "        </div>\n" +
    "        <div id=\"circularG_8\" class=\"circularG\">\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"row\" ng-repeat=\"content in contents | timeFilter | contentFilter\">\n" +
    "        <div class=\"contents\">\n" +
    "            <div class=\"col-xs-12 col-sm-3 text-center\">\n" +
    "                <a href=\"{{content.href}}\" target=\"_blank\">\n" +
    "                    <img ng-src=\"{{content.img | imgUrlChange}}\" class=\"maxwidth\">\n" +
    "                </a>\n" +
    "            </div>\n" +
    "            <div class=\"col-xs-12 col-sm-9\">\n" +
    "                <div class=\"col-xs-12 col-sm-10\">\n" +
    "                    <a href=\"{{content.href}}\" target=\"_blank\">\n" +
    "                        <h4>[{{content.site}}] {{content.title}}</h4>\n" +
    "                    </a>\n" +
    "                </div>\n" +
    "                <div class=\"col-xs-12 col-sm-2\">\n" +
    "                    {{content.gatherTime | date:\"yy/MM/dd HH:mm\"}}\n" +
    "                </div>\n" +
    "                <div class=\"col-xs-12 col-sm-12\">\n" +
    "                    <p>{{content.intro}}</p>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"col-xs-12 col-sm-12\">\n" +
    "                <hr/>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"addmore text-center\" ng-click=\"addMore()\">\n" +
    "        <a class=\"btn btn-info\">{{addMoreInfo}}</a>\n" +
    "    </div>\n" +
    "</div>");
}]);
})();

(function(module) {
try { module = angular.module("ngGather"); }
catch(err) { module = angular.module("ngGather", []); }
module.run(["$templateCache", function($templateCache) {
  $templateCache.put("app/tpls/main.html",
    "<div ui-view=\"choosePanel\">\n" +
    "</div>\n" +
    "<div ui-view=\"contents\">\n" +
    "</div>");
}]);
})();
