//IMPORT LIBRARIES 
//Server
const express = require('express');
const app = express();
const router = express.Router();
require('dotenv').config();
//Mail
const nodemailer = require('nodemailer');
//token
const jwt = require('jsonwebtoken');
//Middlewares 
	//passport
	const passport = require('passport');
	//encryption
	const bcrypt = require('bcryptjs');
	const saltRounds = 10;

//API : 

//Schema mongoDB
const User = require('./model/usersSchema');
const Formation=require('./model/formationsSchema');
const { ConnectionStates } = require('mongoose');

//Routing
//router api root
router.get('/',(req,res)=>{
	res.send('api is up')
});

//Subrouting
//register
router.post('/users/register',(req,res)=>{
	console.log(req.body);
	const { first, last, mail, mdp} = req.body;
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
								.then(async user => {
									await console.log(user);
									await req.flash('success_msg','Ton compte a été crée, verifies ton adresse mail');
									res.redirect("/login");	
									jwt.sign({ data: user.id }, process.env.TOKEN_SECRET, { expiresIn: 60 * 60 * 24 },(err,token)=>{ 
										if(err){
											req.flash('error_msg',err);
											console.log(err);
										}else{
											//envoie mail		
											transporter.sendMail(message(user.mail,token), (error, info)=>{
												if(error){
													req.flash('error_msg',error);
													return console.log(error);
												}else{
													console.log('Message de confirmation envoyé à '+user.first);
												}
											});
										}							
									});
									
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

//formations
router.get('/formation',(req, res)=>{
	Formation.find((err, formations)=> {
		if (err){
			console.log(err);
			res.send(err);

		}else{
			res.send(formations);
		}
	});
});

//add/update formations
router.post('/formation',(req,res)=>{
	if(req.isAuthenticated()){
		if(req.user.admin){
			const { name, url, description} = req.body;
			const new_formation = new Formation({name, url, description});
			console.log(new_formation);

			if(!new_formation.name){
				res.send('Il faut à minima un nom');
				console.log('Il faut à minima un nom');
			} else {
				Formation.findOne({ name: new_formation.name })
					.then(old_formation => {
						if(old_formation){
							for (i in new_formation){
								if (!new_formation.i){
									new_formation.i=old_formation.i;
								}
							}
							old_formation.remove();
						}
						new_formation.save()
						.then(formation_saved => {
							res.send('La formation '+formation_saved.name+' a été enregistrée sous la forme suivante :\n'+formation_saved);
							console.log(formation_saved);
						})		
						.catch(err => {
							console.log(err);
							res.send(err);
						});
					});
				}
			}else{
				req.flash("error_msg","Vous devez être admin pour interragir avec les formations")
				res.redirect('/login');
			}
	}else{
	  res.redirect('/login');
	}
});

//confirmation
router.get('/confirmation/:token', async (req,res)=>{
	try{
		const user_id=jwt.verify(req.params.token,process.env.TOKEN_SECRET).data;
		await User.findById(user_id)
		.then(user =>{
			user.confirmation = true;
			user.save()
			.then(user => {
				console.log('compte de '+user.first+' est validé');
				req.flash('success_msg',"Votre compte est validé, vous pouvez vous connecter");
			})
			.catch(err => { 
				console.log('erreur update confirmation: '+err);
				req.flash('error_msg',err);
			});
		})
		.catch(err => { 
			console.log('erreur finding confirmation: '+err);
			req.flash('error_msg',err);
		});
	} catch (err) {
		console.log(err);
		req.flash('error_msg',err);
	}
	res.redirect('/login');
});

//Mailing (help: https://ourcodeworld.com/articles/read/264/how-to-send-an-email-gmail-outlook-and-zoho-using-nodemailer-in-node-js)
let transporter = nodemailer.createTransport({
	host: process.env.M_HOST,
	secureConnection: false,
	port: process.env.M_PORT,
	tls: {
		ciphers:'SSLv3'
	 },
	auth: {
	  user: process.env.M_USER,
	  pass: process.env.M_PASS
	}
  });
//verify connection configuration
transporter.verify((error, success)=>{
	if (error) {
	  console.log(error);
	} else {
	  console.log("Server mail est lancé");
	}
});
//message
function message(user_adress,user_token) {
	const message = {
		from: '"Creasila" <'+process.env.M_USER+'>',
    	to: user_adress,
   		subject: 'Confirmation de compte',
   		html: '<b>Bonjour et bienvenu chez Creasila</b><br>Veuillez cliquer sur le lien pour valider votre compte : <br><a href="'+process.env.APP_URL+'/api/confirmation/'+user_token+'">Confirmer</a>'
	};
	return message;
}

//export api module
module.exports = router;