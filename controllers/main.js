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

module.exports = {
    postFile,
}
