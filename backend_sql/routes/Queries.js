const express = require('express')
const authorization = require('../middleware/authorization')
const db = require('../db')
const router = express.Router()


// posting 
router.post('/', authorization, async(req, res) => {
    const { content, reciever_id } = req.body
    try {
        if(req.user_role != 2){
            await db.query('INSERT INTO QUERIES(content, sender_id, reciever_id) VALUES ($1, $2, $3)', [
                content, req.user_id, reciever_id
            ])
        }
        else
            await db.query('INSERT INTO QUERIES(content, sender_id) VALUES ($1, $2)', [
                content, req.user_id
            ])

        return res.status(200).json({})
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: error.message})
    }
})


// get queries of single person with admin
router.get('/', authorization, async(req, res)=> {
    try {
        const messages = await db.query('SELECT * FROM QUERIES WHERE sender_id =$1 OR reciever_id = $1', [
            req.user_id
        ])
        return res.status(200).json(messages.rows)
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: error.message})
    }
})



module.exports = router