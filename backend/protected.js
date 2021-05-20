//IMPORT LIBRARIES 
//Server
const express = require('express');
const app = express();
const router = express.Router();
//Routing
const path = require('path');
//Rendering
const expressLayouts = require('express-ejs-layouts');
//Middlewares 
	//passport
	const passport = require('passport');

//Rendering ejs
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('view options', { layout: false });

//Routing
//router protected root
router.get('/',(req, res) => {
    if(req.isAuthenticated()){
		res.redirect('/protected/homepage');
	}
	else{
	  res.redirect('/login');
	}
});

//Subrouting
//register
router.get('/homepage',(req,res) => {
    //app.set('layout','./homepage');
	//res.render('homepage');
	if(req.isAuthenticated()){
		res.render('homepage', { layout: 'homepage' });
	}
	else{
	  res.redirect('/login');
	}
});

//export protected module
module.exports = router;