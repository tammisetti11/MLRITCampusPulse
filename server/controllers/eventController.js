const Event = require('../models/Event');
exports.createEvent = async (req, res) => {
    try {
        // Optional debug to see received data
        console.log("Received body:", req.body);
        console.log("Received file:", req.file);

        const {
            title,
            description,
            category,
            organizer,
            startDate,
            endDate,
            location,
            price,
            capacity,
            time
        } = req.body;

        const image = req.file ? req.file.path : ""; // Get Cloudinary URL if uploaded

        const event = new Event({
            title,
            description,
            category,
            organizer,
            startDate,
            endDate,
            location,
            price,
            capacity,
            time,
            image
        });

        await event.save();
        res.status(201).json(event);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: err.message });
    }
};


// Get all events (sorted by startDate ascending)
exports.getAllEvents = async (req, res) => {
    try {
        const events = await Event.find().sort({ startDate: 1 });
        res.status(200).json(events);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get upcoming events (startDate > now)
exports.getUpcomingEvents = async (req, res) => {
    try {
        const now = new Date();
        console.log("Fetching upcoming with now:", now);
        const events = await Event.find({ startDate: { $gt: now } }).sort({ startDate: 1 });
        console.log("Upcoming events found:", events);
        res.status(200).json(events);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get ongoing events (startDate <= now <= endDate)
exports.getOngoingEvents = async (req, res) => {
    try {
        const now = new Date();
        console.log("Fetching ongoing with now:", now);
        const events = await Event.find({
            startDate: { $lte: now },
            endDate: { $gte: now }
        }).sort({ startDate: 1 });
        console.log("Ongoing events found:", events);
        res.status(200).json(events);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get single event by id
exports.getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.status(200).json(event);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update event by id
exports.updateEvent = async (req, res) => {
    try {
        const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedEvent);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};


// Delete event by id
exports.deleteEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.status(200).json({ message: 'Event deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
