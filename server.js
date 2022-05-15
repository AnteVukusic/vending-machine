const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const controllers = require('./controllers/controllers');
const routes = require('./constants/routes');

require('dotenv').config();

const server = express();
const port = process.env.PORT || 9999;

server.use(cors({
  origin: process.env.VM_APP_CLIENT_URL.toString(),
}));

mongoose.connect(process.env.VM_APP_ATLAS_SERVER_CONNECTION_STRING, {
  useNewUrlParser: true, useUnifiedTopology: true,
});

server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

server.use(routes.USER, controllers.userController);
server.use(routes.PRODUCT, controllers.productController);
server.use(routes.TEST, controllers.testController);

server.get('/', (req, res) => {
  res.send('Vending machine app server');
});

server.listen(port, () => {
  console.log(`Express app has run on port: ${port}`);
});
