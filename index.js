const bodyParser = require('body-parser');
const express = require('express')
const cors = require('cors')
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;

const port = 5000;
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.1znel.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const app = express()
app.use(bodyParser.json())
app.use(cors())

//database code
client.connect(err => {
  const booksCollection = client.db(`${process.env.DB_NAME}`).collection("allBooks");
  const userCollection = client.db(`${process.env.DB_NAME}`).collection("allUser");

  //create data | books added one by one
  app.post('/add-book', (req, res) => {
    const bookData = req.body;
    booksCollection.insertOne(bookData)
      .then(result => console.log(result.insertedCount > 0))
  })
  //read data | send data to the client side
  app.get('/all-books', (req, res) => {
    booksCollection.find({})
      .toArray((err, documents) => {
        res.send(documents)
      })
  })
  //send user data
  app.post('/user-data', (req, res) => {
    const userData = req.body;
    userCollection.insertOne(userData)
      .then(result => console.log(result.insertedCount > 0))
  })
  //get specific user data
  app.get('/user-data', (req, res) => {
    userCollection.find({ email: req.query.email })
      .toArray((err, documents) => {
        res.send(documents)
      })
  })
  //delete data
  app.delete('/delete/:id', (req, res) => {
    booksCollection.deleteOne({ _id: ObjectId(req.params.id) })
      .then(result => console.log(result.deletedCount > 0))
  })
  //update data
  app.patch('/update/:id', (req, res) => {
    console.log(req.body, req.params.id)
    booksCollection.updateOne({ _id: ObjectId(req.params.id) },
      {
        $set: { bookName: req.body.bookName, authorName: req.body.authorName, price: req.body.price }
      })
      .then(result => console.log(result.modifiedCount > 0))
  })

});


app.get('/', (req, res) => {
  res.send('Hello server side World!')
})

app.listen(process.env.PORT || port)