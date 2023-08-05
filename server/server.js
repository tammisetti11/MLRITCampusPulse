const express = require('express');
const cors = require('cors');
require('dotenv').config(); 
const connectDB = require('./config/db');

// Route Imports
const paymentRoutes = require('./routes/paymentRoutes');
const userRoutes = require('./routes/userRoutes');
const ticketRoutes = require('./routes/TicketRoutes');


// Connect to MongoDB
connectDB();

const app = express();

// CORS configuration

app.use(cors({
  origin: 'https://mlritcampuspulse-frontend1.onrender.com',
  credentials: true
}));

app.use(cors(corsOptions));

// Middleware to parse JSON
app.use(express.json());

// Route handlers
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/payment', paymentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tickets', ticketRoutes); // ✅ Register the ticket routes correctly

// Start the server
const PORT = process.env.PORT || 4000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

