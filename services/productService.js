const mongoose = require('mongoose');
const roles = require('../constants/roles');
const productHelper = require('../helpers/productHelper');
const productRepository = require('../repository/productRepository');
const userRepository = require('../repository/userRepository');

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

const buyProducts = async (purchaceData, buyerId) => {
  const isDataValid = productHelper.validatePurchaceModel(purchaceData);
  if (!isDataValid) {
    return {
      err: {
        message: 'Purchace form model is not valid',
        status: 400,
      },
    };
  }

  const { products } = await productRepository.getProducts({
    _id: {
      $in: purchaceData.products.map((p) => mongoose.Types.ObjectId(p.productId)),
    },
  });

  for (let i = 0; i < purchaceData.products.length; i++) {
    const purchaseDataProduct = purchaceData.products[i];
    const databaseProduct = products.find((p) => p._id === purchaseDataProduct.productId);
    if (purchaseDataProduct.amount > databaseProduct.amount) {
      return {
        err: {
          message: 'Product is out of stock',
        },
      };
    }
  }

  if (!products || products.length < purchaceData.products.length) {
    return {
      err: {
        message: 'Error while trying to purchase products',
        status: 500,
      },
    };
  }

  const { user } = await userRepository.getUser({ _id: buyerId });

  if (!user) {
    return {
      err: {
        message: 'Error while trying to retrieve buyer from database',
        status: 500,
      },
    };
  }

  const totalCost = productHelper.getTotalCost(products);

  if (user.deposit < purchaceData.moneyCount) {
    return {
      err: {
        message: 'User has not enough deposit to buy selected products',
        status: 400,
      },
    };
  }

  if (purchaceData.moneyCount < totalCost) {
    return {
      err: {
        message: 'You\'ve added insufficient amount to buy selected products',
        status: 400,
      },
    };
  }

  const bulkOperations = [];
  for (let i = 0; i < purchaceData.products.length; i++) {
    bulkOperations.push({
      updateOne: {
        filter: { _id: purchaceData.products[i].productId },
        update: {
          $inc: { amount: -purchaceData.products[i].amount },
        },
      },
    });
  }

  const productUpdateRes = await productRepository.bulkWrite(bulkOperations);
  if (productUpdateRes.err) {
    return {
      err: {
        message: 'Error while trying to buy selected products',
        status: 500,
      },
    };
  }

  const purchasedItems = purchaceData.products.map((p) => {
    const { amount, productId } = p;
    const productInfo = products.find((product) => product._id.toString() === productId);
    return {
      productName: productInfo.productName,
      amountBought: amount,
      cost: productInfo.cost,
      productId,
    };
  });

  const { userUpdateErr } = await userRepository.putUser(
    user.id,
    {
      deposit: user.deposit - totalCost,
      $push: {
        purchases: {
          purchaceTimestamp: Date.now(),
          items: purchasedItems,
        },
      },
    },
  );

  if (userUpdateErr) {
    return {
      err: {
        message: 'Error while trying to update user purchace hisotry',
        status: 500,
      },
    };
  }

  return {
    purchases: purchasedItems,
    moneyDifference: purchaceData.moneyCount - totalCost,
  };
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

const getProducts = async (sellerId) => {
  const query = sellerId && sellerId !== '' ? { sellerId } : {};
  const { products } = await productRepository.getProducts(query);
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
  buyProducts,
};

module.exports = productService;
