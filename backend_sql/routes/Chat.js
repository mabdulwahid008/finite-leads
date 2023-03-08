const express = require("express")
const { date } = require("../date")
const db = require("../db")
const authorization = require("../middleware/authorization")
const masterOrAdminAuthorization = require("../middleware/masterOrAdminAuthorization")
const router = express.Router()

// create group
router.post('/', authorization, masterOrAdminAuthorization, async(req, res) => {
    const { groupName, users } = req.body;
    try {
        if(users.length < 2){
            return res.status(422).json({message: "Users should me more than 2 to create a group"})
        }
        // ading admin to users
        users.push(req.user_id)

        // ading master to users
        const master = await db.query('SELECT * FROM users WHERE role = 5')
        users.push(master.rows[0]._id)

        // inserting to chat table
        await db.query('INSERT INTO chat(groupName, groupAdmin, create_at) VALUES($1, $2, $3)',[
            groupName, req.user_id, date
        ])

        // getting _id of created chat
        const chat = await db.query('SELECT * FROM chat WHERE create_at = $1', [
            date
        ])

        // inserting to group table
        for (let i = 0; i < users.length; i++) {
            await db.query('INSERT INTO groups(_chatId, _userId) VALUES($1, $2)',[
                chat.rows[0]._id, users[i]
            ])
        }
        
        return res.status(200).json({message: 'Group Created Successfully'})
    } catch (error) {
        console.log(error.message);
        return res.status(200).json({message: 'Server Error'})
    }
})

// my groups
router.get('/my-chats', authorization, async(req, res) => {
    try {
        const chats = await db.query('SELECT * FROM groups WHERE _userId = $1',[
            req.user_id
        ])
        let myChats = [];

        for (let i = 0; i < chats.rows.length; i++) {
            // geting chat metadata
            let chat = await db.query('SELECT chat._id, groupname, latestmessage, name as groupadmin, create_at FROM chat INNER JOIN users on chat.groupadmin = users._id where chat._id = $1',[
                chats.rows[i]._chatid
            ])
            // geting users in that chat
            let users = await db.query('SELECT users._id, users.name FROM groups INNER JOIN users ON groups._userid = users._id WHERE groups._chatid = $1',[
                chats.rows[i]._chatid
            ])

            chat.rows[i].users = users.rows

            myChats.push(chat.rows[i])
        }
        return res.status(200).json(myChats)
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: 'Server Error'})
    }
})

// updating group name
router.get('/update-group-name', authorization, masterOrAdminAuthorization, async(req, res)=> {
    const { _id, updatedGroupName } = req.body
    try {
        await db.query('UPDATE chat SET groupname = $1 WHERE _id = $2',[
            updatedGroupName, _id
        ])
        return res.status(200).json({message: 'Group name updated successfully'})
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: 'Server Error'})
    }
})

// adding new member
router.patch('/add-new-users', authorization, masterOrAdminAuthorization, async(req, res) => {
    const { _id, userId } = req.body;
    try {
        const chat = await db.query('SELECT * FROM groups WHERE _chatid = $1 AND _userid = $2',[
            _id, userId
        ])

        if(chat.rows.length > 0)
            return res.status(200).json({message: 'User is already a member'})
        
        await db.query('INSERT INTO groups(_chatid, _userid) VALUES($1, $2)',[
            _id, userId
        ])

        return res.status(200).json({message: "New member added successfully"});
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: 'Server Error'})
    }
})

// removing member
router.patch('/remove-member', authorization, masterOrAdminAuthorization, async(req, res) => {
    const { _id, userId } = req.body;
    try {
        await db.query('DELETE FROM groups WHERE _chatId = $1 AND _userId = $2',[
            _id, userId
        ])

        return res.status(200).json({message: "Member Removed"})
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: 'Server Error'})
    }
})

// deleting group
router.delete('/delete-group', authorization, masterOrAdminAuthorization, async(req, res)=> {
    const { _id } = req.body
    try {
        const chat = await db.query('SELECT * FROM chat WHERE _id = $1',[
            _id
        ])
        const isAdmin = chat.rows[0].groupadmin == req.user_id ? true : false
        if(!isAdmin)
            return res.status(401).json({message: 'You are not admin of this group'})
        
        await db.query('DELETE FROM groups WHERE _chatId = $1', [_id])
        await db.query('DELETE FROM chat WHERE _id = $1', [_id])

        return res.status(200).json({message: 'Group deleted successfully'})
    } catch (error) {
        console.log(error.message);
        return res.status(200).json({message: 'Server Error'})
    }
})


module.exports = router