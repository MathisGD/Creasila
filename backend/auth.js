exports.ensureAuthentificated = function(req, res, next){
		if(req.isAuthentificated()){
			return next();
		}
		
	}