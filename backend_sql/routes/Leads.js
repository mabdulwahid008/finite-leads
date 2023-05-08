const express = require('express');
const db = require('../db');
const authorization = require('../middleware/authorization');
const masterOrAdminAuthorization = require('../middleware/masterOrAdminAuthorization');
const realEstateAutorization = require('../middleware/realEstateAutorization');
const { dateWithoutTime, getTimePeriod } = require('../date');
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

// for RE Agnet to view single lead
router.get('/my-leads/:_id', authorization, realEstateAutorization, async(req, res) => {
    try {
        const leads = await db.query('SELECT * FROM leads INNER JOIN lead_assigned_to ON leads._id = lead_assigned_to.lead_id WHERE lead_id = $1 AND realEstateAgent_id = $2',[
            req.params._id, req.user_id
        ])
        return res.status(200).json(leads.rows)
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: 'Server Error'})
    }
})

router.get('/notfication', authorization, realEstateAutorization, async(req, res) => {
    try {
        const leads = await db.query('SELECT _id,fname, address, viewed, create_at FROM leads INNER JOIN lead_assigned_to ON leads._id = lead_assigned_to.lead_id WHERE realEstateAgent_id = $1 ORDER BY create_at DESC', [
         req.user_id
        ])
        
        let notViewd = [];
        if(leads.rows.length > 0)
             notViewd = leads.rows.filter((lead) => lead.viewed === false)

        return res.status(200).json({notViewd: notViewd.length, leads: leads.rows.reverse()})
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
router.get('/getLeads/:agent_id', authorization, masterOrAdminAuthorization, async(req, res) => {
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


// for RE Agent dashborad stats
router.get('/agent/dashboard/:year/:month', authorization, realEstateAutorization, async(req, res)=>{
    try {
        const [thisMonth, toMonth] = getTimePeriod(req.params.year, req.params.month)

        const leads = await db.query('SELECT * FROM lead_assigned_to WHERE realEstateAgent_id = $1 AND create_at >= $2 AND create_at <= $3',[
            req.user_id, thisMonth, toMonth
        ])
        let accepted, rejected, followUp, onContract, listed, sold, neutral
        if(leads.rows.length > 0){
            accepted = leads.rows.filter((lead)=> lead.current_status == 0)
            rejected = leads.rows.filter((lead)=> lead.current_status == 1)
            listed = leads.rows.filter((lead)=> lead.current_status == 2)
            sold = leads.rows.filter((lead)=> lead.current_status == 3)
            followUp = leads.rows.filter((lead)=> lead.current_status == 4)
            onContract = leads.rows.filter((lead)=> lead.current_status == 5)
            neutral = leads.rows.filter((lead)=> lead.current_status == 99)
        }
        return res.status(200).json({
            accepted : accepted.length,
            rejected : rejected.length,
            listed : listed.length,
            sold : sold.length,
            followUp : followUp.length,
            onContract : onContract.length,
            neutral : neutral.length,
        })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: 'Server Error' });
    }
})

// for RE Agent dahboard leads which are not given any status
router.get('/agent/dahboard-leads/:page', authorization, realEstateAutorization, async(req, res) => {
    try {
        const record = 1;
        const page = parseInt(req.params.page) ;
        const offset = (page - 1) * record;

        const totalCount = await db.query('SELECT count(*) FROM LEADS INNER JOIN LEAD_ASSIGNED_TO ON LEADS._id = LEAD_ASSIGNED_TO.lead_id WHERE LEAD_ASSIGNED_TO.realEstateAgent_id = $1 AND LEAD_ASSIGNED_TO.current_status = $2', [
                    req.user_id,  99
                ]);
        const leads = await db.query('SELECT count(leads._id), leads._id, fname, current_status, working_status, lead_type, create_at as assigned_on FROM LEADS INNER JOIN LEAD_ASSIGNED_TO ON LEADS._id = LEAD_ASSIGNED_TO.lead_id WHERE LEAD_ASSIGNED_TO.realEstateAgent_id = $1 AND LEAD_ASSIGNED_TO.current_status = $2 GROUP BY leads._id, fname, lname, current_status, working_status, lead_type, address, state, zip_code, phone, recording_link, beds, baths, additional_info, assigned_on ORDER BY create_at DESC LIMIT $3 OFFSET $4', [
                    req.user_id, '99', record, offset
                ]);

        const totalRows = totalCount.rows[0].count;
        return res.status(200).json({ data: leads.rows, totalRows });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: 'Server Error' });
    }
})

// RE agent to get his leads which are assigned to him
router.get('/agent/leads/:year/:month/:lead_status/:page', authorization, realEstateAutorization, async(req, res) => {
    try {
        const record = 1;
        const page = parseInt(req.params.page) ;
        const offset = (page - 1) * record;
            
        let leads;
        let totalCount;
        // default call when time period and status are not specified
        if(req.params.year == 'null' && req.params.month == 'null' && req.params.lead_status == 99){
            totalCount = await db.query('SELECT count(*) FROM leads INNER JOIN lead_assigned_to ON leads._id = lead_assigned_to.lead_id WHERE realEstateAgent_id = $1', [
                req.user_id
            ]);
            leads = await db.query('SELECT _id, fname, lname, working_status, current_status, lead_type, address, state, zip_code, phone, recording_link, beds, baths, additional_info, create_at as assigned_on FROM leads INNER JOIN lead_assigned_to ON leads._id = lead_assigned_to.lead_id WHERE realEstateAgent_id = $1 ORDER BY create_at DESC LIMIT $2 OFFSET $3', [
                req.user_id, record, offset
            ]);
        }
        // when both are specifiec
        else if(req.params.year != 'null'  && req.params.month != 'null' && req.params.lead_status != 99){
                const [thisMonth, toMonth] = getTimePeriod(req.params.year, req.params.month)

                totalCount = await db.query('SELECT count(*) FROM LEADS INNER JOIN LEAD_ASSIGNED_TO ON LEADS._id = LEAD_ASSIGNED_TO.lead_id INNER JOIN LEAD_COMMENTS ON LEADS._id = LEAD_COMMENTS.lead_id WHERE LEAD_ASSIGNED_TO.realEstateAgent_id = $1 AND create_at >= $2 AND create_at <= $3 AND LEAD_ASSIGNED_TO.current_status = $4', [
                    req.user_id, thisMonth, toMonth, req.params.lead_status
                ]);
                leads = await db.query('SELECT count(leads._id), leads._id, fname, lname, current_status, working_status, lead_type, address, state, zip_code, phone, recording_link, beds, baths, additional_info, create_at as assigned_on FROM LEADS INNER JOIN LEAD_ASSIGNED_TO ON LEADS._id = LEAD_ASSIGNED_TO.lead_id INNER JOIN LEAD_COMMENTS ON LEADS._id = LEAD_COMMENTS.lead_id WHERE LEAD_ASSIGNED_TO.realEstateAgent_id = $1 AND create_at >= $2 AND create_at <= $3 AND LEAD_ASSIGNED_TO.current_status = $4 GROUP BY leads._id, fname, lname, current_status, working_status, lead_type, address, state, zip_code, phone, recording_link, beds, baths, additional_info, assigned_on ORDER BY create_at DESC LIMIT $5 OFFSET $6', [
                    req.user_id, thisMonth, toMonth, req.params.lead_status, record, offset
                ]);
        }
        // only when time period is specified 
        else if (req.params.year != 'null' && req.params.month != 'null' &&  req.params.lead_status == 99){
            const [thisMonth, toMonth] = getTimePeriod(req.params.year, req.params.month)
            totalCount = await db.query('SELECT count(*) FROM leads INNER JOIN lead_assigned_to ON leads._id = lead_assigned_to.lead_id WHERE realEstateAgent_id = $1 AND create_at >= $2 AND create_at <= $3', [
                req.user_id, thisMonth, toMonth
                ]);
                leads = await db.query('SELECT _id, fname, lname, working_status, current_status, lead_type, address, state, zip_code, phone, recording_link, beds, baths, additional_info, create_at as assigned_on FROM leads INNER JOIN lead_assigned_to ON leads._id = lead_assigned_to.lead_id WHERE realEstateAgent_id = $1 AND create_at >= $2 AND create_at <= $3 ORDER BY create_at DESC LIMIT $4 OFFSET $5', [
                    req.user_id, thisMonth, toMonth, record, offset
                ]);
        }
        //  only when status is specified
        else if(req.params.year == 'null' && req.params.month == 'null' && req.params.lead_status != 99){
            totalCount = await db.query('SELECT count(*) FROM LEADS INNER JOIN LEAD_ASSIGNED_TO ON LEADS._id = LEAD_ASSIGNED_TO.lead_id INNER JOIN LEAD_COMMENTS ON LEADS._id = LEAD_COMMENTS.lead_id WHERE LEAD_ASSIGNED_TO.realEstateAgent_id = $1 AND LEAD_ASSIGNED_TO.current_status = $2', [
                req.user_id, req.params.lead_status
            ]);
            leads = await db.query('SELECT count(leads._id), leads._id, fname, lname, current_status, working_status, lead_type, address, state, zip_code, phone, recording_link, beds, baths, additional_info, create_at as assigned_on FROM LEADS INNER JOIN LEAD_ASSIGNED_TO ON LEADS._id = LEAD_ASSIGNED_TO.lead_id INNER JOIN LEAD_COMMENTS ON LEADS._id = LEAD_COMMENTS.lead_id WHERE LEAD_ASSIGNED_TO.realEstateAgent_id = $1 AND LEAD_ASSIGNED_TO.current_status = $2 GROUP BY leads._id, fname, lname, current_status, working_status, lead_type, address, state, zip_code, phone, recording_link, beds, baths, additional_info, assigned_on ORDER BY create_at DESC LIMIT $3 OFFSET $4', [
                req.user_id, req.params.lead_status, record, offset
            ]);
        }
        else{}

        const totalRows = totalCount.rows[0].count;
        return res.status(200).json({ data: leads.rows, totalRows });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ message: 'Server Error' });
    }
});

// for real estate agent before posting a comment under a asigned lead, whether has he already commented
// and sending back agents comment
router.get('/comment/:id', authorization, realEstateAutorization, async(req, res) => {
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
router.post('/comment', authorization, realEstateAutorization, async(req, res) => {
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