const productModel = {
  type: 'object',
  properties: {
    amount: { type: 'number', minimum: 1 },
    cost: { type: 'number', minimum: 0.01 },
    productName: { type: 'string', minLength: 3 },
  },
  required: ['amount', 'cost', 'productName'],
};

const productModels = {
  productModel,
};

module.exports = { productModels };
