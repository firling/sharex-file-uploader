const express = require("express");
const https = require("https");
//const fs = require("fs");
require('dotenv').config()
const cors = require("cors");
var bodyParser = require('body-parser')


const app = express();
const port = process.env.PORT || 3321;

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors());

const mainRouter = require('./routes/main');

app.use('/api', mainRouter);
app.use('/static', express.static(__dirname + "/files"));

app.listen(port, () => {
  console.log(`Web server is running on port ${port}`);
})
