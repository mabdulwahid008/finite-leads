const express = require('express');
const { dateWithoutTime, date } = require('../date');
const db = require('../db');
const authorization = require('../middleware/authorization')
const router = express.Router()

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
        // const todaySales = userSales.rows.filter((sale) => sale.create_at.includes(dateWithoutTime))
        const todaySales = userSales.rows.filter((sale) => console.log(sale.create_at))

        console.log(dateWithoutTime);
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
        // if(user_id === null)
        //     await db.query('INSERT INTO sales(user_id, client_name, client_address, client_phone, multiplier, create_at) VALUES($1, $2, $3, $4, $5, $6)',[
        //         req.user_id, client_name, client_address, client_phone, multiplier, date
        //     ])
        // // for admin to add sale for user
        // else
        //     await db.query('INSERT INTO sales(user_id, client_name, client_address, client_phone, multiplier, create_at) VALUES($1, $2, $3, $4, $5, $6)',[
        //         user_id, client_name, client_address, client_phone, multiplier, date
        //     ])
        
        return res.status(200).json({message: 'Sale added successfully'})
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: 'Server Error'})
    }
})

module.exports = router