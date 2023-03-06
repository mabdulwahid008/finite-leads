const express = require('express')
const router = express.Router();
const db = require('../db')
const bcrypt = require('bcrypt')
const { date } = require('../date')
const jwt = require('jsonwebtoken')
const authorization = require('../middleware/authorization')
const masterOrAdminAuthorization = require('../middleware/masterOrAdminAuthorization')


// login 
router.post('/login', async(req, res) => {
    const { email, password } = req.body;
    try {
        const user = await db.query('SELECT * FROM users WHERE email = $1', [
            email
        ])

        if(user.rows.length === 0)
            return res.status(401).json({message: "Email is incorrect"})
        
        const comparePass = await bcrypt.compare(password, user.rows[0].password)

        if(!comparePass)
        return res.status(401).json({message: "Password is incorrect"})
    
        const payload = {
            user : {
                id: user.rows[0]._id,
                role: user.rows[0].role
            }
        }

        const token = jwt.sign(payload, process.env.SECERET_KEY)
        return res.status(200).json({token: token, role: user.rows[0].role, userId: user.rows[0]._id})
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: "Server Error"})
    }
})

// create User
router.post('/', authorization, masterOrAdminAuthorization, async(req, res) => {
    const { name, phone, email, address, password, role } = req.body
    try {
        const user = await db.query('SELECT * FROM users WHERE email = $1',[
            email
        ])
        if(user.rows.length > 0)
            return res.status(422).json({message: "User with this email already registered"})
    
        const salt = bcrypt.genSaltSync(10)
        const encryptedPass = bcrypt.hashSync(password, salt)

        const createUser = await db.query('INSERT INTO users(name, phone, email, address, password, role, created_at) VALUES($1, $2, $3, $4, $5, $6, $7)',[
            name, phone, email, address, encryptedPass, role, date
        ])
        return res.status(200).json({message: 'User Created'})
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: "Server Error"})
    }
})

// edit user
router.patch('/', authorization, masterOrAdminAuthorization, async(req, res) => {
    const { _id, name, phone, email, address, role } = req.body;
    try {
        console.log(role);
        let user = await db.query('SELECT * FROM users WHERE _id = $1',[
            _id
        ])
        if(user.rows.length === 0)
            return res.status(422).json({message: "User not found"})
        
        if(req.user_role === 3 && user.role >= 3){
            return res.status(401).json({message: 'You can\'t change data of users of this role'})
        }

        
        if(user.rows[0].email !== email){
             user = await db.query('SELECT * FROM users WHERE email = $1',[
                    email
                ])
            
            if(user.rows.length > 0)
                return res.status(422).json({message: "User with this email already registered"})
        }

        
        user = await db.query('UPDATE users SET name = $1, phone = $2, email = $3, address = $4, role = $5 WHERE _id = $6',[
            name, phone, email, address, role, _id
        ])

        return res.status(200).json({message: 'Successfully Updated user\'s data'})
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: 'Server Error'})
    }

})

// get all users 
router.get('/:role', authorization, masterOrAdminAuthorization, async(req, res) => {
    try {
        let users = []
        if(req.params.role != 99)
            users = await db.query('SELECT _id, name, email, phone, address, created_at, role FROM users WHERE role != 5 AND role = $1',[
                req.params.role
            ])
        else
            users = await db.query('SELECT _id, name, email, phone, address, created_at, role FROM users WHERE role != 5')

        return res.status(200).json(users.rows)    
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Server Error"})
    }
})

// get user details
router.post('/getdetails', async(req, res)=> {
    try {
        let user = await db.query('SELECT * FROM users WHERE email = $1',[
            req.body.email
        ])
        if(user.rows.length > 0)
            return res.status(422).json({message: 'User with this email exisis'})

        const salt = bcrypt.genSaltSync(10)
        const encryptedPass = bcrypt.hashSync(req.body.password, salt)

        await db.query('INSERT INTO users(name, phone, email, address, password, role, created_at) VALUES($1, $2, $3, $4, $5, $6, $7)',[
            req.body.name, req.body.phone, req.body.email, req.body.address, encryptedPass, req.body.role, date
        ])
        return res.status(200).json({message: 'Success'})
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: "Server Error"})
    }
})

// delete user
router.delete('/:id', authorization, masterOrAdminAuthorization, async(req, res) => {
    try {
        let user = await db.query('SELECT * FROM users WHERE _id = $1',[
            req.params.id
        ])
        if(user.rows.length === 0)
            return res.status(404).json({message: 'User Not Fount'})

        if(req.user_role === 3 && user.rows[0].role >= 3)
            return res.status(401).json({message: 'You can\'t delete users of this role'})
        
        await db.query('DELETE FROM users WHERE _id = $1', [
            req.params.id
        ])

        return res.status(200).json({message: 'User deleted successfully'})
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: "Server Error"})
    }
})

//for admin and master to add sale for sale agents
router.get('/', authorization, async(req, res)=> {
    try {
        const salesAgent = await db.query('SELECT _id, name From users WHERE role = 0')
        return res.status(200).json(salesAgent.rows)
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: 'Server Error'})
    }
})


module.exports = router