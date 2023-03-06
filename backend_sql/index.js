const express = require("express")
const cors = require("cors")
const db = require('./db')
require('dotenv').config()

const app = express();

const PORT = process.env.PORT || 5000

db.connect();

app.use(cors())
app.use(express.json())

app.use('/user', require('./routes/User'))
app.use('/sale', require('./routes/Sales'))

app.listen(PORT, ()=>{
    console.log(`App is listening on port ${PORT}`);
})