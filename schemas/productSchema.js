const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  cost: {
    type: Number,
    required: true,
  },
  sellerId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model('Products', productSchema);

module.exports = Product;
