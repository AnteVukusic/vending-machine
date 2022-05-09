const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  deposit: {
    type: Number,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
});

const Product = mongoose.model('Users', productSchema);

module.exports = Product;
