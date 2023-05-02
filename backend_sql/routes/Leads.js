const express = require('express');
const db = require('../db');
const authorization = require('../middleware/authorization');
const masterOrAdminAuthorization = require('../middleware/masterOrAdminAuthorization');
const realEstateAutorization = require('../middleware/realEstateAutorization');
const { dateWithoutTime } = require('../date');
const router = express.Router();


// for form - lead posting
router.post('/', async(req, res) => {
    const { lead_type, working_status, fname, lname, address, state, zip_code, phone, beds, baths, price, additional_info, recording_link, agentName } = req.body;
    try {
        await db.query('INSERT INTO leads(lead_type, working_status, fname, lname, address, state, zip_code, phone, beds, baths, price, additional_info, recording_link, agentName) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14 )',[
            lead_type, working_status, fname, lname, address, state, zip_code, phone, beds, baths, price, additional_info, recording_link, agentName
        ])
        return res.status(200).json({message: 'Lead added successfully.'})
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: 'Server Error'})
    }
})

// for getting leads
router.get('/', authorization, masterOrAdminAuthorization, async(req, res) => {
    try {
        const leads = await db.query('SELECT * FROM leads')
        return res.status(200).json(leads.rows.sort(function(a, b) {
            if (a._id !== b._id) 
                return b._id - a._id 
            }))
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: 'Server Error'})
    }
})

// get single lead by id
router.get('/:_id', authorization, async(req, res) => {
    try {
        const leads = await db.query('SELECT * FROM leads WHERE _id = $1', [req.params._id])
        return res.status(200).json(leads.rows[0])
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: 'Server Error'})
    }
})

// checking lead before assigning
router.get('/getLeads/:agent_id', authorization, async(req, res) => {
    try {
        const leads = await db.query('SELECT * FROM LEAD_ASSIGNED_TO WHERE realEstateAgent_id = $1 AND create_at = $2',[
            req.params.agent_id, dateWithoutTime
        ])
        return res.status(200).json(leads.rows.sort(function(a, b) {
            if (a._id !== b._id) 
                return b._id - a._id 
            }))
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: 'Server Error'})
    }
})

// for assigning lead to real estate agents
router.post('/assign', authorization, masterOrAdminAuthorization, async(req, res) => {
    const { lead_id, agent_id } = req.body;
    try {
        await db.query('INSERT INTO LEAD_ASSIGNED_TO(lead_id, realEstateAgent_id, create_at) VALUES($1, $2, $3)',[
            lead_id, agent_id, dateWithoutTime
        ])
        return res.status(200).json({message: 'Lead assigned successfully.'})
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: 'Server Error'})
    }
})



router.get('/agent/leads', authorization, async(req, res) => {
    try {
        const leads = await db.query('SELECT _id, fname, lname, working_status, lead_type, address, state, zip_code, phone, recording_link, beds, baths, additional_info, create_at as assigned_on  FROM leads INNER JOIN lead_assigned_to ON leads._id = lead_assigned_to.lead_id WHERE realEstateAgent_id = $1 AND create_at = $2',[
            req.user_id, dateWithoutTime
        ])
        return res.status(200).json(leads.rows)
        // return res.status(200).json({message: 'hello'})
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: 'Server Error'})
    }
})



// for real estate agent for posting a comment under a asigned lead
router.post('/comment', authorization, realEstateAutorization, async(req, res) => {
    const { lead_id , content, lead_status } = req.body;
    try {   
        await db.query('INSERT INTO LEAD_COMMENTS(lead_id , content, lead_status, realEstateAgent_id) VALUES($1, $2, $3, $4)',[
            lead_id , content, lead_status, req.user_id
        ])
        return res.status(200).json({message: 'Comment posted successfully.'})
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: 'Server Error'})
    }
})

// for addmin to get cooments of lead of all real estate agents
router.get('/comments/:_id', authorization, masterOrAdminAuthorization, async(req, res) => {
    try {
        const comments = await db.query('SELECT lead_id, content, lead_status, name FROM LEAD_COMMENTS INNER JOIN USERS ON LEAD_COMMENTS.realEstateAgent_id = USERS._id WHERE lead_id = $1',[
            req.params._id
        ])
        return res.status(200).json(comments.rows)
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: 'Server Error'})
    }
})

module.exports = router