
var express = require('express'),
    app = express(),
    mailer = require('express-mailer'),
    settings = require('../../config/settings'),

    app.set('views', __dirname + '/../view');
    app.set('view engine', 'jade');

// create reusable transport method (opens pool of SMTP connections)
mailer.extend(app, {
  from: 'saneilnaik11@gmail.com',
  host: 'smtp.gmail.com', // hostname
  secureConnection: true, // use SSL
  port: 465, // port for secure SMTP
  transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
  auth: {
    user: 'saneilnaik11@gmail.com',
    pass: 'uc@ntste@l'
  }
});

exports.sentMailVerificationLink = function(user, token, url) {
    console.log("token",token);
     app.mailer.send('../view/mailer/signup', {
        to: user.email, // REQUIRED. This can be a comma delimited string just like a normal email to field. 
        subject: "Welcome to Findoo", // REQUIRED.
        user : user,
        verifyEmailUrl : url + '/?' + 'token=' + token // All additional properties are also passed to the template as local variables.
        }, function (err) {
        if (err) {
      // handle error
            console.log(err);
            return;
        }
        });
};

exports.sentMailForgotPassword = function(user, token, url) {
    console.log("token",token);
    app.mailer.send('../view/mailer/forgotPassword', {
        to: user.email, // REQUIRED. This can be a comma delimited string just like a normal email to field. 
        subject: "Welcome to Findoo", // REQUIRED.
        user : user,
        forgotPasswordUrl : url + '/?' + 'token=' + token // All additional properties are also passed to the template as local variables.
        }, function (err) {
        if (err) {
      // handle error
            console.log(err);
            return;
        }
        });
};
