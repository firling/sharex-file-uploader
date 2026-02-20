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

const authMiddleware = require("../middleware/auth");
const { login } = require("../controllers/auth");
const { postFile, getAllFile, deleteFile, uploadFile } = require("../controllers/main");

router.post('/login', login);
router.post('/postFile', upload.single('sharex'), postFile);
router.get('/getAllFile', authMiddleware, getAllFile);
router.delete('/deleteFile/:filename', authMiddleware, deleteFile);
router.post('/uploadFile', authMiddleware, upload.single('file'), uploadFile);

module.exports = router;
