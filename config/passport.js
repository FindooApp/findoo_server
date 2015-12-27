var LocalStrategy = require('passport-local').Strategy,
  TwitterStrategy = require('passport-twitter').Strategy,
  FacebookStrategy = require('passport-facebook').Strategy,
  GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
  Model = require('../app/models'),
  settings = require('./settings');


var opts = {};

opts.secretOrKey = settings.privateKey;


module.exports = function (passport, config) {
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function(email, password, done) {
    Model.User.findOne({ where : { email: email }})
    .then(function (user) {
      if (!user || !user.authenticate(password)) {
        return done(null, false, { message: 'Incorrect Email or Password.' });
      }
      return done(null, user);
    })
    .catch(function(err){
      if (err) { return done(err); }
    })
  }
));

passport.use(new TwitterStrategy({
        consumerKey: config.twitter.clientID
      , consumerSecret: config.twitter.clientSecret
      , callbackURL: config.twitter.callbackURL
    },
    function(token, tokenSecret, profile, done) {
      User.findOne({ 'twitter.id': parseInt(profile.id) }, function (err, user) {
        if (err) { return done(err) }
        if (!user) {
          user = new User({
              name: profile.displayName
            , username: profile.username
            , provider: 'twitter'
            , twitter: profile._json
            , avatar: profile._json.profile_image_url
          });
          user.save(function (err) {
            if (err) console.log(err)
            return done(err, user)
          })
        }
        else {
          return done(err, user)
        }
      })
    }
  ))

passport.use(new FacebookStrategy({
        clientID: config.facebook.clientID
      , clientSecret: config.facebook.clientSecret
      , callbackURL: config.facebook.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
      User.findOne({ 'facebook.id': profile.id }, function (err, user) {
        if (err) { return done(err) }
        if (!user) {
          user = new User({
              name: profile.displayName
            , email: profile.emails[0].value
            , username: profile.username
            , provider: 'facebook'
            , facebook: profile._json
            , avatar: "http://graph.facebook.com/"+profile.id+"/picture?type=square"
          })
          user.save(function (err) {
            if (err) console.log(err)
            return done(err, user)
          })
        }
        else {
          return done(err, user)
        }
      })
    }
  ))

passport.use(new GoogleStrategy({
      clientID: config.google.clientID,
      clientSecret: config.google.clientSecret,
      callbackURL: config.google.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
      User.findOne({ 'google.id': profile.id }, function (err, user) {
        if (!user) {
          // make a new google profile without key start with $
          var new_profile = {}
          new_profile.id = profile.id
          new_profile.displayName = profile.displayName
          new_profile.emails = profile.emails
          user = new User({
              name: profile.displayName
            , email: profile.emails[0].value
            , username: profile.username
            , provider: 'google'
            , google: new_profile._json
          })
          user.save(function (err) {
            if (err) console.log(err)
            return done(err, user)
          })
        } else {
          return done(err, user)
        }
      })
    }
  ));

}