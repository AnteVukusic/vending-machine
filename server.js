const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const controllers = require('./controllers/controllers');
const routes = require('./constants/routes');

require('dotenv').config();

const server = express();
const port = process.env.PORT || 9999;

mongoose.connect(process.env.VM_APP_ATLAS_SERVER_CONNECTION_STRING, {
  useNewUrlParser: true, useUnifiedTopology: true,
});

server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

server.use(routes.USER, controllers.userController);
server.use(routes.PRODUCT, controllers.productController);

server.listen(port, () => {
  console.log(`Express app has run on port: ${port}`);
});
