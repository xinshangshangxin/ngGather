'use strict';

var mongoose = require('mongoose');
var config = require('config');


function getCodingMongodbUri() {
  try {
    return JSON.parse(process.env.VCAP_SERVICES).mongodb[0].credentials.uri;
  }
  catch (e) {
    return false;
  }
}

function getDockerMongo(database) {
  var mongodbUri = 'mongodb://';

  if (process.env.MONGO_USERNAME) {
    mongodbUri += process.env.MONGO_USERNAME;

    if (process.env.MONGO_PASSWORD) {
      mongodbUri += ':' + process.env.MONGO_PASSWORD;
    }
    mongodbUri += '@';
  }

  if (!process.env.MONGO_PORT_27017_TCP_ADDR) {
    return false;
  }

  mongodbUri += (process.env.MONGO_PORT_27017_TCP_ADDR || 'localhost') + ':' + (process.env.MONGO_PORT_27017_TCP_PORT || 27017) + '/' + (process.env.MONGO_INSTANCE_NAME || database || 'test');

  return mongodbUri;
}

function getDaoCloudorLocalMongodbUri(database) {
  // 链接格式:    mongodb://user:pass@localhost:port/database
  // DaoCloud链接地址
  var mongodbUri = 'mongodb://';

  if (process.env.MONGODB_USERNAME) {
    mongodbUri += process.env.MONGODB_USERNAME;

    if (process.env.MONGODB_PASSWORD) {
      mongodbUri += ':' + process.env.MONGODB_PASSWORD;
    }
    mongodbUri += '@';
  }

  mongodbUri += (process.env.MONGODB_PORT_27017_TCP_ADDR || 'localhost') + ':' + (process.env.MONGODB_PORT_27017_TCP_PORT || 27017) + '/' + (process.env.MONGODB_INSTANCE_NAME || database || 'test');

  return mongodbUri;
}

function getMongodbUri() {
  var _args = arguments;
  // 返回函数 为了添加参数database
  return function(database) {
    for (var i = 0, l = _args.length; i < l; i++) {
      var fn = _args[i];
      var uri = fn(database);
      if (uri !== false) {
        return uri;
      }
    }
  };
}

function close() {
  mongoose.connection.close(function() {
    console.log('Mongoose disconnected');
  });
}


var dbName = config.get('dbName');
var mongodbUri = getMongodbUri(getCodingMongodbUri, getDockerMongo, getDaoCloudorLocalMongodbUri)(dbName);

//console.log(mongodbUri);

// 链接数据库
var db = mongoose.connect(mongodbUri);

exports.db = db;
exports.mongoose = mongoose;
exports.close = close;
