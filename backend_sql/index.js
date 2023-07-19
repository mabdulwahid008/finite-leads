const express = require("express")
const cors = require("cors")
const db = require('./db')
require('dotenv').config()
const path = require('path')

const app = express();

const PORT = process.env.PORT || 5000

db.connect();

app.use(cors())
app.use(express.json())

app.use(express.static(path.join(__dirname, "client/build")))
app.use('/profileImages',express.static('profileImages'))

app.use('/user', require('./routes/User'))
app.use('/sale', require('./routes/Sales'))
app.use('/chat', require('./routes/Chat'))
app.use('/lead', require('./routes/Leads'))
app.use('/announcement', require('./routes/Announcement'))
app.use('/query', require('./routes/Queries'))
app.use('/file', require('./routes/file'))


app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, "client/build", 'index.html'));
});

app.listen(PORT, ()=>{
    console.log(`App is listening on port ${PORT}`);
})

