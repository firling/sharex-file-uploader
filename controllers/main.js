const fs = require('fs');

const postFile = (req, res) => {

    var url = "";
    if (req.body.secret != process.env.SECRET) url = "wrong secret";
    else url = `${process.env.URL}/static/${req.filename}`;

    console.log(url);

    return res.status(200).json({
        success: true,
        url,
    });
}

const getAllFile = (req, res) => {
    fs.readdir('./files', (err, files) => {
        if (err) return res.status(500).json({ success: false, error: err });
        return res.status(200).json({ success: true, files });
    });
}

const deleteFile = (req, res) => {
    fs.unlink(`./files/${req.params.filename}`, (err) => {
        if (err) return res.status(500).json({ success: false, error: err });
        return res.status(200).json({ success: true });
    });
}

module.exports = {
    postFile, getAllFile, deleteFile
}
