const jwt = require("jsonwebtoken")
require("dotenv").config()

const authorization = async(req, res, next) => {
    try {
        const token = req.header('token')
        if(!token)
        return res.status(401).json({message: "Unauthorized Attempt"})
        
        const user = await jwt.verify(token, process.env.SECERET_KEY)
        req.user_id = user.user.id
        req.user_role = user.user.role
        next()

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Server Error"})
    }
}

module.exports = authorization