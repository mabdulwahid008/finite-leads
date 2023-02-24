const mongoose = require("mongoose");
const { Schema } = mongoose;

const chatModal = new Schema({
    groupName : {
        type: String,
        trim : true
    },
    isGroupChat : {
        type: Boolean,
        default: false,
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref : 'User'
    }],
    latestMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    },
    groupAdmin:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
},
{
    timestamps: true
})

const Chat = mongoose.model('Chat', chatModal)
module.exports = Chat