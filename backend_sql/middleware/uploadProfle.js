const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, './profileImages')
    },
    filename: (req, file, cb)=>{
        cb(null, new Date().getTime() + file.originalname )
    }
})

const filterFile = (req, file, cb) =>{
    if(file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg' || file.mimetype == 'image/png' || file.mimetype == 'application/pdf')
        cb(null, true)
    else
        cb(null, false)
}
const imageUpload = multer({
    storage: storage,
    fileFilter: filterFile,
    limits : 1024 * 1024 *2 //2MB
})

module.exports = imageUpload;