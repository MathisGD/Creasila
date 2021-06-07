//IMPORT LIBRARIES 
//Server
const express = require('express');
const app = express();
const PORT = process.env.APP_PORT || 8000;
require('dotenv').config();
//Rendering
const expressLayouts = require('express-ejs-layouts');
//Database
const mongoose = require('mongoose');
const url = process.env.DB_URL;
//Routing
const path = require('path');
app.use( express.static( "../public" ) );
//Middlewares 
	//sessions 
	const flash = require('connect-flash');
	const session = require('express-session');
	//passport
	const passport = require('passport');
	require('./passport')(passport);
	//json format
	const bodyParser = require('body-parser');
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: false }));


//SERVER : 

//Session 
app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: false
}));

//Passport moddleware
app.use(passport.initialize());
app.use(passport.session());

//Flash
app.use(flash());

//Global vars
app.use((req, res, next)=>{
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg=req.flash('error_msg');
	res.locals.error = req.flash('error');
	next();
});

//Database connection 
mongoose.connect(
	url,
	{ useNewUrlParser: true },
	(err,db)=>{console.log("Connecté à la base de donnée")}
);

//Rendering ejs
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('view options', { layout: false });

//Routing
//routing root
app.get('/',(req,res) => {
	if(req.isAuthenticated()){
		res.redirect('/homepage');
	}
	else{
	  res.redirect('/login');
	}
});

//routing homepage
app.get('/homepage',(req,res) => {
    //app.set('layout','./homepage');
	//res.render('homepage');
	if(req.isAuthenticated()){
		res.render('homepage', { layout: 'homepage', user:req.user });
	}
	else{
	  res.redirect('/login');
	}
});

//routing video
app.get('/video', (req,res)=> {
	//app.set('layout','./signup');
	//res.render('signup');
	res.sendFile(path.resolve('./views/video.html'));
});

//routing api
const api = require('./api');
app.use('/api',api);

//register page
app.get('/register', (req,res)=> {
	//app.set('layout','./signup');
	//res.render('signup');
	res.render('signup', { layout: 'signup' });
});

//login page
app.get('/login', (req,res) => {
	//app.set('layout','./login');
	//res.render('login');
	res.render('login', { layout: 'login' });
});

//rooting css
app.get('/css', (req, res) => res.sendFile(path.resolve('../css/style.css')));

//Running server
app.listen(PORT, () => {
  console.log(`running server http://localhost:${PORT}`+ __dirname);
}); 

