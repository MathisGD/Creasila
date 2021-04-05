//running server
const express = require('express')
const app = express()
const port = 8000
//database
const mongoose = require('mongoose')
const url = 'mongodb://localhost:27017/creasila'


//database connection 
mongoose.connect(
	url,
	{ useNewUrlParser: true },
	(err,db)=>{console.log("Connecté à la base de donnée")}
)


//routing homepage
app.get('/', (req, res) => {
  res.sendFile("/Users/simon.cherel/Documents/Études/GATE/Creasila/signup HTML/signup.html")
})

//routing api
const api = require('./api')
app.use('/api',api)

//rooting css
app.get('/css', (req, res) => {
  res.sendFile("/Users/simon.cherel/Documents/Études/GATE/Creasila/signup HTML/style.css")
})

//running server
app.listen(port, () => {
  console.log(`running server http://localhost:${port}`)
})

