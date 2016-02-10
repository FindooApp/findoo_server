var userRequestValidations = {
	create : function(req,res,next){
		req.checkHeaders('content-type', 'Invalid content-type. It should be application/x-www-form-urlencoded').equals('application/x-www-form-urlencoded');
		req.checkBody('email', 'Email is a required field').notEmpty();
		req.checkBody('password', 'Password is a required field').notEmpty();
		req.checkBody('verifyEmailUrl', 'verifyEmailUrl is a required field').notEmpty();
		var errors = req.validationErrors();
		if(errors){
			res.status(400).json({message : "Are you dozing off? That's a Bad Request", errors: errors})
			return;
		}
		next();
	},

	login : function(req, res, next){
		req.checkHeaders('content-type', 'Invalid content-type. It should be application/x-www-form-urlencoded').equals('application/x-www-form-urlencoded');
		req.checkBody('email', 'Email is a required field').notEmpty();
		req.checkBody('password', 'Password is a required field').notEmpty();
		var errors = req.validationErrors();
		if(errors){
			res.status(400).json({message : "Are you dozing off? That's a Bad Request", errors: errors})
			return;
		}
		next();
	},
	loginWithFacebook : function(req, res, next){
		req.checkHeaders('content-type', 'Invalid content-type. It should be application/x-www-form-urlencoded').equals('application/x-www-form-urlencoded');
		req.checkBody('accessToken', 'accessToken is a required field').notEmpty();
		var errors = req.validationErrors();
		if(errors){
			res.status(400).json({message : "Are you dozing off? That's a Bad Request", errors: errors})
			return;
		}
		next();
	},
	verifyEmail : function(req, res, next){
		req.checkHeaders('content-type', 'Invalid content-type. It should be application/x-www-form-urlencoded').equals('application/x-www-form-urlencoded');
		req.checkBody('accessToken', 'accessToken is a required field').notEmpty();
		var errors = req.validationErrors();
		if(errors){
			res.status(400).json({message : "Are you dozing off? That's a Bad Request", errors: errors})
			return;
		}
		next();
	},
	resendVerificationEmail : function(req, res, next){
		req.checkHeaders('content-type', 'Invalid content-type. It should be application/x-www-form-urlencoded').equals('application/x-www-form-urlencoded');
		req.checkBody('email', 'email is a required field').notEmpty();
		var errors = req.validationErrors();
		if(errors){
			res.status(400).json({message : "Are you dozing off? That's a Bad Request", errors: errors})
			return;
		}
		next();
	},
	resetPassword : function(req, res, next){
		req.checkHeaders('content-type', 'Invalid content-type. It should be application/x-www-form-urlencoded').equals('application/x-www-form-urlencoded');
		req.checkBody('token', 'token is a required field').notEmpty();
		req.checkBody('password', 'password is a required field').notEmpty();
		var errors = req.validationErrors();
		if(errors){
			res.status(400).json({message : "Are you dozing off? That's a Bad Request", errors: errors})
			return;
		}
		next();
	},
	forgotPassword : function(req, res, next){
		req.checkHeaders('content-type', 'Invalid content-type. It should be application/x-www-form-urlencoded').equals('application/x-www-form-urlencoded');
		req.checkBody('email', 'email is a required field').notEmpty();
		var errors = req.validationErrors();
		if(errors){
			res.status(400).json({message : "Are you dozing off? That's a Bad Request", errors: errors})
			return;
		}
		next();
	}
}

module.exports = userRequestValidations;
