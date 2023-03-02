
const masterOrAdminAuthorization = (req, res, next) => {
    if(req.user_role !== 5 && req.user_role !== 3)
        return res.status(401).json({message: "Unauthorized Attempt"})
    else
        next()
}

module.exports = masterOrAdminAuthorization