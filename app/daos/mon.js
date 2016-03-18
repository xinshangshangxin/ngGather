'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');
var path = require('path');

mongoose.Promise = require('bluebird');

var dbName = process.env.dbName || 'noDbName';

var optionConfig = {
  coding: {
    type: 'fun',
    fun: getCodingMongodbUri
  },
  docker: {
    type: 'env',
    condition: 'host',
    username: 'MONGO_USERNAME',
    password: 'MONGO_PASSWORD',
    host: 'MONGO_PORT_27017_TCP_ADDR',
    post: 'MONGO_PORT_27017_TCP_PORT',
    name: 'MONGO_INSTANCE_NAME'
  },
  daoCloud: {
    type: 'env',
    condition: 'host',
    username: 'MONGODB_USERNAME',
    password: 'MONGODB_PASSWORD',
    host: 'MONGODB_PORT_27017_TCP_ADDR',
    post: 'MONGODB_PORT_27017_TCP_PORT',
    name: 'MONGODB_INSTANCE_NAME'
  },
  openshift: {
    type: 'env',
    condition: 'host',
    username: 'OPENSHIFT_MONGODB_DB_USERNAME',
    password: 'OPENSHIFT_MONGODB_DB_PASSWORD',
    host: 'OPENSHIFT_MONGODB_DB_HOST',
    post: 'OPENSHIFT_MONGODB_DB_PORT',
    name: 'OPENSHIFT_APP_NAME'
  }
};

function close() {
  mongoose.connection.close(function() {
    console.log('Mongoose disconnected');
  });
}

function getCodingMongodbUri() {
  try {
    return _.get(JSON.parse(process.env.VCAP_SERVICES), 'mongodb[0].credentials.uri');
  }
  catch(e) {
    return false;
  }
}

function resolveEnvUrl(config) {
  if(config.condition && !process.env[config[config.condition]]) {
    return false;
  }

  var mongodbUri = 'mongodb://';
  if(process.env[config.username]) {
    mongodbUri += process.env[config.username];

    if(process.env[config.password]) {
      mongodbUri += ':' + process.env[config.password];
    }
    mongodbUri += '@';
  }

  mongodbUri += (process.env[config.host] || 'localhost') + ':' + (process.env[config.port] || 27017) + '/' + (process.env[config.name] || dbName);

  return mongodbUri;
}

function getMongodbUri() {
  var _args = arguments;
  return function() {
    for(var i = 0, l = _args.length; i < l; i++) {
      var config = optionConfig[_args[i]];
      if(!config) {
        continue;
      }

      var uri = '';
      switch(config.type) {
        case 'fun':
        {
          uri = config.fun();
          break;
        }
        case 'env':
        {
          uri = resolveEnvUrl(config);
          break;
        }
        default:
        {
          break;
        }
      }

      if(uri !== false) {
        return uri;
      }
    }

    return 'mongodb://localhost:27017/' + dbName;
  };
}


var mongodbUri = getMongodbUri('openshift', 'coding')();

// 链接数据库
var db = mongoose.connect(mongodbUri);

function generateNewMongooseType(modelName, opt) {
  var modelNameSchema = new mongoose.Schema(_.assign({
    createdAt: {
      type: Date,
      default: Date.now()
    },
    updatedAt: {
      type: Date
    }
  }, opt));

  // 更新 updatedAt
  modelNameSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
  });

  modelNameSchema.pre('update', function(next) {
    this.updatedAt = Date.now();
    next();
  });

  modelNameSchema.pre('findOneAndUpdate', function(next) {
    if(!this.createdAt) {
      this.findOneAndUpdate({}, {
        createdAt: Date.now()
      });
    }
    this.findOneAndUpdate({}, {
      updatedAt: Date.now()
    });
    next();
  });
  var modelNameModel = db.model(modelName, modelNameSchema);

  modelNameSchema.set('toJSON', {
    transform: function(doc, ret) {
      ret.id = ret._id;
    }
  });

  return {
    model: modelNameModel,
    schema: modelNameSchema
  };
}

module.exports = {
  mongoose: mongoose,
  Types: mongoose.Schema.Types,
  db: db,
  generateNewMongooseType: generateNewMongooseType,
  close: close
};