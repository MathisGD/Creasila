//IMPORT LIBRARIES 
//Passport
const LocalStrategy = require('passport-local').Strategy;
//Database
const mongoose = require('mongoose');
//Encryption
const bcrypt = require('bcryptjs');



//Schema mongoDB
const User = require('./model/usersSchema');

module.exports = function(passport) {
	passport.use(
		new LocalStrategy({
				usernameField: 'mail',
				passwordField: 'mdp'},
				(mail, mdp, done) => {
					User.findOne({ mail: mail })
					.then(user => {
						let msg="";
						if(!user) {
							msg += "L'utilisateur n'existe pas";
							return done(null, false, { message: msg });
						}else{
							bcrypt.compare(mdp, user.mdp, (err,isMatch) => {
								if(err) throw err;
								if(isMatch) {
									msg += "Utilisateur connecté, bienvenu "+user.first;
									return done(null, user, { message : msg});
								} else {
									msg += "Mauvais mot de passe";
									return done(null, false, { message: msg});
								}
							})
					
						}
						console.log(msg);
					})
					.catch(err => {
						console.log(err);
						return done(err);
					});
				}
		)
	);

	passport.serializeUser((user, done) => {
  		done(null, user.id);
	});

	passport.deserializeUser((id, done) => {
  		User.findById(id, (err, user) => {
    		done(err, user);
  		});
	});
};