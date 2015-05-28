var express = require('express');
var router = express.Router();

var serverGet = require('../model/serverGet');

/* GET home page. */
router
    .use(function(req, res, next) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader(
            "Access-Control-Allow-Methods",
            "GET, POST, HEAD"
        );

        next();
    })
    .get('/', function(req, res, next) {
        res.render('index.html');
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
    }).get('/databaseoperate', function(req, res) {
        var token = req.query.token;
        console.log(token);
        if (token != ( process.env.token)) {
            res.send('token 错误!!');
        }
        else {
            res.send('start');
            serverGet.databaseOperate(req, res);
        }
    });

module.exports = router;
