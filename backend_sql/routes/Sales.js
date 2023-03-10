const express = require('express');
const { dateWithoutTime, date, startDate, endDate, time } = require('../date');
const db = require('../db');
const authorization = require('../middleware/authorization');
const masterOrAdminAuthorization = require('../middleware/masterOrAdminAuthorization');
const router = express.Router()
const moment = require('moment-timezone')


// user to get his own sales
router.get('/mysales', authorization, async(req, res)=> {
    try {
        const sales = await db.query('SELECT SALES._id, extraBonus, client_name, client_phone, client_address, client_phone, multiplier, updated_multiplier, create_at, user_id, name  FROM SALES INNER JOIN USERS ON SALES.user_id = USERS._id WHERE user_id = $1 AND create_at >= $2 AND create_at <= $3',[
            req.user_id, startDate, endDate
        ])
        
        return res.status(200).json(sales.rows.sort(function(a, b) {
            if (a._id !== b._id) {
                return b._id - a._id 
            }}))
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: 'Server Error'})
    }
})

// admin or master get all sales
router.get('/:fromDate/:toDate/:agentId', authorization, masterOrAdminAuthorization, async(req, res)=> {
    try {
        let sales = [];
        // default call
        if(req.params.agentId == 0 && req.params.fromDate == 0 && req.params.toDate == 0)
            sales = await db.query('SELECT SALES._id, extraBonus, client_name, client_phone, client_address, client_phone, multiplier, updated_multiplier, create_at, user_id, name  FROM SALES INNER JOIN USERS ON SALES.user_id = USERS._id')
        // all sales of specific agent
        else if(req.params.agentId != 0 && req.params.fromDate == 0 && req.params.toDate == 0)
             sales = await db.query('SELECT SALES._id, extraBonus, client_name, client_phone, client_address, client_phone, multiplier, updated_multiplier, create_at, user_id, name  FROM SALES INNER JOIN USERS ON SALES.user_id = USERS._id WHERE user_id = $1',[
                 req.params.agentId
             ])
        // within time period sales of specific agent
        else if(req.params.agentId != 0 && req.params.fromDate != 0 && req.params.toDate != 0)
            sales = await db.query('SELECT SALES._id, extraBonus, client_name, client_phone, client_address, client_phone, multiplier, updated_multiplier, create_at, user_id, name  FROM SALES INNER JOIN USERS ON SALES.user_id = USERS._id WHERE user_id = $1 AND create_at >= $2 AND create_at <= $3',[
                req.params.agentId, req.params.fromDate, req.params.toDate
            ])
        // all sales within time perios
        else if(req.params.agentId == 0 && req.params.fromDate != 0 && req.params.toDate != 0)
            sales = await db.query('SELECT SALES._id, extraBonus, client_name, client_phone, client_address, client_phone, multiplier, updated_multiplier, create_at, user_id, name  FROM SALES INNER JOIN USERS ON SALES.user_id = USERS._id WHERE create_at >= $1 AND create_at <= $2',[
                req.params.fromDate, req.params.toDate
            ])
        else{}    
        
        return res.status(200).json(sales.rows.sort(function(a, b) {
            if (a._id !== b._id) {
                return b._id - a._id 
            }}))
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: 'Server Error'})
    }
})

// edit sale
router.patch('/', authorization, masterOrAdminAuthorization, async(req, res)=> {
    const {_id, user_id, client_name, client_phone, client_address, multiplier, extrabonus, create_at} = req.body;
    try {
        let newdate = create_at;

        let dateUpdate = false;
        if(newdate.length === 10){
            newdate = create_at.concat(`/${time}`)
            dateUpdate = true
        }
        const sale = await db.query('SELECT * FROM sales WHERE _id = $1',[
            _id
        ])

        if(!dateUpdate)
            await db.query('UPDATE sales SET client_name = $1, client_phone = $2, client_address = $3, extraBonus = $4, create_at= $5 WHERE _id = $6',[
                        client_name, client_phone, client_address, extrabonus, newdate, _id
            ])
        if(dateUpdate){
            // getting user sales
            const userSales = await db.query('SELECT * FROM sales WHERE user_id = $1', [
                user_id ? user_id : req.user_id
            ])

            // filtering user's today sales
            const thatDaySales = userSales.rows.filter((sale) => sale.create_at.includes(newdate.substr(0, 10)))
            
            let multiplier = 1;

            if(thatDaySales.length !== 0){
                // getting the last value for the multiplier 
                for (let i = 0; i < thatDaySales.length; i++) {
                    multiplier = todaySales[i].multiplier
                }
                
                if(multiplier < 5)
                    multiplier += 1;
                if(multiplier === 5)
                    multiplier = 5;
            }

            await db.query('UPDATE sales SET client_name = $1, client_phone = $2, client_address = $3, extraBonus = $4, multiplier = $5 WHERE _id = $6',[
                client_name, client_phone, client_address, extrabonus, multiplier, _id
            ])
        }
        
        // if(sale.rows[0].multiplier !== multiplier)
        //     await db.query('UPDATE sales SET client_name = $1, client_phone = $2, client_address = $3, updated_multiplier = $4 WHERE _id = $5',[
        //         client_name, client_phone, client_address, multiplier, _id
        //     ])
        // else
        //     await db.query('UPDATE sales SET client_name = $1, client_phone = $2, client_address = $3, multiplier = $4 WHERE _id = $5',[
        //         client_name, client_phone, client_address, multiplier, _id
        //     ])
        return res.status(200).json({message: 'Sale updated'})
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: 'Server Error'})
    }
})

// Adding Sale
router.post('/', authorization, async(req, res) => {
    const { client_name, client_phone, client_address, user_id } = req.body;
    try {
        const sale = await db.query('SELECT * FROM sales WHERE client_phone = $1',[
            client_phone
        ])
        if(sale.rows.length > 0)
            return res.status(422).json({message: 'Duplicate Sale'})
        
        // getting user sales
        const userSales = await db.query('SELECT * FROM sales WHERE user_id = $1', [
            user_id ? user_id : req.user_id
        ])

         // filtering user's today sales
        const todaySales = userSales.rows.filter((sale) => sale.create_at.includes(dateWithoutTime))
        
        let multiplier = 1;

        if(todaySales.length !== 0){
            // getting the last value for the multiplier 
            for (let i = 0; i < todaySales.length; i++) {
                multiplier = todaySales[i].multiplier
            }
            
            if(multiplier < 5)
                multiplier += 1;
            if(multiplier === 5)
                multiplier = 5;
        }

        // for user to add sale by himself
        if(user_id === null)
            await db.query('INSERT INTO sales(user_id, client_name, client_address, client_phone, multiplier, create_at) VALUES($1, $2, $3, $4, $5, $6)',[
                req.user_id, client_name, client_address, client_phone, multiplier, date
            ])
        // for admin to add sale for user
        else
            await db.query('INSERT INTO sales(user_id, client_name, client_address, client_phone, multiplier, create_at) VALUES($1, $2, $3, $4, $5, $6)',[
                user_id, client_name, client_address, client_phone, multiplier, date
            ])
        
        return res.status(200).json({message: 'Sale added successfully'})
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: 'Server Error'})
    }
})

// delete sale
router.delete('/:id', authorization, masterOrAdminAuthorization, async(req, res)=>{
    try {
        await db.query('DELETE FROM sales WHERE _id = $1',[
            req.params.id
        ])
        return res.status(200).json({message: 'Sale deleted successfully'})
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: 'Server Error'})
    }
})


// for dashboard graph 
router.get('/stats', authorization, async(req, res)=>{
    const date = moment.tz(Date.now(), "America/Los_Angeles");
    let startOfMonth = ''
    let endOfMonth = ''
    const data = []

    try {
        if(req.user_role === 5 || req.user_role === 3){
            for (let i = 1; i <= date.month()+1; i++) {
                startOfMonth = `${date.year()}-${i <= 9 ? `0${i}`: `${i}`}-01`
                endOfMonth = `${date.year()}-${i <= 9 ? `0${i}`: `${i}`}-31`

                const sales = await db.query('SELECT * FROM sales WHERE create_at >= $1 AND create_at <= $2',[
                    startOfMonth, endOfMonth
                ])

                data.push(sales.rows.length)
            }
        }
        if(req.user_role === 0){
            for (let i = 1; i <= date.month()+1; i++) {
                startOfMonth = `${date.year()}-${i <= 9 ? `0${i}`: `${i}`}-01`
                endOfMonth = `${date.year()}-${i <= 9 ? `0${i}`: `${i}`}-31`

                const sales = await db.query('SELECT * FROM sales WHERE create_at >= $1 AND create_at <= $2 AND user_id = $3',[
                    startOfMonth, endOfMonth, req.user_id
                ])

                data.push(sales.rows.length)
            }
        }

        return res.status(200).json({data})
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: 'Server Error'})
    }
})

module.exports = router