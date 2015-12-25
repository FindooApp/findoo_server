"use strict";
var userDefination = require('./definations/user'),
    util = require('../helper/util');
// var crypto = require('crypto');
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", userDefination.get(DataTypes), {
    classMethods: {
      associate: userDefination.associate
    },
    instanceMethods : {
      authenticate :  function(plainText){
        return util.decrypt(this.password) === plainText;
      }
    }
  });

  return User;
};
