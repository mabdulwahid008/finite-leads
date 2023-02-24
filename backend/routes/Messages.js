const express = require('express')
const authorization = require('../middleware/authorization')
const masterOrAdminAuthorization = require('../middleware/masterOrAdminAuthorization')
const Chat = require('../models/Chat')
const router = express.Router()

router.post('/create-group', authorization, masterOrAdminAuthorization, async(req, res) => {
    const { groupName, users } = req.body;
    try {
        
        await Chat.create({
            groupName: groupName,
            isGroupChat : true,
            users: users
        })
        return res.status(200).json({message: 'Group created'})
    } catch (error) {
        console.log(error);
        return res.status(200).json({message: 'Server Error'})
    }
})

router.get('/my-groups', authorization, async(req, res)=>{
    try {
        console.log(req.user_id);
        const groups = await Chat.find({ users: { $in: [req.user_id] }})

        return res.status(200).json(groups)
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: 'Server Error'})
    }
})

module.exports = router