const productModel = {
  type: 'object',
  properties: {
    amount: { type: 'number', minimum: 1 },
    cost: { type: 'number', minimum: 0.01 },
    productName: { type: 'string', minLength: 3 },
  },
  required: ['amount', 'cost', 'productName'],
};

const purchaceModel = {
  type: 'object',
  properties: {
    moneyCount: {
      type: 'number',
      minimum: 1,
    },
    products: {
      type: 'array',
      additionalItems: true,
      items: [
        {
          type: 'object',
          properties: {
            productId: {
              type:
               'string',
            },
            amount: {
              type: 'number',
              minimum: 1,
            },
          },
          required: ['productId', 'amount'],
        },
      ],
    },
  },
  required: ['products', 'moneyCount'],
};

const productModels = {
  productModel,
  purchaceModel,
};

module.exports = { productModels };
