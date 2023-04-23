const router = require("express").Router();
const path = require("path");

var multer  = require('multer')
var storage = multer.diskStorage({ 
    destination: './files/',
    filename: function (req, file, cb) {
        const filename = Math.random().toString(36).substring(7) + path.extname(file.originalname)
        req.filename = filename;
        cb(null, filename)
    }
});
const upload = multer({ storage })

const { postFile, getAllFile, deleteFile } = require("../controllers/main");
router.post('/postFile', upload.single('sharex'), postFile);
router.get('/getAllFile', getAllFile)
router.delete('/deleteFile', deleteFile)

module.exports = router;