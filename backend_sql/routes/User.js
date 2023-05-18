const express = require('express')
const router = express.Router();
const db = require('../db')
const bcrypt = require('bcrypt')
const { date } = require('../date')
const jwt = require('jsonwebtoken')
const authorization = require('../middleware/authorization')
const masterOrAdminAuthorization = require('../middleware/masterOrAdminAuthorization')
const authorizationn = require('../middleware/authorizationn');
const uploadProfle = require('../middleware/uploadProfle');


// checking if user is gets deactivated if yes then removing token from localstorage 
router.get('/authenticate', authorization, async(req, res) => {
    try{

    } catch (error){
        console.log(error.message);
    }
})

// login 
router.post('/login', async(req, res) => {
    const { email, password } = req.body;
    try {
        const user = await db.query('SELECT * FROM users WHERE email = $1', [
            email
        ])

        if(user.rows.length === 0)
            return res.status(401).json({message: "Email is incorrect"})

        if(user.rows[0].active == 0)
            return res.status(401).json({message: "You are not user of this system anymore"})
        
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
        return res.status(200).json({token: token, role: user.rows[0].role, userId: user.rows[0]._id, profile_image: user.rows[0].profile_image})
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: "Server Error"})
    }
})

// create User
router.post('/', authorization, masterOrAdminAuthorization, async(req, res) => {
    const { name, phone, email, address, password, role, brokerage_name, broker_name, office_phone, city, country, zip_code, state,  service_radius, re_license_no, rep } = req.body
    try {
        const user = await db.query('SELECT * FROM users WHERE email = $1',[
            email
        ])
        if(user.rows.length > 0)
            return res.status(422).json({message: "User with this email already registered"})
    
        const salt = bcrypt.genSaltSync(10)
        const encryptedPass = bcrypt.hashSync(password, salt)

        // sale agent
        if(role == 0){
            const createUser = await db.query('INSERT INTO users(name, phone, email, address, password, role, created_at) VALUES($1, $2, $3, $4, $5, $6, $7)',[
                name, phone, email, address, encryptedPass, role, date
            ])
        }
        // RE agnet
        if(role == 2){
            const createUser = await db.query('INSERT INTO users(name, phone, email, address, password, role, created_at, brokerage_name, broker_name, office_phone, city, country, zip_code, state, service_radius, re_license_no, rep) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)',[
                name, phone, email, address, encryptedPass, role, date, brokerage_name, broker_name, office_phone, city, country, zip_code, state, service_radius, re_license_no, rep
            ])
        }
        return res.status(200).json({message: 'User Created'})
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: "Server Error"})
    }
})

// edit user
router.patch('/', authorization, masterOrAdminAuthorization, async(req, res) => {
    const { _id, name, phone, email, address, role, brokerage_name, broker_name, office_phone, city, country, zip_code, state,  service_radius, re_license_no, service_areas, rep } = req.body;
    try {
        console.log(req.body);
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

        
        user = await db.query('UPDATE users SET name = $1, phone = $2, email = $3, address = $4, role = $5, brokerage_name = $6, broker_name  = $7, office_phone = $8, city = $9, country = $10, zip_code = $11, state = $12,  service_radius = $13, re_license_no = $14, service_areas = $15, rep = $16 WHERE _id = $17',[
            name, phone, email, address, role, brokerage_name, broker_name, office_phone, city, country, zip_code, state,  service_radius, re_license_no, service_areas, rep, _id
        ])

        return res.status(200).json({message: 'Successfully Updated user\'s data'})
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: 'Server Error'})
    }

})

// get users by role
router.get('/:role', authorization, masterOrAdminAuthorization, async(req, res) => {
    try {
        let users = []
        if(req.params.role != 99)
            users = await db.query('SELECT _id, name, email, phone, address, state, zip_code, service_areas, service_radius, active, created_at, role FROM users WHERE role != 5 AND role = $1 AND active = 1 ORDER BY _id DESC',[
                req.params.role
            ])
        else
            users = await db.query('SELECT _id, name, email, phone, address, active, created_at, role FROM users WHERE role != 5 AND active = 1 ORDER BY _id DESC')

        users = users.rows.filter((user) => user._id != req.user_id)
        return res.status(200).json(users)    
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Server Error"})
    }
})

// get users for admin listing section
router.get('/listing/:role', authorization, masterOrAdminAuthorization, async(req, res) => {
    try {
        let users = []
        if(req.params.role != 99)
            users = await db.query('SELECT _id, name, email, phone, address, state, zip_code, service_areas, service_radius, active, created_at, role FROM users WHERE role != 5 AND role = $1 ORDER BY _id DESC',[
                req.params.role
            ])
        else
            users = await db.query('SELECT _id, name, email, phone, address, active, created_at, role FROM users WHERE role != 5 ORDER BY _id DESC')

        users = users.rows.filter((user) => user._id != req.user_id)
        return res.status(200).json(users)    
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Server Error"})
    }
})

// get single user
router.get('/get-single/:id', authorization, masterOrAdminAuthorization, async(req, res) => {
    try {
        const user = await db.query('SELECT * From Users WHERE _id = $1', [req.params.id])
        return res.status(200).json(user.rows[0])
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

// deactivate user
router.patch('/deactivate/:id', authorization, masterOrAdminAuthorization, async(req, res) => {
    try {
        let user = await db.query('SELECT * FROM users WHERE _id = $1',[
            req.params.id
        ])
        if(user.rows.length === 0)
            return res.status(404).json({message: 'User Not Fount'})

        if(req.user_role === 3 && user.rows[0].role >= 3)
            return res.status(401).json({message: 'You can\'t deactivate users of this role'})
        
        await db.query('UPDATE USERS SET active = $1 WHERE _id = $2',[
            0, req.params.id
        ])

        return res.status(200).json({message: 'User deactivated successfully'})
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: "Server Error"})
    }
})

// activate user
router.patch('/activate/:id', authorization, masterOrAdminAuthorization, async(req, res) => {
    try {
        let user = await db.query('SELECT * FROM users WHERE _id = $1',[
            req.params.id
        ])
        if(user.rows.length === 0)
            return res.status(404).json({message: 'User Not Fount'})

        if(req.user_role === 3 && user.rows[0].role >= 3)
            return res.status(401).json({message: 'You can\'t activate users of this role'})
        
        await db.query('UPDATE USERS SET active = $1 WHERE _id = $2',[
            1, req.params.id
        ])

        return res.status(200).json({message: 'User activated successfully'})
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: "Server Error"})
    }
})

// dete admin
router.delete('/admin/delete', authorizationn, async(req, res) => {
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

// user to get his data for my Profile component
router.get('/profile/data', authorization, async(req, res) => {
    try {
        const data = await db.query('SELECT * FROM USERS WHERE _id = $1',[
            req.user_id
        ])
        return res.status(200).json(data.rows[0])
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message:'Server Error'})
    }
})

// user to change his password
router.patch('/update-pass', authorization, async(req, res) => {
    const { old_pass, new_pass } = req.body
    try {
        const user = await db.query('SELECT password FROM USERS WHERE _id = $1', [req.user_id])
        const comparePass = await bcrypt.compare(old_pass, user.rows[0].password)

        if(!comparePass)
            return res.status(401).json({message: "Old Password is incorrect"})
        
        const salt = bcrypt.genSaltSync(10)
        const encryptedPass = bcrypt.hashSync(new_pass, salt)

        await db.query('UPDATE users SET password = $1 WHERE _id = $2',[
            encryptedPass, req.user_id
        ])

        return res.status(200).json({message: "Password Updated"})
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message:'Server Error'})
    }
})

// user to upload his profile
router.patch('/upload-profile', authorization, uploadProfle.single('image'), async(req, res) => {
    try {
        await db.query('UPDATE users SET profile_image = $1 WHERE _id = $2', [
            req.file.path, req.user_id
        ])
        return res.status(200).json({message: 'Profile image updated'})
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message:'Server Error'})
    }
})


// get Service Areas of RE AGENT 
router.get('/service-areas/:id', authorization, async(req, res) => {
    try {
        const areas = await db.query('SELECT lat, long FROM SERVICE_AREAS WHERE realEstateAgent_id = $1', [
            req.params.id
        ]) 
        return res.status(200).json(areas.rows)
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: 'Server Error'}) 
    }
})

// admin to update service areas of RE agent
router.post('/service-areas', authorization, masterOrAdminAuthorization, async(req, res) => {
    const { agentId, areas } = req.body
    try {
        // removing pervious areas
        await db.query('DELETE FROM SERVICE_AREAS WHERE realEstateAgent_id = $1',[
            agentId
        ])
        // updating new areas which arw modified on frontend
        for (let i = 0; i < areas.length; i++) {
            await db.query('INSERT INTO SERVICE_AREAS(lat, long, realEstateAgent_id) VALUES ($1, $2, $3)',[
                areas[i].lat, areas[i].long, agentId
            ])
        }
        return res.status(200).json({message: 'Service Areas Updated'})
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: 'Server Error'})
    }
})


module.exports = router