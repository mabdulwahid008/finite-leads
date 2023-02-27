const express = require('express')
const authorization = require('../middleware/authorization')
const masterOrAdminAuthorization = require('../middleware/masterOrAdminAuthorization')
const Chat = require('../models/Chat')
const User = require('../models/User')
const router = express.Router()

// create group
router.post('/create-group', authorization, masterOrAdminAuthorization, async(req, res) => {
    const { groupName, users } = req.body;
    try {
        if(users.length < 2){
            return res.status(422).json({message: "Users should me more than 2 to create a group"})
        }

        users.push(req.user_id)

        await Chat.create({
            groupName: groupName,
            isGroupChat : true,
            users: users,
            groupAdmin: req.user_id
        })
        return res.status(200).json({message: 'Group created'})
    } catch (error) {
        console.log(error);
        return res.status(200).json({message: 'Server Error'})
    }
})

// accessing groups 
router.get('/my-groups', authorization, async(req, res)=>{
    try {
        const groups = await Chat.find({ 
            users: { $elemMatch: { $eq: req.user_id} }
        })
        .populate("groupAdmin", "-password -email -phone -address -role -created_at -__v")
        .populate("users", "-password -email -phone -address -role -created_at -__v")
        .populate("latestMessage")
        .sort({updatedAt: -1})

        const data = await User.populate(groups, {
            path: "latestMessage.sender",
            select: "name"
        })

        return res.status(200).json(data)
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: 'Server Error'})
    }
})

// updating group name
router.patch('/update-group-name', authorization, masterOrAdminAuthorization, async(req, res)=> {
    const { _id, updatedGroupName } = req.body
    try {
        const group = await Chat.findById({_id: _id})
        if(!group)
            return res.status(404).json({message: "Group not found"});
        
        group.groupName = updatedGroupName;
        await group.save()

        return res.status(200).json({message: "Group name updated"})

    } catch (error) {
        
    }
})

// adding new member
router.patch('/add-new-users', authorization, masterOrAdminAuthorization, async(req, res)=> {
    const { _id, userId } = req.body;
    try {
        const group = await Chat.findById({_id: _id})
        if(!group)
            return res.status(404).json({message: "Group not found"});
        
        const userAlreadyExists = group.users.includes(userId)

        if(userAlreadyExists)
            return res.status(422).json({message: "User is already the member of this group"});
        
        group.users.push(userId)
        await group.save()

        return res.status(200).json({message: "New member added"})
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: 'Server Error'})
    }
})


module.exports = router