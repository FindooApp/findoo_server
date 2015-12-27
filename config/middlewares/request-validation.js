var requestValidations = {
	status : function(req,res,next){
		console.log("inside validation",next)
		req.checkQuery('urlparam', 'Invalid urlparam').isAlpha();
		var errors = req.validationErrors();
		if(errors){
			res.status(400).json({message : "Bad Request", errors: errors})
			return;
		}
		next();
	}
}

module.exports = requestValidations;