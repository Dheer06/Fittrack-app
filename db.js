const mongoose = require('mongoose');
require('dotenv').config(); // ← ADD THIS LINE TO LOAD THE .env FILE

function connectDB(){
  const uri = process.env.MONGO_URI; // ← This will now read from your .env file

  if (!uri) {
    console.error('ERROR: MONGO_URI is not defined in the .env file.');
    process.exit(1);
  }

  mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));
}

module.exports = connectDB;