const bodyParser = require('body-parser');
const express = require('express')
const cors = require('cors')


const port = 5000;
const app = express()
app.use(bodyParser.json())
app.use(cors())


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port)