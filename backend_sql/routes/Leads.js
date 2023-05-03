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
        const isAlreadyAssigned = await db.query('SELECT * FROM LEAD_ASSIGNED_TO WHERE lead_id = $1 AND realEstateAgent_id = $2',[
            lead_id, agent_id
        ])
        if(isAlreadyAssigned.rows.length > 0)
            return res.status(422).json({message: 'Lead has already assigned to this agent'})

        await db.query('INSERT INTO LEAD_ASSIGNED_TO(lead_id, realEstateAgent_id, create_at) VALUES($1, $2, $3)',[
            lead_id, agent_id, dateWithoutTime
        ])
        return res.status(200).json({message: 'Lead assigned successfully.'})
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: 'Server Error'})
    }
})

// RE agent to get his leads which are assigned to him
router.get('/agent/leads/:year/:month/:lead_status', authorization, async(req, res) => {
    const thisMonth = `${req.params.year}-${req.params.month}`
    const toMonth = `${req.params.year}-${1+parseInt(req.params.month) <= 9 ? `0${1+parseInt(req.params.month)}` : `${1+parseInt(req.params.month)}`}`

    try {
        let leads;

        if (req.params.lead_status == 99)
            leads = await db.query('SELECT _id, fname, lname, working_status, current_status, lead_type, address, state, zip_code, phone, recording_link, beds, baths, additional_info, create_at as assigned_on  FROM leads INNER JOIN lead_assigned_to ON leads._id = lead_assigned_to.lead_id WHERE realEstateAgent_id = $1 AND create_at >= $2 AND create_at <= $3',[
                req.user_id, thisMonth, toMonth
            ])
        else{
            leads = await db.query('SELECT count(leads._id), leads._id, fname, lname, current_status, working_status, lead_type, address, state, zip_code, phone, recording_link, beds, baths, additional_info, create_at as assigned_on FROM LEADS INNER JOIN LEAD_ASSIGNED_TO ON LEADS._id = LEAD_ASSIGNED_TO.lead_id INNER JOIN LEAD_COMMENTS ON LEADS._id = LEAD_COMMENTS.lead_id WHERE LEAD_ASSIGNED_TO.realEstateAgent_id = $1 AND create_at >= $2 AND create_at <= $3 AND LEAD_ASSIGNED_TO.current_status = $4 GROUP BY leads._id, fname, lname, current_status, working_status, lead_type, address, state, zip_code, phone, recording_link, beds, baths, additional_info, assigned_on',[
                req.user_id, thisMonth, toMonth, req.params.lead_status
            ])
        }

        return res.status(200).json(leads.rows.reverse())
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: 'Server Error'})
    }
})

// for real estate agent before posting a comment under a asigned lead, whether has he already commented
// and sending back agents comment
router.get('/comment/:id', authorization, async(req, res) => {
    try {
        const lead = await db.query('SELECT * FROM LEAD_COMMENTS WHERE lead_id = $1 AND realEstateAgent_id = $2',[
            req.params.id, req.user_id
        ])
        if(lead.rows.length > 0){
            // for rejected lead status = 1
            const isLeadRejected = lead.rows[lead.rows.length-1].lead_status === 1 ? true : false
            if(isLeadRejected)
                return res.status(400).json(lead.rows)
        }
        return res.status(200).json(lead.rows)
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: 'Server Error'})
    }
})

// for real estate agent for posting a comment under a asigned lead
router.post('/comment', authorization, async(req, res) => {
    const { lead_id , content, lead_status } = req.body;
    try {   
        await db.query('UPDATE LEAD_ASSIGNED_TO SET current_status = $1 WHERE lead_id = $2 AND realEstateAgent_id = $3',[
            lead_status, lead_id, req.user_id
        ])

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