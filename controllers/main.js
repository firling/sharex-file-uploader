const postFile = (req, res) => {

    console.log(req.filename);

    var url = "";
    if (req.body.secret != process.env.SECRET) url = "wrong secret";
    else url = `https://anquetil.org:3321/static/${req.filename}`;

    return res.status(200).json({
        success: true,
        url,
    });
}

module.exports = {
    postFile,
}