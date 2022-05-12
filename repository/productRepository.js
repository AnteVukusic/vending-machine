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

const getProducts = async (query) => {
  try {
    const products = await Product.find(query).sort({ createdAt: 'desc' });
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
  try {
    const product = await Product.findOneAndUpdate(
      { _id: id },
      { ...data },
      { new: true }, // Ensures return of freshly updated object
    );
    return {
      product,
    };
  } catch (error) {
    return {
      err: {
        message: 'Error while updating product in database',
        status: 500,
      },
    };
  }
};

const deleteProduct = async (id) => {
  try {
    return await Product.findOneAndDelete(
      { _id: id },
    );
  } catch (error) {
    return {
      err: {
        message: 'Error while deleting product in database',
        status: 500,
      },
    };
  }
};

const bulkWrite = async (operations) => {
  try {
    await Product.bulkWrite(operations);
    return {};
  } catch (error) {
    return {
      err: {
        message: 'Error while updating products',
        status: 500,
      },
    };
  }
};

const productRepository = {
  postProduct,
  getProduct,
  putProduct,
  deleteProduct,
  getProducts,
  bulkWrite,
};

module.exports = productRepository;
