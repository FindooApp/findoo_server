"use strict";

var fs        = require("fs");
var path      = require("path");
var Sequelize = require("sequelize");
var config = require('../../config/database.json')['development'];

var sequelize = new Sequelize(config.database, config.username, config.password, config);

console.log("88888 ==", config)
var db        = {};

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf(".") !== 0) && (file !== "index.js");
  })
  .forEach(function(file) {
    if(file !== "definations"){
      var model = sequelize["import"](path.join(__dirname, file));
      db[model.name] = model;
    }
  });

Object.keys(db).forEach(function(modelName) {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;