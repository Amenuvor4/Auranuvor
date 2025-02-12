const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const passport = require('passport');
require('./config/passportConfig');

// Load environment variables
dotenv.config({ path: '../.env' });

// test
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID);
console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET);
console.log('GOOGLE_CALLBACK_URL:', process.env.GOOGLE_CALLBACK_URL);

const app = express();

// Connect to MongoDB
connectDB();


// Middleware for parsing JSON
app.use(express.json());

// Initialize Passport
app.use(passport.initialize());

// Import routes
const authRoutes = require('./routes/authRoutes'); // Authentication routes
const taskRoutes = require('./routes/taskRoutes'); // Task management routes

// Use routes
app.use('/api/auth', authRoutes); // Mount authentication routes
app.use('/api/tasks', taskRoutes); // Mount task management routes



// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
