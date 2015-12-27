var express = require('express'),
    app = express(),
    router = express.Router(),
    bodyParser = require('body-parser'),
    logger = require('morgan'),
    jsonParser = bodyParser.json(),
    settings = require('./config/settings'),
    passport = require('passport'),
    jwt = require('jsonwebtoken'),
    // LocalStrategy = require('passport-local').Strategy,
    port = settings[settings.env].port,
    // JwtStrategy = require('passport-jwt').Strategy,
    // TwitterStrategy = require('passport-twitter').Strategy,
    // FacebookStrategy = require('passport-facebook').Strategy,
    // GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
    Model = require('./app/models'),
    opts = {};



    //Enable Cors
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  app.use(jsonParser);
  app.use(logger('dev'));
  app.use(bodyParser.urlencoded({
    extended: true
  }));


app.use(function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['authcode'];

  // decode token
  if (token) {

      console.log(token,settings.privateKey);
    // verifies secret and checks exp
    jwt.verify(token, settings.privateKey, function(err, decoded) {     


    console.log(token,settings.privateKey,decoded); 
      if (err) {
        return res.status(403).json({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        // if everything is good, save to request for use in other routes
        req.user = decoded;    
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });
    
  }
});



  app.use(passport.initialize());

	app.use('/api/v1/', require('./config/routes'));
	app.set('views', __dirname + '/app/views');
	app.set('view engine', 'jade');


app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({message : 'Unauthorize Access'});
  }
});

// passport.use(new LocalStrategy({
//     usernameField: 'email',
//     passwordField: 'password'
//   },
//   function(email, password, done) {
//     Model.User.findOne({ where : { email: email }})
//     .then(function (user) {
//       if (!user || !user.authenticate(password)) {
//         return done(null, false, { message: 'Incorrect Email or Password.' });
//       }
//       return done(null, user);
//     })
//     .catch(function(err){
//       if (err) { return done(err); }
//     })
//   }
// ));

// passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
//   Model.User.findOne({email: jwt_payload.sub}, function(err, user) {
//       if (err) {
//           return done(err, false);
//       }
//       if (user) {
//           done(null, user);
//       } else {
//           done(null, false);
//           // or you could create a new account
//       }
//   });
// }));

// passport.use(new TwitterStrategy({
//         consumerKey: config.twitter.clientID
//       , consumerSecret: config.twitter.clientSecret
//       , callbackURL: config.twitter.callbackURL
//     },
//     function(token, tokenSecret, profile, done) {
//       User.findOne({ 'twitter.id': parseInt(profile.id) }, function (err, user) {
//         if (err) { return done(err) }
//         if (!user) {
//           user = new User({
//               name: profile.displayName
//             , username: profile.username
//             , provider: 'twitter'
//             , twitter: profile._json
//             , avatar: profile._json.profile_image_url
//           });
//           user.save(function (err) {
//             if (err) console.log(err)
//             return done(err, user)
//           })
//         }
//         else {
//           return done(err, user)
//         }
//       })
//     }
//   ))

// passport.use(new FacebookStrategy({
//         clientID: config.facebook.clientID
//       , clientSecret: config.facebook.clientSecret
//       , callbackURL: config.facebook.callbackURL
//     },
//     function(accessToken, refreshToken, profile, done) {
//       User.findOne({ 'facebook.id': profile.id }, function (err, user) {
//         if (err) { return done(err) }
//         if (!user) {
//           user = new User({
//               name: profile.displayName
//             , email: profile.emails[0].value
//             , username: profile.username
//             , provider: 'facebook'
//             , facebook: profile._json
//             , avatar: "http://graph.facebook.com/"+profile.id+"/picture?type=square"
//           })
//           user.save(function (err) {
//             if (err) console.log(err)
//             return done(err, user)
//           })
//         }
//         else {
//           return done(err, user)
//         }
//       })
//     }
//   ))

// passport.use(new GoogleStrategy({
//       clientID: config.google.clientID,
//       clientSecret: config.google.clientSecret,
//       callbackURL: config.google.callbackURL
//     },
//     function(accessToken, refreshToken, profile, done) {
//       User.findOne({ 'google.id': profile.id }, function (err, user) {
//         if (!user) {
//           // make a new google profile without key start with $
//           var new_profile = {}
//           new_profile.id = profile.id
//           new_profile.displayName = profile.displayName
//           new_profile.emails = profile.emails
//           user = new User({
//               name: profile.displayName
//             , email: profile.emails[0].value
//             , username: profile.username
//             , provider: 'google'
//             , google: new_profile._json
//           })
//           user.save(function (err) {
//             if (err) console.log(err)
//             return done(err, user)
//           })
//         } else {
//           return done(err, user)
//         }
//       })
//     }
//   ));

require('./config/passport')(passport, settings.social);

var server = app.listen(port, function(){
	var host = server.address().address;
	var port = server.address().port;
	console.log('Findoo Server listening at http://%s:%s', host, port);
});