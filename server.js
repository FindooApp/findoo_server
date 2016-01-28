var express = require('express'),
    app = express(),
    router = express.Router(),
    bodyParser = require('body-parser'),
    logger = require('morgan'),
    jsonParser = bodyParser.json(),
    settings = require('./config/settings'),
    passport = require('passport'),
    jwt = require('jsonwebtoken'),
    expressValidator = require('express-validator'),
    port = settings[settings.env].port,
    Model = require('./app/models'),
    opts = {};

    //Enable Cors
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,authcode");
    next();
  });

  app.use(jsonParser);
  app.use(logger('dev'));
  app.use(bodyParser.urlencoded({
    extended: true
  }));

app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg
    };
  }
})); 

// app.use(function(req, res, next) {

//   // check header or url parameters or post parameters for token
//   var token = req.body.token || req.query.token || req.headers['authcode'];

//   // decode token
//   if (token) {

//       console.log(token,settings.privateKey);
//     // verifies secret and checks exp
//     jwt.verify(token, settings.privateKey, function(err, decoded) {     


//     console.log(token,settings.privateKey,decoded); 
//       if (err) {
//         return res.status(403).json({ success: false, message: 'Failed to authenticate token.' });    
//       } else {
//         // if everything is good, save to request for use in other routes
//         req.user = decoded;    
//         next();
//       }
//     });

//   } else {

//     // if there is no token
//     // return an error
//     return res.status(403).send({ 
//         success: false, 
//         message: 'No token provided.' 
//     });
    
//   }
// });



  app.use(passport.initialize());

	app.use('/api/v1/', require('./config/routes'));
	app.set('views', __dirname + '/app/views');
	app.set('view engine', 'jade');


app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({message : 'Unauthorize Access'});
  }
});


require('./config/passport')(passport, settings.social);

var server = app.listen(port, function(){
	var host = server.address().address;
	var port = server.address().port;
	console.log('Findoo Server listening at http://%s:%s', host, port);
});