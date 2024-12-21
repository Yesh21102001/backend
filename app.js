const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const app = express();

// Serve static files from the CategoryImages folder
app.use('/', express.static(path.join(__dirname, 'CategoryImages')));

// Routes
const categoriesRouter = require('./routes/categories');
const authRouter = require('./routes/auth');
const couponRouter = require('./routes/Coupons');

app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());


// Use routes
app.use('/api/categories', categoriesRouter);
app.use('/api/authentication', authRouter);
app.use('/api/Coupons', couponRouter);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});