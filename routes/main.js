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

const { postFile } = require("../controllers/main");
router.post('/postFile', upload.single('sharex'), postFile);

module.exports = router;