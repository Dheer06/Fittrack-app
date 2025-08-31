const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const activityRoutes = require('./routes/activity');
const connectDB = require('./config/db');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// connect DB
connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/activities', activityRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log('Server running on port', PORT));
