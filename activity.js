const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Activity = require('../models/Activity');

// get all for user
router.get('/', auth, async (req, res) => {
  try {
    const activities = await Activity.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(activities);
  } catch(err){
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// create
router.post('/', auth, async (req, res) => {
  try {
    const { name, durationMinutes, date, notes } = req.body;
    if(!name || !durationMinutes) return res.status(400).json({ message: 'Missing fields' });
    const a = new Activity({ userId: req.user.id, name, durationMinutes, date: date || Date.now(), notes });
    await a.save();
    res.status(201).json(a);
  } catch(err){
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
