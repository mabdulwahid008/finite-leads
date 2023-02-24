const express = require("express")
const cors = require("cors")
const connectToMongoDB = require("./db")
require('dotenv').config()

const app = express();

const PORT = process.env.PORT || 5000


connectToMongoDB()

app.use(cors())
app.use(express.json())

app.use('/user', require('./routes/User'))
app.use('/sale', require('./routes/Sales'))
app.use('/chat', require('./routes/Messages'))

app.listen(PORT, ()=>{
    console.log(`App is listening on port ${PORT}`);
})