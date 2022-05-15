const bcrypt = require('bcryptjs');
const Ajv = require('ajv');
const jwt = require('jsonwebtoken');
const { userModels } = require('../models/userModels');

const ajv = new Ajv({ allErrors: true, $data: true });

const hashUserPassword = async (password) => bcrypt.hash(password, 10);

const validateRegisterModel = (registerData) => {
  const validate = ajv.compile(userModels.registerModel);
  return validate(registerData);
};

const validateLoginModel = (loginData) => {
  const validate = ajv.compile(userModels.loginModel);
  return validate(loginData);
};

const generateClientUserModel = (user) => ({
  purchases: user.purchases,
  id: user._id,
  name: user.name,
  deposit: user.deposit,
  role: user.role,
});

const generateSessionToken = (user) => jwt.sign({
  id: user.id,
  role: user.role,
  user: generateClientUserModel(user),
  expiresAt: Date.now() + 8 * 2600 * 1000,
  timestamp: Date.now(),
}, process.env.VM_APP_JWT_SECRET, {
  expiresIn: '8h',
});

const doPasswordsMatch = async (plain, cipher) => bcrypt.compare(plain, cipher);

const generateClientUsersModel = (users) => {
  const ret = [];
  for (let i = 0; i < users.length; i++) {
    ret.push(generateClientUserModel(users[i]));
  }
  return ret;
};

const userHelper = {
  hashUserPassword,
  validateRegisterModel,
  validateLoginModel,
  generateSessionToken,
  doPasswordsMatch,
  generateClientUserModel,
  generateClientUsersModel,
};

module.exports = userHelper;
