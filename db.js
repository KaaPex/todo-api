"use strict";
const path = require('path');
const Sequelize = require('sequelize');
var env = process.env.NODE_ENV || 'development';
var config = require(__dirname + '/config.json')[env];
var sequelize;

if (env === "production") {
  sequelize = new Sequelize(process.env.DATABASE_URL, config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

var db = {};

db.todo = sequelize.import(path.join(__dirname, '/models/todo.js'));
db.user = sequelize.import(path.join(__dirname, '/models/user.js'));
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
