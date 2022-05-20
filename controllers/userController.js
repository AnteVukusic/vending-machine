const express = require('express');
const protectedRouteAuth = require('../auth');
const roles = require('../constants/roles');
const userHelper = require('../helpers/userHelper');
const userService = require('../services/userService');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { user, err } = await userService.registerUser(req.body);

  if (err) {
    return res.status(err.status).json({ error: err.message });
  }

  return res.status(200).json({
    user: userHelper.generateClientUserModel(user),
    token: userHelper.generateSessionToken(user),
  });
});

router.post('/login', async (req, res) => {
  const { user, err } = await userService.loginUser(req.body);

  if (err) {
    return res.status(err.status).json({ error: err.message });
  }

  return res.status(200).json({
    user: userHelper.generateClientUserModel(user),
    token: userHelper.generateSessionToken(user),
  });
});

router.get('/get-users', protectedRouteAuth[roles.ADMIN], async (req, res) => {
  const { users, err } = await userService.getUsers();

  if (err) {
    return res.status(err.status).json({ error: err.message });
  }

  return res.status(200).json({
    users: userHelper.generateClientUsersModel(users),
  });
});

router.get('/get-user/:id', protectedRouteAuth[roles.ANY], async (req, res) => {
  const { user, err } = await userService.getUser(req.params.id, req.user);

  if (err) {
    return res.status(err.status).json({ error: err.message });
  }

  return res.status(200).json({
    user: userHelper.generateClientUserModel(user),
  });
});

router.get('/get-purchases/:id', protectedRouteAuth[roles.ANY], async (req, res) => {
  const { purchases, err } = await userService.getUserPurchases(req.params.id, req.user);

  if (err) {
    return res.status(err.status).json({ error: err.message });
  }

  return res.status(200).json({
    purchases,
  });
});

router.post('/deposit', protectedRouteAuth[roles.BUYER], async (req, res) => {
  // Sending userId in body if we wan't to have option for admin >
  // to have posiblity to add deposit to some account, with no userId >
  // in body we would need two routes for same logic
  const { user, err } = await userService.depositMoney(req.body.amount, req.body.userId, req.user);

  if (err) {
    return res.status(err.status).json({ error: err.message });
  }

  return res.status(200).json({
    message: 'ok',
    user,
  });
});

router.post('/reset', protectedRouteAuth[roles.BUYER], async (req, res) => {
  const { err } = await userService.resetDeposit(req.body.userId, req.user);

  if (err) {
    return res.status(err.status).json({ error: err.message });
  }

  return res.status(200).json({
    message: 'ok',
  });
});

module.exports = router;
