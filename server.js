var express = require('express'),
    app = express(),
    router = express.Router(),
    bodyParser = require('body-parser'),
    logger = require('morgan'),
    jsonParser = bodyParser.json(),
    settings = require('./config/settings'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    port = settings[settings.env].port,
    JwtStrategy = require('passport-jwt').Strategy,
    Model = require('./app/models'),
    opts = {};
  
    opts.secretOrKey = settings.privateKey;
    opts.authScheme = true;



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

  app.use(passport.initialize());

	app.use('/api/v1/', require('./config/routes'));
	app.set('views', __dirname + '/app/views');
	app.set('view engine', 'jade');


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

passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
  Model.User.findOne({email: jwt_payload.sub}, function(err, user) {
      if (err) {
          return done(err, false);
      }
      if (user) {
          done(null, user);
      } else {
          done(null, false);
          // or you could create a new account
      }
  });
}));


var server = app.listen(port, function(){
	var host = server.address().address;
	var port = server.address().port;
	console.log('Findoo Server listening at http://%s:%s', host, port);
});