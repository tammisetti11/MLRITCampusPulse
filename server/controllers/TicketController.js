
const Ticket = require('../models/Ticket');
const Event = require('../models/Event');
const User = require('../models/User');
const crypto = require('crypto');

// Generate a new event ticket (used when user registers for a free event)
exports.createTicket = async (req, res) => {
    const { eventId } = req.body;
    const userId = req.user?._id; // Make sure user is authenticated

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized. Please login first.' });
    }
    try {
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check if user already has a ticket for the same event
        const existingTicket = await Ticket.findOne({ userId, eventId });
        if (existingTicket) {
            return res.status(400).json({ message: 'You have already registered for this event.', ticketId: existingTicket._id });
        }

        const paymentStatus = event.price > 0 ? "Paid" : "Free";

        // Generate a unique 8-character alphanumeric ticket code
        const uniqueCode = crypto.randomBytes(4).toString('hex').toUpperCase();

        const newTicket = new Ticket({
            userId,
            eventId,
            paymentStatus,
            uniqueCode,
        });

        await newTicket.save();

        res.status(201).json({
            message: `Ticket created successfully for ${event.title}`,
            ticket: newTicket,
            ticketId: newTicket._id,
        });
    } catch (error) {
        console.error("Create ticket error:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
// Get ticket by ID (used to view a ticket)
exports.getTicketById = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id)
            .populate('eventId') // Optional: populate event details
            .populate('userId', 'name email'); // Optional: populate user details

        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" });
        }

        res.status(200).json(ticket);
    } catch (error) {
        console.error("Error fetching ticket:", error);
        res.status(500).json({ message: "Server error" });
    }
};


exports.getUserTickets = async (req, res) => {
    const userId = req.user._id;
    const tickets = await Ticket.find({ userId }).populate("eventId");
    res.json(tickets);
};