const express = require('express');
const db = require('../db');
const router = express.Router();


router.post('/', async(req, res) => {
    const { lead_type, working_status, fname, lname, address, state, zip_code, phone, beds, baths, price, additional_info, agentName } = req.body;
    try {
        await db.query('INSERT INTO leads(lead_type, working_status, fname, lname, address, state, zip_code, phone, beds, baths, price, additional_info, agentName) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13 )',[
            lead_type, working_status, fname, lname, address, state, zip_code, phone, beds, baths, price, additional_info, agentName
        ])
        return res.status(200).json({message: 'Lead added successfully.'})
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: 'Server Error'})
    }
})

module.exports = router