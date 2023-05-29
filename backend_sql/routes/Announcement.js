const express = require('express')
const authorization = require('../middleware/authorization')
const masterOrAdminAuthorization = require('../middleware/masterOrAdminAuthorization')
const db = require('../db')
const imageUpload = require('../middleware/uploadProfle')
const { dateWithoutTime } = require('../date')
const router = express.Router()

// create
router.post('/', authorization, masterOrAdminAuthorization, imageUpload.single('image'), async(req, res) => {
    const { for_user_role } = req.body
    try {
        await db.query('INSERT INTO ANNOUNCEMENTS(image, for_user_role, created_at) VALUES($1, $2, $3)',[
            req.file.path, for_user_role, dateWithoutTime
        ])
        return res.status(200).json({message: 'Announcemnet shared'})
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message:'Server Error'})
    }
})

// get 
router.get('/', authorization, async(req, res) => {
    try {
        const user = await db.query('SELECT * FROM USERS WHERE _id = $1',[req.user_id])

        const announcement = await db.query('SELECT * FROM ANNOUNCEMENTS WHERE for_user_role = $1 ORDER BY _id DESC',[
            user.rows[0].role
        ])
        return res.status(200).json(announcement.rows)
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: 'Server Error'})
    }
})

// delete
router.delete('/:id', authorization, masterOrAdminAuthorization, async(req, res)=>{
    try {
        await db.query('DELETE FROM ANNOUNCEMENTS WHERE _id = $1', [req.params.id])
        return res.status(500).json({message: 'Server Error'})
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: 'Server Error'})
    }
})
module.exports = router