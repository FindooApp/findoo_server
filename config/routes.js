var express = require('express'),
	router = express.Router(),
	controllers = require('../app/controllers'),
	passport = require('passport'),
	settings = require('./settings'),
	userValidations = require('../app/validations/user.js');
	authenticate = require('./middlewares/authenticate-token');


// console.log("validations",authenticate)
router.get('/status',function(req, res) {

		res.json({message : 'Server is Up'});
});
router.post('/signup', userValidations.create, controllers.users.create);
router.post('/verifyEmail', userValidations.verifyEmail, controllers.users.verifyEmail);
router.post('/login',userValidations.login, controllers.users.login);
router.get('/logout',controllers.users.logout);
router.post('/forgotPassword',userValidations.forgotPassword, controllers.users.forgotPassword);
router.post('/resetPassword', userValidations.resetPassword,controllers.users.resetPassword);
router.post('/resendVerificationEmail', userValidations.resendVerificationEmail,controllers.users.resendVerificationEmail);

router.post('/loginWithFacebook',userValidations.create, controllers.users.loginWithFacebook);

router.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));
router.get('/auth/facebook/callback',
  passport.authenticate('facebook'),
  function(req, res){});

router.get('*', function (req, res) {
    res.status(404).json({
        success: false,
        message: 'Unknown command'
    });
});

module.exports = router;
