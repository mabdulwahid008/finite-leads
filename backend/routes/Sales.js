const express = require("express")
const router = express.Router();
const authorization = require("../middleware/authorization");
const Sales = require("../models/Sales");
const masterOrAdminAuthorization = require("../middleware/masterOrAdminAuthorization");
const Multiplier = require("../models/Multiplier");

// create sale
router.post('/', authorization, async(req, res)=>{
    const { client_name, client_phone, client_address } = req.body;
    try {
        const sale = await Sales.findOne({client_phone: client_phone})
        if(sale)
            return res.status(422).json({message: 'Duplicate Sale'})

        const multiplier = await Multiplier.find({})

        await Sales.create({
            user_id : req.user_id,
            client_name : client_name,
            client_address : client_address,
            client_phone : client_phone,
            multiplier: multiplier[0].multiply_with
        })
        return res.status(200).json({message: 'Sale added successfully'})
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: 'Server Error'})
    }
})

router.patch('/', authorization, masterOrAdminAuthorization, async(req, res)=> {

})


module.exports = router
