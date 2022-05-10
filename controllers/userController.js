const express = require('express');
const protectedRouteAuth = require('../auth');
const roles = require('../constants/roles');
const userService = require('../services/userService');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { user, err } = await userService.registerUser(req.body);

  if (err) {
    return res.status(err.status).json({ error: err.message });
  }

  return res.status(200).json({
    user,
  });
});

router.post('/login', async (req, res) => {
  const { user, token, err } = await userService.loginUser(req.body);

  if (err) {
    return res.status(err.status).json({ error: err.message });
  }

  return res.status(200).json({
    user,
    token,
  });
});

router.get('/get-users', protectedRouteAuth[roles.ADMIN], async (req, res) => {
  const { users, err } = await userService.getUsers();

  if (err) {
    return res.status(err.status).json({ error: err.message });
  }

  return res.status(200).json({
    users,
  });
});

module.exports = router;
