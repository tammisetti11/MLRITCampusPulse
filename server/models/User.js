const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'admin'], default: 'student' },
    interestedEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],

    // Additional fields
    mobile: { type: String },
    address: { type: String },
    rollNumber: { type: String },
    emergencyContact: {
        name: { type: String },
        relationship: { type: String },
        phone: { type: String }
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
