
const onlyMaster = (req, res, next) => {
    if(req.user_role !== 5)
        return res.status(401).json({message: "Only master have this privilege"})
    else
        next()
}

module.exports = onlyMaster