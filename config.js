'use strict';

const path = require('path');

// mysql
module.exports.mysql = {
  host: 'localhost',
  user: 'root',
  password: 'root',
  charset: 'UTF8MB4',
  database: 'unitPlanner',
  // socketPath: '/tmp/mysql.sock', // uncomment this when testing with local non-networked mysql
};

// constants for directories
module.exports.webpages = path.join(__dirname, '/webPages/');
