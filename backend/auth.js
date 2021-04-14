module.exports = {
	ensureAuthentificated: function(req, res, next){
		if(req.isAuthentificated()){
			return next();
		}
		req.flash('error_msg', 'Il faut être connecté pour voir cette page');
		res.redirect('/login');
	}
}