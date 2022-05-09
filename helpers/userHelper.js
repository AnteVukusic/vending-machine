const bcrypt = require('bcrypt');

const hashUserPassword = async (password) => bcrypt.hash(password, 10);

const userHelper = {
  hashUserPassword,
};

module.exports = userHelper;
