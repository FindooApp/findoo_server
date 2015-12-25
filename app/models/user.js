"use strict";
var userDefination = require('./definations/user');
var crypto = require('crypto');
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", userDefination.get(DataTypes), {
    classMethods: {
      associate: userDefination.associate
    },
    instanceMethods : {
      authenticate :  function(plainText){
        return this.encryptPassword(plainText) === this.hashed_password;
        // return plainText == this.password;
      },
       makeSalt: function() {
        return Math.round((new Date().valueOf() * Math.random())) + ''
      },
      encryptPassword: function(password) {
        if (!password) return ''
        return crypto.createHmac('sha1', this.salt).update(password).digest('hex')
      }
    }
  });

  return User;
};
