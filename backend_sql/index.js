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
app.use('/chat', require('./routes/Chat'))

const server = app.listen(PORT, ()=>{
    console.log(`App is listening on port ${PORT}`);
})

const io = require('socket.io')(server, {
    cors:{
        origin: [process.env.SOCKET_CLIENT_ORIGIN]
    }
})

io.on('connection', (socket) => {
    // console.log('Connected to socket');

    // geting userid
    socket.on('setup', (userId) => {
        socket.join(userId)
        socket.emit('Connected')
    })

    // when user selects the group 
    socket.on('join chat', (chatId) => {
        socket.join(chatId)
        // console.log("group joined ", chatId);
    })

    socket.on('new message', (message) => {
        // console.log(message);

        socket.emit("message recieved", message)
        // let chat = newMessageReceived

        // if(!chat.users)
        //     return console.log('chat.users are not defined');
        
        // chat.users.forEach((user)=> {
        //     if(user._id == newMessageReceived.sender._id)
        //         return;
            
        //     socket.in(user._id).emit('message recieved', newMessageReceived)
        // })
    })

})