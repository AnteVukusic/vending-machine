const express = require('express');
const protectedRouteAuth = require('../auth');
const roles = require('../constants/roles');
const productService = require('../services/productService');

const router = express.Router();

router.post('/add-product', protectedRouteAuth[roles.SELLER], async (req, res) => {
  const { product, err } = await productService.addProduct(req.body, req.user.id);

  if (err) {
    return res.status(err.status).json({ error: err.message });
  }

  return res.status(200).json({
    product,
  });
});

router.get('/get-product/:id', protectedRouteAuth[roles.ANY], async (req, res) => {
  const { product, err } = await productService.getProduct(req.params.id);

  if (err) {
    return res.status(err.status).json({ error: err.message });
  }

  return res.status(200).json({
    product,
  });
});

router.get('/get-products', protectedRouteAuth[roles.ANY], async (req, res) => {
  const { products, err } = await productService.getProducts();

  if (err) {
    return res.status(err.status).json({ error: err.message });
  }

  return res.status(200).json({
    products,
  });
});

router.put('/update-product', protectedRouteAuth[roles.SELLER], async (req, res) => {
  const { product, err } = await productService.updateProduct(req.body, req.user);

  if (err) {
    return res.status(err.status).json({ error: err.message });
  }

  return res.status(200).json({
    product,
  });
});

router.delete('/delete-product/:id', protectedRouteAuth[roles.SELLER], async (req, res) => {
  const { err } = await productService.deleteProduct(req.params.id, req.user);

  if (err) {
    return res.status(err.status).json({ error: err.message });
  }

  return res.status(200).json({
    message: 'ok',
  });
});

// todo: implement
router.post('/buy', protectedRouteAuth[roles.BUYER], async (req, res) => {
  const { err } = await productService.buyProducts(req.body, req.user.id);

  if (err) {
    return res.status(err.status).json({ error: err.message });
  }

  return res.status(200).json({
    message: 'ok',
  });
});

module.exports = router;
