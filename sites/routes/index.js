var express = require('express');
var router = express.Router();

var serverGet = require('../model/serverGet');

/* GET home page. */
router
    .get('/', function(req, res, next) {
        res.render('index.html');
        //res.end('nihao');
    })
    .get('/getimg', function(req, res, next) {
        serverGet.getImg(req, res);
    })
    .get('/getinfo', function(req, res) {
        serverGet.getInfo(req, res);
    }).get('/getlatest', function(req, res) {
        serverGet.getLatest(req, res);
    }).get('/getupdatetime', function(req, res) {
        serverGet.getUpdateTime(req, res);
    });

module.exports = router;
