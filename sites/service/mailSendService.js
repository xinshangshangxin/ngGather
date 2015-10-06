'use strict';

var Promise = require('bluebird');
var nodemailer = require('nodemailer');
var _ = require('lodash');

// 从环境变量中获取账号
var getEnvSetting = function() {
  var _transport = {
    auth: {}
  };

  if (process.env.host) {
    _transport.host = process.env.host;
  }
  if (process.env.port) {
    _transport.port = process.env.port;
  }
  if (process.env.user) {
    _transport.auth.user = process.env.user;
  }
  if (process.env.pass) {
    _transport.auth.pass = process.env.pass;
  }
  if (process.env.service) {
    _transport.service = process.env.service;
  }
  return _transport;
};

// 默认配置
var defaultMailOptions = {
  from: 'test4code@sina.com',
  to: ['codenotification@sina.com'],
  subject: 'subject',
  text: 'text',
  html: '<b>Hello world ✔</b>' // html body
};

var defaultTransport = {
  host: 'smtp.sina.com',
  port: 25,
  auth: {
    user: 'test4code@sina.com',
    pass: 'Test4code;'
  }
};

var transporter = Promise
  .promisifyAll(nodemailer
    .createTransport(_.assign({}, getEnvSetting(), defaultTransport))
  );

var sendMail = function(mailOtions) {
  return transporter
    .sendMailAsync(_.assign({}, defaultMailOptions, mailOtions));
};

// sendMail()
//   .then(function(data) {
//     console.log(data);
//   })
//   .catch(function(e) {
//     console.log(e);
//   });

exports.sendMail = sendMail;
