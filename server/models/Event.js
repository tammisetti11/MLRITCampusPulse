const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    category: { type: String, required: true },
    organizer: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },  
    time: { type: String, required: true },  
    location: { type: String, required: true },
    price: { type: Number, default: 0 },
    capacity: { type: Number, required: true },
    image: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
