const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth'));
router.use('/itineraries', require('./itineraries'));

router.get('/health', (req, res) => res.json({ status: 'ok' }));

module.exports = router;
