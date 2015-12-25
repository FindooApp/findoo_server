var Model = require('../models'),
    JSONWebToken = require('jsonwebtoken'),
    passport = require('passport'),
    settings = require('../../config/settings');
    util = require('../helper/util');


module.exports.create = function(req, res){
  req.body.password = util.encrypt(req.body.password)
  req.body.provider = 'local';
  Model.User.findOrCreate({ where : { email : req.body.email, password : req.body.password },defaults :  req.body})
     .spread(function(user, created) {
      if(created){
          var tokenData = {
              email: user.email,
              id: user.id
          };
          var token = JSONWebToken.sign(tokenData, settings.privateKey);
          // Common.sentMailVerificationLink(user,token,req.body.verifyEmailUrl);
          res.status(201).json({ token : token});
      }else{
          var error = {};
          if(user.isVerfied){
            error.userAlreadyExist = true;  
            error.message = "User already exists in the system"
          }else{
            error.userNotVerified = true;
            error.message = "User already exists in the system but not verified"
          }
          return res.status(409).json({error : error});
        }
      })
};


module.exports.verifyEmail = function(req, res){
  
};


module.exports.resendVerificationEmail = function(req, res) {
  
};


module.exports.login = function(req, res, next){
  passport.authenticate('local', { sessions: false }, function(err, user, info){
    // console.log("inside authenticate",err,user.authenticate(),req)
    if(err){
      res.status(500).json(err);
      return next(err);
    }
    
    if(!user){
      res.status(401).json(info);
      return next(info);
    }

    //user has authenticated correctly thus we create a JWT token 
    var token = JSONWebToken.sign({
      user: {
        email: user.email
      }
    }, 'secret');
    res.json({ token : token });
    
  })(req, res, next);
};



module.exports.forgotPassword = function(req, res){
    
}


module.exports.resetPassword = function(req, res){
   
};