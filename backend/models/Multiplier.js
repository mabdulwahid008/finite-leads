const mongoose = require("mongoose")
const { Schema } = mongoose;

const MultiplierSchema = new Schema({
    multiply_with:{
        type: Number,
        required: true
    }
})

const Multiplier = mongoose.model('Multiplier', MultiplierSchema)
module.exports = Multiplier