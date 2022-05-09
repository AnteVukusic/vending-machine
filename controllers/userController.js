const express = require('express');
const userRepository = require('../repository/userRepository');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { user, err } = await userRepository.postUser(req.body);

  if (err) {
    return res.status(err.status).json({ error: err.message });
  }

  return res.status(200).json({
    user,
  });
});

module.exports = router;
