const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({ 
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    paymentStatus: { 
        type: String, 
        enum: ['Paid', 'Pending', 'Free'],  // ✅ Add 'Free' here
        default: 'Pending' 
    },
    uniqueCode: { type: String, required: true }
}, { timestamps: true });
module.exports = mongoose.model('Ticket', ticketSchema);
