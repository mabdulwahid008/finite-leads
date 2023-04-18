
const realEstateAutorization = (req, res, next) => {
    if(req.user_role !== 5 && req.user_role !== 2)
        return res.status(401).json({message: "Unauthorized Attempt"})
    else
        next()
}

module.exports = realEstateAutorization