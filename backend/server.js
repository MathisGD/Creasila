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
	const ensureAuthentification = require('./auth');
	//json format
	const bodyParser = require('body-parser');
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: false }));


//SERVER : 

//Session 
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
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
//app.use(express.static(path.join(__dirname, "/../views")));
//app.set('/views',path.resolve('/../views'));
//app.engine('html', require('ejs').renderFile);





//Routing
//routing api
const api = require('./api');
app.use('/api',api);

//routing initial à modifier en fonction du log
app.get('/', (req, res) => res.redirect("/login"));

//routing protégée 
app.get('/protected', ensureAuthentification.ensureAuthentificated, (req, res) => res.sendFile(path.resolve('')));

//test rooting
app.get("/homepage", (req,res) => res.sendFile(path.resolve("./views/homepage.html")));

//register page
app.get('/register', (req,res)=> {
	app.set('layout','./signup');
	res.render('signup');
});

//login page
app.get('/login', (req,res) => {
	app.set('layout','./login');
	res.render('login');
});

//rooting css
app.get('/css', (req, res) => res.sendFile(path.resolve('../css/style.css')));

//Running server
app.listen(PORT, () => {
  console.log(`running server http://localhost:${PORT}`+ __dirname);
}); 

