//IMPORT LIBRARIES 
//Server
const express = require('express');
const app = express();
const router = express.Router();
//Middlewares 
	//passport
	const passport = require('passport');
	//encryption
	const bcrypt = require('bcryptjs');
	const saltRounds = 10;

//API : 

//Schema mongoDB
const User = require('./model/usersSchema');

//Routing
//router api root
router.get('/',(req,res)=>{
	res.send('api is up')
});

//Subrouting
//register
router.post('/users/register',(req,res)=>{
	console.log(req.body);
	const { first, last, mail, mdp } = req.body;
	let errors = [];

	if(!first || !last || !mail || !mdp){
		errors.push({ msg: 'Certains champs sont vides'});
	}
	if (mdp.length < 6){
		errors.push({ msg: 'Le mot de passe est trop court'});
	}

	if(errors.length> 0){
		// res.send(errors);
		let err_s=errors[0].msg;
		for(let i=1;i<errors.length;i++){
			err_s+=" et "+errors[i].msg;
		};
		console.log(errors);
		req.flash('error_msg',err_s);
		res.redirect("/register");

	} else {
		User.findOne({ mail: mail })
			.then(user => {
				if(user){
					errors.push({ msg: "L'utilisateur existe déjà" });
					req.flash('error_msg',errors[0].msg);
					res.redirect("/login");
				} else {
					const newUser = new User({ first, last, mail, mdp });
					//hashage du mdp
					bcrypt.genSalt(saltRounds, (err, salt) => {
						bcrypt.hash(newUser.mdp, salt, (err,hash) => {
							if(err) throw err;
							newUser.mdp = hash;
							newUser.save()
								.then(user => {
									console.log(newUser);
									req.flash('success_msg','Ton compte a été crée');
									res.redirect("/login");	
								})
								.catch(err => { 
									console.log(err);
									req.flash('error_msg',err);
									res.redirect("/register");
								});
						});
					});
				}
			});
	}
});

//login
router.post('/user/login',
	passport.authenticate('local',{
		successRedirect: '/',
		failureRedirect: '/login',
		failureFlash: true }));

//logout
router.get('/user/logout',(req, res)=>{
	req.logout();
	req.flash('success_msg','Tu es déconnecté.e');
	res.redirect('/login');
});

//export api module
module.exports = router;