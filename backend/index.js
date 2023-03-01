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

const server = app.listen(PORT, ()=>{
    console.log(`App is listening on port ${PORT}`);
})

const io = require('socket.io')(server, {
    cors:{
        origin: "http://localhost:3000"
    }
})

io.on('connection', (socket) => {
    console.log('Connected to socket');

    socket.on('setup', (userId) => {
        socket.join(userId)
        console.log(userId);
        socket.emit('Connected')
    })

    socket.on('join chat', (room) => {
        socket.join(room)
        console.log('User joined room '+ room);
    })

    socket.on('new message', (newMessageReceived) => {
        let chat = newMessageReceived.chat

        if(!chat.users)
            return console.log('chat.users are not defined');
        
        chat.users.forEach((user)=> {
            if(user._id == newMessageReceived.sender._id)
                return;
            
            socket.in(user._id).emit('message recieved', newMessageReceived)
        })
    })
})
