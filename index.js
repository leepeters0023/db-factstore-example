const DataStore = require('./factStore.js')
require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')

let myDatabase = new DataStore(`mongodb+srv://Habenzy:${process.env.DB_PASSWORD}@cluster0-4eale.mongodb.net/test?retryWrites=true&w=majority`, 'notebook', 'entries') // this is where our database lives. it's a remote url mapping to our remote mongodb cluster, we would otherwise be using the mongodb instance on our harddrive

app.use(express.static('./public'))
app.use(bodyParser()) // allows express to deal with form submissions 

app.get('/posts', showAll) // request response handlers 

app.post('/posts', insert) // 

async function showAll(req, res) {
  let entries = await myDatabase.getAll()

  res.type('application/json').send(JSON.stringify(entries)) // send our json as a string as a response, this is what's called our api endpoint with the posts. this is triggered by our fetch in index.html

}

async function insert(req, res) {

  let name = req.body.name
  let content = req.body.message

  await myDatabase.insertDoc({name: name, content: content})
  res.redirect('/') // redirect automatically re-freshes and presents new data
}

async function showOne() {
  let entry = await myDatabase.getOne('5e7a17c228e6232d3c63b536')

}

async function edit() {
  await myDatabase.editDoc({power: 'The Dark Side of the Force'}, '5e7a17c228e6232d3c63b536')


}

async function deleteItem() {
  await myDatabase.deleteDoc('5e791bea166a9265f0022e83')


}


app.listen(process.env.PORT || 3000, console.log('listening for requests'))
