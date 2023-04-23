const express = require("express");
require('dotenv').config()
const cors = require("cors");
const path = require('path');

const app = express();
const port = process.env.PORT || 3321;

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors());

const mainRouter = require('./routes/main');

app.use('/api', mainRouter);
app.use('/static', express.static(__dirname + "/files"));

app.use('/assets', express.static(__dirname + "/mediaManager/dist/assets"))

app.get('/manager/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'mediaManager', 'dist', 'index.html'));
})

app.listen(port, () => {
  console.log(`Web server is running on port ${port}`);
})
