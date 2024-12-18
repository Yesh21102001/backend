const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const app = express();

// Serve static files from the CategoryImages folder
app.use('/', express.static(path.join(__dirname, 'CategoryImages')));

// Routes
const categoriesRouter = require('./routes/categories');
const signupRoutes = require('./routes/SignUp');
const loginRoutes = require('./routes/login');

// Middleware
app.use(express.json());
app.use(cors());

// Use routes
app.use('/api/categories', categoriesRouter);
app.use('/api/signup', signupRoutes);
app.use('/api/login', loginRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});