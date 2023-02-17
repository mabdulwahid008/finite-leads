const mongoose = require("mongoose")
require("dotenv").config()

const connectToMongoDB = () => {
    mongoose.set("strictQuery", false);
    mongoose.connect(process.env.DBMS_URI, ()=>{
        console.log("Connected to Database");
    })
}

module.exports = connectToMongoDB