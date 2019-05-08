'use strict';
var mysql = require('mysql')
var connection = mysql.createConnection({
    "host"            : "mojoexternals.cpse5vpaifmp.us-east-2.rds.amazonaws.com",
    "user"            : "mojodev",
    "password"        : "mojo1234",
    "database"        : "mojodev"
});

module.exports.create = function(event, context, callback){
  context.callbackWaitsForEmptyEventLoop = false;
  const sql = 'select * from track where 1=1 limit 2';
  connection.query(sql, (error, rows) => {
    if (error) {
      callback({
        statusCode: 500,
        body: error
      })
    } else {
      callback(null, {
        statusCode: 200,
        body: rows
      })
    }
  })
};

module.exports.retrieve = function(event, context, callback){
  return event
};

module.exports.update = function(event, context, callback){
  context.callbackWaitsForEmptyEventLoop = false;
  const sql = 'select * from track where 1=1 limit 2';
  connection.query(sql, (error, rows) => {
    if (error) {
      callback({
        statusCode: 500,
        body: error
      })
    } else {
      callback(null, {
        statusCode: 200,
        body: rows
      })
    }
  })
};

module.exports.delete = function(event, context, callback){
  context.callbackWaitsForEmptyEventLoop = false;
  const sql = 'select * from track where 1=1 limit 2';
  connection.query(sql, (error, rows) => {
    if (error) {
      callback({
        statusCode: 500,
        body: error
      })
    } else {
      callback(null, {
        statusCode: 200,
        body: rows
      })
    }
  })
};
