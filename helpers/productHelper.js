const Ajv = require('ajv');
const { productModels } = require('../models/productModels');

const ajv = new Ajv({ allErrors: true });

const validateProductModel = (loginData) => {
  const validate = ajv.compile(productModels.productModel);
  return validate(loginData);
};

const productHelper = {
  validateProductModel,
};

module.exports = productHelper;
