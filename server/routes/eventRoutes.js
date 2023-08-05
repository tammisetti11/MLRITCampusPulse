// server/routes/eventRoutes.js

const express = require('express');
const router = express.Router();

const {
  createEvent,
  getAllEvents,
  getUpcomingEvents,
  getOngoingEvents,
  getEventById,
  updateEvent,
  deleteEvent
} = require('../controllers/eventController');

const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

// ------------------ PUBLIC ROUTES ------------------

// Get all events
router.get('/', getAllEvents);

// Get upcoming events
router.get('/upcoming', getUpcomingEvents);

// Get ongoing events
router.get('/ongoing', getOngoingEvents);

// Get a single event by ID (for Event Details page)
router.get('/:id', getEventById);

// ------------------ ADMIN PROTECTED ROUTES ------------------

// Create a new event
const upload = require('../middleware/upload');

router.post(
    '/',
    authMiddleware,
    adminMiddleware,
    upload.single('image'),   // <--- ADD THIS
    createEvent
);

router.post('/', authMiddleware, adminMiddleware, createEvent);

// Update an event
router.put('/:id', authMiddleware, adminMiddleware, updateEvent);

// Delete an event
router.delete('/:id', authMiddleware, adminMiddleware, deleteEvent);

module.exports = router;
