
var settings = require('../settings'),
	jwt = require('jsonwebtoken');
module.exports = function(req, res, next){
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['authcode'];
  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, settings.privateKey, function(err, decoded) {     
      if (err) {
        return res.status(403).json({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        // if everything is good, save to request for use in other routes
        console.log("****",decoded)
        req.user = decoded;    
        next();
      }
    });

  } else {
    // if there is no token
    // return an error
    return res.status(403).json({ 
        success: false, 
        message: 'No token provided.' 
    });
    
  }
};