//IMPORT LIBRARIES 
//Server
const express = require('express');
const app = express();
const PORT = process.env.PORT || 8000;
//Rendering
const expressLayouts = require('express-ejs-layouts');
//Database
const mongoose = require('mongoose');
const url = 'mongodb://localhost:27017/creasila';
//Routing
const path = require('path');
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
	secret: 'secret',
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
app.get('/',(req,res) => res.redirect('/protected'));

//routing protected
const protected = require('./protected');
app.use('/protected',protected);

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

