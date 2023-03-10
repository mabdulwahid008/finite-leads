const { Pool } = require('pg')
require('dotenv').config()

const db = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWAORD,
    database: process.env.DB_NAME
})

module.exports = db;