const express = require("express");
const https = require("https");
const fs = require("fs");
require('dotenv').config()
const cors = require("cors");

const privateKey  = fs.readFileSync(process.env.SSL_PATH + 'privkey.pem', 'utf8');
const certificate = fs.readFileSync(process.env.SSL_PATH + 'fullchain.pem', 'utf8');
const credentials = {key: privateKey, cert: certificate};

const app = express();
const port = process.env.PORT || 3321;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const mainRouter = require('./routes/main');

app.use('/api', mainRouter);
app.use('/static', express.static(__dirname + "/files"));

const serverSSL = https.createServer(credentials, app);

serverSSL.listen(port, () => {
  console.log(`Web server is running on port ${port}`);
})