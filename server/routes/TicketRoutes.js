// routes/TicketRoutes.js

const express = require('express');
const router = express.Router();

const {
    createTicket,
    getTicketById,
    getUserTickets
} = require('../controllers/TicketController');

const { authMiddleware } = require('../middleware/authMiddleware');

// ✅ Create a new ticket for an event (free event registration)
router.post('/', authMiddleware, createTicket);

// ✅ Get all tickets for the logged-in user
router.get('/my', authMiddleware, getUserTickets);

// ✅ Get a specific ticket by ID
router.get('/:id', authMiddleware, getTicketById);

module.exports = router;
