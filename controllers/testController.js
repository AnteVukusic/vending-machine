const express = require('express');
const roles = require('../constants/roles');
const protectedRouteAuth = require('../auth');

const router = express.Router();

router.get('/admin-protected-route', protectedRouteAuth[roles.ADMIN], async (req, res) => res.status(200).json({ message: 'ok' }));
router.get('/seller-protected-route', protectedRouteAuth[roles.SELLER], async (req, res) => res.status(200).json({ message: 'ok' }));
router.get('/buyer-protected-route', protectedRouteAuth[roles.BUYER], async (req, res) => res.status(200).json({ message: 'ok' }));

module.exports = router;
