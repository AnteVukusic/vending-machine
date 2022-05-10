const Product = require('../schemas/productSchema');

const postProduct = async (data) => {
  try {
    const product = await Product.create(data);
    return { product };
  } catch (error) {
    return {
      err: {
        message: error,
        status: 500,
      },
    };
  }
};

const getProduct = async (query) => Product.findOne(({ ...query }));

const getProducts = async () => {
  try {
    const products = await Product.find().sort({ createdAt: 'desc' });
    return {
      products,
    };
  } catch (error) {
    return {
      err: {
        message: 'Error while returning products',
        status: 500,
      },
    };
  }
};

const putProduct = async (id, data) => {
  let product; let
    err;

  try {
    product = await Product.findOneAndUpdate(
      { _id: id },
      { ...data },
      { new: true },
    );
  } catch (error) {
    err = error;
  }
  return { product, err };
};

const deleteProduct = async (id) => {
  let product;
  let err;

  try {
    product = await Product.findOneAndDelete(
      { _id: id },
    );
  } catch (error) {
    err = error;
  }
  return { product, err };
};

const productRepository = {
  postProduct,
  getProduct,
  putProduct,
  deleteProduct,
  getProducts,
};

module.exports = productRepository;
