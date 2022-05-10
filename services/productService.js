const roles = require('../constants/roles');
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

const getProduct = async (productId) => {
  const product = await productRepository.getProduct({ id: productId });
  if (!product) {
    return {
      err: {
        message: `No product found with provided id: ${productId}`,
        status: 400,
      },
    };
  }

  return {
    product,
  };
};

const getProducts = async () => {
  const { products } = await productRepository.getProducts();
  if (!products) {
    return {
      err: {
        message: 'No products found',
        status: 400,
      },
    };
  }

  return {
    products,
  };
};

const updateProduct = async (productData, user) => {
  const product = await productRepository.getProduct({ id: productData.id });
  if (!product) {
    return {
      err: {
        message: `No product found with provided id: ${productData.id}`,
        status: 400,
      },
    };
  }

  if (user.role !== roles.ADMIN && product.sellerId !== user.id) {
    return {
      err: {
        message: 'Cannot update product',
        status: 400,
      },
    };
  }

  return productRepository.putProduct(productData.id, productData);
};

const deleteProduct = async (productId, user) => {
  const product = await productRepository.getProduct({ id: productId });
  if (!product) {
    return {
      err: {
        message: `No product found with provided id: ${productId.id}`,
        status: 400,
      },
    };
  }

  if (user.role !== roles.ADMIN && product.sellerId !== user.id) {
    return {
      err: {
        message: 'User does not own targeted product',
        status: 400,
      },
    };
  }

  return productRepository.deleteProduct(productId);
};

const productService = {
  addProduct,
  getProduct,
  getProducts,
  updateProduct,
  deleteProduct,
};

module.exports = productService;
