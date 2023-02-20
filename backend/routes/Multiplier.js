const express = require("express")
const router = express.Router();
const authorization = require("../middleware/authorization");
const masterOrAdminAuthorization = require("../middleware/masterOrAdminAuthorization");
const Multiplier = require("../models/Multiplier");

router.patch('/', authorization, masterOrAdminAuthorization, async(req, res)=>{
    const { _id, multiply_with } = req.body;
    try {
        const obj = await Multiplier.findOne({_id: _id})

        obj.multiply_with = multiply_with;
        await obj.save()

        return res.status(200).json({message: 'Multiplier Updated'})
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: 'Server Error'})
    }
})

router.get('/', authorization, async(req, res) => {
    try {
        const multiplier = await Multiplier.find({})
        return res.status(200).json(multiplier[0])
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: 'Server Error'})
    }
})

module.exports = router
