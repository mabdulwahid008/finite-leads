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
        let myChats = []
        for (let i = 0; i < chats.length; i++) {
            const chat = await db.query('SELECT * FROM chat where _id = $1',[
                chats.rows[i]._chatId
            ])
            myChats.push(chat.rows)
        }

        return res.status(200).json(chats.rows[0]._chatId)
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: 'Server Error'})
    }
})

module.exports = router