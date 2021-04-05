const express= require('express')
const app = express()
const router = express.Router();
// const bodyParser = require('body-parser')

const user = require('./model/usersSchema')

// // parse application/json, basically parse incoming Request Object as a JSON Object 
// app.use(bodyParser.json());
// // parse application/x-www-form-urlencoded, basically can only parse incoming Request Object if strings or arrays
// app.use(bodyParser.urlencoded({ extended: false }));
// // combines the 2 above, then you can parse incoming Request Object if object, with nested objects, or generally any type.
// app.use(bodyParser.urlencoded({ extended: true }));

//router api home
router.get('/',(req,res)=>{
	res.send('api is up')
})

//subrouting api & submit a post
router.post('/users',(req,res)=>{
	console.log(req.body);
	const post = new user ({
    	first: req.body.first,
    	last: req.body.last,
    	mail: req.body.mail,
    	mdp: req.body.mdp
	})

	post.save()
	.then(data => {
		res.json(data)
	})
	.catch(err => {
		res.json({message : err})
	})
})


//export api module
module.exports = router