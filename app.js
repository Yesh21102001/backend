// app.js
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');

// Routes
const categoriesRouter = require('./routes/categories');

// Middleware
app.use(express.json());

app.use(cors());

// Use routes
app.use('/api/categories', categoriesRouter);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});