const express = require('express');
const protectedRouteAuth = require('../auth');
const roles = require('../constants/roles');
const productService = require('../services/productService');

const router = express.Router();
router.post('/add-product', protectedRouteAuth[roles.SELLER], async (req, res) => {
  console.log(req.user);
  const { product, err } = await productService.addProduct(req.body, req.user.id);

  if (err) {
    return res.status(err.status).json({ error: err.message });
  }

  return res.status(200).json({
    product,
  });
});

// todo: implement
router.post('/buy', async (req, res) => res.status(200).json({}));

module.exports = router;
