const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const server = express();
const port = process.env.PORT || 9999;

server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

server.listen(port, () => {
  console.log(`Express app has run on port: ${port}`);
});
