const express = require("express")
const cors = require("cors")
const connectToMongoDB = require("./db")

const app = express();

const port = 5000

connectToMongoDB()

app.use(cors())
app.use(express.json())

app.use('/user', require('./routes/User'))
app.use('/sale', require('./routes/Sales'))
app.use('/multiplier', require('./routes/Multiplier'))

app.listen(port, ()=>{
    console.log(`App is listening on port ${port}`);
})