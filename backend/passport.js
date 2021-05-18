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
		new LocalStrategy({ usernameField: 'mail' }, (mail, mdp, done) => {
			User.findOne({ mail: mail })
				.then(user => {
					if(!user) {
						return done(null, false, { message: "L'utilisateur n'existe pas" });
					}

					bcrypt.compare(mdp, user.mdp, (err,isMatch) => {
						if(err) throw err;

						if(isMatch) {
							return done(null, user);
						} else {
							return done(null, flase, { message: "Mauvais mot de passe"});
						}
					});
				})
				.catch(err => console.log(err));
		})
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