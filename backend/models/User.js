const mongoose = require("mongoose")
const { Schema } = mongoose

const UserSchema = new Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
    },
    phone: {
        type: String,
        require: true,
    },
    address: {
        type: String
    },
    password: {
        type: String,
        require: true
    },
    role: {
        type: Number,
        default: 0
    },
    created_at: {
        type: Date,
        default: Date.now
    }
})

const User = mongoose.model('User', UserSchema)
module.exports = User