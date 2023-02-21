const mongoose = require("mongoose");
const { Schema } = mongoose;
const moment = require("moment-timezone")

const date = moment.tz(Date.now(), "America/Los_Angeles");
const losAngelesTZ =  `${date.year()}-${date.month()+1}-${date.date()}/${date.hour()}:${date.minute()}`


const SaleSchema = new Schema({
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    client_name: {
        type: String,
    },
    client_address: {
        type: String,
    },
    client_phone: {
        type: String
    },
    multiplier: {
        type: Number,
        default: 1,
    },
    create_at: {
        type: String,
        default: losAngelesTZ
    },
    updated_at: {
        type: String,
        default: losAngelesTZ
    }
})

const Sales = mongoose.model('Sales', SaleSchema)
module.exports = Sales