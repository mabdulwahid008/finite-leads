const express = require("express")
const router = express.Router();
const authorization = require("../middleware/authorization");
const Sales = require("../models/Sales");
const masterOrAdminAuthorization = require("../middleware/masterOrAdminAuthorization");
const moment = require("moment-timezone")

// create sale
router.post('/', authorization, async(req, res)=>{
    const { client_name, client_phone, client_address, user_id } = req.body;
    try {
        const sale = await Sales.findOne({client_phone: client_phone})
        if(sale)
            return res.status(422).json({message: 'Duplicate Sale'})

        // for user to add sale by himself
        if(user_id === null)
            await Sales.create({
                user_id : req.user_id,
                client_name : client_name,
                client_address : client_address,
                client_phone : client_phone,
            })
        // for admin to add sale for user
        else
            await Sales.create({
                user_id : user_id,
                client_name : client_name,
                client_address : client_address,
                client_phone : client_phone,
            })
        return res.status(200).json({message: 'Sale added successfully'})
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: 'Server Error'})
    }
})

// edit sale
router.patch('/', authorization, masterOrAdminAuthorization, async(req, res)=> {
})

router.get('/mysales', authorization, async(req, res)=> {
    try {
        const date = moment.tz(Date.now(), "America/Los_Angeles");
        const startDate =  `${date.year()}-${date.month()+1}-1}/0:0}`
        const endDate =  `${date.year()}-${date.month()+1}-31}/0:0}`

        const sales = await Sales.find({
            user_id: req.user_id,
            create_at: {
                $gte: startDate,
                $lt: endDate,
              }
        }).populate("user_id", "name")
        
        return res.status(200).json(sales.reverse())
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: 'Server Error'})
    }
})


module.exports = router
