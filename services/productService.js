const productHelper = require('../helpers/productHelper');
const productRepository = require('../repository/productRepository');

const addProduct = async (productData, userId) => {
  const isDataValid = productHelper.validateProductModel(productData);
  if (!isDataValid) {
    return {
      err: {
        message: 'Product data is not valid',
        status: 400,
      },
    };
  }

  const product = await productRepository.getProduct({ productName: productData.productName });
  if (product) {
    return {
      err: {
        message: 'Product with that name already exists',
        status: 400,
      },
    };
  }

  return productRepository.postProduct({
    ...productData,
    sellerId: userId,
  });
};

const productService = {
  addProduct,
};

module.exports = productService;
