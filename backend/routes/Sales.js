const express = require("express")
const router = express.Router();
const authorization = require("../middleware/authorization");
const Sales = require("../models/Sales");
const masterOrAdminAuthorization = require("../middleware/masterOrAdminAuthorization");
const moment = require("moment-timezone")


// user to get his own sales
router.get('/mysales', authorization, async(req, res)=> {
    try {
        const date = moment.tz(Date.now(), "America/Los_Angeles");
        const startDate =  `${date.year()}-${date.month()+1}-1`
        const endDate =  `${date.year()}-${date.month()+1}-31`
        
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

// admin or master get all sales
router.get('/', authorization, masterOrAdminAuthorization, async(req, res)=>{
    try {
        const sales = await Sales.find({}).populate("user_id", "name")
        return res.status(200).json(sales)
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: 'Server Error'})
    }
})

// edit sale
router.patch('/', authorization, masterOrAdminAuthorization, async(req, res)=> {
    const {_id, client_name, client_phone, client_address, multiplier} = req.body;
    try {
        const sale = await Sales.findOne({_id: _id})

        sale.client_name = client_name;
        sale.client_phone = client_phone;
        sale.client_address = client_address;
        sale.multiplier = multiplier;

        await sale.save();

        return res.status(200).json({message: 'Sale updated'})
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: 'Server Error'})
    }
})

// delete sale
router.delete('/:id', authorization, masterOrAdminAuthorization, async(req, res)=>{
    try {
        await Sales.deleteOne({_id: req.params.id})
        return res.status(200).json({message: 'Sale deleted successfully'})
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: 'Server Error'})
    }
})

// Adding sale
router.post('/', authorization, async(req, res)=>{
    const { client_name, client_phone, client_address, user_id } = req.body;
    try {
        const sale = await Sales.findOne({client_phone: client_phone})
        if(sale)
            return res.status(422).json({message: 'Duplicate Sale'})

        const date = moment.tz(Date.now(), "America/Los_Angeles");
        const todayDate =  `${date.year()}-${date.month()+1}-${date.date()}`
        
        // getting user sales
        const userSales = await Sales.find({user_id : user_id ? user_id : req.user_id})
    
        // filtering user's today sales
        const todaySales = userSales.filter((sale) => sale.create_at.includes(todayDate))

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
            await Sales.create({
                user_id : req.user_id,
                client_name : client_name,
                client_address : client_address,
                client_phone : client_phone,
                multiplier : multiplier, 
            })
        // for admin to add sale for user
        else
            await Sales.create({
                user_id : user_id,
                client_name : client_name,
                client_address : client_address,
                client_phone : client_phone,
                multiplier : multiplier, 
            })
        return res.status(200).json({message: 'Sale added successfully'})
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: 'Server Error'})
    }
})

module.exports = router
