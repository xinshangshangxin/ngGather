'use strict';

module.exports = {
  superSecret: process.env.SUPER_SECRET || 'SUPER_SECRET',
  execCmdKey: process.env.EXEC_CMD_KEY || 'key',
  port: process.env.LEANCLOUD_APP_PORT || '8080',
  ip: undefined,
  mailTransport: {
    host: 'smtp.sina.com',
    port: 465,
    secure: true,
    tls: {
      rejectUnauthorized: false
    },
    auth: {
      user: 'test4code@sina.com',
      pass: 'Test4code;'
    }
  },
  mongo: {
    type: 'uri',
    uri: 'mongodb://leancloud:leancloud@ds111479.mlab.com:11479/ng-gather',
    collectionPrefix: '',
  },
  update: {
    // ref: 'production'
  },
  bootstrap: [
    // 'webhookService',
  ],
};