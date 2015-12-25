var express = require('express'),
	router = express.Router(),
	controllers = require('../app/controllers'),
	passport = require('passport')

router.get('/status', passport.authenticate('jwt', { session: false}), function(req, res) {
		res.json({message : 'Server is Up'});
});
router.post('/signup', controllers.users.create);
router.post('/verifyEmail', controllers.users.verifyEmail);
router.post('/login',controllers.users.login);
router.post('/forgotPassword', controllers.users.forgotPassword);
router.post('/resetPassword', controllers.users.resetPassword);
router.post('/resendVerificationEmail', controllers.users.resendVerificationEmail);


router.get('*', function (req, res) {
    res.status(404).json({
        success: false,
        message: 'Unknown command'
    });
});

module.exports = router;