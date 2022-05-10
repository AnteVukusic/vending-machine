const express = require('express');
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

module.exports = router;
