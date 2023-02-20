const express = require("express")
const User = require("../models/User")
const bcrypt = require('bcrypt')
const router = express.Router()
const jwt = require("jsonwebtoken")
const authorization = require('../middleware/authorization')
const masterOrAdminAuthorization = require("../middleware/masterOrAdminAuthorization")


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

// create user 
router.post('/', authorization, masterOrAdminAuthorization, async(req,res) => {
    const { name, phone, email, address, password, role } = req.body
    try {
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

// edit user
router.patch('/', authorization, masterOrAdminAuthorization, async(req, res)=>{
    const { id, name, phone, email, address, role } = req.body;
    try {
        const user = await User.findOne({id: id})
        if(!user)
            return res.status(401).json({message: 'User Not Fount'})
        
        user.name = name;
        user.email = email;
        user.phone = phone;
        user.address = address;
        user.role = role;

        await user.save();

        return res.status(200).json({message: 'Successfully Updated  user\'s data'})
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Server Error"})
    }
})

// get all users
router.get('/:role', authorization, masterOrAdminAuthorization, async(req, res)=> {
    try {
        let users = []
        console.log(req.params.role);
        if(req.params.role != 99)
            users = await User.find({role: req.params.role}, {password: 0});
        else    
            users = await User.find({}, {password: 0});

        return res.status(200).json(users)
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Server Error"})

    }
})

// deleteUser
router.delete('/:id', authorization, masterOrAdminAuthorization, async(req, res)=> {
    try {
        await User.deleteOne({_id: req.params.id})
        return res.status(200).json({message: 'User deleted successfully'})
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Server Error"})
    }
})


module.exports = router