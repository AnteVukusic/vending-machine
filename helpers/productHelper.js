const Ajv = require('ajv');
const { productModels } = require('../models/productModels');

const ajv = new Ajv({
  allErrors: true,
});

const validateProductModel = (productData) => {
  const validate = ajv.compile(productModels.productModel);
  return validate(productData);
};

const validatePurchaceModel = (purchaceData) => {
  const validate = ajv.compile(productModels.purchaceModel);
  return validate(purchaceData);
};

const getTotalCost = (products) => {
  let ret = 0;
  for (let i = 0; i < products.length; i++) {
    ret += products[i].cost;
  }
  return ret;
};

const productHelper = {
  validateProductModel,
  validatePurchaceModel,
  getTotalCost,
};

module.exports = productHelper;
