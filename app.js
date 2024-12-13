// app.js
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// Routes
// const bookingRoutes = require('./routes/bookings');

// Middleware
app.use(express.json()); 

// Use routes
// app.use('/api/bookings', bookingRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});