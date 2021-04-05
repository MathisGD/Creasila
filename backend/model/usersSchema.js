const mongoose = require('mongoose')

const usersSchema = mongoose.Schema(
	{
    first:String,
    last:String,
    mail: String,
    mdp: String
}
)

module.exports = mongoose.model('users',usersSchema)