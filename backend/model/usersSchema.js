const mongoose = require('mongoose')

const usersSchema = mongoose.Schema({
    first: {
    	type: String,
    	required: true},
    last: {
    	type: String,
    	required: true},
    mail: {
    	type: String,
    	required: true},
    mdp: {
    	type: String,
    	required: true},
    date: {
    	type: Date,
    	default: Date.now}
});

module.exports = mongoose.model('users',usersSchema);