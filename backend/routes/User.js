const express = require("express")
const User = require("../models/User")
const bcrypt = require('bcrypt')
const router = express.Router()
const jwt = require("jsonwebtoken")
const authorization = require('../middleware/authorization')


// create user 
// have to pass authorization
router.post('/', authorization, async(req,res) => {
    const { name, phone, email, address, password, role } = req.body
    try {
        if(req.user_role !== 5 && req.user_role !== 3)
            return res.status(401).json({message: "Unauthorized Attempt"})

        const user = await User.findOne({email: email})
        if(user)
            return res.status(422).json({message: "User with this email already registered"})
        
        const salt = bcrypt.genSaltSync(10)
        const encryptedPass = bcrypt.hashSync(password, salt)

        User.create({
            name: name,
            phone: phone,
            email: email,
            address: address,
            password: encryptedPass,
            role: role
        })

        return res.status(200).json({message: "User Created"})
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Server Error"})
    }
})

// login
router.post('/login', async(req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({email: email})
        if(!user)
            return res.status(401).json({message: "Email is incorrect"})

        const comparePass = await bcrypt.compare(password, user.password)
        if(!comparePass)
            return res.status(401).json({message: "Password is incorrect"})
        
        const payload = {
            user : {
                id: user.id,
                role: user.role
            }
        }

        const token = jwt.sign(payload, process.env.SECERET_KEY)
        return res.status(200).json({token: token, role: user.role})
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Server Error"})
    }
})

//edit user
router.patch('/', async(req, res)=>{

})

module.exports = router