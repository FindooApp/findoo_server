var Model = require('../models'),
    JSONWebToken = require('jsonwebtoken'),
    passport = require('passport'),
    settings = require('../../config/settings');
    util = require('../helper/util'),
    mailer  = require('../helper/mailer');


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
          mailer.sentMailVerificationLink(user,token,req.body.verifyEmailUrl);
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
   JSONWebToken.verify(req.body.token, settings.privateKey, function(err, decoded) {
          console.log("in verify","decoded,", decoded)
            if(decoded === undefined) return res.status(403).json({message : "Invalid verification link"});
            console.log("decoded",decoded)
            Model.User.findAll({
              where : {
                id :decoded.id,
                email : decoded.email
              }
            })
            .then(function(users){
              console.log("users",users)
              if(users.length){
                users.forEach(function(u){
                  u.update({isVerified : true});
                })
                return res.status(200).json({message :  "Account sucessfully verified"});
              }else{
                return res.status(403).json({message : "Invalid verification link"});
              }
            })
            .catch(function(error){
              return res.status(500).json(error);
            })

        });
};


module.exports.resendVerificationEmail = function(req, res) {
  Model.User.findOne({where : {email : req.body.email}})
        .then(function(user){
          if(user){
            if(user.isVerified) return res.status(200).json({message : "Your email address is already verified"});
            var tokenData = {
                        email: user.email,
                        id: user.id
                    };
            Common.sentMailVerificationLink(user,JSONWebToken.sign(tokenData, util.privateKey));
            res.status(200).json({message : "Account verification link is sucessfully sent to your email id"});
          }else{
            res.status(401).json({message : "Invalid username or password"})
          }
        })
};


module.exports.login = function(req, res, next){
  passport.authenticate('local', { sessions: false }, function(err, user, info){
    if(err){
      res.status(500).json(err);
      return next(err);
    }
    
    if(!user){
      res.status(401).json(info);
      return next(info);
    }

    if(user && !user.isVerified){
      res.status(401).json({message : "User not verified. Please check email"});
      return next(info);
    }

    //user has authenticated correctly thus we create a JWT token 
    var token = JSONWebToken.sign({
        email: user.email
    }, settings.privateKey);

    console.log(token, settings.privateKey)
    res.json({ token : token });
    
  })(req, res, next);
};


module.exports.logout = function(req, res, next){
  
};


module.exports.forgotPassword = function(req, res){
    Model.User.findOne({ where : {email : req.body.email}})
      .then(function(user){
        if(user){
           var tokenData = {
                        email: user.email,
                        id: user.id
                    },
                token = JSONWebToken.sign(tokenData, settings.privateKey);
          mailer.sentMailForgotPassword(user,token, req.body.forgotPasswordUrl);
          res.status(200).json({message : "Instruction to reset password is sent vial email"})
        }else{
          res.status(401).json({message : "User with this email doesn't exists in the system"});
        }
      })
      .catch(function(error){
          console.log("error",error)
      })
}



module.exports.resetPassword = function(req, res){
   JSONWebToken.verify(req.body.token, settings.privateKey, function(err, decoded) {
          console.log("in verify","decoded,", decoded)
            if(decoded === undefined) return res.status(403).json({message : "Invalid Reset Password link"})
            Model.User.findAll({
              where : {
                id :decoded.id,
                email : decoded.email
              }
            })
            .then(function(users){
              if(users.length){
                users.forEach(function(u){
                  u.update({ password : util.encrypt(req.body.password)});
                })
                return res.status(200).json({message :  "Password Reset Successfully"});
              }else{
                return res.status(403).json({message : "Invalid Reset Password link"});
              }
            })
            .catch(function(error){
              return res.status(500).json(error);
            })

        });
};