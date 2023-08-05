const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const { changePassword } = require('../controllers/userController');
const { addInterested, removeInterested, getInterested } = require('../controllers/interestedController');

router.post('/interested/:eventId', authMiddleware, addInterested);
router.delete('/interested/:eventId', authMiddleware, removeInterested);
router.get('/interested', authMiddleware, getInterested);

router.put('/change-password', authMiddleware, changePassword);

module.exports = router;
