const express = require('express');
const db = require('../db');
const authorization = require('../middleware/authorization');
const masterOrAdminAuthorization = require('../middleware/masterOrAdminAuthorization');
const realEstateAutorization = require('../middleware/realEstateAutorization');
const { dateWithoutTime, getTimePeriod, startDate, endDate } = require('../date');
const router = express.Router();
const moment = require('moment-timezone');
const imageUpload = require('../middleware/uploadProfle');



// for form - lead posting
router.post('/', async(req, res) => {
    const { lead_type, working_status, fname, lname, address, state, zip_code, phone, beds, baths, price, additional_info, recording_link, agentName } = req.body;
    try {
        await db.query('INSERT INTO leads(lead_type, working_status, fname, lname, address, state, zip_code, phone, beds, baths, price, additional_info, recording_link, agentName, created_on) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)',[
            lead_type, working_status, fname, lname, address, state, zip_code, phone, beds, baths, price, additional_info, recording_link, agentName, dateWithoutTime
        ])
        return res.status(200).json({message: 'Lead added successfully.'})
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: 'Server Error'})
    }
})

// for getting leads
router.get('/', authorization, masterOrAdminAuthorization, async(req, res) => {
    const { year, month, page } = req.query
    try {
        const record = 10;
        const pagee = parseInt(page) ;
        const offset = (pagee - 1) * record;
            
        let leads;
        let totalCount;
        // default call
        if(year == 'null' && month == 'null'){
            totalCount = await db.query('Select count(*) FROM leads')
            leads = await db.query('SELECT * FROM leads ORDER BY _id DESC LIMIT $1 OFFSET $2',[
                record, offset
            ])
        }
        // time period is specified
        else if(year != 'null' && month != 'null'){
            const [thisMonth, toMonth] = getTimePeriod(year, month)
            totalCount = await db.query('Select count(*) FROM leads WHERE created_on >= $1 AND created_on <= $2',[
                thisMonth, toMonth
            ])
            leads = await db.query('SELECT * FROM leads WHERE created_on >= $1 AND created_on <= $2 ORDER BY _id DESC LIMIT $3 OFFSET $4',[
                thisMonth, toMonth, record, offset
            ])
        }
        else{}

        return res.status(200).json({leads: leads.rows, totalRows: totalCount.rows[0].count})
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
        // restricting user to not check other leads which are not assigned to him, other logic is on frontend
        if(leads.rows.length === 0)
            return res.status(404).json({})

        // if assigned lead found then updating viewed status
        if(!leads.rows[0].viewed)
        await db.query('UPDATE lead_assigned_to SET viewed = $1 WHERE lead_id = $2 AND realEstateAgent_id = $3',[
            true, req.params._id, req.user_id
        ]) 
           
        return res.status(200).json(leads.rows)
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: 'Server Error'})
    }
})

// for Re Agent to get notifications 
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

// get single lead by id admin
router.get('/:_id', authorization, masterOrAdminAuthorization, async(req, res) => {
    try {
        const leads = await db.query('SELECT * FROM leads WHERE _id = $1', [req.params._id])
        if(leads.rows.length === 0)
            return res.status(404).json({})
        
        return res.status(200).json(leads.rows)
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
        let accepted = [], rejected = [], followUp = [], onContract = [], listed = [], sold = [], neutral = []
        if(leads.rows && leads.rows.length > 0){
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
        const record = 6;
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
        const record = 10;
        const page = parseInt(req.params.page);
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

                totalCount = await db.query('SELECT count(*) FROM LEADS INNER JOIN LEAD_ASSIGNED_TO ON LEADS._id = LEAD_ASSIGNED_TO.lead_id WHERE LEAD_ASSIGNED_TO.realEstateAgent_id = $1 AND create_at >= $2 AND create_at <= $3 AND LEAD_ASSIGNED_TO.current_status = $4', [
                    req.user_id, thisMonth, toMonth, req.params.lead_status
                ]);
                leads = await db.query('SELECT count(leads._id), leads._id, fname, lname, current_status, working_status, lead_type, address, state, zip_code, phone, recording_link, beds, baths, additional_info, create_at as assigned_on FROM LEADS INNER JOIN LEAD_ASSIGNED_TO ON LEADS._id = LEAD_ASSIGNED_TO.lead_id WHERE LEAD_ASSIGNED_TO.realEstateAgent_id = $1 AND create_at >= $2 AND create_at <= $3 AND LEAD_ASSIGNED_TO.current_status = $4 GROUP BY leads._id, fname, lname, current_status, working_status, lead_type, address, state, zip_code, phone, recording_link, beds, baths, additional_info, assigned_on ORDER BY create_at DESC LIMIT $5 OFFSET $6', [
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
            totalCount = await db.query('SELECT count(*) FROM LEADS INNER JOIN LEAD_ASSIGNED_TO ON LEADS._id = LEAD_ASSIGNED_TO.lead_id WHERE LEAD_ASSIGNED_TO.realEstateAgent_id = $1 AND LEAD_ASSIGNED_TO.current_status = $2', [
                req.user_id, req.params.lead_status
            ]);
            leads = await db.query('SELECT count(leads._id), leads._id, fname, lname, current_status, working_status, lead_type, address, state, zip_code, phone, recording_link, beds, baths, additional_info, create_at as assigned_on FROM LEADS INNER JOIN LEAD_ASSIGNED_TO ON LEADS._id = LEAD_ASSIGNED_TO.lead_id WHERE LEAD_ASSIGNED_TO.realEstateAgent_id = $1 AND LEAD_ASSIGNED_TO.current_status = $2 GROUP BY leads._id, fname, lname, current_status, working_status, lead_type, address, state, zip_code, phone, recording_link, beds, baths, additional_info, assigned_on ORDER BY create_at DESC LIMIT $3 OFFSET $4', [
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
        const lead = await db.query('SELECT LEAD_COMMENTS._id, lead_id, content, lead_status, realEstateAgent_id, profile_image FROM LEAD_COMMENTS INNER JOIN users ON LEAD_COMMENTS.realEstateAgent_id = users._id WHERE lead_id = $1 AND realEstateAgent_id = $2',[
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
router.get('/comments/:_id/:agent_id', authorization, masterOrAdminAuthorization, async(req, res) => {
    try {
        let comments;
        if(req.params.agent_id == 'null')
            comments = await db.query('SELECT lead_id, content, lead_status, name, profile_image FROM LEAD_COMMENTS INNER JOIN USERS ON LEAD_COMMENTS.realEstateAgent_id = USERS._id WHERE lead_id = $1',[
                req.params._id
            ])
        else
            comments = await db.query('SELECT lead_id, content, lead_status, name, profile_image FROM LEAD_COMMENTS INNER JOIN USERS ON LEAD_COMMENTS.realEstateAgent_id = USERS._id WHERE lead_id = $1 AND realEstateAgent_id = $2',[
                req.params._id, req.params.agent_id
            ])
        return res.status(200).json(comments.rows)
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: 'Server Error'})
    }
})

// for admin to check whose thus lead assigned to and for filtering comments
router.get('/assined/:_id', authorization, masterOrAdminAuthorization, async(req, res) => {
    try {
        const agents = await db.query('SELECT  _id, name FROM lead_assigned_to INNER JOIN USERS ON lead_assigned_to.realEstateAgent_id = USERS._id WHERE lead_id = $1 GROUP BY _id, realEstateAgent_id, name ORDER BY realEstateAgent_id DESC',[
            req.params._id
        ])
        return res.status(200).json(agents.rows)
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: 'Server Error'})        
    }
})

// for admin dashboard
router.get('/dashboard/stats', authorization, masterOrAdminAuthorization, async(req, res) => {
    try {
        const todayLeads = await db.query('SELECT count(*) FROM LEADS WHERE created_on = $1',[
            dateWithoutTime
        ])
        const monthlyLeads = await db.query('SELECT count(*) FROM LEADS WHERE created_on >= $1 AND created_on < $2',[
            startDate, endDate
        ])

        const date = moment.tz(Date.now(), "America/Los_Angeles");
        let startOfMonth = ''
        let endOfMonth = ''
        const data = []

        for (let i = 1; i <= date.month()+1; i++) {
            startOfMonth = `${date.year()}-${i <= 9 ? `0${i}`: `${i}`}-01`
            endOfMonth = `${date.year()}-${i <= 9 ? `0${i}`: `${i}`}-31`

            const leads = await db.query('SELECT * FROM Leads WHERE created_on >= $1 AND created_on < $2',[
                startOfMonth, endOfMonth
            ])

            data.push(leads.rows.length)
        }

        return res.status(200).json({
            dailyLeads : todayLeads.rows[0].count,
            monthlyLeads : monthlyLeads.rows[0].count,
            chartData:  data
        })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: 'Server Error'})
    }
})

// for admin to view all agents stats 
router.get('/listing/agent-stats', authorization, masterOrAdminAuthorization, async(req, res) => {
    const { from, to, page, agent_id, lead_count } = req.query
    // default call
    // from = null
    // toMonth = null
    // page = 1
    // agent_id = null
    // leads_count = null
    try {
        const record = 1;
        const pagee = parseInt(page) ;
        const offset = (pagee - 1) * record;
        
        let agents;
        let leads;
        let totalAgentCount;

        // sending leads data of this month
        const date = moment.tz(Date.now(), "America/Los_Angeles");
        let startOfMonth = `${date.year()}-${date.month()+1 <= 9 ? `0${date.month()+1}` : date.month()+1}`
        let endOfMonth = `${date.year()}-${date.month()+2 <= 9 ? `0${date.month()+2}` : date.month()+2}`
        
        // default calll
        // sending all data of this month
        if(lead_count == 'null'){
            totalAgentCount = await db.query('SELECT count(*) FROM USERS WHERE role = 2 AND active = 1');
        
            if(from == 'null' && to == 'null' && agent_id == 'null'){
                agents = await db.query('SELECT _id, name, state, address FROM USERS WHERE role = 2 AND active = 1 ORDER BY _id DESC LIMIT $1 OFFSET $2',[
                    record, offset
                ])
                
                for (let i = 0; i < agents.rows.length; i++) {
                    leads = await db.query('Select current_status FROM LEAD_ASSIGNED_TO WHERE realEstateAgent_id = $1 AND create_at >= $2 AND create_at <= $3',[
                        agents.rows[i]._id, startOfMonth, endOfMonth
                    ])
                    agents.rows[i].totalLeads = leads.rows.length
                    const rejectedLeads = leads.rows.filter((lead)=> lead.current_status === 1)
                    agents.rows[i].rejectedLeads = rejectedLeads.length
                    agents.rows[i].acceptedLeads = leads.rows.length - rejectedLeads.length
                }
            }

            // // when time is specified and agent is not
            else if (from != 'null' && to != 'null' && agent_id == 'null'){
                agents = await db.query('SELECT _id, name, state, address FROM USERS WHERE role = 2 AND active = 1 ORDER BY _id DESC LIMIT $1 OFFSET $2',[
                    record, offset
                ])

                // sending data of specified
                for (let i = 0; i < agents.rows.length; i++) {
                    leads = await db.query('Select current_status FROM LEAD_ASSIGNED_TO WHERE realEstateAgent_id = $1 AND create_at >= $2 AND create_at <= $3',[
                        agents.rows[i]._id, from, to
                    ])
                    agents.rows[i].totalLeads = leads.rows.length
                    const rejectedLeads = leads.rows.filter((lead)=> lead.current_status === 1)
                    agents.rows[i].rejectedLeads = rejectedLeads.length
                    agents.rows[i].acceptedLeads = leads.rows.length - rejectedLeads.length
                }
            }

            // // when time and agent are specified 
            else if (from != 'null' && to != 'null' && agent_id != 'null'){
                totalAgentCount.rows[0].count = 1
                agents = await db.query('SELECT _id, name, state, address FROM USERS WHERE role = 2 AND active = 1 AND _id = $1',[
                    agent_id
                ])

                // sending data of specified
                for (let i = 0; i < agents.rows.length; i++) {
                    leads = await db.query('Select current_status FROM LEAD_ASSIGNED_TO WHERE realEstateAgent_id = $1 AND create_at >= $2 AND create_at <= $3',[
                        agents.rows[i]._id, from, to
                    ])
                    agents.rows[i].totalLeads = leads.rows.length
                    const rejectedLeads = leads.rows.filter((lead)=> lead.current_status === 1)
                    agents.rows[i].rejectedLeads = rejectedLeads.length
                    agents.rows[i].acceptedLeads = leads.rows.length - rejectedLeads.length
                }

            }
            else {}
        }

        if(lead_count != 'null'){
            totalAgentCount = await db.query(`SELECT count(*)
                                                FROM Users
                                                        JOIN (
                                                        SELECT realEstateAgent_id, COUNT(*) AS lead_count
                                                        FROM LEAD_ASSIGNED_TO 
                                                        WHERE create_at >= '${startOfMonth}' AND create_at <= '${endOfMonth}'
                                                        GROUP BY realEstateAgent_id
                                                        HAVING COUNT(*) = ${lead_count}
                                                    ) AS LAT ON LAT.realEstateAgent_id = Users._id
                                                `)

            agents = await db.query(`SELECT _id, name, state
                                                FROM Users
                                                        JOIN (
                                                        SELECT realEstateAgent_id, COUNT(*) AS lead_count
                                                        FROM LEAD_ASSIGNED_TO
                                                        WHERE create_at >= '${startOfMonth}' AND create_at <= '${endOfMonth}'
                                                        GROUP BY realEstateAgent_id
                                                        HAVING COUNT(*) = ${lead_count}
                                                    ) AS LAT ON LAT.realEstateAgent_id = Users._id
                                                ORDER BY _id DESC LIMIT ${record} OFFSET ${offset}`)


           

            for (let i = 0; i < agents.rows.length; i++) {
                 for (let i = 0; i < agents.rows.length; i++) {
                     leads = await db.query('Select current_status FROM LEAD_ASSIGNED_TO WHERE realEstateAgent_id = $1 AND create_at >= $2 AND create_at <= $3',[
                         agents.rows[i]._id, startOfMonth, endOfMonth
                     ])
                     agents.rows[i].totalLeads = leads.rows.length
                     const rejectedLeads = leads.rows.filter((lead)=> lead.current_status === 1)
                     agents.rows[i].rejectedLeads = rejectedLeads.length
                     agents.rows[i].acceptedLeads = leads.rows.length - rejectedLeads.length
                 }
            }
        }

        return res.status(200).json({
            totalAgents: totalAgentCount.rows[0].count, 
            data:agents.rows
        })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: 'Server Error'})
    }
})

// for admin to view single agents stats 
router.get('/agent-stats/:id', authorization, masterOrAdminAuthorization, async(req, res) => {
    try {
        let data;
        data = await db.query('SELECT name, address, state FROM USERS WHERE _id = $1', [req.params.id])
        if(data.rows.length === 0)
            return res.status(404).json({message:'User not found'})

        let leads = await db.query(`SELECT _id, create_at as assigned_on, current_status, fname, lname, address, state 
                                        FROM LEAD_ASSIGNED_TO 
                                            INNER JOIN LEADS 
                                            ON LEAD_ASSIGNED_TO.lead_id = LEADS._id
                                            WHERE realEstateAgent_id = '${req.params.id}' ORDER BY create_at DESC`
                                        )
        if(leads.rows.length > 0){
            const date = moment.tz(Date.now(), "America/Los_Angeles");
            
            data.rows[0].leads = []
            
            let year = date.year() // project deployed in year 2023 

            for (let j = year; j >= 2023; j--) {
                let startMonth;
                if(j === year){ // if j = current year then from current month data will be cunsidered
                    startMonth =  date.month()+1
                }
                else    // else j = past year then month will start from dec
                    startMonth = 12

                for (let i = startMonth; i > 0 ; i--) { // looping through the months of j which is year
                    let month = `${j}-${i <= 9 ? `0${i}` : i}` // chaning month
                    let monthlyLeads = leads.rows.filter((lead)=> lead.assigned_on.includes(month)) // filtering leads of month
                    if(monthlyLeads.length > 0){ // if month has no leads then, not pushing into 
                        let obj = {
                            month: month,
                            leads: monthlyLeads
                        }
                        data.rows[0].leads.push(obj)
                    }
                }  
            }                            
        }
        return res.status(200).json(data.rows[0])

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message:'Server Error'})
    }
})

router.post('/rfa', authorization, realEstateAutorization, imageUpload.single('rfa'), async(req, res)=>{
    try {
        await db.query('INSERT INTO RFA(rfa, comments, user_id) VALUES($1, $2, $3)',[
            req.file.path, req.body.comments, req.user_id
        ])
        return res.status(200).json({message:'Agreement uploaded successfully'})
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message:'Server Error'})
    }
})

router.get('/rfa/:id', authorization, async(req, res) => {
    try {
        const rfa = await db.query('SELECT * FROM RFA WHERE user_id = $1', [req.params.id])
        if(rfa.rows.length === 0) 
            return res.status(404).json({})
        return res.status(200).json(rfa.rows[0])
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: 'Server Error'})
    }
})

module.exports = router