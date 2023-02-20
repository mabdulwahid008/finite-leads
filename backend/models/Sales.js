const mongoose = require("mongoose");
const { Schema } = mongoose;

const SaleSchema = new Schema({
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
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
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
})

const Sales = mongoose.model('Sales', SaleSchema)
module.exports = Sales